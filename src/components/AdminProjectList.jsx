import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/dashboard.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminProject() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  // -------------------------------
  // 🔐 Admin login protection
  // -------------------------------
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      toast.error("Please login first");
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // -------------------------------
  // 📡 Fetch ALL projects
  // -------------------------------
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const res = await axios.get("/api/department/projects?all=true");
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects");
      }
    };
    fetchAllProjects();
  }, []);

  // -------------------------------
  // 📌 Group projects by department
  // -------------------------------
  const departmentGroups = projects.reduce((acc, p) => {
    if (!acc[p.department]) acc[p.department] = [];
    acc[p.department].push(p);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      
      <main style={{ flex: 1, padding: "20px" }}>
        <div className={styles.projectWrapper}>
          <div className={styles.headerSection}>
            <h1
              style={{
                color: "#111",
                fontWeight: 700,
                marginBottom: "30px",
                textAlign: "center",
              }}
            >
              📋 All Department Projects
            </h1>
          </div>

          {Object.keys(departmentGroups).length === 0 && (
            <p style={{ color: "#666", textAlign: "center", marginTop: "50px" }}>
              No projects found.
            </p>
          )}

          {Object.keys(departmentGroups).map((dept, idx) => (
            <div
              key={idx}
              style={{ 
                background: "#fff", 
                padding: "20px", 
                borderRadius: "12px", 
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                marginBottom: "40px" 
              }}
            >
              <h2
                style={{
                  color: "#0056b3",
                  fontWeight: 600,
                  marginBottom: "20px",
                  paddingBottom: "10px",
                  borderBottom: "2px solid #eee"
                }}
              >
                🏢 {dept} Department
              </h2>

              {/* Table Wrapper for Horizontal Scroll */}
              <div style={{ overflowX: "auto" }}>
                <table
                  className={styles.projectTable}
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "1200px"
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      {[
                        "Project Name",
                        "Progress",
                        "Start Date",
                        "End Date",
                        "Contact Person",
                        "Designation",
                        "Number",
                        "Budget",
                        "Remaining",
                        "Remarks",
                      ].map((h, i) => (
                        <th
                          key={i}
                          style={{
                            color: "#333",
                            fontWeight: 700,
                            padding: "12px",
                            textAlign: "left",
                            fontSize: "14px"
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {departmentGroups[dept].map((p) => (
                      <tr key={p._id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={cellStyle}>
                          <div style={scrollBox}>{p.name}</div>
                        </td>

                        <td style={cellStyle}>
                          <div style={progressOuter}>
                            <div
                              style={{
                                ...progressInner,
                                width: `${p.progress}%`,
                                background: p.progress === 100 ? "#4CAF50" : "#FF9800",
                              }}
                            />
                          </div>
                          <span style={{ fontSize: "12px", color: "#444" }}>
                            {p.progress}%
                          </span>
                        </td>

                        <td style={cellStyle}>{new Date(p.startDate).toLocaleDateString()}</td>
                        <td style={cellStyle}>{new Date(p.endDate).toLocaleDateString()}</td>
                        <td style={cellStyle}>{p.contactPerson || "-"}</td>
                        <td style={cellStyle}>{p.designation || "-"}</td>
                        <td style={cellStyle}>{p.contactNumber || "-"}</td>
                        <td style={cellStyle}>{p.budgetAllocated || "-"}</td>
                        <td style={cellStyle}>{p.remainingBudget || "-"}</td>

                        <td style={cellStyle}>
                          <div style={{ ...scrollBox, maxWidth: "150px" }}>{p.remarks || "-"}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '3px solid #0056b3',
        padding: '15px 10px',
        color: '#333',
        textAlign: 'center',
        fontFamily: "serif",
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ margin: '0', fontSize: '0.9rem', fontWeight: 'bold', color: '#002147' }}>
            District Administration
          </p>
          <p style={{ margin: '4px 0', fontSize: '0.75rem', opacity: 0.8 }}>
            Designed and Developed by <strong>District Administration</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px',
            fontSize: '0.7rem',
            borderTop: '1px solid #ddd',
            marginTop: '10px',
            paddingTop: '10px'
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

/* ------------------------------
   🔧 INLINE STYLES
------------------------------ */

const cellStyle = {
  padding: "12px",
  color: "#444",
  fontSize: "14px",
  fontWeight: 500,
};

const scrollBox = {
  maxWidth: "200px",
  whiteSpace: "nowrap",
  overflowX: "auto",
  padding: "4px 6px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  backgroundColor: "#f9f9f9",
  color: "#333",
};

const progressOuter = {
  background: "#ddd",
  borderRadius: "8px",
  overflow: "hidden",
  height: "12px",
  width: "80px",
  marginBottom: "4px",
};

const progressInner = {
  height: "100%",
  transition: "width 0.6s ease",
};