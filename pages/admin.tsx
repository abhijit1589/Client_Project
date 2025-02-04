import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import { useRouter } from 'next/router';

import { GetServerSideProps } from 'next';
import cookie from 'cookie';

type Project = {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  technologiesUsed: string;
  youtubeLink: string;
  githubLink: string;
  imageUrl: string;
  image?: File;
  latest?: boolean; // New field
};




export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = cookie.parse(req.headers.cookie || '');
  const isAuthenticated = cookies.isAuthenticated; // Replace with your auth token or session check

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Add additional props if necessary
  };
};

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProject = async (newProject: Project) => {
    const formData = new FormData();
    formData.append('name', newProject.name);
    formData.append('description', newProject.description);
    formData.append('shortDescription', newProject.shortDescription);
    formData.append('technologiesUsed', newProject.technologiesUsed);
    formData.append('youtubeLink', newProject.youtubeLink);
    formData.append('githubLink', newProject.githubLink);
    if (newProject.image) {
      formData.append('image', newProject.image);
    }
    formData.append('latest', newProject.latest ? 'true' : 'false'); // New field

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to add project');
      }
      const data = await res.json();
      setProjects((prevProjects) => [data, ...prevProjects]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    const formData = new FormData();
    formData.append('name', updatedProject.name);
    formData.append('description', updatedProject.description);
    formData.append('shortDescription', updatedProject.shortDescription);
    formData.append('technologiesUsed', updatedProject.technologiesUsed);
    formData.append('youtubeLink', updatedProject.youtubeLink);
    formData.append('githubLink', updatedProject.githubLink);
    if (updatedProject.image) {
      formData.append('image', updatedProject.image);
    }
    formData.append('latest', updatedProject.latest ? 'true' : 'false'); // New field

    try {
      const res = await fetch(`/api/projects/${updatedProject._id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to update project');
      }
      const data = await res.json();
      setProjects((prevProjects) =>
        prevProjects.map((project) => (project._id === data._id ? data : project))
      );
      setEditingProject(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };
  

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete project');
      }
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    document.cookie = "isAuthenticated=; Max-Age=0"; // Clear the auth cookie
    router.push('/login');
  };

  return (
    <div className="container mx-auto py-20 mb-1">
      <nav className="flex justify-between items-center mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full hover:bg-gradient-to-l transition duration-300 ">
        <Link href="/" className="text-left">
          HOME
        </Link>
        <button onClick={handleLogout} className="text-right">
          Logout
        </button>
      </nav>

      <ProjectForm
        onAddProject={handleAddProject}
        onEditProject={handleUpdateProject}
        editingProject={editingProject}
      />
     <ProjectList
  projects={projects}
  onEditProject={handleEditProject}
  onDeleteProject={handleDeleteProject}
  isAdmin={true}
/>
    </div>
  );
}