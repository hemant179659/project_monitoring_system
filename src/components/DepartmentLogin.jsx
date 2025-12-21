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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) {
      navigate("/dept-dashboard", { replace: true });
    }
  }, [navigate]);

  // Prevent back navigation
  useEffect(() => {
    window.history.replaceState({ page: "login" }, "", window.location.href);
    window.history.pushState({ page: "login_dummy" }, "", window.location.href);
    const handlePopState = () => navigate("/", { replace: true });
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please enter email and password");
    try {
      const response = await axios.post("/api/department/login", { email, password });
      localStorage.setItem("loggedInDepartment", response.data.deptName);
      toast.success("Login successful!");
      setTimeout(() => navigate("/dept-dashboard"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflowX: 'hidden' // Prevents horizontal scroll on mobile
    }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className={styles.loginPage} style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row' // Stacks vertically on mobile
      }}>
        
        {/* LEFT SECTION */}
        <div
          className={styles.leftSection}
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: isMobile ? 'cover' : '115%', // Cover on mobile to look better
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 20%',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: '20px',
            height: isMobile ? '250px' : 'calc(100vh - 50px)', // Fixed height for image on mobile
            width: isMobile ? '100%' : '50%',
            borderRight: isMobile ? 'none' : '1px solid #eee'
          }}
        >
          <BackButton onClick={() => navigate("/", { replace: true })} />
        </div>

        {/* RIGHT SECTION */}
        <div 
          className={styles.rightSection}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: isMobile ? '120px' : '100px', // Extra padding for mobile footer
            height: isMobile ? 'auto' : 'calc(100vh - 50px)',
            width: isMobile ? '100%' : '50%',
            paddingTop: isMobile ? '40px' : '0'
          }}
        >
          <div className={styles.loginBox} style={{ 
            width: isMobile ? '85%' : 'auto', // Responsive width
            maxWidth: '400px'
          }}>
            <h2>Department Login</h2>
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
            <button className={styles.loginBtn} onClick={handleLogin}>Login</button>
            <div className={styles.linkGroup} style={{ 
              flexDirection: isMobile ? 'column' : 'row', // Stack buttons on very small screens
              gap: '10px' 
            }}>
              <button className={styles.loginBtn} onClick={() => navigate("/dept-signup")}>Signup</button>
              <button className={styles.loginBtn} onClick={() => navigate("/dept-forgot")}>Forgot Password</button>
            </div>
          </div>
        </div>
      </div>

      {/* SLIM STICKY FOOTER */}
      <footer style={{
        position: isMobile ? 'relative' : 'fixed', // Fixed for desktop, relative for mobile to prevent overlap
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