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

  const [deptName, setDeptName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle Responsive Layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) navigate("/dept-dashboard", { replace: true });
  }, [navigate]);

  // Handle Back Navigation
  useEffect(() => {
    const handlePopState = () => navigate("/dept-login");
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  // RESTORED SIGNUP LOGIC
  const handleSignup = async () => {
    // 1. Basic Validation
    if (!deptName || !email || !password || !confirmPassword || !verificationCode) {
      return toast.error("Please complete all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      // 2. API Call to Backend
      const response = await axios.post("/api/department/signup", {
        deptName,
        email,
        password,
        verificationCode,
      });

      // 3. Success Handling
      toast.success(response.data.message || "Account created successfully!");
      
      // Delay navigation so user can see the success message
      setTimeout(() => {
        navigate("/dept-login");
      }, 2000);

    } catch (error) {
      // 4. Error Handling
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      overflowX: 'hidden' 
    }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className={styles.loginPage} style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        height: isMobile ? 'auto' : '100vh' 
      }}>
        
        {/* LEFT SECTION */}
        <div
          className={styles.leftSection}
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: isMobile ? 'cover' : '115%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 20%',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: '20px',
            height: isMobile ? '200px' : 'calc(100vh - 50px)',
            width: isMobile ? '100%' : '50%',
            borderRight: isMobile ? 'none' : '1px solid #eee'
          }}
        >
          <BackButton onClick={() => navigate("/dept-login")} />
        </div>

        {/* RIGHT SECTION */}
        <div 
          className={styles.rightSection}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: isMobile ? 'auto' : 'calc(100vh - 50px)',
            overflowY: isMobile ? 'visible' : 'auto',
            paddingTop: isMobile ? '20px' : '40px',
            paddingBottom: isMobile ? '100px' : '120px', 
            width: isMobile ? '100%' : '50%'
          }}
        >
          <div className={styles.loginBox} style={{ width: '90%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', textAlign: 'center' }}>
              Department Signup
            </h2>

            <select 
              className={styles.inputField} 
              value={deptName} 
              onChange={(e) => setDeptName(e.target.value)}
            >
              <option value="">Select Department</option>
              {["Agriculture", "PWD", "Forestry", "Horticulture", "Vetenary"].map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

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
            <input 
              className={styles.inputField} 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <input 
              className={styles.inputField} 
              type="text" 
              placeholder="Enter Verification Code" 
              value={verificationCode} 
              onChange={(e) => setVerificationCode(e.target.value)} 
            />

            <button className={styles.loginBtn} onClick={handleSignup}>Signup</button>
            <button 
              className={styles.loginBtn} 
              style={{ marginTop: '10px', backgroundColor: '#6c757d' }} 
              onClick={() => navigate("/dept-login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{
        position: isMobile ? 'relative' : 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '3px solid #0056b3',
        padding: '8px 10px',
        color: '#333',
        textAlign: 'center',
        zIndex: 1000,
        fontFamily: "serif",
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ margin: '0', fontSize: '0.8rem', fontWeight: 'bold', color: '#002147' }}>
            District Administration
          </p>
          <p style={{ margin: '2px 0', fontSize: '0.65rem', opacity: 0.8 }}>
            Designed and Developed by <strong>District Administration</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px',
            fontSize: '0.6rem',
            borderTop: '1px solid #ddd',
            marginTop: '4px',
            paddingTop: '4px'
          }}>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
            <span>|</span>
            <span>Official Digital Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}