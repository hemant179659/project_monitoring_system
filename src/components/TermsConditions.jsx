import { Link } from "react-router-dom";
import { useState } from "react";

export default function TermsConditions() {
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
          {lang === "hi" ? "नियम एवं शर्तें" : "Terms & Conditions"}
        </h2>

        {lang === "hi" ? (
          <>
            <p>
              यह वेबसाइट <strong>तहसील दिवस – शिकायत निवारण पोर्टल</strong> है,
              जिसका संचालन <strong>जिला प्रशासन, उत्तराखंड</strong> द्वारा किया
              जाता है। इस पोर्टल का उपयोग करके आप निम्न शर्तों से सहमत होते हैं।
            </p>

            <h3>1. वेबसाइट का उपयोग</h3>
            <p>
              इस पोर्टल का उपयोग केवल वैध शिकायत पंजीकरण एवं जानकारी प्राप्त करने
              हेतु किया जाना चाहिए।
            </p>

            <h3>2. सामग्री की जिम्मेदारी</h3>
            <p>
              उपयोगकर्ता द्वारा प्रदान की गई जानकारी की सत्यता की जिम्मेदारी
              स्वयं उपयोगकर्ता की होगी।
            </p>

            <h3>3. सेवा में परिवर्तन</h3>
            <p>
              जिला प्रशासन बिना पूर्व सूचना के किसी भी सेवा में परिवर्तन या
              समाप्ति कर सकता है।
            </p>

            <h3>4. कानूनी अधिकार</h3>
            <p>
              किसी भी विवाद की स्थिति में न्याय क्षेत्र उत्तराखंड राज्य के
              अंतर्गत होगा।
            </p>
          </>
        ) : (
          <>
            <p>
              This website <strong>Tehsil Diwas – Grievance Redressal Portal</strong>{" "}
              is operated by the <strong>District Administration, Uttarakhand</strong>.
              By accessing this portal, you agree to the following terms and conditions.
            </p>

            <h3>1. Use of Website</h3>
            <p>
              This portal shall be used only for lawful grievance registration and
              information purposes.
            </p>

            <h3>2. User Responsibility</h3>
            <p>
              Users are responsible for the accuracy of the information submitted
              by them.
            </p>

            <h3>3. Modification of Services</h3>
            <p>
              The District Administration reserves the right to modify or
              discontinue services without prior notice.
            </p>

            <h3>4. Jurisdiction</h3>
            <p>
              Any legal disputes shall fall under the jurisdiction of
              Uttarakhand, India.
            </p>
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
