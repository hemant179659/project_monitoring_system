import express from "express";
import {
  departmentSignup,
  departmentLogin,
  addProject,
  getProjects,
  updateProject,
  deleteProject,
  photoUploadMiddleware,
  forgotPassword,
  resetPassword
} from "../controllers/department.controller.mjs";

const router = express.Router();

// AUTH
router.post("/signup", departmentSignup);
router.post("/login", departmentLogin);

// PASSWORD RESET
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// PROJECTS
router.post("/add-project", addProject);
router.get("/projects", getProjects);
router.put("/project/update/:id", photoUploadMiddleware, updateProject);
router.delete("/project/:id", deleteProject);

export default router;
