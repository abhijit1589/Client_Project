import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Project {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  technologiesUsed: string;
  youtubeLink: string;
  githubLink: string;
  imageUrl: string;
  image?: File;
  latest?: boolean;
}
interface ProjectListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  isAdmin: boolean;
}

export default function ProjectList({ projects = [], onEditProject, onDeleteProject, isAdmin }: ProjectListProps) {

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [projectsPerPage, setProjectsPerPage] = useState<number>(8); // Default to PC view

  const projectsPerPagePC = 8;
  const projectsPerPageMobile = 4;

  // Function to determine the number of projects per page based on screen size
  const updateProjectsPerPage = () => {
    setProjectsPerPage(window.innerWidth < 768 ? projectsPerPageMobile : projectsPerPagePC);
  };

  // Update projects per page on mount and on window resize
  useEffect(() => {
    updateProjectsPerPage();
    window.addEventListener('resize', updateProjectsPerPage);
    return () => window.removeEventListener('resize', updateProjectsPerPage);
  }, []);

  const totalPages = Math.ceil((projects?.length || 0) / projectsPerPage);


  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects ? projects.slice(indexOfFirstProject, indexOfLastProject) : [];


  // Event handler for page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onDeleteProject(id);
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
        {currentProjects.map((project) => (
          <div key={project._id} className="flex flex-col items-center transform transition duration-300 hover:scale-105">
            {project.imageUrl && (
              <a href={`/projects/${project._id}`}>
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full rounded-2xl mt-5"
                  style={{
                    width: '95%',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
              </a>
            )}
            <div className="w-full mt-2 text-center">
              <h3
                className="text-lg hover:underline inline-flex items-center flex-wrap justify-center"
                style={{
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 500,
                }}>
                <a href={`/projects/${project._id}`} className="flex-1">
                  {project.name}
                </a>
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="ml-2">
                    <img
                      src="/github-mark.png"
                      alt="GitHub"
                      style={{
                        width: '20px',
                        height: '20px',
                        marginLeft: '5px',
                      }}
                    />
                  </a>
                )}
              </h3>

              {isAdmin && (
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => onEditProject(project)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-full hover:bg-gradient-to-l transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-full hover:bg-gradient-to-l transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-4">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-6 rounded-full hover:bg-gradient-to-l transition duration-300"
          >
            ← Previous Page
          </button>
        )}

        <button
          onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full hover:bg-gradient-to-l transition duration-300"
        >
          Next Page →
        </button>
      </div>
    </div>
  );
}
