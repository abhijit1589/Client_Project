import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGODB_URI; // MongoDB connection string
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let client = null;

// Reuse the MongoDB connection across API calls for performance
async function getMongoClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const mongoClient = await getMongoClient();
      const database = mongoClient.db('yourDatabaseName'); // Replace with your database name
      const collection = database.collection('abcd'); // Replace with your collection name

      // Fetch the user from the database
      const admin = await collection.findOne({ username, password });

      console.log('Admin fetched:', admin);

      if (admin) {
        console.log('Login successful');
        // Return success response
        return res.status(200).json({ message: 'Login successful' });
      } else {
        console.log('Invalid username or password');
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error connecting to MongoDB or fetching data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle invalid HTTP methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}