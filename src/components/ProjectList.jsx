import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [editingProject, setEditingProject] = useState(null);
  const [totalBudgetFromDB, setTotalBudgetFromDB] = useState(0);
  const [remainingFromDB, setRemainingFromDB] = useState(0);

  // Constants from localStorage
  const loggedDept = localStorage.getItem("loggedInDepartment");
  const token = localStorage.getItem("deptToken");
  
  useEffect(() => {
    if (!loggedDept || !token) {
      toast.error("Access Denied. Please login as Admin.");
      navigate("/dept-login", { replace: true });
    }
  }, [navigate]);

  // ✅ Responsive Listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchBudgetInfo = async () => {
    if (!loggedDept || !token) return;
    try {
      const res = await API.get(`/department/budget-summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const deptData = res.data.find((d) => d.department === loggedDept);
      if (deptData) {
        setTotalBudgetFromDB(deptData.totalBudget);
        setRemainingFromDB(deptData.remaining);
      }
    } catch (err) { 
      if (err.response?.status === 401) handleAuthError();
    }
  };

  const loadProjects = async () => {
    if (!token) return;
    try {
      const res = await API.get(`/department/projects?department=${loggedDept}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data.projects || []);
    } catch (error) { 
      if (error.response?.status === 401) handleAuthError();
      else toast.error("Failed to fetch projects"); 
    }
  };

  const handleAuthError = () => {
    localStorage.clear();
    navigate("/desto-login", { replace: true });
    toast.error("Session expired. Please login again.");
  };

  useEffect(() => {
    if (loggedDept && token) { 
      loadProjects(); 
      fetchBudgetInfo(); 
    }
  }, [loggedDept, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/department/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted!");
      loadProjects();
      fetchBudgetInfo();
    } catch (err) { toast.error("Delete failed"); }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/department/project/update/${editingProject._id}`, editingProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Updated successfully!");
      setEditingProject(null);
      loadProjects();
      fetchBudgetInfo();
    } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(projects.map(p => ({
        "Project Name": p.name, "Progress": p.progress + "%", "Budget (L)": p.budgetAllocated, "Remarks": p.remarks, "Contact": p.contactPerson, "Mobile": p.contactNumber
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, `${loggedDept}_Project_List.xlsx`);
  };

 const downloadPDF = async () => {
    const element = document.createElement("div");
    // स्टाइलिंग को एकदम सॉलिड रखा है ताकि धुंधला न दिखे
    element.style.padding = "40px";
    element.style.background = "#ffffff";
    element.style.width = "1100px";
    element.style.color = "#000000"; // पक्का काला रंग
    
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; border: 3px solid #000; padding: 25px; background: #fff;">
        <h1 style="text-align: center; color: #000; margin-bottom: 5px; text-transform: uppercase;">${loggedDept}</h1>
        <h3 style="text-align: center; color: #000; margin-top: 0;">PROJECT MONITORING REPORT</h3>
        <hr style="border: 1px solid #000; margin: 20px 0;" />
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 16px;">
          <span><b>Total Budget:</b> ₹${totalBudgetFromDB} L</span>
          <span><b>Remaining:</b> ₹${remainingFromDB} L</span>
          <span><b>Date:</b> ${new Date().toLocaleDateString()}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; color: #000;">
          <thead>
            <tr style="background: #eeeeee;">
              <th style="border: 2px solid #000; padding: 12px; text-align: left;">Project Name</th>
              <th style="border: 2px solid #000; padding: 12px; text-align: center; width: 100px;">Budget</th>
              <th style="border: 1px solid #000; padding: 12px; text-align: center; width: 100px;">Progress</th>
              <th style="border: 2px solid #000; padding: 12px; text-align: left;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${projects.map(p => `
              <tr>
                <td style="border: 2px solid #000; padding: 10px; font-weight: bold;">${p.name}</td>
                <td style="border: 2px solid #000; padding: 10px; text-align: center;">₹${p.budgetAllocated}L</td>
                <td style="border: 2px solid #000; padding: 10px; text-align: center;">${p.progress}%</td>
                <td style="border: 2px solid #000; padding: 10px;">${p.remarks || "-"}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 40px; text-align: right;">
          <p>__________________________</p>
          <p style="margin-right: 40px;">Authorized Signatory</p>
        </div>
      </div>
    `;

    document.body.appendChild(element);

    // Canvas settings for High Definition (Anti-faint)
    const canvas = await html2canvas(element, { 
      scale: 3, // स्केल बढ़ाया ताकि प्रिंट क्रिस्प आए
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("l", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(`${loggedDept}_Report.pdf`);
    
    document.body.removeChild(element);
  };
  if (!token) return null;

  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", color: "#000", display: "flex", flexDirection: "column" }}>
      <ToastContainer />
      
      {/* --- CONTENT WRAPPER --- */}
      <div style={{ flex: 1 }}>
        <main style={{ padding: isMobile ? "15px" : "30px" }}>
          
          {/* --- Header Section (Responsive) --- */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexDirection: isMobile ? "column" : "row", gap: "15px" }}>
            <h1 style={{ margin: 0, fontWeight: "900", fontSize: isMobile ? "22px" : "32px", textAlign: isMobile ? "center" : "left", color: "#1e293b" }}>
                📋 {loggedDept}
            </h1>
            
            <div style={{ display: "flex", gap: isMobile ? "10px" : "20px", background: "#fff", padding: "12px 20px", borderRadius: "10px", border: "2px solid #21618c", width: isMobile ? "100%" : "auto", justifyContent: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                <div style={{ textAlign: "center" }}>
                  <small style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b" }}>TOTAL BUDGET</small> <br/> 
                  <b style={{ fontSize: isMobile ? "16px" : "18px", color: "#21618c" }}>₹{totalBudgetFromDB} L</b>
                </div>
                <div style={{ borderLeft: "2px solid #e2e8f0", paddingLeft: isMobile ? "10px" : "20px", textAlign: "center" }}>
                  <small style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b" }}>REMAINING</small> <br/> 
                  <b style={{ fontSize: isMobile ? "16px" : "18px", color: "#e11d48" }}>₹{remainingFromDB} L</b>
                </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <button onClick={downloadExcel} style={{ ...btnS, background: "#1D6F42", flex: isMobile ? 1 : "none" }}>{isMobile ? "Excel" : "Excel Export"}</button>
            <button onClick={downloadPDF} style={{ ...btnS, background: "#E74C3C", flex: isMobile ? 1 : "none" }}>{isMobile ? "PDF" : "PDF Report"}</button>
          </div>

          {/* --- Responsive Table/Card View --- */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {projects.length > 0 ? projects.map(p => (
                <div key={p._id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>{p.name}</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                    <div><b>Progress:</b> <span style={{color: p.progress === 100 ? "green" : "orange"}}>{p.progress}%</span></div>
                    <div><b>Budget:</b> ₹{p.budgetAllocated}L</div>
                    <div style={{ gridColumn: "span 2" }}><b>Contact:</b> {p.contactPerson} ({p.contactNumber})</div>
                  </div>
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button onClick={() => setEditingProject({...p})} style={{ ...edBtn, flex: 1, padding: "8px" }}>Edit</button>
                    <button onClick={() => handleDelete(p._id)} style={{ ...dlBtn, flex: 1, padding: "8px" }}>Delete</button>
                  </div>
                </div>
              )) : <p style={{textAlign: "center"}}>No projects found.</p>}
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", overflowX: "auto", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1200px", tableLayout: "fixed" }}>
                <thead style={{ background: "#f8fafc", borderBottom: "2px solid #21618c" }}>
                  <tr>
                    <th style={{ ...thS, width: "25%" }}>Project Name</th>
                    <th style={{ ...thS, width: "10%" }}>Progress</th>
                    <th style={{ ...thS, width: "12%" }}>Budget (L)</th>
                    <th style={{ ...thS, width: "30%" }}>Remarks</th>
                    <th style={{ ...thS, width: "15%" }}>Contact Details</th>
                    <th style={{ ...thS, width: "10%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={tdS}><div style={scrollB}><b>{p.name}</b></div></td>
                      <td style={tdS}><span style={{color: p.progress === 100 ? "green" : "orange", fontWeight: "bold"}}>{p.progress}%</span></td>
                      <td style={tdS}><b>₹{p.budgetAllocated} L</b></td>
                      <td style={tdS}><div style={scrollB}>{p.remarks || "-"}</div></td>
                      <td style={tdS}>
                        <div style={{ fontSize: "12px" }}>
                          <b>{p.contactPerson}</b><br/>
                          <a href={`tel:${p.contactNumber}`} style={{color: "#2563eb", textDecoration: "none"}}>{p.contactNumber}</a>
                        </div>
                      </td>
                      <td style={tdS}>
                        <button onClick={() => setEditingProject({...p})} style={edBtn}>Edit</button>
                        <button onClick={() => handleDelete(p._id)} style={dlBtn}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL --- */}
      {editingProject && (
        <div style={modalO}>
          <div style={{ ...modalB, width: isMobile ? "90%" : "550px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ borderBottom: "2px solid #21618c", marginBottom: "15px", paddingBottom: "10px", color: "#1e293b" }}>EDIT PROJECT</h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
              <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
                <label style={lbl}>Project Name</label>
                <textarea style={inp} rows="3" value={editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value})} />
              </div>
              <div><label style={lbl}>Progress (%)</label><input type="number" style={inp} value={editingProject.progress} onChange={e => setEditingProject({...editingProject, progress: e.target.value})} /></div>
              <div><label style={lbl}>Budget (Lakhs)</label><input type="number" style={inp} value={editingProject.budgetAllocated} onChange={e => setEditingProject({...editingProject, budgetAllocated: e.target.value})} /></div>
              <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}><label style={lbl}>Remarks</label><textarea style={inp} value={editingProject.remarks} onChange={e => setEditingProject({...editingProject, remarks: e.target.value})} /></div>
              <div><label style={lbl}>Contact Person</label><input style={inp} value={editingProject.contactPerson} onChange={e => setEditingProject({...editingProject, contactPerson: e.target.value})} /></div>
              <div><label style={lbl}>Designation</label><input style={inp} value={editingProject.designation} onChange={e => setEditingProject({...editingProject, designation: e.target.value})} /></div>
              <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}><label style={lbl}>Mobile Number</label><input style={inp} value={editingProject.contactNumber} onChange={e => setEditingProject({...editingProject, contactNumber: e.target.value})} /></div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={handleUpdate} style={{ ...btnS, background: "#21618c", flex: 1 }}>UPDATE</button>
              <button onClick={() => setEditingProject(null)} style={{ ...btnS, background: "#64748b", flex: 1 }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* --- BALANCED FOOTER (Home.jsx Wala Exact Footer) --- */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>DISTRICT ADMINISTRATION, UTTARAKHAND</strong>
          </div>
          
          <nav style={footerLinks}>
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

// Styling Constants (Table & UI)
const thS = { padding: "15px", textAlign: "left", fontWeight: "800", fontSize: "13px", color: "#475569", textTransform: "uppercase" };
const tdS = { padding: "15px", verticalAlign: "top", fontSize: "13px", color: "#1e293b" };
const scrollB = { maxHeight: "70px", overflowY: "auto", wordBreak: "break-word" };
const btnS = { padding: "10px 20px", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", transition: "0.2s" };
const edBtn = { background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", marginRight: "5px", cursor: "pointer", fontWeight: "600" };
const dlBtn = { background: "#e11d48", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "600" };
const modalO = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, backdropFilter: "blur(4px)" };
const modalB = { background: "#fff", padding: "30px", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" };
const inp = { width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", boxSizing: "border-box", outline: "none", fontSize: "14px" };
const lbl = { display: "block", fontWeight: "700", fontSize: "12px", marginBottom: "5px", color: "#475569" };

// --- FOOTER STYLES (Exact From Home.jsx) ---
const footerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px 0",
  borderTop: "5px solid #21618c",
  marginTop: "auto"
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