import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface ProjectFormData {
  title: string;
  description: string;
  link?: string;
}

const ProjectForm: React.FC = () => {
  const [form, setForm] = useState<ProjectFormData>({
    title: "",
    description: "",
    link: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/projects", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess("🎉 Project posted successfully!");
      setForm({ title: "", description: "", link: "" });
    } catch (err) {
      setError("Failed to post project. Please try again.");
      console.error(err);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4 py-12">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-2xl max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          🚀 Post a New Project
        </h2>

        {error && (
          <p className="text-red-300 text-sm text-center mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-300 text-sm text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            className="px-4 py-2 h-32 rounded-lg bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />

          <input
            type="url"
            name="link"
            placeholder="Project Link (e.g., GitHub)"
            value={form.link}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-100 transition"
          >
            Submit Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
