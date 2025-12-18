import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function DeptResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get token & email from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      alert("Invalid or expired link");
      navigate("/dept-login");
    }
  }, [token, email, navigate]);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) return alert("Please fill all fields");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/department/reset-password", {
        email,
        token,
        newPassword,
      });

      alert(res.data.message);
      navigate("/dept-login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className={styles.loginPage}>
      {/* Left Section with Background Image */}
      <div
        className={styles.leftSection}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <BackButton onClick={() => navigate("/dept-login")} />
      </div>

      {/* Right Section: Reset Password Form */}
      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <h2>Reset Password</h2>

          <input
            className={styles.inputField}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            className={styles.inputField}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className={styles.loginBtn}
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
