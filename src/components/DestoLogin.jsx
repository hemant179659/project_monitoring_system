import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DestoLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin-dashboard", { replace: true });
    }

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warn("Please fill email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/department/desto-login", {
        email: email.toLowerCase(), 
        password 
      });

      if (res.data.success) {
        localStorage.clear(); 
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("isDesto", "true"); 
        // ✅ Ye line add ki hai taaki Project List page load ho sake
        localStorage.setItem("isAdmin", "true"); 

        toast.success("Login Successful!");
        
        setTimeout(() => {
          navigate("/admin-dashboard", { replace: true });
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <div className={styles.loginPage} style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        <div className={styles.leftSection} style={{ 
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
            borderRight: isMobile ? 'none' : '1px solid #eee'
          }}>
          <BackButton onClick={() => navigate("/", { replace: true })} />
        </div>

        <div className={styles.rightSection} style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: isMobile ? '120px' : '100px', 
            height: isMobile ? 'auto' : 'calc(100vh - 50px)',
            paddingTop: isMobile ? '40px' : '0'
          }}>
          <div className={styles.loginBox} style={isMobile ? { width: '85%', maxWidth: '400px' } : {}}>
            <h2 className={styles.loginTitle}>DESTO Login</h2>

            <input
              className={styles.inputField}
              type="email"
              placeholder="Official Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
            />

            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
            />

            <button 
              className={styles.loginBtn} 
              onClick={handleLogin} 
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
        </div>
      </div>

      <footer style={{ position: isMobile ? 'relative' : 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#f8f9fa', borderTop: '3px solid #0056b3', padding: '8px 10px', color: '#333', textAlign: 'center', zIndex: 1000 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ margin: '0', fontSize: '0.8rem', fontWeight: 'bold', color: '#002147' }}>District Administration</p>
          <p style={{ margin: '2px 0', fontSize: '0.65rem', opacity: 0.8 }}>Designed and Developed by <strong>District Administration</strong></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.6rem', borderTop: '1px solid #ddd', marginTop: '4px', paddingTop: '4px' }}>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
            <span>|</span>
            <span>Official Digital Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}