import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Imports for Download ---
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaFileExcel, FaFilePdf, FaDownload, FaBuilding } from "react-icons/fa";

export default function AdminProject() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const token = localStorage.getItem("adminToken");
    if (!isAdmin || !token) {
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
        else toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, [navigate]);

  // Filter Logic
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.department && p.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Grouping Logic (Used for both UI and Report Generation)
  const departmentGroups = filteredProjects.reduce((acc, p) => {
    const deptName = p.department || "Unknown";
    if (!acc[deptName]) acc[deptName] = [];
    acc[deptName].push(p);
    return acc;
  }, {});

  // ✅ Excel Download Logic (Sorted by Department)
  const downloadExcel = (data, filename) => {
    // Pehle data ko department wise sort kar lete hain
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

  // ✅ PDF Download Logic (With Department Segregation Headers)
  const downloadPDF = async (groups, title) => {
    const toastId = toast.loading(`Generating Segregated PDF...`);
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.left = "-9999px"; 
    element.style.width = "1100px"; 
    element.style.padding = "40px";
    element.style.backgroundColor = "#ffffff";

    // Agar single department hai toh title wahi rahega, warna Master Report
    const isMaster = Object.keys(groups).length > 1;

    let tableRowsHTML = "";
    Object.keys(groups).sort().forEach(dept => {
      // Har department ke liye ek sub-header row
      tableRowsHTML += `
        <tr style="background-color: #002147; color: #fff;">
          <td colspan="5" style="padding: 12px; font-weight: bold; font-size: 14px; border: 1px solid #000;">
            DEPARTMENT: ${dept.toUpperCase()}
          </td>
        </tr>
      `;
      // Us department ke projects
      groups[dept].forEach(p => {
        tableRowsHTML += `
          <tr>
            <td style="border: 1px solid #000; padding: 8px; font-weight: bold; width: 30%;">${p.name}</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: center; width: 10%;">${p.progress}%</td>
            <td style="border: 1px solid #000; padding: 8px; width: 15%;">₹${p.budgetAllocated} L</td>
            <td style="border: 1px solid #000; padding: 8px; width: 20%;">${p.contactPerson}</td>
            <td style="border: 1px solid #000; padding: 8px; font-size: 10px; width: 25%;">${p.remarks || "-"}</td>
          </tr>
        `;
      });
    });

    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: #000; background: #fff;">
        <h1 style="text-align: center; font-size: 26px; font-weight: bold; margin-bottom: 5px;">DISTRICT PLAN MONITORING SYSTEM</h1>
        <h2 style="text-align: center; font-size: 18px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-top: 0;">
            ${isMaster ? "CONSOLIDATED MASTER REPORT" : `DEPARTMENT REPORT: ${title}`}
        </h2>
        <p style="text-align: right; font-size: 12px; font-weight: bold;">Date: ${new Date().toLocaleDateString('en-IN')}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed;">
          <thead>
            <tr style="background-color: #e2e2e2;">
              <th style="border: 1px solid #000; padding: 10px; text-align: left;">Project Details</th>
              <th style="border: 1px solid #000; padding: 10px;">Progress</th>
              <th style="border: 1px solid #000; padding: 10px;">Budget</th>
              <th style="border: 1px solid #000; padding: 10px;">Nodal Officer</th>
              <th style="border: 1px solid #000; padding: 10px;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHTML}
          </tbody>
        </table>
      </div>
    `;

    document.body.appendChild(element);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 0.9); 
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(imgData, "JPEG", 0, 10, 297, (canvas.height * 297) / canvas.width);
      pdf.save(`${title}_Segregated.pdf`);
      toast.update(toastId, { render: "PDF Ready", type: "success", isLoading: false, autoClose: 2000 });
    } catch (err) { toast.dismiss(toastId); }
    finally { document.body.removeChild(element); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6', color: '#000' }}>
      <ToastContainer />
      <main style={{ padding: "30px" }}>
        
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '30px' }}>
          <h1 style={{ color: "#002147", fontWeight: "900", margin: 0, fontSize: '1.6rem' }}>Consolidated Project Repository</h1>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Search projects..." 
              style={{ padding: '10px 15px', borderRadius: '8px', border: '2px solid #ccc', width: '300px', fontWeight: 'bold' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => downloadExcel(filteredProjects, "Master_Report")} style={{ ...btnAction, background: '#1D6F42' }}>
              <FaFileExcel /> EXCEL ALL
            </button>
            <button onClick={() => downloadPDF(departmentGroups, "Master_Report")} style={{ ...btnAction, background: '#E74C3C' }}>
              <FaFilePdf /> PDF ALL
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>
        ) : (
          Object.keys(departmentGroups).map((dept, idx) => (
            <div key={idx} style={{ background: "#fff", padding: "25px", borderRadius: "12px", marginBottom: "30px", border: '1px solid #ccc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ color: "#0056b3", fontSize: '1.3rem', margin: 0, fontWeight: 'bold' }}>
                  <FaBuilding /> {dept}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => downloadExcel(departmentGroups[dept], dept)} style={btnSmall}><FaDownload /> Excel</button>
                    {/* Yahan single dept ke liye grouping pass kar rahe hain object wrap karke */}
                    <button onClick={() => downloadPDF({[dept]: departmentGroups[dept]}, dept)} style={btnSmall}><FaFilePdf /> PDF</button>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fa", borderBottom: '2px solid #000' }}>
                      <th style={thStyle}>Project Name</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Officer Details</th>
                      <th style={thStyle}>Budget</th>
                      <th style={thStyle}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentGroups[dept].map((p) => (
                      <tr key={p._id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "15px", fontWeight: 'bold', width: '25%', color: '#000' }}>{p.name}</td>
                        <td style={{ padding: "15px", width: '20%' }}>
                          <div style={{ background: "#eee", borderRadius: "10px", height: "10px", width: "100px" }}>
                            <div style={{ height: "100%", borderRadius: "10px", width: `${p.progress}%`, background: p.progress === 100 ? "#28a745" : "#fd7e14" }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: '900', color: '#000' }}>{p.progress}% Completed</span>
                        </td>
                        <td style={{ padding: "15px", width: '20%', color: '#000' }}>
                          <b>{p.contactPerson}</b><br/>
                          <span style={{ fontSize: '12px', color: '#444' }}>{p.designation}</span><br/>
                          <span style={{ color: '#0056b3' }}>{p.contactNumber}</span>
                        </td>
                        <td style={{ padding: "15px", fontWeight: '900', fontSize: '1.1rem', color: '#000' }}>₹{p.budgetAllocated} L</td>
                        <td style={{ padding: "15px", fontSize: '12px', color: '#333', wordBreak: 'break-word', maxWidth: '250px' }}>
                          {p.remarks || "---"}
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

const btnAction = { display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnSmall = { display: 'flex', alignItems: 'center', gap: '5px', background: '#fff', border: '1px solid #0056b3', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: '#0056b3', fontWeight: 'bold' };
const thStyle = { padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: "bold", color: "#000", borderBottom: '1px solid #000' };