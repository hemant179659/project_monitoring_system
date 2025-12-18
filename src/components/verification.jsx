import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function Verification() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  // Predefined department verification codes
  const departmentCodes = {
    agriculture: "1234",
    horticulture: "4321",
    pwd: "5678",
    forestry: "2468",
    vetenary: "1357"
  };

  const pendingDept = localStorage.getItem("pendingVerificationDept");

  useEffect(() => {
    if (!pendingDept) {
      navigate("/dept-login", { replace: true });
    }
  }, [pendingDept, navigate]);

  const handleVerify = () => {
    if (!pendingDept) return;

    const expectedCode = departmentCodes[pendingDept.toLowerCase().trim()];

    if (!expectedCode) {
      alert("No verification code found for this department.");
      return;
    }

    if (code === expectedCode) {
      alert("Verification successful!");

      localStorage.setItem("loggedInDepartment", pendingDept);
      localStorage.removeItem("pendingVerificationDept");

      navigate("/dept-dashboard", { replace: true });
    } else {
      alert("Incorrect code. Try again.");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div
        className={styles.leftSection}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <BackButton onClick={() => navigate("/dept-login")} />
      </div>

      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <h2>Verification Required</h2>
          <p style={{ textAlign: "center", opacity: 0.8 }}>
            Department: <b>{pendingDept || "N/A"}</b>
          </p>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter Department Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className={styles.loginBtn} onClick={handleVerify}>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
