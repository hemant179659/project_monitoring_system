// 📌 Verification.jsx — Verifies department-specific login code before accessing dashboard
// NOTE: No logic changed — only detailed comments added for clarity.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function Verification() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  // ✅ Predefined department verification codes
  const departmentCodes = {
    agriculture: "1234",
    horticulture: "4321",
    irrigation: "5678",
    forestry: "2468",
    vetenary: "1357"
  };

  // 👍 Department selected during login, waiting for verification
  const pendingDept = localStorage.getItem("pendingVerificationDept");

  // ---------------------------------------------------------------
  // 🔐 Redirect users if they access verification page directly
  // ---------------------------------------------------------------
  useEffect(() => {
    // If no department is pending for verification → redirect to login
    if (!pendingDept) {
      navigate("/dept-login", { replace: true });
    }
  }, [pendingDept, navigate]);

  // ---------------------------------------------------------------
  // ✅ VERIFY DEPARTMENT CODE
  // ---------------------------------------------------------------
  const handleVerify = () => {
    // Fetch correct verification code for the department
    const expectedCode = departmentCodes[pendingDept.toLowerCase().trim()];

    // If department is not found in code list
    if (!expectedCode) {
      alert("No verification code found for this department.");
      return;
    }

    // Compare user-entered code with expected code
    if (code === expectedCode) {
      alert("Verification successful!");

      // 🔄 Move login status from "pending" to "logged in"
      localStorage.setItem("loggedInDepartment", pendingDept);
      localStorage.removeItem("pendingVerificationDept");

      // 🚀 Navigate to dashboard and prevent back navigation
      navigate("/dept-dashboard", { replace: true });

    } else {
      alert("Incorrect code. Try again.");
    }
  };

  return (
    <div className={styles.loginPage}>
      
      {/* LEFT SIDE (Image + Back Button) */}
      <div
        className={styles.leftSection}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Go back to login page */}
        <BackButton onClick={() => navigate("/dept-login")} />
      </div>

      {/* RIGHT SIDE (Verification Box) */}
      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <h2>Verification Required</h2>

          {/* Show which department is being verified */}
          <p style={{ textAlign: "center", opacity: 0.8 }}>
            Department: <b>{pendingDept}</b>
          </p>

          {/* Input Field — Enter Verification Code */}
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter Department Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {/* Submit Button */}
          <button className={styles.loginBtn} onClick={handleVerify}>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
