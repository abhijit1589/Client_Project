import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import Contact from '../../models/Contact'; // Import the Contact model

// MongoDB connection function
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return; // Check if already connected
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    try {
      // Save contact info in MongoDB
      await connectToDatabase();
      const newContact = new Contact({
        name,
        email,
        message,
      });
      await newContact.save(); // Save the document to the database

      // Set up Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'projectx673@gmail.com', // Replace with your Gmail
          pass: 'ends fqzg vfoo dnto', // Replace with your Gmail App Password
        },
      });

      // Email options
      const mailOptions = {
        from: email,
        to: 'abhijitnaikwadi98@gmail.com', // Replace with the admin's email
        subject: `New Contact Form Submission from ${name}`,
        text: `Message: ${message}\n\nFrom: ${name}\nEmail: ${email}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully and data saved' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to send email and save data', error });
    }
  } else {
    // Handle any non-POST requests
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
