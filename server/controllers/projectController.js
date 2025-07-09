import Project from "../models/Project.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const commentOnProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newComment = {
      user: req.user.id,
      text,
    };

    project.comments.push(newComment);
    await project.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProject = async (req, res) => {
  const { title, description, link } = req.body;
  try {
    const newProject = new Project({
      user: req.user.id,
      title,
      description,
      link,
    });
    await newProject.save();
    res.json(newProject);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("user", "name");
    res.json(projects);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;

  // ✅ Prevents CastError for invalid ObjectIds
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    const project = await Project.findById(id).populate("user", "name");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error("Error fetching project:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsersOrProjects = async (req, res) => {
  const { q } = req.query;
  try {
    const users = await User.find({
      name: { $regex: q, $options: "i" },
    }).select("name");
    const projects = await Project.find({
      title: { $regex: q, $options: "i" },
    }).populate("user", "name");
    res.json({ users, projects });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
