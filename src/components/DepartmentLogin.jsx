import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [lang, setLang] = useState("en");

  // Dashboard Check, Resize Handler & Back Button Logic
  useEffect(() => {
    // 1. Dashboard Check
    const token = localStorage.getItem("deptToken");
    if (token) {
      navigate("/dept-dashboard", { replace: true });
    }

    // 2. Resize Handler
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    // 3. Browser Back Button Redirection to Home
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = (event) => {
      // Browser back button dabane par home page pe bheje
      navigate("/", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("popstate", handlePopState);
    };
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* LEFT SECTION */}
        <div
          style={{ 
            flex: isMobile ? 'none' : '1',
            backgroundImage: `url(${backgroundImage})`, 
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundColor: '#ffffff',
            height: isMobile ? '250px' : 'auto',
            position: 'relative' 
          }}
        >
          {/* BackButton direct home navigate karega */}
          <div 
            onClick={() => navigate("/", { replace: true })} 
            style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 999, cursor: 'pointer' }}
          >
            <BackButton />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div style={{ 
            flex: isMobile ? 'none' : '1',
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000b1a', 
            padding: '40px 20px'
          }}>
          <div className={styles.loginBox} style={{ width: '100%', maxWidth: '400px' }}>
            <h2 className={styles.loginTitle} style={{ color: '#fff', textAlign: 'center' }}>Department Login</h2>
            
            <input
              className={styles.inputField}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px' }}
            />
            
            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px' }}
            />

            <button className={styles.loginBtn} onClick={handleLogin} style={{ width: '100%', fontWeight: 'bold' }}>
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

      {/* FOOTER */}
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