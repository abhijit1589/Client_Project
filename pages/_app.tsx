// pages/_app.tsx
import "../styles/index.css"; // Import Tailwind and global styles
import React from "react";
import "../styles/global.css";

const MyApp = ({ Component, pageProps }: any) => {
  return <Component {...pageProps} />;
};

export default MyApp;

