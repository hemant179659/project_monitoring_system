import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const token = localStorage.getItem("destoToken");
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
        localStorage.setItem("destoToken", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("isDesto", "true"); 
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <ToastContainer position="top-center" autoClose={2000} />
      
      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* Left Image Section */}
        <div style={{ 
            flex: isMobile ? 'none' : '1',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundColor: '#ffffff',
            height: isMobile ? '250px' : 'auto',
            position: 'relative'
          }}>
          <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
            <BackButton onClick={() => navigate("/", { replace: true })} />
          </div>
        </div>

        {/* Right Form Section */}
        <div style={{ 
            flex: isMobile ? 'none' : '1',
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000b1a', // स्क्रीनशॉट के हिसाब से डार्क बैकग्राउंड
            padding: '40px 20px'
          }}>
          <div className={styles.loginBox} style={{ width: '100%', maxWidth: '400px' }}>
            <h2 className={styles.loginTitle} style={{ color: '#fff', textAlign: 'center', marginBottom: '30px' }}>DESTO Login</h2>

            <input
              className={styles.inputField}
              type="email"
              placeholder="Official Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#111', color: '#fff' }}
            />

            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#111', color: '#fff' }}
            />

            <button 
              className={styles.loginBtn} 
              onClick={handleLogin} 
              disabled={loading}
              style={{ width: '100%', padding: '12px', backgroundColor: '#5c2d91', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= BALANCED FOOTER (Exactly as Home) ================= */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>{lang === "hi" ? "जिला प्रशासन, उत्तराखंड" : "DISTRICT ADMINISTRATION, UTTARAKHAND"}</strong>
          </div>
          
          <nav style={footerLinks}>
            <Link to="/privacy" style={fLink}>Privacy Policy</Link>
            <span style={fSep}>|</span>
            <Link to="/terms" style={fLink}>Terms & Conditions</Link>
            <span style={fSep}>|</span>
            <Link to="/accessibility" style={fLink}>Accessibility</Link>
            <span style={fSep}>|</span>
            <Link to="/contact" style={fLink}>Contact Us</Link>
          </nav>
          
          <p style={copyright}>
            © {new Date().getFullYear()} Designed & Developed by District Administration
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ===================== FOOTER STYLES (NO CHANGES) ===================== */
const footerStyle = {
  position: "relative",
  zIndex: 1,
  backgroundColor: "#ffffff",
  padding: "15px 0",
  borderTop: "5px solid #21618c",
};

const footerContainer = {
  width: "90%",
  maxWidth: "550px",
  margin: "0 auto",
  textAlign: "center",
};

const footerBrand = {
  fontSize: "0.85rem",
  fontWeight: "700",
  color: "#333",
  marginBottom: "8px",
};

const footerLinks = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  marginBottom: "8px",
};

const fLink = {
  color: "#21618c",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "0.75rem",
};

const fSep = {
  color: "#ddd",
  fontSize: "0.75rem"
};

const copyright = {
  fontSize: "0.7rem",
  color: "#666",
  margin: 0,
  borderTop: "1px solid #f0f0f0",
  paddingTop: "8px"
};