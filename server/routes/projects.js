import express from "express";
import {
  createProject,
  getAllProjects,
  commentOnProject,
  searchUsersOrProjects,
  getProjectById
} from "../controllers/projectController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", auth, createProject);
router.get("/search", searchUsersOrProjects);
router.get("/", getAllProjects);
router.get("/:id", getProjectById); 
router.post("/:id/comments", auth, commentOnProject);




export default router;
