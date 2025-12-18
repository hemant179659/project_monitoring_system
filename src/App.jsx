import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import AdminLogin from "./components/AdminLogin";
import DepartmentLogin from "./components/DepartmentLogin";
import DepartmentSignup from "./components/DepartmentSignup";
import DepartmentForgot from "./components/DepartmentForgot";
import Verification from "./components/verification";

import AdminDashboard from "./components/AdminDashboard";
import DepartmentStatus from "./components/DepartmentStatus";
import AdminProjectList from "./components/AdminProjectList";
import Completed from "./components/Completed";
import Pending from "./components/Pending";

import DepartmentDashboard from "./components/DepartmentDashboard";
import AddProject from "./components/AddProject";
import ProjectList from "./components/ProjectList";
import DailyReporting from "./components/DailyReporting";
import ProjectRecentPhoto from "./components/ProjectRecentPhoto";

// ✅ ADMIN recent photos
import ProjectPhotoAdmin from "./components/ProjectPhotoAdmin";

// ✅ Department Reset Password
import DeptResetPassword from "./components/DeptResetPassword";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* -------------------- HOME -------------------- */}
        <Route path="/" element={<Home />} />

        {/* -------------------- ADMIN -------------------- */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-project-list" element={<AdminProjectList />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/department-status" element={<DepartmentStatus />} />

        {/* ✅ Admin – All department recent photos */}
        <Route
          path="/projectrecentphotoadmin"
          element={<ProjectPhotoAdmin />}
        />

        {/* -------------------- DEPARTMENT AUTH -------------------- */}
        <Route path="/dept-login" element={<DepartmentLogin />} />
        <Route path="/dept-signup" element={<DepartmentSignup />} />
        <Route path="/dept-forgot" element={<DepartmentForgot />} />
        <Route path="/dept-verify" element={<Verification />} />

        {/* ✅ DEPARTMENT RESET PASSWORD */}
        <Route path="/dept-reset-password" element={<DeptResetPassword />} />

        {/* -------------------- DEPARTMENT DASHBOARD -------------------- */}
        <Route path="/dept-dashboard" element={<DepartmentDashboard />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/project-list" element={<ProjectList />} />
        <Route path="/daily-reporting" element={<DailyReporting />} />
        <Route path="/project-photos" element={<ProjectRecentPhoto />} />
      </Routes>
    </Router>
  );
}
