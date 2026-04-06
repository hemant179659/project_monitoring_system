import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import styles from "../styles/dashboard.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFileExcel, FaFilePdf, FaSearch, FaBuilding, FaProjectDiagram, FaRupeeSign, FaUserTie } from "react-icons/fa";

export default function AdminProject() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const token = localStorage.getItem("adminToken");
    if (!isAdmin || !token) {
      toast.error("Access Denied. Please login as Admin.");
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        const res = await API.get("/department/projects?all=true");
        setProjects(res.data.projects || []);
      } catch (error) {
        if (error.response?.status === 401) navigate("/admin-login", { replace: true });
        else toast.error("Failed to fetch projects");
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
    const dataToExport = data.map(p => ({
      "Department": p.department,
      "Project Name": p.name,
      "Progress (%)": p.progress,
      "Budget (Lakhs)": p.budgetAllocated,
      "Officer Name": p.contactPerson,
      "Designation": p.designation || "N/A",
      "Mobile": p.contactNumber,
      "Remarks": p.remarks
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const downloadPDF = async (data, title) => {
    const toastId = toast.loading(`Generating High-Res PDF...`);
    const element = document.createElement("div");
    element.style.width = "1200px"; 
    element.style.padding = "40px";
    element.style.backgroundColor = "#ffffff";
    element.style.position = "absolute";
    element.style.left = "-9999px";

    element.innerHTML = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; border: 5px solid #002147; padding: 40px; color: #000;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 4px solid #002147; padding-bottom: 20px;">
          <h1 style="margin: 0; font-size: 36px; color: #002147; font-weight: bold; text-transform: uppercase;">District Administration - Udham Singh Nagar</h1>
          <h2 style="margin: 10px 0; font-size: 24px; color: #444;">${title}</h2>
          <p style="font-size: 16px; font-weight: bold;">Date: ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <thead>
            <tr style="background-color: #002147; color: #ffffff;">
              <th style="border: 1px solid #000; padding: 15px;">Department</th>
              <th style="border: 1px solid #000; padding: 15px;">Project Description</th>
              <th style="border: 1px solid #000; padding: 15px;">Physical Progress</th>
              <th style="border: 1px solid #000; padding: 15px;">Allocated Budget</th>
              <th style="border: 1px solid #000; padding: 15px;">Nodal Officer</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(p => `
              <tr>
                <td style="border: 1px solid #000; padding: 12px; font-weight: bold; background: #f9f9f9;">${p.department}</td>
                <td style="border: 1px solid #000; padding: 12px; width: 350px;">${p.name}</td>
                <td style="border: 1px solid #000; padding: 12px; text-align: center; font-weight: bold;">${p.progress}%</td>
                <td style="border: 1px solid #000; padding: 12px; text-align: center;">₹${p.budgetAllocated} Lakhs</td>
                <td style="border: 1px solid #000; padding: 12px;">
                    <b>${p.contactPerson}</b><br/>
                    <span style="font-size: 13px;">${p.designation || "N/A"}</span><br/>
                    ${p.contactNumber}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.body.appendChild(element);
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png", 1.0); 
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`District_Project_Report_${Date.now()}.pdf`);
      toast.update(toastId, { render: "Report Exported Successfully!", type: "success", isLoading: false, autoClose: 2000 });
    } catch (e) { toast.update(toastId, { render: "Export Failed", type: "error", isLoading: false }); }
    finally { document.body.removeChild(element); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#eef2f5', fontFamily: "'Inter', sans-serif" }}>
      <ToastContainer position="top-center" theme="colored" />
      <main style={{ flex: 1, padding: "30px" }}>
        
        {/* Header Section */}
        <div style={headerCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
                <h1 style={{ color: "#002147", fontWeight: 800, margin: 0, fontSize: '1.8rem' }}>
                    <FaProjectDiagram style={{marginRight: '12px'}}/>Project Repository
                </h1>
                <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>Monitoring & Management System | USN</p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                <input 
                    type="text" 
                    placeholder="Filter by Department or Project..." 
                    style={searchInput} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
                <button onClick={() => downloadExcel(filteredProjects, "District_Projects_Master")} style={{ ...btnMain, background: '#1D6F42' }}><FaFileExcel /> Excel</button>
                <button onClick={() => downloadPDF(filteredProjects, "MASTER PROJECT REPORT")} style={{ ...btnMain, background: '#C0392B' }}><FaFilePdf /> PDF</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <div className={styles.spinner}></div>
            <p style={{fontWeight: 'bold', color: '#002147', marginTop: '15px'}}>Loading Database...</p>
          </div>
        ) : (
          Object.keys(departmentGroups).map((dept, idx) => (
            <div key={idx} style={deptCard}>
              <div style={deptHeader}>
                <h2 style={{ color: "#002147", fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaBuilding color="#0056b3"/> {dept}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => downloadExcel(departmentGroups[dept], dept)} style={btnMini}>Export Excel</button>
                  <button onClick={() => downloadPDF(departmentGroups[dept], `${dept} - Status Report`)} style={btnMini}>Export PDF</button>
                </div>
              </div>

              <div style={{ overflowX: "auto", borderRadius: '8px', border: '1px solid #eee' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={{ backgroundColor: "#002147", color: "#fff" }}>
                      <th style={thStyle}>Project Name</th>
                      <th style={thStyle}>Physical Progress</th>
                      <th style={thStyle}>Nodal Officer</th>
                      <th style={thStyle}>Budget (Lakhs)</th>
                      <th style={thStyle}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentGroups[dept].map((p, pIdx) => (
                      <tr key={p._id} style={{ borderBottom: "1px solid #eee", backgroundColor: pIdx % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ ...tdStyle, width: '30%', fontWeight: '700', color: '#2c3e50' }}>{p.name}</td>
                        <td style={tdStyle}>
                          <div style={progOuter}><div style={{ ...progInner, width: `${p.progress}%`, background: p.progress === 100 ? "#27ae60" : "#e67e22" }} /></div>
                          <span style={{ fontSize: "12px", fontWeight: 800, color: p.progress === 100 ? '#27ae60' : '#d35400' }}>{p.progress}% Completed</span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ lineHeight: '1.4' }}>
                            <div style={{ fontWeight: '800', color: '#000' }}><FaUserTie size={12}/> {p.contactPerson}</div>
                            <div style={{ color: '#0056b3', fontSize: '12px', fontWeight: '600' }}>{p.designation || "N/A"}</div>
                            <div style={{ color: '#666', fontSize: '12px' }}>{p.contactNumber}</div>
                          </div>
                        </td>
                        <td style={tdStyle}><b style={{ color: '#2c3e50', fontSize: '15px' }}><FaRupeeSign size={13}/>{p.budgetAllocated} L</b></td>
                        <td style={{ ...tdStyle, width: '20%', fontSize: '12px', fontStyle: 'italic', color: '#7f8c8d' }}>
                          {p.remarks || "No additional remarks"}
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
    </div>
  );
}

// Professional CSS Objects
const headerCard = { 
    background: '#fff', 
    padding: '25px', 
    borderRadius: '15px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
    marginBottom: '30px',
    borderLeft: '10px solid #002147'
};

const searchInput = { 
    width: '320px', 
    padding: '12px 15px 12px 45px', 
    borderRadius: '10px', 
    border: '1px solid #cbd5e0', 
    fontSize: '14px', 
    outline: 'none',
    transition: 'all 0.3s ease'
};

const btnMain = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    color: '#fff', 
    border: 'none', 
    padding: '12px 24px', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const btnMini = { 
    backgroundColor: '#fff', 
    border: '1px solid #002147', 
    padding: '8px 16px', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontSize: '12px', 
    fontWeight: '700', 
    color: '#002147',
    transition: 'all 0.2s'
};

const deptCard = { 
    background: "#fff", 
    padding: "25px", 
    borderRadius: "15px", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)", 
    marginBottom: "35px", 
    border: '1px solid #e1e8ed' 
};

const deptHeader = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px', 
    paddingBottom: '15px',
    borderBottom: '2px solid #f1f1f1'
};

const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { padding: "15px", textAlign: "left", fontSize: "14px", fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: "15px", verticalAlign: 'top' };
const progOuter = { background: "#edf2f7", borderRadius: "10px", overflow: "hidden", height: "8px", width: "120px", marginBottom: "6px" };
const progInner = { height: "100%", transition: "width 1s ease-in-out", borderRadius: '10px' };