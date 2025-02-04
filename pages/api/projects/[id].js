import clientPromise from '../../../db'; // Adjust the path if necessary
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for multi-part form data
  },
};

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('yourDatabaseName'); // Replace with your actual database name
  const collection = db.collection('projects');

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid Project ID' });
      return;
    }

    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Project deleted successfully' });
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  } else if (req.method === 'POST' || req.method === 'PUT') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        res.status(500).json({ error: 'Failed to parse form data' });
        return;
      }

      console.log('Fields:', fields);
      console.log('Files:', files);

      let imageUrl = '';
      if (files.image && files.image.length > 0) {
        const imageFile = files.image[0]; // Access the first file in the array
        const oldPath = imageFile.filepath;
        const newFilename = imageFile.newFilename;
        const newPath = path.join(uploadDir, newFilename);
        try {
          if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath); // Move the file to the desired directory
            imageUrl = `/uploads/${newFilename}`;
          } else {
            console.error('File does not exist:', oldPath);
          }
        } catch (renameError) {
          console.error('Error moving file:', renameError);
          res.status(500).json({ error: 'Failed to move uploaded file' });
          return;
        }
      }

      const projectData = {
        name: fields.name ? fields.name[0] : '',
        description: fields.description ? fields.description[0] : '',
        shortDescription: fields.shortDescription ? fields.shortDescription[0] : '',
        technologiesUsed: fields.technologiesUsed ? fields.technologiesUsed[0] : '',
        youtubeLink: fields.youtubeLink ? fields.youtubeLink[0] : '',
        githubLink: fields.githubLink ? fields.githubLink[0] : '',
        // Only set imageUrl if a new image was uploaded or if no new image was uploaded but an existing image URL is provided
        imageUrl: imageUrl || (fields.imageUrl ? fields.imageUrl[0] : ''),
        latest: fields.latest ? fields.latest[0] === 'true' : false, // Handle latest field
      };

      // Ensure only one project is marked as latest
      if (projectData.latest) {
        await collection.updateMany({ latest: true }, { $set: { latest: false } });
      }

      if (req.method === 'POST') {
        projectData.createdAt = new Date();
        await collection.insertOne(projectData);
        res.status(201).json(projectData);
      } else if (req.method === 'PUT') {
        const { id } = req.query;
        if (!id || !ObjectId.isValid(id)) {
          res.status(400).json({ error: 'Invalid Project ID' });
          return;
        }
        // Fetch the existing project to retain its imageUrl if no new image is uploaded
        const existingProject = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingProject) {
          res.status(404).json({ error: 'Project not found' });
          return;
        }
        if (!imageUrl) {
          projectData.imageUrl = existingProject.imageUrl; // Keep the existing image URL
        }
        await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: projectData }
        );
        res.status(200).json(projectData);
      }
    });
  } else if (req.method === 'GET') {
    const { id } = req.query;
    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid Project ID' });
      return;
    }

    try {
      const project = await collection.findOne({ _id: new ObjectId(id) });
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }
      res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'POST', 'PUT', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}