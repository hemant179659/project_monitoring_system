import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function DepartmentLogin() {
  const navigate = useNavigate();

  // Stores login input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ------------------------------------------------------------------
  // 🔐 If department is already logged in → redirect directly to dashboard
  // ------------------------------------------------------------------
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) {
      navigate("/dept-dashboard", { replace: true });
    }
  }, [navigate]);

  // ------------------------------------------------------------------
  // 🛑 Prevent navigating back to previous pages
  //     - Makes login page the first history entry
  //     - If user presses browser back → redirect to Home
  // ------------------------------------------------------------------
  useEffect(() => {
    // Replace current history state to lock the page
    window.history.replaceState({ page: "login" }, "", window.location.href);

    // Push a dummy state so that back button triggers popstate
    window.history.pushState({ page: "login_dummy" }, "", window.location.href);

    const handlePopState = () => {
      // Any back navigation brings user to home page
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // ------------------------------------------------------------------
  // ▶️ Handle Login
  //     - Validates input
  //     - Fetches stored department credentials
  //     - Matches login details
  //     - Moves user to verification page
  // ------------------------------------------------------------------
  const handleLogin = () => {
    if (!email || !password)
      return alert("Please enter credentials");

    // Get stored department accounts from localStorage
    let storedData = localStorage.getItem("departmentCredentials");
    let departments = [];

    // Parse department list and ensure it's always an array
    try {
      departments = storedData ? JSON.parse(storedData) : [];
      if (!Array.isArray(departments)) departments = [departments];
    } catch {
      departments = [];
    }

    if (departments.length === 0)
      return alert("No registered department found. Please signup first.");

    // Find matching department with same email and password
    const matchedDept = departments.find(
      (dep) =>
        dep.email.toLowerCase() === email.toLowerCase() &&
        dep.password === password
    );

    if (matchedDept) {
      // Save department name for verification step
      localStorage.setItem("pendingVerificationDept", matchedDept.deptName);

      // Redirect to verification page
      navigate("/dept-verify");
    } else {
      alert("Incorrect email or password");
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Left side with image & back button */}
      <div
        className={styles.leftSection}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <BackButton onClick={() => navigate("/", { replace: true })} />
      </div>

      {/* Right side login form */}
      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <h2>Department Login</h2>

          {/* Email input */}
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input */}
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login button */}
          <button className={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>

          {/* Signup + Forgot Password buttons */}
          <div className={styles.linkGroup}>
            <button
              className={styles.loginBtn}
              onClick={() => navigate("/dept-signup")}
            >
              Signup
            </button>

            <button
              className={styles.loginBtn}
              onClick={() => navigate("/dept-forgot")}
            >
              Forgot Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
