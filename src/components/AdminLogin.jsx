import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function AdminLogin() {
  const navigate = useNavigate();

  // State variables for storing email and password input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * useEffect to handle browser back button behavior.
   * 
   * When the user presses the back button, we redirect them to the home page "/"
   * instead of going back to the previous protected page.
   * 
   * replace: true ensures the current entry is replaced in history 
   * and user cannot go forward again to this page.
   */
  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    // Attach event listener for browser back button
    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  /**
   * Login handler function
   * - Validates if fields are filled
   * - Verifies admin credentials
   * - Stores admin login state in localStorage
   * - Redirects to admin dashboard on success
   */
  const handleLogin = () => {
    if (!email || !password) {
      return alert("Please fill email and password");
    }

    // Check hardcoded admin login credentials
    if (email === "diousn@nic.in" && password === "diousn@123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Left section with background image */}
      <div
        className={styles.leftSection}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Back button to return user to home page */}
        <BackButton onClick={() => navigate("/", { replace: true })} />
      </div>

      {/* Right section containing the login form */}
      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <h2>Admin Login</h2>

          {/* Email Input */}
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <button className={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
