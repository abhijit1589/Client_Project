import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import ContactForm from "../components/ContactForm";

// Dynamically import ReactQuill, but disable SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles

interface Project {
  _id: string;
  name: string;
  description: string;
  youtubeLink?: string;
  githubLink: string;
  imageUrl: string;
  shortDescription: string;
  technologiesUsed: string;
}

const ProjectDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Getting the project ID from URL
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projects/${id}`);
          const data = await response.json();
          if (data.error) {
            setProject(null);
          } else {
            setProject(data);
          }
        } catch (error) {
          console.error('Error fetching project:', error);
          setProject(null);
        }
        setLoading(false);
      };

      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Project not found</span>
      </div>
    );
  }

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : '';
  };

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
            <a href="https://www.youtube.com/watch?v=6dqAwh2MCg0" className="text-gray-800 font-semibold hover:text-yellow-400 block md:inline-block">
              YouTube
            </a>

            <a href="#contact" className="text-black-1000 font-semibold hover:text-yellow-400 block md:inline-block">
              Contact
            </a>
          </nav>
        </div>
      </header>
      {/* Main Project Content */}
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold text-center mb-4">{project.name}</h1>

          <section className="bg-cover bg-center text-gray-800 py-12 px-4 lg:px-0">
            <div className="container mx-auto flex flex-col items-center justify-center">
              {project.youtubeLink && (
                <div className="w-full max-w-5xl">

                  <div className="relative w-full pb-[56.25%] lg:w-[900px] lg:h-0 overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full lg:h-[506px]"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(project.youtubeLink)}`}
                      title="Project Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </section>


          {project.shortDescription && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Indtroduction</h2>
              <p>{project.shortDescription}</p>
            </div>
          )}

          {project.technologiesUsed && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Technologies Used</h2>
              <p>{project.technologiesUsed}</p>
            </div>
          )}

          <div className="description-container border-0 mb-6">
            <h3 className="text-xl font-semibold mb-2">Steps To Follow</h3>
            <ReactQuill
              value={project.description}
              readOnly={true}
              theme="bubble"
              modules={{ toolbar: false }}
              className="description-text mb-4 border-0 focus:outline-none p-0 m-0" // Optional padding/margin removal
            />
          </div>

          <div className="text-center mt-6">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

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
                  href="https://github.com"
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
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-blue-400 text-3xl"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <span className="text-sm mt-2">Twitter</span>
              </div>
              {/* Facebook */}
              <div className="flex flex-col items-center">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-blue-700 text-3xl"
                >
                  <i className="fab fa-facebook"></i>
                </a>
                <span className="text-sm mt-2">Facebook</span>
              </div>
              {/* Mail */}
              <div className="flex flex-col items-center">
                <a
                  href="mailto:example@mail.com"
                  className="text-gray-800 hover:text-red-600 text-3xl"
                >
                  <i className="fas fa-envelope"></i>
                </a>
                <span className="text-sm mt-2">Mail</span>
              </div>
              {/* Instagram */}
              <div className="flex flex-col items-center">
                <a
                  href="https://instagram.com"
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
                  href="https://youtube.com"
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
};

export default ProjectDetail;