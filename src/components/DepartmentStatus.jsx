import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link जोड़ा गया
import API from "../api/axios"; 
import { FaFileExcel, FaFilePdf, FaLanguage, FaBuilding, FaCheckCircle, FaClock, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DepartmentStatus() {
  const navigate = useNavigate();
  const [deptStats, setDeptStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("hi");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const token = localStorage.getItem("destoToken") || localStorage.getItem("adminToken");
    if (!isAdmin || !token) {
      toast.error("Access Denied! Please login as Admin.");
      navigate("/desto-login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = {
    hi: {
      title: "विभागवार बजट एवं प्रगति विवरण",
      total: "प्रोजेक्ट्स",
      completed: "पूर्ण",
      pending: "लंबित",
      budget: "बजट (L)",
      shesh: "शेष (L)",
      status: "उपयोग %",
      excel: "Excel",
      pdf: "PDF",
      admin: "जिला प्रशासन, उत्तराखंड"
    },
    en: {
      title: "Dept Budget & Progress Status",
      total: "Projects",
      completed: "Done",
      pending: "Pend",
      budget: "Budget (L)",
      shesh: "Rem (L)",
      status: "Util %",
      excel: "Excel",
      pdf: "PDF",
      admin: "DISTRICT ADMINISTRATION, UTTARAKHAND"
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await API.get("/department/budget-summary");
        const processedData = (res.data || []).map(d => {
          const spent = d.totalBudget - d.remaining;
          const utilization = d.totalBudget > 0 ? ((spent / d.totalBudget) * 100).toFixed(1) : 0;
          return { ...d, utilization };
        });
        setDeptStats(processedData);
      } catch (err) {
        toast.error("Data fetch error!");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const exportToExcel = () => {
    const data = deptStats.map(d => ({
      "Department": d.department,
      "Total Projects": d.totalProjects,
      "Completed": d.completed,
      "Pending": d.pending,
      "Total Budget (L)": d.totalBudget,
      "Remaining (L)": d.remaining,
      "Utilization %": d.utilization + "%"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary");
    XLSX.writeFile(wb, "Department_Utilization_Report.xlsx");
  };

  const exportToPDF = async () => {
    const toastId = toast.loading("Generating Official PDF...");
    const element = document.createElement("div");
    element.style.padding = "30px";
    element.style.background = "#fff";
    element.style.width = "1100px";
    element.innerHTML = `
      <div style="font-family: Arial; border: 3px solid #000; padding: 25px; color: #000;">
        <h2 style="text-align: center; margin: 0;">DISTRICT PLANNING OFFICE</h2>
        <h3 style="text-align: center; margin: 10px 0;">Official Budget & Progress Status</h3>
        <hr style="border: 1px solid #000" />
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f2f2f2;">
              <th style="border: 1px solid #000; padding: 8px;">Department</th>
              <th style="border: 1px solid #000; padding: 8px;">Projects</th>
              <th style="border: 1px solid #000; padding: 8px;">Budget (L)</th>
              <th style="border: 1px solid #000; padding: 8px;">Spent (L)</th>
              <th style="border: 1px solid #000; padding: 8px;">Utilization %</th>
            </tr>
          </thead>
          <tbody>
            ${deptStats.map(d => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px;">${d.department}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${d.totalProjects}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">₹${d.totalBudget}L</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">₹${(d.totalBudget - d.remaining).toFixed(2)}L</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">${d.utilization}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    document.body.appendChild(element);
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(imgData, "JPEG", 5, 10, 287, (canvas.height * 287) / canvas.width);
    pdf.save(`Dept_Summary_Official.pdf`);
    document.body.removeChild(element);
    toast.update(toastId, { render: "PDF Ready!", type: "success", isLoading: false, autoClose: 2000 });
  };

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <main style={{ padding: isMobile ? "15px" : "30px", flex: 1 }}>
        
        {/* Responsive Header */}
        <header style={headerStyle(isMobile)}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button onClick={() => navigate(-1)} style={backBtn}>
              <FaArrowLeft />
            </button>
            <div>
              <h1 style={{ fontWeight: "900", color: "#002147", margin: 0, fontSize: isMobile ? '1.1rem' : '1.5rem' }}>
                {t[lang].title}
              </h1>
              <p style={{ color: '#64748b', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Real-time Monitoring
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "8px", width: isMobile ? "100%" : "auto" }}>
            <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} style={btnTop}>
              <FaLanguage size={16} /> {lang === "hi" ? "English" : "हिन्दी"}
            </button>
            <button onClick={exportToExcel} style={{ ...btnTop, background: '#15803d', color: '#fff', border: 'none' }}>
              <FaFileExcel /> {t[lang].excel}
            </button>
            <button onClick={exportToPDF} style={{ ...btnTop, background: '#b91c1c', color: '#fff', border: 'none' }}>
              <FaFilePdf /> {t[lang].pdf}
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "100px", color: "#64748b", fontWeight: "600" }}>
            Fetching Department Data...
          </div>
        ) : (
          <div style={tableWrapper}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "850px" : "100%" }}>
                <thead>
                  <tr style={{ backgroundColor: "#002147", color: "#fff" }}>
                    <th style={thStyle}>विभाग (Department)</th>
                    <th style={{...thStyle, textAlign: 'center'}}>{t[lang].total}</th>
                    <th style={{...thStyle, textAlign: 'center'}}>{t[lang].completed}</th>
                    <th style={{...thStyle, textAlign: 'center'}}>{t[lang].pending}</th>
                    <th style={thStyle}>{t[lang].budget}</th>
                    <th style={thStyle}>{t[lang].shesh}</th>
                    <th style={thStyle}>{t[lang].status}</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map((d, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={{ ...tdStyle, fontWeight: "700", position: isMobile ? 'sticky' : 'static', left: 0, backgroundColor: idx % 2 === 0 ? "#fff" : "#f8fafc", zIndex: 1 }}>
                        <FaBuilding style={{marginRight: '8px', color: '#21618c'}}/> {d.department}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{d.totalProjects}</td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: "#16a34a", fontWeight: "bold" }}>
                        <FaCheckCircle style={{marginRight: '5px'}}/> {d.completed}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: "#ea580c", fontWeight: "bold" }}>
                        <FaClock style={{marginRight: '5px'}}/> {d.pending}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: "bold", color: "#1e293b" }}>₹{d.totalBudget} L</td>
                      <td style={{ ...tdStyle, color: "#dc2626", fontWeight: "bold" }}>₹{d.remaining} L</td>
                      <td style={tdStyle}>
                          <div style={progressBase}>
                            <div style={{ ...progressFill, width: `${d.utilization}%`, backgroundColor: d.utilization > 80 ? '#16a34a' : d.utilization > 40 ? '#3b82f6' : '#ef4444' }} />
                          </div>
                          <span style={{ fontWeight: '800', fontSize: '12px', color: '#334155' }}>{d.utilization}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ================= BALANCED FOOTER (SYNCED) ================= */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>{t[lang].admin}</strong>
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

// Styles
const headerStyle = (isMobile) => ({
  display: "flex", 
  flexDirection: isMobile ? "column" : "row",
  justifyContent: "space-between", 
  alignItems: isMobile ? "stretch" : "center", 
  gap: "20px",
  marginBottom: "25px", 
  background: "#fff", 
  padding: "20px", 
  borderRadius: "16px", 
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
});

const backBtn = {
  background: "#f1f5f9",
  border: "none",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "#475569"
};

const tableWrapper = { 
  background: "#fff",
  borderRadius: "16px", 
  overflow: "hidden",
  border: "1px solid #e2e8f0", 
  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" 
};

const thStyle = { padding: "18px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" };
const tdStyle = { padding: "16px", fontSize: "13px", color: '#334155', whiteSpace: "nowrap" };

const btnTop = { 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  gap: "8px", 
  padding: "10px 16px", 
  borderRadius: "8px", 
  cursor: "pointer", 
  fontWeight: "700", 
  border: "1px solid #e2e8f0", 
  background: "#fff", 
  fontSize: "13px", 
  flex: "1",
  transition: "all 0.2s"
};

const progressBase = { background: "#e2e8f0", borderRadius: "10px", height: "8px", width: "100px", marginBottom: "5px", overflow: 'hidden' };
const progressFill = { height: "100%", borderRadius: "10px", transition: 'width 0.5s ease-in-out' };

/* --- FOOTER STYLES (SYNCED) --- */
const footerStyle = { backgroundColor: "#ffffff", padding: "20px 0", borderTop: "5px solid #21618c", marginTop: "40px" };
const footerContainer = { width: "90%", maxWidth: "600px", margin: "0 auto", textAlign: "center" };
const footerBrand = { fontSize: "0.9rem", fontWeight: "700", color: "#1e293b", marginBottom: "10px" };
const footerLinksWrapper = { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "10px", flexWrap: "wrap" };
const fLink = { color: "#21618c", textDecoration: "none", fontWeight: "600", fontSize: "0.8rem" };
const fSep = { color: "#cbd5e1", fontSize: "0.8rem" };
const copyright = { fontSize: "0.75rem", color: "#64748b", margin: 0, borderTop: "1px solid #f1f5f9", paddingTop: "10px" };