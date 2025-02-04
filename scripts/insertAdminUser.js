// scripts/insertAdminUser.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI; // Your MongoDB connection string
const client = new MongoClient(uri);

async function insertAdminUser() {
  try {
    await client.connect();
    const database = client.db('yourDatabaseName'); // Adjust to your actual database name
    const collection = database.collection('abcd');

    const username = 'admin';
    const password = 'yourSecurePassword';

    await collection.insertOne({ username, password });
    console.log('Admin user inserted');
  } catch (error) {
    console.error('Error inserting admin user:', error);
  } finally {
    await client.close();
  }
}

insertAdminUser();