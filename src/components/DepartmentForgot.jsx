import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function DepartmentForgot() {
  const navigate = useNavigate();

  // Stores user-entered email for password reset
  const [email, setEmail] = useState("");

  // ----------------------------------------------
  // 📩 Handle sending reset link
  // ----------------------------------------------
  const handleReset = () => {
    // Validate required field
    if (!email) return alert("Please provide your email");

    // Simulated reset link message (backend not included)
    alert(`Password reset link sent to: ${email}`);

    // Redirect user back to login page
    navigate("/dept-login");
  };

  return (
    <div className={styles.loginPage}>
      {/* Left Section with Background Image + Back Button */}
      <div
        className={styles.leftSection}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Reusable Back Button */}
        <BackButton />
      </div>

      {/* Right Section: Forgot Password Form */}
      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <h2>Forgot Password</h2>

          {/* Email Input Field */}
          <input
            className={styles.inputField}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Send Reset Link */}
          <button className={styles.loginBtn} onClick={handleReset}>
            Send Reset Link
          </button>

          {/* Navigate back to Login */}
          <button
            className={styles.loginBtn}
            onClick={() => navigate("/dept-login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
