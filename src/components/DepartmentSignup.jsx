import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function DepartmentSignup() {
  const navigate = useNavigate();

  // Form states
  const [deptName, setDeptName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Predefined list of departments
  const departments = [
    "Agriculture",
    "Irrigation",
    "Forestry",
    "Horticulture",
    "Vetenary"
  ];

  // If a department is already logged in, redirect to dashboard
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) {
      navigate("/dept-dashboard", { replace: true });
    }
  }, [navigate]);

  // Prevent browser back button from navigating to unauthorized pages
  useEffect(() => {
    const handlePopState = () => {
      navigate("/dept-login"); // Force redirect to login
    };

    // Push current state so back button triggers popstate
    window.history.pushState(null, document.title, window.location.href);

    // Add back button listener
    window.addEventListener("popstate", handlePopState);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  // Handle signup submission
  const handleSignup = () => {
    // Validate required fields
    if (!deptName || !email || !password || !confirmPassword) {
      return alert("Please complete all fields");
    }

    // Check password match
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    // Retrieve stored department data
    let storedData = localStorage.getItem("departmentCredentials");
    let existingDepartments = [];

    try {
      // Parse stored JSON or fallback to empty array
      existingDepartments = storedData ? JSON.parse(storedData) : [];

      // Ensure it's always an array
      if (!Array.isArray(existingDepartments)) {
        existingDepartments = [existingDepartments];
      }
    } catch {
      existingDepartments = [];
    }

    // Check for duplicate department or email
    const duplicate = existingDepartments.find(
      (dep) =>
        dep.deptName.toLowerCase() === deptName.toLowerCase() ||
        dep.email.toLowerCase() === email.toLowerCase()
    );

    if (duplicate) {
      return alert("This department or email is already registered");
    }

    // Create new department entry
    const newDepartment = { deptName, email, password };

    // Store updated department list
    existingDepartments.push(newDepartment);
    localStorage.setItem(
      "departmentCredentials",
      JSON.stringify(existingDepartments)
    );

    // Successful signup
    alert(`Signup successful for ${deptName}! You can now login.`);
    navigate("/dept-login");
  };

  return (
    <div className={styles.loginPage}>
      {/* Left side with background image */}
      <div
        className={styles.leftSection}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Back button component */}
        <BackButton onClick={() => navigate("/dept-login")} />
      </div>

      {/* Right side signup form */}
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
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Email field */}
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password field */}
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Confirm password field */}
          <input
            className={styles.inputField}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Signup button */}
          <button className={styles.loginBtn} onClick={handleSignup}>
            Signup
          </button>

          {/* Navigate back to login */}
          <button
            className={styles.loginBtn}
            onClick={() => navigate("/dept-login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
