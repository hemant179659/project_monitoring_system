import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import backgroundImage from "../assets/work.jpeg";

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={pageWrapper} lang={lang}>
      {/* ================= BACKGROUND ================= */}
      <div style={backgroundOverlay(backgroundImage)} aria-hidden="true" />

      {/* ================= LANG TOGGLE ================= */}
      <div style={langToggle}>
        <button onClick={() => setLang("hi")} style={langBtn(lang === "hi")}>हिन्दी</button>
        <button onClick={() => setLang("en")} style={langBtn(lang === "en")}>English</button>
      </div>

      {/* ================= HEADER ================= */}
      <header style={headerStyle}>
        <h1 style={titleStyle(isMobile)}>
          {lang === "hi" ? "जिला योजना निगरानी प्रणाली" : "District Plan Monitoring System"}
        </h1>
        <div style={accentLine}></div>
        <p style={locationText}>DISTRICT ADMINISTRATION, UTTARAKHAND</p>
      </header>

      {/* ================= MAIN BUTTONS ================= */}
      <main style={mainStyle}>
        <div style={buttonGrid(isMobile)}>
          <Link to="/admin-login" className="btn-3d" style={govButton("#5c2d91", isMobile)}>
            {lang === "hi" ? "प्रशासन लॉगिन" : "Administration LOGIN"}
          </Link>
          <Link to="/desto-login" className="btn-3d" style={govButton("#d35400", isMobile)}>
            {lang === "hi" ? "डीईएसटीओ लॉगिन" : "DESTO LOGIN"}
          </Link>
          <Link to="/dept-login" className="btn-3d" style={govButton("#21618c", isMobile)}>
            {lang === "hi" ? "विभाग लॉगिन" : "DEPT. LOGIN"}
          </Link>
        </div>
      </main>

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
            <Link to="/budgetallocation" style={fLink}>Budget Allocation</Link>
            <span style={fSep}>|</span>
            <Link to="/update-budget" style={fLink}>Update Budget</Link>
          </nav>
          
          <p style={copyright}>
            © {new Date().getFullYear()} Designed & Developed by District Administration
          </p>
        </div>
      </footer>

      <style>
        {`
          .btn-3d { transition: all 0.1s ease-in-out; cursor: pointer; text-decoration: none; }
          .btn-3d:active { transform: translateY(4px); border-bottom-width: 2px !important; box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important; }
          .btn-3d:hover { filter: brightness(1.1); }
        `}
      </style>
    </div>
  );
}

/* ===================== STYLES ===================== */

const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#001529",
  position: "relative",
  fontFamily: "'Open Sans', Arial, sans-serif",
  overflow: "hidden"
};

const backgroundOverlay = (img) => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: 0.45,
  zIndex: 0,
});

const langToggle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  zIndex: 10,
  display: "flex",
  border: "1px solid #fff",
  borderRadius: "3px",
  overflow: "hidden"
};

const langBtn = (active) => ({
  padding: "5px 12px",
  backgroundColor: active ? "#fff" : "transparent",
  color: active ? "#000" : "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: "bold",
});

const headerStyle = {
  position: "relative",
  zIndex: 1,
  textAlign: "center",
  padding: "70px 20px 20px",
  color: "#fff",
};

const titleStyle = (isMobile) => ({
  fontSize: isMobile ? "1.6rem" : "3rem",
  margin: "0",
  fontWeight: "800",
  textTransform: "uppercase",
  textShadow: "2px 4px 8px rgba(0,0,0,0.7)",
});

const accentLine = {
  width: "80px",
  height: "4px",
  backgroundColor: "#ff9933",
  margin: "12px auto",
};

const locationText = {
  fontSize: "0.9rem",
  letterSpacing: "2px",
  fontWeight: "600",
  opacity: 0.9,
};

const mainStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1,
};

const buttonGrid = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: "20px",
});

const govButton = (bgColor, isMobile) => ({
  backgroundColor: bgColor,
  color: "#fff",
  padding: "18px 25px",
  borderRadius: "5px",
  textAlign: "center",
  fontSize: "1rem",
  fontWeight: "bold",
  minWidth: isMobile ? "250px" : "230px",
  borderBottom: "5px solid rgba(0,0,0,0.4)",
  boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

// ================= BALANCED FOOTER =================
const footerStyle = {
  position: "relative",
  zIndex: 1,
  backgroundColor: "#ffffff",
  padding: "15px 0", // मध्यम पैडिंग (Balanced)
  borderTop: "5px solid #21618c",
};

const footerContainer = {
  width: "90%",
  maxWidth: "550px", // कंटेंट विड्थ सेट है
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