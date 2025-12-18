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
        const res = await axios.get(
          "http://localhost:8000/department/projects?all=true"
        );
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
    <div className={styles.projectWrapper}>
      <div className={styles.headerSection}>
        <h1
          style={{
            color: "#000",
            fontWeight: 700,
            opacity: 1,
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          📋 All Department Projects
        </h1>
      </div>

      {Object.keys(departmentGroups).length === 0 && (
        <p style={{ color: "#000", opacity: 1, textAlign: "center" }}>
          No projects found.
        </p>
      )}

      {Object.keys(departmentGroups).map((dept, idx) => (
        <div
          key={idx}
          className={styles.projectCard}
          style={{ marginBottom: "40px" }}
        >
          <h2
            style={{
              color: "#000",
              fontWeight: 600,
              marginBottom: "15px",
              opacity: 1,
            }}
          >
            {dept} Department
          </h2>

          <table
            className={styles.projectTable}
            style={{
              tableLayout: "fixed",
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                {[
                  "Project Name",
                  "Progress",
                  "Start Date",
                  "Estimated End Date",
                  "Contact Person",
                  "Designation",
                  "Contact Number",
                  "Budget Allocated",
                  "Remaining Budget",
                  "Remarks",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      color: "#000",
                      opacity: 1,
                      fontWeight: 700,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {departmentGroups[dept].map((p) => (
                <tr key={p._id}>
                  <td style={cellStyle}>
                    <div style={scrollBox}>{p.name}</div>
                  </td>

                  <td style={cellStyle}>
                    <div style={progressOuter}>
                      <div
                        style={{
                          ...progressInner,
                          width: `${p.progress}%`,
                          background:
                            p.progress === 100 ? "#4CAF50" : "#FF9800",
                        }}
                      />
                    </div>
                    <span style={{ color: "#000", opacity: 1 }}>
                      {p.progress}%
                    </span>
                  </td>

                  <td style={cellStyle}>
                    {new Date(p.startDate).toLocaleDateString()}
                  </td>
                  <td style={cellStyle}>
                    {new Date(p.endDate).toLocaleDateString()}
                  </td>
                  <td style={cellStyle}>{p.contactPerson || "-"}</td>
                  <td style={cellStyle}>{p.designation || "-"}</td>
                  <td style={cellStyle}>{p.contactNumber || "-"}</td>
                  <td style={cellStyle}>{p.budgetAllocated || "-"}</td>
                  <td style={cellStyle}>{p.remainingBudget || "-"}</td>

                  <td style={cellStyle}>
                    <div style={scrollBox}>{p.remarks || "-"}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------
   🔧 INLINE STYLES (FULL VISIBILITY)
------------------------------ */

const cellStyle = {
  padding: "8px 12px",
  color: "#000",
  opacity: 1,
  fontWeight: 500,
};

const scrollBox = {
  maxWidth: "200px",
  whiteSpace: "nowrap",
  overflowX: "auto",
  padding: "4px 6px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  backgroundColor: "#fff",
  color: "#000",
  opacity: 1,
};

const progressOuter = {
  background: "#ddd",
  borderRadius: "8px",
  overflow: "hidden",
  height: "16px",
  marginBottom: "4px",
};

const progressInner = {
  height: "100%",
  transition: "width 0.6s ease",
};
