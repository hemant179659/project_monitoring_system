import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function DeptResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const res = await axios.post("/api/department/reset-password", {
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
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div className={styles.loginPage} style={{ flex: 1, display: 'flex' }}>
        
        {/* LEFT SECTION - Image Zoomed and Positioned */}
        <div
          className={styles.leftSection}
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: '115%',       // Increased zoom
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 20%', // Visible above footer
            backgroundColor: '#ffffff',
            display: isMobile ? 'none' : 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: '20px',
            height: 'calc(100vh - 50px)', // Stops before slim footer
            borderRight: '1px solid #eee'
          }}
        >
          <BackButton onClick={() => navigate("/dept-login")} />
        </div>

        {/* RIGHT SECTION - Centered and Shifted UP */}
        <div 
          className={styles.rightSection}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',    // Vertical center
            alignItems: 'center',        // Horizontal center
            paddingBottom: '100px',      // Shifted UP from center
            height: 'calc(100vh - 50px)',
            backgroundColor: "#f5f5f5"
          }}
        >
          <div className={styles.loginBox} style={{ width: '90%', maxWidth: '400px' }}>
            {/* Reduced Title Size */}
            <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', textAlign: 'center' }}>
              Reset Password
            </h2>

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
            
            <button 
              className={styles.loginBtn} 
              style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
              onClick={() => navigate("/dept-login")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* SLIM STICKY FOOTER */}
      <footer style={{
        position: 'fixed',
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