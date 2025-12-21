import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DepartmentForgot() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReset = async () => {
    if (!email) return toast.warn("Please enter your email");
    setLoading(true);
    try {
      await axios.post("/api/department/forgot-password", { email });
      toast.success("Reset link sent to your email!");
      setTimeout(() => navigate("/dept-login"), 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
        flexDirection: isMobile ? 'column' : 'row' 
      }}>
        
        {/* LEFT SECTION - Image */}
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
            height: isMobile ? '250px' : 'calc(100vh - 50px)',
            width: isMobile ? '100%' : '50%',
            borderRight: isMobile ? 'none' : '1px solid #eee'
          }}
        >
          <BackButton onClick={() => navigate("/dept-login")} />
        </div>

        {/* RIGHT SECTION - Form */}
        <div 
          className={styles.rightSection}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: isMobile ? '120px' : '100px', 
            height: isMobile ? 'auto' : 'calc(100vh - 50px)',
            width: isMobile ? '100%' : '50%',
            paddingTop: isMobile ? '40px' : '0'
          }}
        >
          <div className={styles.loginBox} style={{ 
            width: isMobile ? '85%' : 'auto', 
            maxWidth: '400px'
          }}>
            <h2>Forgot Password</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
              Enter your email to receive a reset link.
            </p>
            
            <input
              className={styles.inputField}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            
            <button 
              className={styles.loginBtn} 
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            
            {/* ONLY CHANGE: Added display flex and justify center here */}
            <div className={styles.linkGroup} style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                className={styles.loginBtn} 
                style={{ backgroundColor: '#6c757d' }} 
                onClick={() => navigate("/dept-login")}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SLIM STICKY FOOTER */}
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