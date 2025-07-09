import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error("Failed to load project:", err);
    }
  };

  const submitComment = async () => {
    try {
      await axios.post(
        `/api/projects/${id}/comments`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComment("");
      await fetchProject();
      alert("Comment added");
    } catch (err) {
      console.error("Failed to submit comment:", err);
      alert("Comment submission failed");
    }
  };

  if (!project) return <div className="p-4">Loading...</div>;

  return (
    <>
      <div className="mt-8 mb-4">
        <div className="p-6  max-w-3xl mx-auto bg-white shadow-md rounded-xl">
          <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
          <p className="text-gray-700 mb-4">{project.description}</p>

          <p className="text-sm text-gray-500 mb-2">
            <strong>Posted by:</strong> {project.user?.name || "Unknown"}
          </p>

          {typeof project.link === "string" &&
            project.link.trim().toLowerCase() !== "not available" &&
            project.link.trim() !== "" && (
              <a
                href={
                  project.link.startsWith("http")
                    ? project.link
                    : `https://${project.link}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Visit Project
              </a>
            )}

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">💬 Comments</h3>
            {project.comments && project.comments.length > 0 ? (
              project.comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-gray-100 p-2 px-4 mb-2 rounded shadow-sm"
                >
                  <p className="text-sm text-gray-800 italic">"{c.text}"</p>
                  <p className="text-xs text-gray-500">
                    — {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No comments yet.</p>
            )}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full mt-4 p-2 border rounded"
              rows="3"
              placeholder="Write your comment..."
            />

            <button
              onClick={submitComment}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
