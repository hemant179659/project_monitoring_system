import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import AdminLogin from "./components/AdminLogin";
import DestoLogin from "./components/destologin";
import DepartmentLogin from "./components/DepartmentLogin";
import DepartmentSignup from "./components/DepartmentSignup";
import DMDashboard from "./components/dmdashboard";
import DepartmentForgot from "./components/DepartmentForgot";
import Verification from "./components/verification";

import AdminDashboard from "./components/AdminDashboard";
import DepartmentStatus from "./components/DepartmentStatus";
import AdminProjectList from "./components/AdminProjectList";
import DestoAllProjectList from "./components/DestoAllProjectList";
import Completed from "./components/Completed";
import Pending from "./components/Pending";

import DepartmentDashboard from "./components/DepartmentDashboard";
import AddProject from "./components/AddProject";
import ProjectList from "./components/ProjectList";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsConditions";
import ContactUs from "./components/ContactUs";
import Accessibility from "./components/Accessibility";

import DailyReporting from "./components/DailyReporting";
import ProjectRecentPhoto from "./components/ProjectRecentPhoto";

// ✅ ADMIN recent photos
import ProjectPhotoAdmin from "./components/ProjectPhotoAdmin";


// ✅ Department Reset Password
import DeptResetPassword from "./components/DeptResetPassword";
import BudgetAllocation from "./components/BudgetAllocation";
import UpdateBudget from "./components/UpdateBudget";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* -------------------- HOME -------------------- */}
        <Route path="/" element={<Home />} />

        {/* -------------------- ADMIN -------------------- */}
        <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/desto-login" element={<DestoLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-project-list" element={<AdminProjectList />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dmdashboard" element={<DMDashboard />} />
        <Route  path="/desto-all-projects" element={<DestoAllProjectList />} />
        <Route path="/accessibility" element={<Accessibility />} />

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
        <Route path="/budgetallocation" element={<BudgetAllocation />} />
        <Route path="/update-budget" element={<UpdateBudget />} />


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
