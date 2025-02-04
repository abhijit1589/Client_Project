import clientPromise from '../../db';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we will handle it manually
  },
};

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('yourDatabaseName');
  const collection = db.collection('projects');

  if (req.method === 'POST' || req.method === 'PUT') {
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
        youtubeLink: fields.youtubeLink ? fields.youtubeLink[0] : '',
        description: fields.description ? fields.description[0] : '',
        githubLink: fields.githubLink ? fields.githubLink[0] : '',
        imageUrl: imageUrl,
      };

      if (req.method === 'POST') {
        projectData.createdAt = new Date();
        await collection.insertOne(projectData);
        res.status(201).json(projectData);
      } else if (req.method === 'PUT') {
        const { id } = req.query;
        await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: projectData }
        );
        res.status(200).json(projectData);
      }
    });
  } else if (req.method === 'GET') {
    const projects = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json(projects);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}