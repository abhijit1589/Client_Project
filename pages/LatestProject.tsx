import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Project = {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  technologiesUsed: string;
  youtubeLink: string;
  githubLink: string;
  imageUrl: string;
  latest?: boolean;
};

const LatestProject = () => {
  const [latestProject, setLatestProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestProject();
  }, []);

  const fetchLatestProject = async () => {
    try {
      const res = await fetch('/api/projects/latest');
      if (!res.ok) {
        const errorDetails = await res.text();
        throw new Error(`Failed to fetch latest project: ${res.status} ${res.statusText} - ${errorDetails}`);
      }
      const data = await res.json();
      setLatestProject(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
      console.error('Error fetching latest project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading latest project...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!latestProject) {
    return <p>No latest project available.</p>;
  }

  return (
    <section className="bg-cover bg-center text-gray-800 py-12 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Left Side: YouTube Video */}
        <div className="lg:w-1/2 w-full flex justify-center">
          <div className="relative w-full pb-[56.25%] lg:w-[700px] lg:h-0 overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <iframe
              className="absolute top-0 left-0 w-full h-full lg:h-[394px]"
              src={latestProject.youtubeLink.replace('watch?v=', 'embed/')}
              title="YouTube Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Right Side: Text Section */}
        <div className="lg:w-1/2 w-full flex flex-col items-start px-4">
          <h2 className="text-4xl font-bold mb-4 font-poppins">
            <a href={latestProject.githubLink} target="_self" className="text-gray-800 hover:text-blue-500 transition duration-300">
              {latestProject.name}
            </a>
          </h2>
          <p className="text-xl text-left font-poppins font-semibold mb-6">
            {latestProject.shortDescription}
          </p>
          <Link href={`/projects/${latestProject._id}`}>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full hover:bg-gradient-to-l transition duration-300">
              Explore
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestProject;