const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 5000;

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    content: String,
    date: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

app.prepare().then(() => {
    const server = express();

    // Middleware
    server.use(bodyParser.json());

    // API Routes
    server.post('/api/blog', async (req, res) => {
        const { title, author, category, content } = req.body;

        const newBlogPost = new Blog({ title, author, category, content });

        try {
            await newBlogPost.save();
            res.status(201).send(newBlogPost);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    // Serve Next.js pages
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});