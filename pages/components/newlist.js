import React, { useState } from 'react';
import { useRouter } from 'next/router';

const NewProjectList = ({ projects = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6; // Show six projects per page
  const router = useRouter();

  // Ensure projects is not undefined before sorting
  const sortedProjects = [...projects].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCardClick = (projectId) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="container mx-auto p-4 my-[100px]">
      {currentProjects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer p-4 flex flex-col border border-gray-200 hover:shadow-xl"
                onClick={() => handleCardClick(project._id)}
              >
                <div className="w-full h-48 overflow-hidden">
                  <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-800">{project.name}</h2>
                  <p className="text-gray-600 mt-2 text-sm">{project.shortDescription}</p>
                  <p className="mt-2 text-sm text-gray-700"><strong>Tech:</strong> {project.technologiesUsed}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    {project.youtubeLink && (
                      <a href={project.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-red-500 text-xl hover:text-red-700">
                        <i className="fab fa-youtube"></i>
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-900 text-xl hover:text-gray-700">
                        <i className="fab fa-github"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6 space-x-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-full ${currentPage === index + 1 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:bg-gradient-to-l transition duration-300 disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No projects available.</p>
      )}
    </div>
  );
};

export default NewProjectList;
