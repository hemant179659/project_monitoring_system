import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/dashboard.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const loggedDept = localStorage.getItem("loggedInDepartment");

  // Handle Resize for layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------------
  // Login protection
  // -------------------------------
  useEffect(() => {
    if (!loggedDept) {
      toast.error("Please login first");
      window.location.replace("/dept-login");
      return;
    }

    const handlePopState = () => {
      if (!localStorage.getItem("loggedInDepartment")) {
        toast.warning("Session expired");
        window.location.replace("/dept-login");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [loggedDept]);

  // -------------------------------
  // Fetch projects
  // -------------------------------
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await axios.get(
          `/api/department/projects?department=${loggedDept}`
        );
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects");
      }
    };

    if (loggedDept) loadProjects();
  }, [loggedDept]);

  // -------------------------------
  // Delete project
  // -------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(`/api/department/project/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      
      <main style={{ flex: 1, padding: isMobile ? "15px" : "30px" }}>
        <div className={styles.projectWrapper}>
          <div className={styles.headerSection}>
            <h1 style={{ color: "#333", fontWeight: 700, marginBottom: "20px" }}>
              📋 {loggedDept} Project List
            </h1>
          </div>

          <div className={styles.projectCard} style={{ 
              overflowX: 'auto', 
              backgroundColor: '#fff', 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}>
            {projects.length === 0 && (
              <p style={{ color: "#666" }}>No projects found.</p>
            )}

            <table
              className={styles.projectTable}
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1200px", 
              }}
            >
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={thStyle}>Project Name</th>
                  <th style={thStyle}>Progress</th>
                  <th style={thStyle}>Start Date</th>
                  <th style={thStyle}>End Date</th>
                  <th style={thStyle}>Contact Person</th>
                  <th style={thStyle}>Designation</th>
                  <th style={thStyle}>Contact Number</th>
                  <th style={thStyle}>Budget</th>
                  <th style={thStyle}>Remaining</th>
                  <th style={thStyle}>Remarks</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>
                      <div style={scrollableCellStyle} title={p.name}>
                        {p.name}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ background: "#ddd", borderRadius: "8px", height: "12px", width: "100px", marginBottom: "4px" }}>
                        <div style={{ width: `${p.progress}%`, background: p.progress === 100 ? "#4CAF50" : "#FF9800", height: "100%", borderRadius: "8px" }}></div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#555' }}>{p.progress}%</span>
                    </td>
                    <td style={tdStyle}>{new Date(p.startDate).toLocaleDateString()}</td>
                    <td style={tdStyle}>{new Date(p.endDate).toLocaleDateString()}</td>
                    <td style={tdStyle}>{p.contactPerson || "-"}</td>
                    <td style={tdStyle}>{p.designation || "-"}</td>
                    <td style={tdStyle}>{p.contactNumber || "-"}</td>
                    <td style={tdStyle}>{p.budgetAllocated || "-"}</td>
                    <td style={tdStyle}>{p.remainingBudget || "-"}</td>
                    <td style={tdStyle}>
                       <div style={{ ...scrollableCellStyle, maxWidth: "150px", border: 'none', padding: 0 }} title={p.remarks}>
                        {p.remarks || "-"}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={{ backgroundColor: "#FF4D4F", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: '500' }}
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '3px solid #0056b3',
        padding: '12px 10px',
        color: '#333',
        textAlign: 'center',
        fontFamily: "serif",
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: 'bold', color: '#002147' }}>
            District Administration
          </p>
          <p style={{ margin: '4px 0', fontSize: '0.7rem', opacity: 0.8 }}>
            Designed and Developed by <strong>District Administration</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px',
            fontSize: '0.65rem',
            borderTop: '1px solid #ddd',
            marginTop: '8px',
            paddingTop: '8px'
          }}>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
            <span>|</span>
            <span>Official Digital Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable Styles to keep code clean
const thStyle = {
  color: "#444",
  fontWeight: 700,
  textAlign: 'left',
  padding: '12px',
  fontSize: '14px'
};

const tdStyle = {
  padding: '12px',
  fontSize: '14px',
  color: '#444'
};

const scrollableCellStyle = {
  maxWidth: "200px",
  overflowX: "auto",
  whiteSpace: "nowrap",
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "4px 8px",
  fontSize: "13px"
};