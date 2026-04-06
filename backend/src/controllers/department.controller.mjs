import { Department, Project, Budget, DistrictBudget, Desto, Admin, DepartmentCode } from "../models/department.model.mjs";
import bcrypt from "bcryptjs";
import multer from "multer";
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
dotenv.config();

// AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const JWT_SECRET = process.env.JWT_SECRET || "UDHAM_SINGH_NAGAR_SECRET_KEY_2026";

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

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email & password are required" });

    const adminUser = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!adminUser) {
      return res.status(404).json({ message: "Admin account not found" });
    }

    if (adminUser.password !== password) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: adminUser._id, role: "superadmin" },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({ 
      success: true, 
      message: "Welcome Super Admin", 
      token, 
      role: "superadmin"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during admin login" });
  }
};

// ---------------------------
// ✅ MODIFIED: DEPARTMENT SIGNUP (With Verification Code Check)
// ---------------------------
export const departmentSignup = async (req, res) => {
  console.log("Signup body:", req.body);
  const { deptName, email, password, verificationCode } = req.body;
  
  try {
    // 1. Basic Fields Check
    if (!deptName || !email || !password || !verificationCode)
      return res.status(400).json({ message: "All fields including verification code are required" });

    // 2. VERIFICATION CODE CHECK (Main Security Logic)
    const validCodeEntry = await DepartmentCode.findOne({ deptName });

    if (!validCodeEntry) {
      return res.status(400).json({ message: `No verification record found for ${deptName}` });
    }

    if (validCodeEntry.verificationCode !== verificationCode) {
      return res.status(401).json({ message: "Invalid verification code for this department" });
    }

    // 3. Check for existing user
    const existingDept = await Department.findOne({ $or: [{ deptName }, { email }] });
    if (existingDept)
      return res.status(400).json({ message: "Dept name or email already exists" });

    // 4. Hash and Save
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

    const token = jwt.sign(
      { id: dept._id, deptName: dept.deptName, role: "department" },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({ 
      success: true,
      message: "Login successful", 
      token,
      deptName: dept.deptName 
    });
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

    const resetLink = `http://localhost:5173/dept-reset-password?token=${token}&email=${email}`;

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

export const destoLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email & password are required" });

    const destoUser = await Desto.findOne({ email: email.toLowerCase() });
    
    if (!destoUser) {
      return res.status(404).json({ message: "DESTO account not found" });
    }

    if (destoUser.password !== password) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: destoUser._id, role: destoUser.role },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      token, 
      role: destoUser.role 
    });
  } catch (error) {
    console.error("Desto Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const setDistrictTotal = async (req, res) => {
  const { total } = req.body;
  try {
    let budget = await DistrictBudget.findOne();
    if (budget) {
      budget.totalJilaBudget = Number(total);
      await budget.save();
    } else {
      budget = new DistrictBudget({ totalJilaBudget: Number(total) });
      await budget.save();
    }
    res.json({ message: "Total Jila Budget updated successfully", total: budget.totalJilaBudget });
  } catch (err) {
    console.error("Set District Total Error:", err);
    res.status(500).json({ message: "Server Error while setting district budget" });
  }
};

export const getDistrictTotal = async (req, res) => {
  try {
    const budget = await DistrictBudget.findOne();
    res.json(budget || { totalJilaBudget: 0 });
  } catch (err) {
    res.status(500).json({ message: "Error fetching district budget" });
  }
};

export const allocateBudget = async (req, res) => {
  const { department, totalBudget } = req.body;
  const budgetValue = Number(totalBudget);

  try {
    let budgetEntry = await Budget.findOne({ department });
    if (budgetEntry) return res.status(400).json({ message: "Budget already exists for this department. Use Update." });

    const districtData = await DistrictBudget.findOne();
    if (districtData) {
      const allBudgets = await Budget.find();
      const currentTotalAllocated = allBudgets.reduce((sum, b) => sum + (b.totalBudget || 0), 0);
      
      if ((currentTotalAllocated + budgetValue) > districtData.totalJilaBudget) {
        const remaining = districtData.totalJilaBudget - currentTotalAllocated;
        return res.status(400).json({ 
          message: `District Limit Exceeded! Only ₹${remaining} Lakhs available in Jila Yojna.` 
        });
      }
    }

    budgetEntry = new Budget({ department, totalBudget: budgetValue });
    await budgetEntry.save();
    res.status(201).json({ message: "Department Budget Allocated successfully" });
  } catch (err) { 
    res.status(500).json({ message: "Server Error during allocation" }); 
  }
};

export const updateBudget = async (req, res) => {
  const { department, newBudget } = req.body;
  try {
    await Budget.findOneAndUpdate({ department }, { totalBudget: Number(newBudget) });
    res.json({ message: "Updated successfully" });
  } catch (err) { res.status(500).json({ message: "Server Error" }); }
};

export const getBudgetSummary = async (req, res) => {
  try {
    const allBudgets = await Budget.find().lean();
    
    const summary = await Promise.all(allBudgets.map(async (b) => {
      const projects = await Project.find({ department: b.department });
      const totalSpent = projects.reduce((sum, p) => sum + (p.budgetAllocated || 0), 0);
      const totalProjects = projects.length;
      const completed = projects.filter(p => p.progress === 100).length;
      const pending = totalProjects - completed;

      return {
        department: b.department,
        totalBudget: b.totalBudget,
        totalSpent,
        remaining: b.totalBudget - totalSpent,
        totalProjects,
        completed,
        pending
      };
    }));
    
    res.json(summary);
  } catch (err) { 
    console.error("Budget Summary Error:", err);
    res.status(500).json({ message: "Error fetching summary" }); 
  }
};

export const getDeptBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ department: req.params.deptName });
    res.json(budget || { totalBudget: 0 });
  } catch (err) { res.status(500).json({ message: "Error" }); }
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
      !name || !startDate || !endDate || !department ||
      isNaN(progressValue) || progressValue < 0 || progressValue > 100 ||
      isNaN(budgetValue) || budgetValue <= 0 ||
      !contactPerson || !designation || !contactNumber
    ) {
      return res.status(400).json({
        message: "All fields required. Progress 0–100, budget > 0, and contact details required.",
      });
    }

    const deptBudgetData = await Budget.findOne({ department });
    
    if (!deptBudgetData) {
      return res.status(400).json({ 
        message: `DESTO has not allocated any budget to the ${department} department yet.` 
      });
    }

    const existingProjects = await Project.find({ department });
    const totalSpentSoFar = existingProjects.reduce((sum, p) => sum + (p.budgetAllocated || 0), 0);

    if ((totalSpentSoFar + budgetValue) > deptBudgetData.totalBudget) {
      const remainingAmount = deptBudgetData.totalBudget - totalSpentSoFar;
      return res.status(400).json({
        message: `Budget Limit Exceeded! Your department's remaining budget is ₹${remainingAmount} Lakhs. You cannot add a project of ₹${budgetValue} Lakhs.`
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

    const { 
      name, 
      progress, 
      remarks, 
      budgetAllocated, 
      contactPerson, 
      designation, 
      contactNumber 
    } = req.body;

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
          } catch (err) { console.log("S3 delete error:", err); }
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

    if (name !== undefined) project.name = name;
    if (progress !== undefined) project.progress = Number(progress);
    if (remarks !== undefined) project.remarks = remarks;
    if (budgetAllocated !== undefined) project.budgetAllocated = Number(budgetAllocated);
    if (contactPerson !== undefined) project.contactPerson = contactPerson;
    if (designation !== undefined) project.designation = designation;
    if (contactNumber !== undefined) project.contactNumber = contactNumber;

    await project.save();
    res.status(200).json({ message: "Project updated successfully", project });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error while updating" });
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