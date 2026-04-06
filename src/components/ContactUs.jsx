import { Link } from "react-router-dom";
import { useState } from "react";

export default function ContactUs() {
  const [lang, setLang] = useState("hi"); // hi | en

  return (
    <div style={pageWrapper} lang={lang}>
      {/* ================= SKIP TO CONTENT ================= */}
      <a href="#main-content" style={skipLink}>
        {lang === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}
      </a>

      {/* ================= LANGUAGE TOGGLE ================= */}
      <div style={langToggle}>
        <button onClick={() => setLang("hi")} style={langBtn(lang === "hi")}>
          हिंदी
        </button>
        <button onClick={() => setLang("en")} style={langBtn(lang === "en")}>
          English
        </button>
      </div>

      {/* ================= HEADER ================= */}
      <header style={headerStyle} role="banner">
        <h1 style={siteTitle}>
          {lang === "hi" ? "तहसील दिवस" : "Tehsil Diwas"}
        </h1>
        <p style={siteSubtitle}>
          {lang === "hi"
            ? "शिकायत निवारण पोर्टल"
            : "Grievance Redressal Portal"}
        </p>
      </header>

      {/* ================= MAIN ================= */}
      <main id="main-content" style={contentStyle} role="main">
        <h2 style={pageHeading}>
          {lang === "hi" ? "संपर्क करें" : "Contact Us"}
        </h2>

        {lang === "hi" ? (
          <>
            <p>
              यदि आपको इस पोर्टल से संबंधित किसी प्रकार की सहायता या जानकारी
              की आवश्यकता हो, तो आप निम्न माध्यमों से संपर्क कर सकते हैं।
            </p>

            <ul>
              <li>
                <strong>कार्यालय:</strong> जिला प्रशासन, उत्तराखंड
              </li>
              <li>
                <strong>कार्य समय:</strong> सोमवार से शुक्रवार (10:00 AM – 5:00 PM)
              </li>
              <li>
                <strong>ईमेल:</strong> support@district.gov.in
              </li>
            </ul>
          </>
        ) : (
          <>
            <p>
              For any assistance or queries related to this portal, please
              contact the details given below.
            </p>

            <ul>
              <li>
                <strong>Office:</strong> District Administration, Uttarakhand
              </li>
              <li>
                <strong>Working Hours:</strong> Monday to Friday (10:00 AM – 5:00 PM)
              </li>
              <li>
                <strong>Email:</strong> support@district.gov.in
              </li>
            </ul>
          </>
        )}

        <p style={authorityText}>
          {lang === "hi"
            ? "जिला प्रशासन, उत्तराखंड"
            : "District Administration, Uttarakhand"}
        </p>
      </main>

      {/* ================= FOOTER ================= */}
      <footer style={footerStyle} role="contentinfo">
        <p style={{ margin: 0, fontWeight: 700 }}>
          {lang === "hi"
            ? "जिला प्रशासन, उत्तराखंड"
            : "District Administration, Uttarakhand"}
        </p>
        <p style={{ margin: "4px 0", fontSize: "0.8rem" }}>
          Designed & Developed by District Administration
        </p>

        <nav aria-label="Footer Navigation">
          <ul style={footerLinks}>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/accessibility">Accessibility</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </nav>
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
  position: "relative",
};

const skipLink = {
  position: "absolute",
  top: "-40px",
  left: "10px",
  background: "#000",
  color: "#fff",
  padding: "6px 10px",
  zIndex: 1000,
  textDecoration: "none",
};

const langToggle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  display: "flex",
  gap: "6px",
};

const langBtn = (active) => ({
  padding: "6px 10px",
  border: "1px solid #000",
  backgroundColor: active ? "#000" : "#fff",
  color: active ? "#fff" : "#000",
  cursor: "pointer",
  fontWeight: 600,
});

const headerStyle = {
  textAlign: "center",
  padding: "28px 16px",
  borderBottom: "4px solid #0056b3",
  color: "#000",
};

const siteTitle = {
  margin: 0,
  fontWeight: 800,
  fontSize: "2rem",
};

const siteSubtitle = {
  margin: 0,
  fontSize: "1rem",
};

const contentStyle = {
  maxWidth: "900px",
  margin: "auto",
  padding: "24px",
  lineHeight: 1.65,
  color: "#000",
};

const pageHeading = {
  marginBottom: "16px",
  fontWeight: 800,
  fontSize: "1.5rem",
};

const authorityText = {
  marginTop: "32px",
  fontWeight: 700,
};

const footerStyle = {
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "14px 10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
};

const footerLinks = {
  listStyle: "none",
  padding: 0,
  margin: "8px 0 0",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  justifyContent: "center",
};
