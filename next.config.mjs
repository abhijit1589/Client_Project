// next.config.mjs
import dotenv from 'dotenv';
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  

  reactStrictMode: true,
  // other configurations
 

  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default nextConfig;