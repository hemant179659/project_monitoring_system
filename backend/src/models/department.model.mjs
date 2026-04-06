import mongoose from "mongoose";

// 1. ✅ Department Verification Code Schema (Naya Add Kiya)
// Isme hum store karenge ki kis department ka kya secret code hai
const departmentCodeSchema = new mongoose.Schema({
  deptName: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  }, // e.g., "PWD", "Agriculture"
  verificationCode: { 
    type: String, 
    required: true 
  } // e.g., "PWD@2026"
}, { timestamps: true });

// 2. Department User Schema (Jo signup ke baad banta hai)
const departmentSchema = new mongoose.Schema({
  deptName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

// 3. DESTO (District Economics & Statistics Officer) Schema
const destoSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: "desto" 
  }
}, { timestamps: true });

// 4. District Overall Budget Schema
const districtBudgetSchema = new mongoose.Schema({
  totalJilaBudget: { type: Number, default: 0 },
  financialYear: { type: String, default: "2026-27" }
}, { timestamps: true });

// 5. Individual Department Budget Schema
const budgetSchema = new mongoose.Schema({
  department: { type: String, required: true, unique: true },
  totalBudget: { type: Number, required: true, default: 0 },
}, { timestamps: true });

// 6. Project Details Schema
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    progress: { type: Number, required: true, min: 0, max: 100 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    department: { type: String, required: true },
    budgetAllocated: { type: Number, required: true },
    remainingBudget: { type: Number, required: true },
    contactPerson: { type: String, required: true },
    designation: { type: String, required: true },
    contactNumber: { type: String, required: true },
    remarks: { type: String, default: "" },
    photos: [
      { url: String, key: String, uploadedAt: { type: Date, default: Date.now } }
    ],
    geoLocation: { lat: { type: Number }, lng: { type: Number } }
  },
  { timestamps: true }
);

// 7. Super Admin Schema
const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: "superadmin" 
  }
}, { timestamps: true });

// Models Creation
const Department = mongoose.model("Department", departmentSchema);
const DepartmentCode = mongoose.model("DepartmentCode", departmentCodeSchema); // ✅ New Model
const Budget = mongoose.model("Budget", budgetSchema);
const Project = mongoose.model("Project", projectSchema);
const DistrictBudget = mongoose.model("DistrictBudget", districtBudgetSchema);
const Desto = mongoose.model("Desto", destoSchema);
const Admin = mongoose.model("Admin", adminSchema);

// Exports
export { 
  Department, 
  DepartmentCode, // ✅ Exported
  Project, 
  Budget, 
  DistrictBudget, 
  Desto, 
  Admin 
};