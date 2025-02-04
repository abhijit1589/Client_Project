import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import the RichTextEditor with ssr: false
const RichTextEditor = dynamic(() => import("../components/RichTextEditor"), {
  ssr: false, // Disables SSR for this component
});

export default function ProjectForm({ onAddProject, onEditProject, editingProject }) {
  const [name, setName] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [technologiesUsed, setTechnologiesUsed] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [image, setImage] = useState(null);
  const [imageFilename, setImageFilename] = useState(''); // Holds the filename of the current image
  const [latest, setLatest] = useState(false); // New state for latest project

  // This effect will ensure the form is populated with the correct data when editing a project
  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name || '');
      setYoutubeLink(editingProject.youtubeLink || '');
      setDescription(editingProject.description || '');
      setShortDescription(editingProject.shortDescription || '');
      setTechnologiesUsed(editingProject.technologiesUsed || '');
      setGithubLink(editingProject.githubLink || '');
      setLatest(editingProject.latest || false); // Set latest project status
      setImageFilename(editingProject.imageUrl || ''); // Set the URL of the existing image
    } else {
      setName('');
      setYoutubeLink('');
      setDescription('');
      setShortDescription('');
      setTechnologiesUsed('');
      setGithubLink('');
      setImage(null);
      setImageFilename('');
      setLatest(false); // Reset latest project status
    }
  }, [editingProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('youtubeLink', youtubeLink);
    formData.append('description', description);
    formData.append('shortDescription', shortDescription);
    formData.append('technologiesUsed', technologiesUsed);
    formData.append('githubLink', githubLink);
    formData.append('latest', latest ? 'true' : 'false'); // Append latest project status

    if (image) {
      formData.append('image', image); // Append new image if selected
    } else {
      formData.append('imageUrl', imageFilename); // Use the previous image URL if no new image is selected
    }

    if (editingProject) {
      await onEditProject({ ...editingProject, name, youtubeLink, description, shortDescription, technologiesUsed, githubLink, image: image || imageFilename, latest });
    } else {
      await onAddProject({ name, youtubeLink, description, shortDescription, technologiesUsed, githubLink, image: image || imageFilename, latest });
    }

    // Clear form fields after submission
    setName('');
    setYoutubeLink('');
    setDescription('');
    setShortDescription('');
    setTechnologiesUsed('');
    setGithubLink('');
    setImage(null);
    setImageFilename('');
    setLatest(false); // Reset latest project status
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageFilename(file.name); // Update the filename state
    }
  };

  

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-md bg-gray-100 space-y-4"
    >
      <div className="flex flex-col">  
        <label htmlFor="name" className="mb-1 font-medium">Project Name (<span className="text-blue-500">Visible On Every Page</span>)</label>
        <input
          id="name"
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 rounded-md border border-gray-300"
        />
      </div>
      <div className="flex flex-col"> 
        <label htmlFor="youtubeLink" className="mb-1 font-medium">YouTube Link (<span className="text-blue-500">Clickable YouTube Link on Every page</span>)</label>
        <input
          id="youtubeLink"
          type="text"
          placeholder="YouTube Link"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          required
          className="p-2 rounded-md border border-gray-300"
        />
      </div>
      <div className="flex flex-col">  
        <label htmlFor="shortDescription" className="mb-1 font-medium">Short Description (<span className="text-blue-500">Show on Projects page, Latest Projects, Project steps</span>)</label>
        <input
          id="shortDescription"
          type="text"
          placeholder="Short Description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
          className="p-2 rounded-md border border-gray-300"
        />
      </div>
      <div className="flex flex-col">    
        <label htmlFor="technologiesUsed" className="mb-1 font-medium">Technologies Used (<span className="text-blue-500">Visible on Projects page, Projects Steps</span>)</label>
        <input
          id="technologiesUsed"
          type="text"
          placeholder="Technologies Used"
          value={technologiesUsed}
          onChange={(e) => setTechnologiesUsed(e.target.value)}
          required
          className="p-2 rounded-md border border-gray-300"
        />
      </div>
      <div className="flex flex-col">     
        <label htmlFor="description" className="mb-1 font-medium">Description (<span className="text-blue-500">Visible on only Projects Steps</span>)</label>
        <div className="p-2 rounded-md border border-gray-300">
          <RichTextEditor value={description} onChange={setDescription} />
        </div>
      </div>
      <div className="flex flex-col">   
        <label htmlFor="githubLink" className="mb-1 font-medium">GitHub Link (<span className="text-blue-500">Clickable Github Link Everywhere</span>)</label>
        <input
          id="githubLink"
          type="text"
          placeholder="GitHub Link"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          required
          className="p-2 rounded-md border border-gray-300"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="image" className="mb-1 font-medium">Upload Image (<span className="text-blue-500">Thumbnail Image On Homepage, projects</span>)</label>
        {imageFilename && !image && (
          <div>
            <img src={imageFilename} alt="Current project image" width={128} height={128} className="mb-2 object-cover"/>
            <span className="mb-2 text-gray-700">Current file: {imageFilename}</span>
          </div>
        )}
        <input
          id="image"
          type="file"
          onChange={handleImageChange}
          className="p-2 rounded-md border border-gray-300"
        />
      </div>
      <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-300">
    <input
        id="latest"
        type="checkbox"
        className="blue-checkbox"
        checked={latest}
        onChange={(e) => setLatest(e.target.checked)} 
    /> 
        <label htmlFor="latest" className="font-medium">Latest Project (<span className="text-blue-500">If you click ✔️ then current project will be latest and show on homepage below profile container</span>)</label>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full hover:bg-gradient-to-l transition duration-300"
        >
          {editingProject ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
  );
}