import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Imports for Download ---
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFileExcel, FaFilePdf, FaDownload, FaBuilding, FaSearch, FaArrowLeft } from "react-icons/fa";

export default function AdminProject() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const token = localStorage.getItem("destoToken") || localStorage.getItem("adminToken");
    if (!isAdmin || !token) {
      toast.error("अनधिकृत पहुंच! कृपया एडमिन के रूप में लॉगिन करें।");
      navigate("/desto-login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        const res = await API.get("/department/projects?all=true");
        setProjects(res.data.projects || []);
      } catch (error) {
        if (error.response?.status === 401) navigate("/desto-login", { replace: true });
        else toast.error("प्रोजेक्ट डेटा लोड करने में विफल");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, [navigate]);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.department && p.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const departmentGroups = filteredProjects.reduce((acc, p) => {
    const deptName = p.department || "Unknown";
    if (!acc[deptName]) acc[deptName] = [];
    acc[deptName].push(p);
    return acc;
  }, {});

  const downloadExcel = (data, filename) => {
    const sortedData = [...data].sort((a, b) => (a.department || "").localeCompare(b.department || ""));
    const dataToExport = sortedData.map(p => ({
      "Department": p.department || "N/A",
      "Project Name": p.name,
      "Progress (%)": p.progress,
      "Budget (L)": p.budgetAllocated,
      "Officer": p.contactPerson,
      "Designation": p.designation || "N/A",
      "Mobile": p.contactNumber,
      "Remarks": p.remarks
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const downloadPDF = async (groups, title) => {
    const toastId = toast.loading(`रिपोर्ट जनरेट हो रही है...`);
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.left = "-9999px"; 
    element.style.width = "1100px"; 
    element.style.padding = "40px";
    element.style.backgroundColor = "#ffffff";

    const isMaster = Object.keys(groups).length > 1;
    let tableRowsHTML = "";
    Object.keys(groups).sort().forEach(dept => {
      tableRowsHTML += `<tr style="background-color: #002147; color: #fff;"><td colspan="5" style="padding: 12px; font-weight: bold; font-size: 14px; border: 1px solid #000;">DEPARTMENT: ${dept.toUpperCase()}</td></tr>`;
      groups[dept].forEach(p => {
        tableRowsHTML += `
          <tr>
            <td style="border: 1px solid #000; padding: 10px; font-weight: bold; width: 30%; word-break: break-word; line-height: 1.4;">${p.name}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align: center; width: 10%;">${p.progress}%</td>
            <td style="border: 1px solid #000; padding: 10px; width: 15%; text-align: center;">₹${p.budgetAllocated} L</td>
            <td style="border: 1px solid #000; padding: 10px; width: 20%; word-break: break-word;">${p.contactPerson}<br/><small style="font-size: 9px;">${p.designation || ""}</small></td>
            <td style="border: 1px solid #000; padding: 10px; font-size: 11px; width: 25%; word-break: break-word; line-height: 1.3;">${p.remarks || "-"}</td>
          </tr>`;
      });
    });

    element.innerHTML = `<div style="font-family: Arial, sans-serif; color: #000; background: #fff;"><h1 style="text-align: center; font-size: 26px; font-weight: bold; margin-bottom: 5px;">DISTRICT PLAN MONITORING SYSTEM</h1><h2 style="text-align: center; font-size: 18px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-top: 0;">${isMaster ? "CONSOLIDATED MASTER REPORT" : `DEPARTMENT REPORT: ${title}`}</h2><p style="text-align: right; font-size: 12px; font-weight: bold;">Date: ${new Date().toLocaleDateString('en-IN')}</p><table style="width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed;"><thead><tr style="background-color: #f0f0f0;"><th style="border: 1px solid #000; padding: 10px; text-align: left; width: 30%;">Project Details</th><th style="border: 1px solid #000; padding: 10px; width: 10%;">Progress</th><th style="border: 1px solid #000; padding: 10px; width: 15%;">Budget</th><th style="border: 1px solid #000; padding: 10px; width: 20%;">Officer</th><th style="border: 1px solid #000; padding: 10px; width: 25%;">Remarks</th></tr></thead><tbody>${tableRowsHTML}</tbody></table></div>`;

    document.body.appendChild(element);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 0.9); 
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(imgData, "JPEG", 0, 10, 297, (canvas.height * 297) / canvas.width);
      pdf.save(`${title}_Official_Report.pdf`);
      toast.update(toastId, { render: "PDF डाउनलोड के लिए तैयार है", type: "success", isLoading: false, autoClose: 2000 });
    } catch (err) { toast.dismiss(toastId); }
    finally { document.body.removeChild(element); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <main style={{ padding: isMobile ? "15px" : "30px", flex: 1 }}>
        
        <div style={headerStyle(isMobile)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <button onClick={() => navigate(-1)} style={backBtn} title="Back">
                <FaArrowLeft />
             </button>
             <div>
                <h1 style={{ color: "#002147", fontWeight: "900", margin: 0, fontSize: isMobile ? '1.2rem' : '1.8rem' }}>
                  Project Repository
                </h1>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Master Database of District Projects</p>
             </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="Search by name or department..." 
                  style={searchInput(isMobile)} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => downloadExcel(filteredProjects, "Consolidated_Master_Report")} style={{ ...btnAction, background: '#16a34a' }}>
                  <FaFileExcel /> EXCEL
                </button>
                <button onClick={() => downloadPDF(departmentGroups, "Consolidated_Master_Report")} style={{ ...btnAction, background: '#dc2626' }}>
                  <FaFilePdf /> PDF
                </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', color: '#64748b' }}>डेटा लोड हो रहा है...</div>
        ) : (
          Object.keys(departmentGroups).sort().map((dept, idx) => (
            <div key={idx} style={deptCard}>
              <div style={deptHeader(isMobile)}>
                <h2 style={{ color: "#21618c", fontSize: isMobile ? '1.1rem' : '1.3rem', margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaBuilding /> {dept}
                </h2>
                <div style={{ display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto' }}>
                    <button onClick={() => downloadExcel(departmentGroups[dept], dept)} style={btnSmall}><FaDownload /> Excel</button>
                    <button onClick={() => downloadPDF({[dept]: departmentGroups[dept]}, dept)} style={btnSmall}><FaFilePdf /> PDF</button>
                </div>
              </div>

              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "900px" : "100%", tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f1f5f9" }}>
                      <th style={{...thStyle, width: '25%'}}>Project Details</th>
                      <th style={{...thStyle, width: '15%'}}>Execution Status</th>
                      <th style={{...thStyle, width: '20%'}}>Officer Details</th>
                      <th style={{...thStyle, width: '15%'}}>Budget</th>
                      <th style={{...thStyle, width: '25%'}}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentGroups[dept].map((p) => (
                      <tr key={p._id} style={{ borderBottom: "1px solid #e2e8f0", transition: '0.2s' }}>
                        <td style={{ padding: "16px", fontWeight: '700', color: '#1e293b', fontSize: '14px', wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1.4' }}>{p.name}</td>
                        <td style={{ padding: "16px" }}>
                          <div style={progressBg}>
                            <div style={{ ...progressFill, width: `${p.progress}%`, background: p.progress === 100 ? "#16a34a" : "#f97316" }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: '800', color: '#475569' }}>{p.progress}% Completed</span>
                        </td>
                        <td style={{ padding: "16px", color: '#334155', fontSize: '13px', wordBreak: 'break-word' }}>
                          <div style={{fontWeight: '700'}}>{p.contactPerson}</div>
                          <div style={{fontSize: '11px', color: '#64748b'}}>{p.designation}</div>
                          <div style={{color: '#21618c', fontWeight: 'bold', marginTop: '2px'}}>{p.contactNumber}</div>
                        </td>
                        <td style={{ padding: "16px", fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>₹{p.budgetAllocated} L</td>
                        <td style={{ padding: "16px", fontSize: '12px', color: '#475569', wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1.4' }}>
                          {p.remarks || <span style={{color: '#cbd5e1'}}>No remarks</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </main>

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

const headerStyle = (isMobile) => ({
  display: 'flex', 
  flexDirection: isMobile ? 'column' : 'row',
  justifyContent: 'space-between', 
  alignItems: isMobile ? 'stretch' : 'center', 
  background: '#fff', 
  padding: isMobile ? '20px' : '25px 35px', 
  borderRadius: '16px', 
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  marginBottom: '30px',
  gap: '20px',
  border: '1px solid #e2e8f0'
});

const backBtn = { background: '#f1f5f9', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', fontSize: '1.2rem' };
const searchInput = (isMobile) => ({ padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1.5px solid #e2e8f0', width: isMobile ? '100%' : '320px', fontWeight: '600', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc' });
const deptCard = { background: "#fff", borderRadius: "16px", marginBottom: "30px", border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', overflow: 'hidden' };
const deptHeader = (isMobile) => ({ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', padding: '18px 25px', background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', gap: '12px' });
const btnAction = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '12px', padding: '10px 20px' };
const btnSmall = { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #cbd5e1', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', color: '#334155', fontWeight: '700', flex: 1, justifyContent: 'center' };
const thStyle = { padding: "16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: 'uppercase', letterSpacing: '0.05em' };
const progressBg = { background: "#e2e8f0", borderRadius: "10px", height: "8px", width: "100px", marginBottom: "6px" };
const progressFill = { height: "100%", borderRadius: "10px", transition: 'width 0.5s ease-in-out' };

const footerStyle = { backgroundColor: "#ffffff", padding: "25px 0", borderTop: "5px solid #21618c", width: '100%', marginTop: 'auto' };
const footerContainer = { width: "90%", maxWidth: "600px", margin: "0 auto", textAlign: "center" };
const footerBrand = { fontSize: "0.9rem", fontWeight: "800", color: "#1e293b", marginBottom: "12px" };
const footerLinksWrapper = { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "12px", flexWrap: "wrap" };
const fLink = { color: "#21618c", textDecoration: "none", fontWeight: "700", fontSize: "0.8rem" };
const fSep = { color: "#cbd5e1", fontSize: "0.8rem" };
const copyright = { fontSize: "0.75rem", color: "#64748b", margin: 0, borderTop: "1px solid #f1f5f9", paddingTop: "12px" };