import { Link } from "react-router-dom";
import { useState } from "react";

export default function Accessibility() {
  const [lang, setLang] = useState("en"); // Default consistent with your other pages

  return (
    <div style={pageWrapper} lang={lang}>
      {/* ================= SKIP TO CONTENT ================= */}
      <a href="#main-content" style={skipLink}>
        {lang === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}
      </a>

      {/* ================= LANGUAGE TOGGLE ================= */}
      <div style={langToggle}>
        <button onClick={() => setLang("hi")} style={langBtn(lang === "hi")}>हिन्दी</button>
        <button onClick={() => setLang("en")} style={langBtn(lang === "en")}>English</button>
      </div>

      {/* ================= HEADER ================= */}
      <header style={headerStyle} role="banner">
        <h1 style={siteTitle}>
          {lang === "hi" ? "जिला योजना निगरानी प्रणाली" : "District Plan Monitoring System"}
        </h1>
        <div style={accentLine}></div>
        <p style={locationText}>DISTRICT ADMINISTRATION, UTTARAKHAND</p>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main id="main-content" style={contentStyle} role="main">
        <h2 style={pageHeading}>
          {lang === "hi"
            ? "सुलभता वक्तव्य (Accessibility Statement)"
            : "Accessibility Statement"}
        </h2>

        {lang === "hi" ? (
          <>
            <p>
              जिला योजना निगरानी प्रणाली का उद्देश्य यह सुनिश्चित करना है कि यह वेबसाइट सभी उपयोगकर्ताओं के लिए सुलभ हो, जिसमें दिव्यांगजन भी शामिल हैं।
            </p>
            <h3>मानक अनुपालन</h3>
            <p>यह पोर्टल <strong>WCAG 2.1 Level AA</strong> एवं <strong> GIGW 3.0</strong> दिशानिर्देशों के अनुरूप विकसित किया गया है।</p>
            <h3>सुलभता सुविधाएँ</h3>
            <ul>
              <li>कीबोर्ड द्वारा पूर्ण नेविगेशन</li>
              <li>स्क्रीन रीडर अनुकूल संरचना</li>
              <li>उचित रंग कंट्रास्ट</li>
              <li>Responsive एवं मोबाइल फ्रेंडली डिज़ाइन</li>
              <li>स्पष्ट हेडिंग संरचना</li>
            </ul>
          </>
        ) : (
          <>
            <p>
              The objective of the District Plan Monitoring System is to ensure that the website is accessible to all users, including persons with disabilities.
            </p>
            <h3>Standards Compliance</h3>
            <p>This portal follows <strong>WCAG 2.1 Level AA</strong> and <strong> GIGW 3.0</strong> guidelines.</p>
            <h3>Accessibility Features</h3>
            <ul>
              <li>Complete keyboard navigation</li>
              <li>Screen reader–friendly structure</li>
              <li>Adequate color contrast</li>
              <li>Responsive and mobile-friendly design</li>
              <li>Clear heading hierarchy</li>
            </ul>
          </>
        )}
      </main>

      {/* ================= BALANCED FOOTER (As requested) ================= */}
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
  backgroundColor: "#ffffff",
  fontFamily: "'Open Sans', Arial, sans-serif",
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
  top: "15px",
  right: "15px",
  zIndex: 10,
  display: "flex",
  border: "1px solid #21618c",
  borderRadius: "3px",
  overflow: "hidden"
};

const langBtn = (active) => ({
  padding: "5px 12px",
  backgroundColor: active ? "#21618c" : "transparent",
  color: active ? "#fff" : "#21618c",
  border: "none",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: "bold",
});

const headerStyle = {
  textAlign: "center",
  padding: "60px 20px 30px",
  backgroundColor: "#001529",
  color: "#fff",
};

const siteTitle = {
  margin: 0,
  fontWeight: "800",
  fontSize: "1.8rem",
  textTransform: "uppercase",
};

const accentLine = {
  width: "60px",
  height: "4px",
  backgroundColor: "#ff9933",
  margin: "12px auto",
};

const locationText = {
  fontSize: "0.8rem",
  letterSpacing: "1px",
  opacity: 0.9,
};

const contentStyle = {
  flex: 1,
  maxWidth: "900px",
  margin: "0 auto",
  padding: "40px 20px",
  lineHeight: 1.7,
  color: "#333",
};

const pageHeading = {
  color: "#21618c",
  marginBottom: "20px",
  fontWeight: "800",
  borderBottom: "2px solid #f0f0f0",
  paddingBottom: "10px"
};

/* ===================== BALANCED FOOTER STYLES ===================== */
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

const footerLinksWrapper = {
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