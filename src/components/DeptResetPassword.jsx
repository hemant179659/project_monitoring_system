import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../api/axios"; // ✅ कस्टम API इंस्टेंस का उपयोग
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify (बेहतर अनुभव के लिए अलर्ट की जगह)
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [lang, setLang] = useState("hi");

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= VALIDATE LINK ================= */
  useEffect(() => {
    if (!token || !email) {
      toast.error(lang === "hi" ? "अमान्य या समाप्त लिंक" : "Invalid or expired link");
      setTimeout(() => navigate("/dept-login", { replace: true }), 3000);
    }
  }, [token, email, navigate, lang]);

  /* ================= RESET ================= */
  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      return toast.warn(lang === "hi" ? "कृपया सभी फ़ील्ड भरें" : "Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error(lang === "hi" ? "पासवर्ड मेल नहीं खा रहे" : "Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await API.post(`/department/reset-password`, { 
        email, 
        token, 
        newPassword 
      });

      toast.success(res.data.message || (lang === "hi" ? "पासवर्ड बदला गया" : "Password reset successfully"));
      setTimeout(() => navigate("/dept-login", { replace: true }), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "hi" ? "कुछ त्रुटि हुई" : "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <ToastContainer position="top-right" autoClose={2500} />

      {/* ================= LANGUAGE TOGGLE ================= */}
      <div style={langToggle}>
        <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} style={langSwitchBtn}>
          {lang === "hi" ? "English" : "हिंदी"}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* LEFT SECTION - Image */}
        <div
          style={{ 
            flex: isMobile ? 'none' : 1,
            height: isMobile ? '200px' : 'auto',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: '20px'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)' }} />
          <BackButton onClick={() => navigate("/dept-login")} />
        </div>

        {/* RIGHT SECTION - Form */}
        <main style={rightSection}>
          <section style={loginBox}>
            <h2 style={title}>
              {lang === "hi" ? "नया पासवर्ड सेट करें" : "Set New Password"}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px', textAlign: 'center' }}>
              {lang === "hi" ? "कृपया अपना नया सुरक्षित पासवर्ड चुनें" : "Please choose a new secure password"}
            </p>

            <label style={label}>{lang === "hi" ? "नया पासवर्ड" : "New Password"}</label>
            <input
              style={input}
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label style={label}>{lang === "hi" ? "पासवर्ड की पुष्टि करें" : "Confirm Password"}</label>
            <input
              style={input}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              style={primaryBtn}
              onClick={handleReset}
              disabled={loading}
            >
              {loading 
                ? (lang === "hi" ? "बदला जा रहा है..." : "Resetting...") 
                : (lang === "hi" ? "पासवर्ड अपडेट करें" : "Update Password")}
            </button>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
               <Link to="/dept-login" style={{ color: '#21618c', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                  {lang === "hi" ? "← लॉगिन पर वापस जाएँ" : "← Back to Login"}
               </Link>
            </div>
          </section>
        </main>
      </div>

      {/* ================= BALANCED FOOTER (SYNCED WITH SCREENSHOT 174) ================= */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>{lang === "hi" ? "जिला प्रशासन, उत्तराखंड" : "DISTRICT ADMINISTRATION, UTTARAKHAND"}</strong>
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
  backgroundColor: "#fff",
};

const langToggle = {
  position: "absolute",
  top: "15px",
  right: "20px",
  zIndex: 100,
};

const langSwitchBtn = {
  padding: "6px 12px",
  borderRadius: "20px",
  border: "1px solid #21618c",
  backgroundColor: "#fff",
  color: "#21618c",
  fontWeight: "700",
  fontSize: "0.75rem",
  cursor: "pointer",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const rightSection = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const loginBox = {
  width: "100%",
  maxWidth: 380,
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  backgroundColor: "#fff",
  border: "1px solid #f0f0f0"
};

const title = {
  textAlign: "center",
  marginBottom: 8,
  fontSize: "1.3rem",
  fontWeight: "800",
  color: "#002147",
};

const label = {
  display: "block",
  marginBottom: "6px",
  fontSize: "0.8rem",
  fontWeight: "700",
  color: "#333",
  textTransform: "uppercase",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "18px",
  borderRadius: "8px",
  border: "1.5px solid #ddd",
  fontSize: "0.9rem",
  boxSizing: "border-box",
};

const primaryBtn = {
  width: "100%",
  padding: "13px",
  backgroundColor: "#21618c",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "0.95rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "background 0.3s"
};

/* --- FOOTER STYLES (SYNCED) --- */
const footerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px 0",
  borderTop: "5px solid #21618c",
  width: '100%'
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