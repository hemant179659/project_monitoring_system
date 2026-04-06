import { useEffect, useState } from "react";
import API from "../api/axios"; 
import styles from "../styles/dashboard.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [totalBudgetFromDB, setTotalBudgetFromDB] = useState(0);
  const [remainingFromDB, setRemainingFromDB] = useState(0);

  const loggedDept = localStorage.getItem("loggedInDepartment");

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchBudgetInfo = async () => {
    if (!loggedDept) return;
    try {
      const res = await API.get(`/department/budget-summary`);
      const deptData = res.data.find((d) => d.department === loggedDept);
      if (deptData) {
        setTotalBudgetFromDB(deptData.totalBudget);
        setRemainingFromDB(deptData.remaining);
      }
    } catch (err) { console.error(err); }
  };

  const loadProjects = async () => {
    try {
      const res = await API.get(`/department/projects?department=${loggedDept}`);
      setProjects(res.data.projects || []);
    } catch (error) { toast.error("Failed to fetch projects"); }
  };

  useEffect(() => {
    if (loggedDept) { loadProjects(); fetchBudgetInfo(); }
  }, [loggedDept]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/department/project/${id}`);
      toast.success("Deleted!");
      loadProjects();
      fetchBudgetInfo();
    } catch (err) { toast.error("Delete failed"); }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/department/project/update/${editingProject._id}`, editingProject);
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
    element.style.padding = "30px";
    element.style.background = "#fff";
    element.style.color = "#000";
    element.style.width = "1050px";
    element.innerHTML = `
      <div style="font-family: Arial; border: 2px solid #000; padding: 20px;">
        <h2 style="text-align: center;">${loggedDept} - Project Report</h2>
        <hr style="border: 1px solid #000" />
        <p><b>Total Budget:</b> ₹${totalBudgetFromDB} L | <b>Remaining:</b> ₹${remainingFromDB} L</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background: #000; color: #fff;">
              <th style="border: 1px solid #000; padding: 8px;">Project Name</th>
              <th style="border: 1px solid #000; padding: 8px;">Budget</th>
              <th style="border: 1px solid #000; padding: 8px;">Progress</th>
              <th style="border: 1px solid #000; padding: 8px;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${projects.map(p => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; width: 30%;">${p.name}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">₹${p.budgetAllocated}L</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${p.progress}%</td>
                <td style="border: 1px solid #000; padding: 8px; width: 30%;">${p.remarks || "-"}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    document.body.appendChild(element);
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(imgData, "PNG", 5, 5, 287, (canvas.height * 287) / canvas.width);
    pdf.save(`${loggedDept}_Report.pdf`);
    document.body.removeChild(element);
  };

  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", color: "#000" }}>
      <ToastContainer />
      <main style={{ padding: isMobile ? "10px" : "30px" }}>
        
        {/* --- TOP HEADER WITH TOTAL & REMAINING --- */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
          <h1 style={{ margin: 0, fontWeight: "900" }}>📋 {loggedDept}</h1>
          
          <div style={{ display: "flex", gap: "20px", background: "#fff", padding: "12px 20px", borderRadius: "10px", border: "2px solid #000" }}>
             <div style={{ textAlign: "center" }}>
               <small style={{ fontSize: "10px", fontWeight: "bold" }}>TOTAL BUDGET</small> <br/> 
               <b style={{ fontSize: "18px" }}>₹{totalBudgetFromDB} L</b>
             </div>
             <div style={{ borderLeft: "2px solid #000", paddingLeft: "20px", textAlign: "center" }}>
               <small style={{ fontSize: "10px", fontWeight: "bold" }}>REMAINING</small> <br/> 
               <b style={{ fontSize: "18px", color: "red" }}>₹{remainingFromDB} L</b>
             </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button onClick={downloadExcel} style={{ ...btnS, background: "#1D6F42" }}>Excel</button>
          <button onClick={downloadPDF} style={{ ...btnS, background: "#E74C3C" }}>PDF</button>
        </div>

        <div style={{ background: "#fff", border: "1px solid #ccc", borderRadius: "10px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1200px", tableLayout: "fixed" }}>
            <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #000" }}>
              <tr>
                <th style={{ ...thS, width: "25%" }}>Project Name</th>
                <th style={{ ...thS, width: "10%" }}>Progress</th>
                <th style={{ ...thS, width: "12%" }}>Budget (L)</th>
                <th style={{ ...thS, width: "30%" }}>Remarks</th>
                <th style={{ ...thS, width: "15%" }}>Contact Person</th>
                <th style={{ ...thS, width: "8%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdS}><div style={scrollB}><b>{p.name}</b></div></td>
                  <td style={tdS}><b>{p.progress}%</b></td>
                  <td style={tdS}><b>₹{p.budgetAllocated} L</b></td>
                  <td style={tdS}><div style={scrollB}>{p.remarks || "-"}</div></td>
                  <td style={tdS}>
                    <div style={{ fontSize: "12px" }}><b>{p.contactPerson}</b><br/>{p.designation}<br/>{p.contactNumber}</div>
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
      </main>

      {/* --- FULL EDIT MODAL --- */}
      {editingProject && (
        <div style={modalO}>
          <div style={modalB}>
            <h3 style={{ borderBottom: "2px solid #000", marginBottom: "15px" }}>EDIT PROJECT</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Project Name</label>
                <textarea style={inp} value={editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value})} />
              </div>
              <div><label style={lbl}>Progress (%)</label><input type="number" style={inp} value={editingProject.progress} onChange={e => setEditingProject({...editingProject, progress: e.target.value})} /></div>
              <div><label style={lbl}>Budget (L)</label><input type="number" style={inp} value={editingProject.budgetAllocated} onChange={e => setEditingProject({...editingProject, budgetAllocated: e.target.value})} /></div>
              <div style={{ gridColumn: "span 2" }}><label style={lbl}>Remarks</label><textarea style={inp} value={editingProject.remarks} onChange={e => setEditingProject({...editingProject, remarks: e.target.value})} /></div>
              <div><label style={lbl}>Contact Person</label><input style={inp} value={editingProject.contactPerson} onChange={e => setEditingProject({...editingProject, contactPerson: e.target.value})} /></div>
              <div><label style={lbl}>Designation</label><input style={inp} value={editingProject.designation} onChange={e => setEditingProject({...editingProject, designation: e.target.value})} /></div>
              <div style={{ gridColumn: "span 2" }}><label style={lbl}>Mobile</label><input style={inp} value={editingProject.contactNumber} onChange={e => setEditingProject({...editingProject, contactNumber: e.target.value})} /></div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={handleUpdate} style={{ ...btnS, background: "#28a745", flex: 1 }}>SAVE</button>
              <button onClick={() => setEditingProject(null)} style={{ ...btnS, background: "#000", flex: 1 }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Shortened Styles
const thS = { padding: "12px", textAlign: "left", fontWeight: "900", fontSize: "14px" };
const tdS = { padding: "12px", verticalAlign: "top", fontSize: "13px" };
const scrollB = { maxHeight: "70px", overflowY: "auto", wordBreak: "break-word" };
const btnS = { padding: "8px 16px", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
const edBtn = { background: "#007bff", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", marginRight: "5px", cursor: "pointer" };
const dlBtn = { background: "#dc3545", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" };
const modalO = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 };
const modalB = { background: "#fff", padding: "25px", borderRadius: "12px", width: "550px", border: "3px solid #000" };
const inp = { width: "100%", padding: "8px", border: "1px solid #000", borderRadius: "4px" };
const lbl = { display: "block", fontWeight: "bold", fontSize: "11px", marginBottom: "3px" };