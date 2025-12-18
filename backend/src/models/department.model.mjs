import mongoose from "mongoose";

// ---------------------------
// Department Schema
// ---------------------------
const departmentSchema = new mongoose.Schema({
  deptName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Password reset fields
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

const Department = mongoose.model("Department", departmentSchema);

// ---------------------------
// Project Schema
// ---------------------------
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    progress: { type: Number, required: true, min: 0, max: 100 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    department: { type: String, required: true },

    // budgeting fields
    budgetAllocated: { type: Number, required: true },
    remainingBudget: { type: Number, required: true },

    // contact person details
    contactPerson: { type: String, required: true },
    designation: { type: String, required: true },
    contactNumber: { type: String, required: true },

    // optional remarks
    remarks: { type: String, default: "" },

    // uploaded images (max 5)
    photos: [
      {
        url: String,
        key: String, // store S3 key for deletion
        uploadedAt: { type: Date, default: Date.now }
      }
    ],

    // geolocation
    geoLocation: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export { Department, Project };
