import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function TermsConditions() {
  const [lang, setLang] = useState("hi"); // hi | en
  const navigate = useNavigate();

  return (
    <div style={pageWrapper}>
      {/* ================= SKIP TO CONTENT ================= */}
      <a href="#main-content" style={skipLink}>
        {lang === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}
      </a>

      {/* ================= LANGUAGE TOGGLE ================= */}
      <div style={langToggle}>
        <button onClick={() => setLang("hi")} style={langBtn(lang === "hi")}>हिंदी</button>
        <button onClick={() => setLang("en")} style={langBtn(lang === "en")}>English</button>
      </div>

      {/* ================= HEADER ================= */}
      <header style={headerStyle} role="banner">
        <h1 style={siteTitle}>
          {lang === "hi" ? "जिला योजना अनुश्रवण प्रणाली" : "District Plan Monitoring System"}
        </h1>
        <p style={siteSubtitle}>
          {lang === "hi" ? "विकास कार्यों की प्रगति एवं बजट अनुश्रवण" : "Project Progress & Budget Monitoring"}
        </p>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main id="main-content" style={contentStyle} role="main">
        <h2 style={pageHeading}>
          {lang === "hi" ? "नियम एवं शर्तें" : "Terms & Conditions"}
        </h2>

        <div style={infoBox}>
          {lang === "hi" ? (
            <>
              <p>यह पोर्टल जिला प्रशासन, ऊधम सिंह नगर द्वारा आधिकारिक उपयोग के लिए संचालित है। इसके उपयोग के नियम निम्नलिखित हैं:</p>
              <ul style={listStyle}>
                <li><strong>उपयोग:</strong> यह पोर्टल केवल अधिकृत विभागीय डेटा प्रविष्टि के लिए है।</li>
                <li><strong>डेटा सुरक्षा:</strong> सभी प्रविष्टियां सत्य और सत्यापित होनी चाहिए।</li>
                <li><strong>गोपनीयता:</strong> लॉगिन क्रेडेंशियल को सुरक्षित रखना उपयोगकर्ता की जिम्मेदारी है।</li>
              </ul>
            </>
          ) : (
            <>
              <p>This portal is operated by the District Administration, Udham Singh Nagar for official use. The terms of use are as follows:</p>
              <ul style={listStyle}>
                <li><strong>Usage:</strong> This portal is strictly for authorized departmental data entry.</li>
                <li><strong>Data Integrity:</strong> All entries must be authentic and verified.</li>
                <li><strong>Confidentiality:</strong> Users are responsible for maintaining the security of their login credentials.</li>
              </ul>
            </>
          )}
        </div>
      </main>

      {/* ================= BALANCED FOOTER (AS REQUESTED) ================= */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>{lang === "hi" ? "जिला प्रशासन, ऊधम सिंह नगर" : "DISTRICT ADMINISTRATION, UDHAM SINGH NAGAR"}</strong>
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
            © {new Date().getFullYear()} Designed & Developed by NIC Udham Singh Nagar
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ===================== STYLES (No Opacity, Sharp Contrast) ===================== */

const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f8fafc",
  fontFamily: "'Inter', sans-serif",
};

const skipLink = {
  position: "absolute",
  top: "-40px",
  left: "10px",
  background: "#000",
  color: "#fff",
  padding: "6px 10px",
  zIndex: 1000,
};

const langToggle = {
  position: "absolute",
  top: "15px",
  right: "20px",
  display: "flex",
  gap: "8px",
};

const langBtn = (active) => ({
  padding: "5px 12px",
  border: "1.5px solid #000000",
  borderRadius: "4px",
  backgroundColor: active ? "#21618c" : "#fff",
  color: active ? "#fff" : "#000000",
  cursor: "pointer",
  fontSize: "0.8rem",
  fontWeight: "bold",
});

const headerStyle = {
  textAlign: "center",
  padding: "40px 16px",
  backgroundColor: "#fff",
  borderBottom: "5px solid #21618c",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const siteTitle = {
  margin: 0,
  fontWeight: "800",
  fontSize: "2.2rem",
  color: "#000000",
};

const siteSubtitle = {
  margin: "5px 0 0",
  fontSize: "1.1rem",
  color: "#21618c",
  textTransform: "uppercase",
  letterSpacing: "1px",
  fontWeight: "700",
};

const contentStyle = {
  maxWidth: "800px",
  width: "90%",
  margin: "40px auto",
  padding: "40px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  flex: 1,
};

const pageHeading = {
  color: "#000000",
  borderBottom: "2px solid #eef2f5",
  paddingBottom: "15px",
  marginBottom: "20px",
  fontSize: "1.8rem",
  fontWeight: "900",
};

const infoBox = {
  lineHeight: "1.8",
  color: "#000000",
  fontWeight: "500",
};

const listStyle = {
  listStyleType: "none",
  padding: "20px",
  backgroundColor: "#f1f5f9",
  borderRadius: "8px",
  marginTop: "20px",
  borderLeft: "5px solid #21618c",
};

const footerStyle = {
  backgroundColor: "#ffffff",
  padding: "20px 0",
  borderTop: "5px solid #21618c",
  marginTop: "auto",
};

const footerContainer = {
  width: "90%",
  maxWidth: "800px",
  margin: "0 auto",
  textAlign: "center",
};

const footerBrand = {
  fontSize: "0.9rem",
  fontWeight: "800",
  color: "#000000",
  marginBottom: "10px",
};

const footerLinksWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginBottom: "10px",
  flexWrap: "wrap",
};

const fLink = {
  color: "#21618c",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "0.8rem",
};

const fSep = { color: "#000000", fontWeight: "900" };

const copyright = {
  fontSize: "0.75rem",
  color: "#000000",
  margin: 0,
  borderTop: "1px solid #f0f0f0",
  paddingTop: "10px",
  fontWeight: "600",
};