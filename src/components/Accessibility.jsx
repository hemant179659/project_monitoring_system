import { Link } from "react-router-dom";
import { useState } from "react";

export default function Accessibility() {
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
          {lang === "hi"
            ? "सुलभता वक्तव्य (Accessibility Statement)"
            : "Accessibility Statement"}
        </h2>

        {lang === "hi" ? (
          <>
            <p>
              तहसील दिवस – शिकायत निवारण पोर्टल का उद्देश्य यह सुनिश्चित
              करना है कि यह वेबसाइट सभी उपयोगकर्ताओं के लिए सुलभ हो,
              जिनमें दिव्यांगजन भी शामिल हैं।
            </p>

            <h3>मानक अनुपालन</h3>
            <p>
              यह पोर्टल <strong>WCAG 2.1 Level AA</strong> एवं
              <strong> GIGW 3.0</strong> दिशानिर्देशों के अनुरूप विकसित
              किया गया है।
            </p>

            <h3>सुलभता सुविधाएँ</h3>
            <ul>
              <li>कीबोर्ड द्वारा पूर्ण नेविगेशन</li>
              <li>स्क्रीन रीडर अनुकूल संरचना</li>
              <li>उचित रंग कंट्रास्ट</li>
              <li>Responsive एवं मोबाइल फ्रेंडली डिज़ाइन</li>
              <li>स्पष्ट हेडिंग संरचना</li>
            </ul>

            <h3>प्रतिक्रिया</h3>
            <p>
              यदि वेबसाइट के उपयोग में किसी प्रकार की कठिनाई हो, तो
              उपयोगकर्ता जिला प्रशासन, उत्तराखंड से संपर्क कर सकते हैं।
            </p>
          </>
        ) : (
          <>
            <p>
              The objective of the Tehsil Diwas – Grievance Redressal Portal
              is to ensure that the website is accessible to all users,
              including persons with disabilities.
            </p>

            <h3>Standards Compliance</h3>
            <p>
              This portal follows <strong>WCAG 2.1 Level AA</strong> and
              <strong> GIGW 3.0</strong> guidelines.
            </p>

            <h3>Accessibility Features</h3>
            <ul>
              <li>Complete keyboard navigation</li>
              <li>Screen reader–friendly structure</li>
              <li>Adequate color contrast</li>
              <li>Responsive and mobile-friendly design</li>
              <li>Clear heading hierarchy</li>
            </ul>

            <h3>Feedback</h3>
            <p>
              If you face any difficulty in accessing the content of this
              website, please contact the District Administration,
              Uttarakhand.
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
