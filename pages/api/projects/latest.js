// pages/api/projects/latest.js

import clientPromise from '../../../db'; // Adjust the path if necessary

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('yourDatabaseName'); // Replace with your actual database name
    const collection = db.collection('projects');

    if (req.method === 'GET') {
        try {
            const latestProject = await collection.find({ latest: true }).sort({ createdAt: -1 }).limit(1).toArray();
            if (latestProject.length === 0) {
                res.status(404).json({ error: 'Latest project not found' });
                return;
            }
            res.status(200).json(latestProject[0]);
        } catch (error) {
            console.error('Error fetching latest project:', error);
            res.status(500).json({ error: 'Failed to fetch latest project' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}