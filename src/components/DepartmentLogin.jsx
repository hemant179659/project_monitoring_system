import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DepartmentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dashboard Check
  useEffect(() => {
    const token = localStorage.getItem("deptToken");
    if (token) {
      navigate("/dept-dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Details bharo bhai!");
    try {
      const response = await axios.post("http://localhost:8000/api/department/login", { 
        email: email.toLowerCase(), 
        password 
      });
      if (response.data.success) {
        localStorage.setItem("deptToken", response.data.token);
        localStorage.setItem("loggedInDepartment", response.data.deptName);
        localStorage.setItem("role", "department");
        toast.success("Login Successful!");
        setTimeout(() => navigate("/dept-dashboard", { replace: true }), 800);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={styles.loginPage}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* LEFT SECTION */}
      <div
        className={styles.leftSection}
        style={{ backgroundImage: `url(${backgroundImage})`, position: 'relative' }}
      >
        <div 
          onClick={() => window.location.href = "/"} 
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 999, cursor: 'pointer' }}
        >
          <BackButton />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>Department Login</h2>
          
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <button className={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>

          <div className={styles.linkGroup} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button 
              type="button" 
              className={styles.loginBtn} 
              style={{ height: '40px', padding: '0', flex: 1, backgroundColor: '#28a745' }}
              onClick={() => navigate("/dept-signup")}
            >
              Signup
            </button>
            <button 
              type="button" 
              className={styles.loginBtn} 
              style={{ height: '40px', padding: '0', flex: 1, backgroundColor: '#6c757d' }}
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