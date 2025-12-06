import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import AdminLogin from "./components/AdminLogin";
import DepartmentLogin from "./components/DepartmentLogin";
import DepartmentSignup from "./components/DepartmentSignup";
import DepartmentForgot from "./components/DepartmentForgot";
import Verification from "./components/verification";
import AdminDashboard from "./components/AdminDashboard";
import DailyReporting from "./components/DailyReporting";
import DepartmentStatus from "./components/DepartmentStatus";
import AdminProjectList from "./components/AdminProjectList";
import Completed from "./components/Completed";
import Pending from "./components/Pending";
import DepartmentDashboard from "./components/DepartmentDashboard";
import AddProject from "./components/AddProject";
import ProjectList from "./components/ProjectList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-project-list" element={<AdminProjectList />} />
            <Route path="/completed" element={<Completed />} />
        <Route path="/pending" element={<Pending />} />
          <Route path="/department-status" element={<DepartmentStatus />} />
        <Route path="/dept-login" element={<DepartmentLogin />} />
        <Route path="/dept-signup" element={<DepartmentSignup />} />
        <Route path="/dept-forgot" element={<DepartmentForgot />} />
        <Route path="/dept-verify" element={<Verification />} />

        {/* Dashboard pages */}
        <Route path="/dept-dashboard" element={<DepartmentDashboard />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/project-list" element={<ProjectList />} />
          <Route path="/daily-reporting" element={<DailyReporting />} />
      </Routes>
    </Router>
  );
}
