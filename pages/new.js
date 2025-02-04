import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="bg-white text-gray-800 py-12 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Left Side: YouTube Video */}
        <div className="flex justify-center mb-6 px-4">
          <div className="relative w-full pb-[56.25%] lg:w-[700px] lg:h-[100px] overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <iframe
              className="absolute top-0 left-0 w-full h-full lg:h-[100px]"
              src={`https://www.youtube.com/embed/${project.youtubeLink.split('v=')[1]}`}
              title="YouTube Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Right Side: Project Details */}
        <div className="lg:w-1/2 w-full flex flex-col items-start px-4">
          {project.shortDescription && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Steps To Follow</h2>
              <p>{project.shortDescription}</p>
            </div>
          )}
          {project.technologiesUsed && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Technologies Used</h2>
              <p>{project.technologiesUsed}</p>
            </div>
          )}
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <ReactQuill value={project.description} readOnly={true} theme="snow" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;
