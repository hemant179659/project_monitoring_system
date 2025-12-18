import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// React Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DepartmentSignup() {
  const navigate = useNavigate();

  // Form states
  const [deptName, setDeptName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); 

  // Predefined departments
  const departments = ["Agriculture", "PWD", "Forestry", "Horticulture", "Vetenary"];

  // Department verification codes
  const departmentCodes = {
    Agriculture: "12345",
    PWD: "54321",
    Forestry: "99999",
    Horticulture: "22222",
    Vetenary: "77777",
  };

  // Redirect if already logged in
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) navigate("/dept-dashboard", { replace: true });
  }, [navigate]);

  // Prevent browser back button
  useEffect(() => {
    const handlePopState = () => navigate("/dept-login");
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  // Handle signup submit
  const handleSignup = async () => {
    if (!deptName || !email || !password || !confirmPassword || !verificationCode) {
      return toast.error("Please complete all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    // Validate department verification code
    const correctCode = departmentCodes[deptName];
    if (verificationCode !== correctCode) {
      return toast.error("Invalid verification code for this department");
    }

    try {
      const response = await axios.post("https://usn.digital/department/signup", {
        deptName,
        email,
        password,
      });

      toast.success(response.data.message);

      setTimeout(() => navigate("/dept-login"), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className={styles.loginPage}>
        <div
          className={styles.leftSection}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <BackButton onClick={() => navigate("/dept-login")} />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.loginBox}>
            <h2>Department Signup</h2>

            {/* Department dropdown */}
            <select
              className={styles.inputField}
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Email */}
            <input
              className={styles.inputField}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Confirm Password */}
            <input
              className={styles.inputField}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Verification Code */}
            <input
              className={styles.inputField}
              type="text"
              placeholder="Enter Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />

            {/* Signup Button */}
            <button className={styles.loginBtn} onClick={handleSignup}>
              Signup
            </button>

            <button
              className={styles.loginBtn}
              onClick={() => navigate("/dept-login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
