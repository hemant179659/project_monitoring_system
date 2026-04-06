import express from "express";
// 1. Middleware import karein (Rasta check kar lena apne folder ke hisaab se)
import { verifyToken } from "../middleware/auth.mjs"; 
import {
  departmentSignup,
  departmentLogin,
  addProject,
  getProjects,
  adminLogin,
  destoLogin,
  updateProject,
  deleteProject,
  photoUploadMiddleware,
  forgotPassword,
  resetPassword,
  allocateBudget, 
  updateBudget, 
  getBudgetSummary, 
  getDeptBudget,
  setDistrictTotal,
  getDistrictTotal,
} from "../controllers/department.controller.mjs";

const router = express.Router();

/* ---------------------------------------------------------
   PUBLIC ROUTES (Inke liye login zaroori nahi hai)
--------------------------------------------------------- */
router.post("/signup", departmentSignup);
router.post("/login", departmentLogin);
router.post("/desto-login", destoLogin);
router.post("/admin-login", adminLogin);

// Password Reset Flow
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword); 

/* ---------------------------------------------------------
   PROTECTED ROUTES (Inke liye Valid JWT Token chahiye)
   Yahan 'verifyToken' har request ko check karega
--------------------------------------------------------- */

// District Level Settings
router.post("/set-district-total", verifyToken, setDistrictTotal);
router.get("/get-district-total", verifyToken, getDistrictTotal);

// Budget Allocation & Management
router.post("/allocate-budget", verifyToken, allocateBudget);
router.put("/update-budget", verifyToken, updateBudget);
router.get("/budget-summary", verifyToken, getBudgetSummary);
router.get("/budget/:deptName", verifyToken, getDeptBudget);

// Project Management (MERN Stack Operations)
router.post("/add-project", verifyToken, addProject);
router.get("/projects", verifyToken, getProjects);

// Update Project (Photo upload + JWT validation)
router.put("/project/update/:id", verifyToken, photoUploadMiddleware, updateProject);

// Delete Project
router.delete("/project/:id", verifyToken, deleteProject);

export default router;