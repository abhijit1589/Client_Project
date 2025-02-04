import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewProjectList from './components/newlist';
import styled from 'styled-components';
import ContactForm from "./components/ContactForm";

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    }
    fetchProjects();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Header Section */}

      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-8 h-8 color-yellow rounded-md mr-2"
            />
           <a href="/" className="website-name" id="websiteName">thecodingfeast</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="menu-button"
            className="text-gray-800 md:hidden focus:outline-none"
            aria-label="Toggle Menu"
            onClick={toggleMenu} // Add onClick handler
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Navigation Links */}
          <nav
            id="menu"
            className={`${isMenuOpen ? 'block' : 'hidden'
              } md:flex md:items-center md:space-x-6 md:static absolute bg-white top-16 left-0 right-0 shadow-md md:shadow-none p-4 md:p-0`}
          >
            <a href="/" className="text-black-1000 font-semibold hover:text-yellow-400 block md:inline-block">
              Home
            </a>
            <a href="/project" className="text-black-1000 font-semibold hover:text-yellow-400 block md:inline-block">
              Projects
            </a>
            <a href="https://youtube.com/@thecodingfeast?si=8R0ynLM_feGgriV_" className="text-gray-800 font-semibold hover:text-yellow-400 block md:inline-block">
              YouTube
            </a>

            <a href="#contact" className="text-black-1000 font-semibold hover:text-yellow-400 block md:inline-block">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <Container>
        <h1>Projects</h1>
        <NewProjectList projects={projects} />
      </Container>

      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        rel="stylesheet"
      />
      <section id="contact" className="bg-gray-50 py-12">
        <div className="container mx-auto flex flex-col lg:flex-row items-start lg:items-center">
          {/* Contact Form */}
          <main className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <ContactForm />
          </main>

          {/* Links and Icons */}
         
          {/* Links and Icons */}
          <div className="lg:w-1/2 lg:ml-8 mt-8 lg:mt-0 flex flex-col items-center text-center space-y-8">
            <h3 className="text-2xl font-semibold text-gray-700">Follow Me</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {/* GitHub */}
              <div className="flex flex-col items-center">
                <a
                  href="https://github.com/Mohammed-Aftab-Siddique"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-blue-500 text-3xl"
                >
                  <i className="fab fa-github"></i>
                </a>
                <span className="text-sm mt-2">GitHub</span>
              </div>
              {/* Twitter */}
              <div className="flex flex-col items-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Coming Soon!");
                  }}
                  className="text-gray-800 hover:text-blue-400 text-3xl cursor-pointer"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <span className="text-sm mt-2">Twitter</span>
              </div>

              {/* Facebook */}
              <div className="flex flex-col items-center">
                <a
                  href="https://www.linkedin.com/in/mohammed-aftab-siddique-62221517b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-blue-700 text-3xl"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <span className="text-sm mt-2">LinkedIn</span>
              </div>


              {/* Instagram */}
              <div className="flex flex-col items-center">
                <a
                  href="https://www.instagram.com/lordsam07?igsh=MTM1d2s1ZnN3cXN4eA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-pink-500 text-3xl"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <span className="text-sm mt-2">Instagram</span>
              </div>
              {/* YouTube */}
              <div className="flex flex-col items-center">
                <a
                  href="https://youtube.com/@thecodingfeast?si=8R0ynLM_feGgriV_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-red-500 text-3xl"
                >
                  <i className="fab fa-youtube"></i>
                </a>
                <span className="text-sm mt-2">YouTube</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      <footer className="bg-gray-800 text-white py-4 px-4 flex items-center justify-center">
        <div className="flex items-center">
          <a href="/login" target="_blank" rel="noopener noreferrer">
            <img
              src="/prico.jpg"
              alt="Logo"
              className="w-8 h-8 rounded-md mr-2 cursor-pointer"
            />
          </a>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Creators-Mind. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}