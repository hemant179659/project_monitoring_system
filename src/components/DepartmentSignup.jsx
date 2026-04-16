import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link add kiya gaya
import API from "../api/axios"; 
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
  const [lang, setLang] = useState("en"); // Language state for footer

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

  const handleSignup = async () => {
    if (!deptName || !email || !password || !confirmPassword || !verificationCode) {
      return toast.error("Please complete all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const response = await API.post("/department/signup", {
        deptName,
        email,
        password,
        verificationCode,
      });

      toast.success(response.data.message || "Account created successfully!");
      
      setTimeout(() => {
        navigate("/dept-login");
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
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
            height: isMobile ? '200px' : 'auto',
            position: 'relative',
            borderRight: isMobile ? 'none' : '1px solid #eee'
          }}
        >
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 999 }}>
            <BackButton onClick={() => navigate("/dept-login")} />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div 
          style={{
            flex: isMobile ? 'none' : '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000b1a', // Theme matching login screens
            padding: '40px 20px'
          }}
        >
          <div className={styles.loginBox} style={{ width: '90%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', textAlign: 'center', color: '#fff' }}>
              Department Signup
            </h2>

            <select 
              className={styles.inputField} 
              value={deptName} 
              onChange={(e) => setDeptName(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px' }}
            >
              <option value="">Select Department</option>
              {["District Industry Centre",
  "District Horticulture Office",
  "Chief Agriculture Office",
  "Agriculture Soil Conservation Office (Rudrapur)",
  "Agriculture Soil Conservation Office (Kashipur)",
  "Minor Irrigation Department",
  "District Development Office",
  "District Panchayati Raj Office",
  "Youth Welfare PRD Department",
  "Chief Veterinary Office",
  "Dairy Development Department",
  "Cooperative Societies Office",
  "District Sports Office",
  "Cane Commissioner Office",
  "Chief Medical Office",
  "Ayurvedic Yunani Office",
  "Homeopathy Medical Office",
  "Economic Statistics Office",
  "District Programme Office",
  "District Probation Office",
  "District Magistrate (Grants)",
  "District Magistrate Office",
  "PWD (PD) Rudrapur",
  "PWD (CD) Kashipur",
  "PWD (CD) Khatima",
  "Fisheries Department",
  "District Education Office",
  "Elementary Education Office",
  "District Employment Office",
  "District Social Welfare Office",
  "District Information Office",
  "Irrigation Division (Rudrapur)",
  "Irrigation Division (Kashipur)",
  "Irrigation Division (Sitarganj)",
  "Tubewell Division (Bazpur)"].map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <input 
              className={styles.inputField} 
              type="email" 
              placeholder="Email" 
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
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px' }}
            />
            
            <input 
              className={styles.inputField} 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px' }}
            />

            <input 
              className={styles.inputField} 
              type="text" 
              placeholder="Verification Code" 
              value={verificationCode} 
              onChange={(e) => setVerificationCode(e.target.value)} 
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #0056b3' }}
            />

            <button className={styles.loginBtn} onClick={handleSignup} style={{ width: '100%', fontWeight: 'bold' }}>Signup</button>
            <button 
              className={styles.loginBtn} 
              style={{ width: '100%', marginTop: '10px', backgroundColor: '#6c757d', fontWeight: 'bold' }} 
              onClick={() => navigate("/dept-login")}
            >
              Back to Login
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