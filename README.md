# Project Setup Guide

Follow these steps to set up the project on your local machine:

## 1. Install Node.js and npm

Make sure you have **Node.js** and **npm** installed on your system. You can check the installation by running the following commands:

```bash
node -v
npm -v

## 2. Install Dependencies

Navigate to the project folder and install the dependencies defined in the package.json file:

npm install


## 3. Frontend Dependencies (React, Next.js, etc.)

react, react-dom, next: Core dependencies for a Next.js project using React.
@heroicons/react: For using Heroicons (SVG icons).
quill, react-quill: For rich text editor functionality.
styled-components: For styling components using styled-components.
next-themes: For theme support in Next.js (likely for dark/light mode).

## 4. Backend Dependencies (Express, MongoDB, etc.)

express: A web framework for building the backend API.
bcrypt, bcryptjs: For hashing passwords.
body-parser: Middleware to parse incoming request bodies.
cors: Middleware to enable Cross-Origin Resource Sharing.
dotenv: To load environment variables from a .env file.
jsonwebtoken: For handling JSON Web Tokens for authentication.
formidable: For handling file uploads.
mongodb, mongoose: For working with MongoDB databases using Mongoose ORM.
nodemailer: For sending emails via SMTP.

## 5. Development Dependencies

typescript, ts-node: For using TypeScript.
eslint: A linter for maintaining code quality.
postcss, tailwindcss: For styling with Tailwind CSS using PostCSS.
autoprefixer: For automatically adding vendor prefixes to CSS.
@types/...: TypeScript type definitions for various packages (e.g., react, node)


## 6. Change user Send Msg Mail 

Edit in sendMail.js 

  const mailOptions = {
        from: email,
        to: 'abhijit98naikwadi@yahoo.com', // Replace with the admin's email
        subject: `New Contact Form Submission from ${name}`,
        text: `Message: ${message}\n\nFrom: ${name}\nEmail: ${email}`,
      }; 
      