import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaShieldAlt, FaLanguage, FaArrowLeft } from "react-icons/fa";

export default function PrivacyPolicy() {
  const [lang, setLang] = useState("hi"); // hi | en
  const navigate = useNavigate();

  return (
    <div style={pageWrapper}>
      {/* ================= SKIP LINK ================= */}
      <a href="#main-content" style={skipLink}>
        {lang === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}
      </a>

      {/* ================= HEADER / NAVBAR ================= */}
      <header style={headerStyle}>
        <div style={headerContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate(-1)} style={backBtn} title="Back">
              <FaArrowLeft />
            </button>
            <div>
              <h1 style={siteTitle}>
                {lang === "hi" ? "जिला योजना पोर्टल" : "District Plan Portal"}
              </h1>
              <p style={siteSubtitle}>
                {lang === "hi" ? "उत्तराखंड शासन" : "Government of Uttarakhand"}
              </p>
            </div>
          </div>

          <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} style={toggleBtn}>
            <FaLanguage size={20} /> {lang === "hi" ? "English" : "हिंदी"}
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main id="main-content" style={contentStyle} role="main">
        <div style={cardStyle}>
          <div style={cardHeader}>
            <FaShieldAlt size={24} color="#0056b3" />
            <h2 style={pageHeading}>
              {lang === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
            </h2>
          </div>

          <div style={textBody}>
            <p style={introText}>
              {lang === "hi"
                ? "यह गोपनीयता नीति जिला योजना निगरानी पोर्टल के उपयोगकर्ताओं की जानकारी की सुरक्षा के लिए बनाई गई है। इस पोर्टल का संचालन जिला प्रशासन द्वारा किया जाता है।"
                : "This Privacy Policy describes how user information is protected on the District Planning Monitoring Portal, operated by the District Administration."}
            </p>

            <section style={sectionStyle}>
              <h3 style={sectionTitle}>1. {lang === "hi" ? "जानकारी का संग्रह" : "Information Collection"}</h3>
              <p>
                {lang === "hi"
                  ? "पोर्टल उपयोग के दौरान लॉग-इन क्रेडेंशियल, विभाग का नाम और प्रोजेक्ट संबंधी डेटा एकत्र किया जाता है ताकि निगरानी प्रक्रिया सुचारू रहे।"
                  : "During usage, login credentials, department names, and project-related data are collected to ensure a smooth monitoring process."}
              </p>
            </section>

            <section style={sectionStyle}>
              <h3 style={sectionTitle}>2. {lang === "hi" ? "डेटा का उपयोग" : "Data Usage"}</h3>
              <p>
                {lang === "hi"
                  ? "एकत्र की गई जानकारी का उपयोग केवल आधिकारिक रिपोर्टिंग, प्रगति विश्लेषण और प्रशासनिक निर्णयों के लिए किया जाता है।"
                  : "The collected information is strictly used for official reporting, progress analysis, and administrative decision-making."}
              </p>
            </section>

            <section style={sectionStyle}>
              <h3 style={sectionTitle}>3. {lang === "hi" ? "डेटा सुरक्षा" : "Data Security"}</h3>
              <p>
                {lang === "hi"
                  ? "हम डेटा की गोपनीयता बनाए रखने के लिए सुरक्षित सर्वर और अत्याधुनिक सुरक्षा उपायों का उपयोग करते हैं।"
                  : "We employ secure servers and advanced security measures to maintain the confidentiality of the portal data."}
              </p>
            </section>

            <div style={lastUpdated}>
              {lang === "hi" ? "अंतिम अद्यतन: अप्रैल 2026" : "Last Updated: April 2026"}
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER (SCREENSHOT 174 SYNC) ================= */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>DISTRICT ADMINISTRATION, UTTARAKHAND</strong>
          </div>
          
          <nav style={footerLinksWrapper}>
            <Link to="/privacy-policy" style={fLink}>Privacy Policy</Link>
            <span style={fSep}>|</span>
            <Link to="/terms-conditions" style={fLink}>Terms & Conditions</Link>
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
  backgroundColor: "#f4f7f6",
};

const skipLink = {
  position: "absolute",
  top: "-100px",
  left: 0,
  background: "#0056b3",
  color: "#fff",
  padding: "8px",
  zIndex: 100,
};

const headerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px 0",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  borderBottom: "1px solid #ddd",
};

const headerContainer = {
  width: "90%",
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const backBtn = {
  backgroundColor: "#eee",
  border: "none",
  padding: "10px",
  borderRadius: "50%",
  color: "#333",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  fontSize: "16px"
};

const siteTitle = {
  margin: 0,
  fontWeight: "800",
  fontSize: "1.4rem",
  color: "#000",
};

const siteSubtitle = {
  margin: 0,
  fontSize: "0.85rem",
  color: "#666",
  fontWeight: "600",
};

const toggleBtn = {
  backgroundColor: "#0056b3",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const contentStyle = {
  flex: 1,
  width: "90%",
  maxWidth: "800px",
  margin: "40px auto",
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  overflow: "hidden",
  border: "1px solid #eee",
};

const cardHeader = {
  backgroundColor: "#fcfcfc",
  padding: "20px 30px",
  borderBottom: "1px solid #eee",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const pageHeading = {
  margin: 0,
  fontWeight: 800,
  fontSize: "1.25rem",
  color: "#000",
};

const textBody = {
  padding: "30px",
  lineHeight: "1.7",
  color: "#333",
};

const introText = {
  fontSize: "1.05rem",
  marginBottom: "25px",
  fontWeight: "500",
};

const sectionStyle = {
  marginBottom: "20px",
};

const sectionTitle = {
  fontSize: "1.1rem",
  fontWeight: "700",
  color: "#0056b3",
  marginBottom: "8px",
};

const lastUpdated = {
  marginTop: "30px",
  fontSize: "0.85rem",
  color: "#888",
  borderTop: "1px solid #eee",
  paddingTop: "15px",
  fontStyle: "italic",
};

/* --- FOOTER STYLES (MATCHING SCREENSHOT 174) --- */
const footerStyle = { 
  backgroundColor: "#ffffff", 
  padding: "25px 0", 
  borderTop: "5px solid #0056b3",
  marginTop: "auto" 
};

const footerContainer = { 
  width: "90%", 
  maxWidth: "800px", 
  margin: "0 auto", 
  textAlign: "center" 
};

const footerBrand = { 
  fontSize: "0.85rem", 
  color: "#000", 
  marginBottom: "10px" 
};

const footerLinksWrapper = { 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  gap: "12px", 
  marginBottom: "12px", 
  flexWrap: "wrap" 
};

const fLink = { 
  color: "#0056b3", 
  textDecoration: "none", 
  fontWeight: "700", 
  fontSize: "0.8rem" 
};

const fSep = { 
  color: "#ccc", 
  fontSize: "0.8rem" 
};

const copyright = { 
  fontSize: "0.75rem", 
  color: "#666", 
  margin: 0, 
  borderTop: "1px solid #eee", 
  paddingTop: "12px" 
};