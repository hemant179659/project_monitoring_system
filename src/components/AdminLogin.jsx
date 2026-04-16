import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link add kiya gaya
import API from "../api/axios"; 
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/dmdashboard", { replace: true });
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
      const res = await API.post("/department/admin-login", {
        email: email.toLowerCase(), 
        password 
      });

      if (res.data.success) {
        localStorage.clear(); 
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminToken", res.data.token);
        
        toast.success("Login Successful!");

        setTimeout(() => {
          navigate("/dmdashboard", { replace: true });
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
      
      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* LEFT SECTION */}
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
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 999 }}>
            <BackButton onClick={() => navigate("/", { replace: true })} />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div style={{ 
            flex: isMobile ? 'none' : '1',
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000b1a', // Theme matching your system
            padding: '40px 20px'
          }}>
          <div className={styles.loginBox} style={{ width: '100%', maxWidth: '400px' }}>
            <h2 className={styles.loginTitle} style={{ color: '#fff', textAlign: 'center', marginBottom: '30px' }}>ADMIN Login</h2>

            <input
              className={styles.inputField}
              type="email"
              placeholder="Official Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px' }}
            />

            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px' }}
            />

            <button 
              className={styles.loginBtn} 
              onClick={handleLogin} 
              disabled={loading}
              style={{ width: '100%', fontWeight: 'bold' }}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= BALANCED FOOTER ================= */}
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

/* ===================== FOOTER STYLES ===================== */
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