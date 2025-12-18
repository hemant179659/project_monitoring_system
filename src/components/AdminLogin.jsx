import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // -------------------------------
  // Admin Login
  // -------------------------------
  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill email and password");
      return;
    }

    if (email === "diousn@nic.in" && password === "diousn@123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Left Section */}
      <div
        className={styles.leftSection}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <BackButton onClick={() => navigate("/")} />
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          {/* ⛔ NO inline styles here */}
          <h2 className={styles.loginTitle}>Admin Login</h2>

          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
