import { Department, Project } from "../models/department.model.mjs";
import bcrypt from "bcryptjs";
import multer from "multer";
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
dotenv.config();

// AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer setup
const storage = multer.memoryStorage();
export const photoUploadMiddleware = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/jpg"].includes(file.mimetype)) {
      return cb(new Error("Only JPG images allowed"));
    }
    cb(null, true);
  },
}).array("photos", 5);

// Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper
function extractKeyFromUrl(url) {
  try {
    return url.split(".amazonaws.com/")[1];
  } catch {
    return null;
  }
}

// ---------------------------
// DEPARTMENT SIGNUP
// ---------------------------
export const departmentSignup = async (req, res) => {
  console.log("Signup body:", req.body);
  const { deptName, email, password } = req.body;
  try {
    if (!deptName || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingDept = await Department.findOne({ $or: [{ deptName }, { email }] });
    if (existingDept)
      return res.status(400).json({ message: "Dept name or email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDept = new Department({ deptName, email, password: hashedPassword });

    try {
      const savedDept = await newDept.save();
      console.log("Signup saved:", savedDept);
      res.status(201).json({ message: "Signup successful" });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "Duplicate key error" });
      }
      throw err;
    }
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ---------------------------
// DEPARTMENT LOGIN
// ---------------------------
export const departmentLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email & password are required" });

    const dept = await Department.findOne({ email });
    if (!dept) return res.status(400).json({ message: "Account not found" });

    const isMatch = await bcrypt.compare(password, dept.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login successful", deptName: dept.deptName });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ---------------------------
// FORGOT PASSWORD
// ---------------------------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const dept = await Department.findOne({ email });
    if (!dept) return res.status(404).json({ message: "Email not found" });

    const token = crypto.randomBytes(20).toString("hex");
    const hashedToken = await bcrypt.hash(token, 10);
    const expiry = Date.now() + 15 * 60 * 1000;

    dept.resetToken = hashedToken;
    dept.resetTokenExpiry = expiry;
    await dept.save();

    const resetLink = `https://www.usn.digital/dept-reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `"Project Monitoring" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click below to reset your password (valid for 15 minutes):</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Password reset link sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

// ---------------------------
// RESET PASSWORD
// ---------------------------
export const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    const dept = await Department.findOne({ email });
    if (!dept) return res.status(404).json({ message: "Invalid request" });

    if (!dept.resetToken || !dept.resetTokenExpiry)
      return res.status(400).json({ message: "No reset request found" });

    if (Date.now() > dept.resetTokenExpiry)
      return res.status(400).json({ message: "Token expired" });

    const isValid = await bcrypt.compare(token, dept.resetToken);
    if (!isValid) return res.status(400).json({ message: "Invalid token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    dept.password = hashedPassword;
    dept.resetToken = undefined;
    dept.resetTokenExpiry = undefined;
    await dept.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

// ---------------------------
// ADD PROJECT
// ---------------------------
export const addProject = async (req, res) => {
  const {
    name,
    progress,
    startDate,
    endDate,
    department,
    budgetAllocated,
    remarks,
    contactPerson,
    designation,
    contactNumber,
  } = req.body;

  try {
    const progressValue = Number(progress);
    const budgetValue = Number(budgetAllocated);

    if (
      !name ||
      !startDate ||
      !endDate ||
      !department ||
      isNaN(progressValue) ||
      progressValue < 0 ||
      progressValue > 100 ||
      isNaN(budgetValue) ||
      budgetValue <= 0 ||
      !contactPerson ||
      !designation ||
      !contactNumber
    ) {
      return res.status(400).json({
        message:
          "All fields required. Progress 0–100, budget > 0, and contact details required.",
      });
    }

    const newProject = new Project({
      name,
      progress: progressValue,
      startDate,
      endDate,
      department,
      budgetAllocated: budgetValue,
      remainingBudget: budgetValue,
      remarks: remarks || "",
      photos: [],
      contactPerson,
      designation,
      contactNumber,
    });

    await newProject.save();
    res.status(201).json({ message: "Project added successfully", project: newProject });
  } catch (error) {
    console.error("Add project error:", error);
    res.status(500).json({ message: "Server error while adding project" });
  }
};

// ---------------------------
// GET PROJECTS
// ---------------------------
export const getProjects = async (req, res) => {
  const { department, all } = req.query;
  try {
    let projects;
    if (all === "true") {
      projects = await Project.find({}).lean();
    } else {
      if (!department) return res.status(400).json({ message: "Department is required" });
      projects = await Project.find({ department }).lean();
    }

    const projectsWithUrls = projects.map((p) => {
      const photosWithUrl = (p.photos || []).map((photo) => ({
        url:
          photo.url ||
          (photo.key
            ? `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${photo.key}`
            : ""),
        uploadedAt: photo.uploadedAt,
      }));
      return { ...p, photos: photosWithUrl };
    });

    res.status(200).json({ projects: projectsWithUrls });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
};

// ---------------------------
// UPDATE PROJECT
// ---------------------------
export const updateProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { progress, remarks, remainingBudget } = req.body;

    if (req.files && req.files.length > 0) {
      if (Array.isArray(project.photos) && project.photos.length > 0) {
        const objectsToDelete = project.photos
          .map((p) => {
            const key = p.key ? p.key : extractKeyFromUrl(p.url);
            return key ? { Key: key } : null;
          })
          .filter(Boolean);

        if (objectsToDelete.length > 0) {
          try {
            await s3.send(
              new DeleteObjectsCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: { Objects: objectsToDelete },
              })
            );
          } catch (err) {
            console.log("S3 delete error:", err);
          }
        }
      }

      const uploadedPhotos = [];
      for (const file of req.files) {
        const key = `projects/${Date.now()}-${file.originalname}`;
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );

        uploadedPhotos.push({
          key,
          url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
          uploadedAt: new Date(),
        });
      }
      project.photos = uploadedPhotos;
    }

    if (progress !== undefined) project.progress = Number(progress);
    if (remarks !== undefined) project.remarks = remarks;
    if (remainingBudget !== undefined) project.remainingBudget = Number(remainingBudget);

    await project.save();
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ message: "Server error while updating project" });
  }
};

// ---------------------------
// DELETE PROJECT
// ---------------------------
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (Array.isArray(project.photos) && project.photos.length > 0) {
      const objectsToDelete = project.photos
        .map((p) => {
          const key = p.key ? p.key : extractKeyFromUrl(p.url);
          return key ? { Key: key } : null;
        })
        .filter(Boolean);

      if (objectsToDelete.length > 0) {
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: { Objects: objectsToDelete },
          })
        );
      }
    }

    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: "Project and its photos deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: "Server error while deleting project" });
  }
};
