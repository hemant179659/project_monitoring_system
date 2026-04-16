import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link जोड़ा गया
import API from "../api/axios"; // ✅ axios की जगह कस्टम API इंस्टेंस
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
      // ✅ API इंस्टेंस का उपयोग
      await API.post("/department/forgot-password", { email });
      toast.success("Reset link sent to your email!");
      setTimeout(() => navigate("/dept-login"), 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
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
            height: isMobile ? '250px' : 'auto',
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
            padding: isMobile ? '40px 20px 100px' : '0',
            width: isMobile ? '100%' : '50%',
          }}
        >
          <div className={styles.loginBox} style={{ 
            width: '100%', 
            maxWidth: '380px',
            padding: '30px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ color: '#002147', fontWeight: '800', marginBottom: '10px' }}>Forgot Password</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '25px' }}>
              Enter your registered email to receive a reset link.
            </p>
            
            <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: '5px' }}>Email Address</label>
            <input
              className={styles.inputField}
              type="email"
              placeholder="e.g. admin@district.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{ marginBottom: '20px' }}
            />
            
            <button 
              className={styles.loginBtn} 
              onClick={handleReset}
              disabled={loading}
              style={{ background: '#0056b3', padding: '12px', fontWeight: '700' }}
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => navigate("/dept-login")}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#21618c', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  fontSize: '0.9rem' 
                }}
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BALANCED FOOTER (SYNCED) ================= */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>DISTRICT ADMINISTRATION, UTTARAKHAND</strong>
          </div>
          
          <nav style={footerLinksWrapper}>
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

/* ===================== STYLES ===================== */

const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#ffffff",
};

/* --- FOOTER STYLES (SYNCED) --- */
const footerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px 0",
  borderTop: "5px solid #21618c",
  marginTop: "auto", // सुनिश्चित करता है कि फुटर हमेशा नीचे रहे
  width: '100%',
  zIndex: 10
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

const footerLinksWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  marginBottom: "8px",
  flexWrap: "wrap",
};

const fLink = {
  color: "#21618c",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "0.75rem",
};

const fSep = { color: "#ddd", fontSize: "0.75rem" };

const copyright = {
  fontSize: "0.7rem",
  color: "#666",
  margin: 0,
  borderTop: "1px solid #f0f0f0",
  paddingTop: "8px",
};