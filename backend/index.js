const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURL = 'mongodb://admin:password@mongo:27017'; // use container name 'mongo'
const client = new MongoClient(mongoURL);

async function main() {
  await client.connect();
  const db = client.db('userdb');
  const users = db.collection('users');

  // API route
  app.post('/api/users', async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await users.insertOne({ name, email, phone });
    res.status(201).json({ message: 'User saved successfully' });
  });

  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

main().catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
