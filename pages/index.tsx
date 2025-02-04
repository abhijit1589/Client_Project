import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProjectList from './components/ProjectList';
import styled from 'styled-components';
import ContactForm from "./components/ContactForm";
import LatestProject from './LatestProject';



const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const HomePage = () => {
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

  type Project = {
    _id: string;
    name: string;
    description: string;
    // Add any other necessary fields here
  };


  const handleEditProject = (project: Project) => {
    // You can now use the full `project` object to edit
    console.log(project);
  };

  const handleDeleteProject = (id: string) => {
    console.log(id);
  };



  return (
    <>
      {/* Header Section */}
      <header className="fixed top-0  left-0 w-full bg-white z-40">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.jpg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-md mr-2"
            />
            <Link href="/" legacyBehavior>
              <a className="website-name" id="websiteName">thecodingfeast</a>
            </Link>
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
            className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center md:space-x-6 md:static absolute bg-white top-16 left-0 right-0 shadow-md md:shadow-none p-4 md:p-0`}
          >
            <Link href="/" legacyBehavior>
              <a className="text-black-1000 font-semibold hover:text-yellow-400 block md:inline-block">
                Home
              </a>
            </Link>
            <Link href="/project" legacyBehavior>
              <a className="text-black-1000 font-semibold hover:text-yellow-400 block md:inline-block">
                Projects
              </a>
            </Link>
            <a href="https://youtube.com/@thecodingfeast?si=8R0ynLM_feGgriV_" className="text-gray-800 font-semibold hover:text-yellow-400 block md:inline-block">
              YouTube
            </a>
            <Link href="#contact" legacyBehavior>
              <a className="text-black-1000 font-semibold hover:text-yellow-400 block md:inline-block">
                Contact
              </a>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id='about' className="min-h-screen lg:ml-10  h-40 flex items-center justify-center bg-cover bg-center text-black ">
        <div className="container  mt-12 mx-auto flex flex-col md:flex-row items-center px-4">
          {/* Text Section */}
          <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-5xl font-bold mb-4  font-poppins text-gray-800 hover:text-yellow-400 transition duration-300">
              Hi, I&apos;m Mohammed Aftab Siddique
            </h2>
            <p className="text-xl font-poppins text-gray-800 mb-4" >(Software Engineer @ IonIdea | Certified Dynatrace Professional | ACE Consultant)</p>
            <p className="text-xl font-poppins text-gray-800 mb-4 ">I'm a dedicated software engineer with expertise in performance monitoring and optimization. Passionate about coding, gaming, and technology, I thrive on solving complex problems and building efficient solutions.</p>

            <Link href="#contact" legacyBehavior>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 mt-2 rounded-full hover:bg-gradient-to-l transition duration-300">
                Connect
              </button>
            </Link>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center md:justify-start md:ml-20">
            <img
              src="/Aftab12.jpg"
              alt="Divy Vishwakarma"
              width={456}
              height={456}
              className="rounded-full object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-black w-1/5 mx-auto my-20" style={{ width: '10%' }} />

      {/* Project Tiles Section */}
      <Container>
        <LatestProject />
      </Container>

      <hr className="border-t-2 border-black w-1/5 mx-auto my-20" style={{ width: '10%' }} />
      <h3 className="text-4xl font-bold mb-4 font-poppins mb-6 text-center font-inherit lg:text-center text-gray-800 hover:text-blue-500 transition duration-300 align-center">
        Explore My Creations
      </h3>
      <h2 className="text-2xl font-semibold mb-4 text-center lg:text-center font-inherit text-black align-center">
        Learning the theory is good, but applying your knowledge on a project is AWESOME!!
      </h2>

      <Container>
        <ProjectList
          projects={projects}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          isAdmin={false} // Pass appropriate value for isAdmin
        />
      </Container>

      {/* Contact Section */}
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
          <Link href="/login" legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              <img
                src="/prico.jpg"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-md mr-2 cursor-pointer"
              />
            </a>
          </Link>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Creators-Mind. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;