import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSuccess(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
        value={formData.message}
        onChange={handleChange}
        required
      ></textarea>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-full hover:bg-gradient-to-l transition duration-300"
      >
        Send Message
      </button>
      {success !== null && (
        <p className={`text-center mt-4 ${success ? 'text-green-500' : 'text-red-500'}`}>
          {success ? 'Message sent successfully!' : 'Failed to send message.'}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
