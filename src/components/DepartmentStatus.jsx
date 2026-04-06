import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import { FaFileExcel, FaFilePdf, FaLanguage, FaBuilding, FaCheckCircle, FaClock } from "react-icons/fa";
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

  const t = {
    hi: {
      title: "विभागवार बजट एवं प्रगति विवरण",
      dept: "विभाग का नाम",
      total: "कुल प्रोजेक्ट्स",
      completed: "पूर्ण",
      pending: "लंबित",
      budget: "कुल बजट (L)",
      shesh: "शेष राशि (L)",
      status: "बजट उपयोग %",
      excel: "Excel डाउनलोड",
      pdf: "PDF डाउनलोड"
    },
    en: {
      title: "Departmental Budget & Progress Status",
      dept: "Department Name",
      total: "Total Projects",
      completed: "Completed",
      pending: "Pending",
      budget: "Total Budget (L)",
      shesh: "Remaining (L)",
      status: "Utilization %",
      excel: "Download Excel",
      pdf: "Download PDF"
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
        <h2 style="text-align: center; margin: 0;">DISTRICT PLANNING OFFICE - US NAGAR</h2>
        <h3 style="text-align: center; margin: 10px 0;">${t[lang].title}</h3>
        <hr style="border: 1px solid #000" />
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f2f2f2;">
              <th style="border: 1px solid #000; padding: 8px;">${t[lang].dept}</th>
              <th style="border: 1px solid #000; padding: 8px;">Projects</th>
              <th style="border: 1px solid #000; padding: 8px;">Budget (L)</th>
              <th style="border: 1px solid #000; padding: 8px;">Spent (L)</th>
              <th style="border: 1px solid #000; padding: 8px;">${t[lang].status}</th>
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
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <ToastContainer position="top-center" />
      <main style={{ padding: "30px" }}>
        <header style={headerBox}>
          <div>
            <h1 style={{ fontWeight: "900", color: "#0f172a", margin: 0 }}>{t[lang].title}</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Official Monitoring Dashboard</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} style={btnTop}><FaLanguage /> {lang === "hi" ? "English" : "हिंदी"}</button>
            <button onClick={exportToExcel} style={{ ...btnTop, background: '#15803d', color: '#fff', border: 'none' }}><FaFileExcel /> {t[lang].excel}</button>
            <button onClick={exportToPDF} style={{ ...btnTop, background: '#b91c1c', color: '#fff', border: 'none' }}><FaFilePdf /> {t[lang].pdf}</button>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Data...</div>
        ) : (
          <div style={tableWrapper}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#002d5a", color: "#fff" }}>
                  <th style={thStyle}>{t[lang].dept}</th>
                  <th style={thStyle}>{t[lang].total}</th>
                  <th style={thStyle}>{t[lang].completed}</th>
                  <th style={thStyle}>{t[lang].pending}</th>
                  <th style={thStyle}>{t[lang].budget}</th>
                  <th style={thStyle}>{t[lang].shesh}</th>
                  <th style={thStyle}>{t[lang].status}</th>
                </tr>
              </thead>
              <tbody>
                {deptStats.map((d, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                    <td style={{ ...tdStyle, fontWeight: "bold", width: '20%' }}><FaBuilding style={{marginRight: '8px', color: '#64748b'}}/> {d.department}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{d.totalProjects}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: "#16a34a", fontWeight: "bold" }}><FaCheckCircle style={{fontSize: '12px'}}/> {d.completed}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: "#ea580c", fontWeight: "bold" }}><FaClock style={{fontSize: '12px'}}/> {d.pending}</td>
                    <td style={{ ...tdStyle, fontWeight: "bold" }}>₹{d.totalBudget} L</td>
                    <td style={{ ...tdStyle, color: "#dc2626", fontWeight: "bold" }}>₹{d.remaining} L</td>
                    <td style={tdStyle}>
                        <div style={progressBase}>
                          <div style={{ ...progressFill, width: `${d.utilization}%`, backgroundColor: d.utilization > 80 ? '#16a34a' : d.utilization > 40 ? '#3b82f6' : '#ef4444' }} />
                        </div>
                        <span style={{ fontWeight: '900', fontSize: '12px' }}>{d.utilization}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// Styles consistent with previous clean UI
const headerBox = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" };
const tableWrapper = { borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" };
const thStyle = { padding: "16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase" };
const tdStyle = { padding: "14px 16px", fontSize: "13px", color: '#000' };
const btnTop = { display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "700", border: "1px solid #cbd5e1", background: "#fff" };
const progressBase = { background: "#f1f5f9", borderRadius: "10px", height: "8px", width: "100px", marginBottom: "4px", overflow: 'hidden' };
const progressFill = { height: "100%", borderRadius: "10px", transition: '0.3s' };