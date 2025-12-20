import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/dashboard.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const loggedDept = localStorage.getItem("loggedInDepartment");

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
    <div className={styles.projectWrapper}>
      <div className={styles.headerSection}>
        <h1 style={{ color: "#000", fontWeight: 700, opacity: 1, marginBottom: "20px" }}>
          📋 {loggedDept} Project List
        </h1>
      </div>

      <div className={styles.projectCard}>
        {projects.length === 0 && (
          <p style={{ color: "#000", opacity: 1 }}>No projects found.</p>
        )}

        <table
          className={styles.projectTable}
          style={{
            tableLayout: "fixed",
            width: "100%",
            borderCollapse: "collapse",
            columnGap: "10px",
          }}
        >
          <thead>
            <tr>
              <th style={{ color: "#000", fontWeight: 700 }}>Project Name</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Progress</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Start Date</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Estimated End Date</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Contact Person</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Designation</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Contact Number</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Budget Allocated</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Remaining Budget</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Remarks</th>
              <th style={{ color: "#000", fontWeight: 700 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => (
              <tr key={p._id}>
                <td style={{ padding: "8px 12px" }}>
                  <div
                    style={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflowX: "auto",
                      padding: "4px 6px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      color: "#000",
                      cursor: "pointer",
                    }}
                    title={p.name}
                  >
                    {p.name}
                  </div>
                </td>

                <td style={{ padding: "8px 12px" }}>
                  <div
                    style={{
                      background: "#ddd",
                      borderRadius: "8px",
                      overflow: "hidden",
                      height: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: `${p.progress}%`,
                        background: p.progress === 100 ? "#4CAF50" : "#FF9800",
                        height: "100%",
                        transition: "width 0.6s ease",
                      }}
                    ></div>
                  </div>
                  <span style={{ color: "#000", opacity: 1 }}>{p.progress}%</span>
                </td>

                <td style={{ color: "#000", opacity: 1 }}>
                  {new Date(p.startDate).toLocaleDateString()}
                </td>
                <td style={{ color: "#000", opacity: 1 }}>
                  {new Date(p.endDate).toLocaleDateString()}
                </td>
                <td style={{ color: "#000", opacity: 1 }}>{p.contactPerson || "-"}</td>
                <td style={{ color: "#000", opacity: 1 }}>{p.designation || "-"}</td>
                <td style={{ color: "#000", opacity: 1 }}>{p.contactNumber || "-"}</td>
                <td style={{ color: "#000", opacity: 1 }}>{p.budgetAllocated || "-"}</td>
                <td style={{ color: "#000", opacity: 1 }}>{p.remainingBudget || "-"}</td>
                <td style={{ padding: "8px 12px" }}>
                  <div
                    style={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflowX: "auto",
                      padding: "4px 6px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      color: "#000",
                      cursor: "pointer",
                    }}
                    title={p.remarks || "-"}
                  >
                    {p.remarks || "-"}
                  </div>
                </td>

                <td style={{ padding: "8px 12px" }}>
                  <button
                    style={{
                      backgroundColor: "#FF4D4F",
                      color: "#fff",
                      padding: "4px 8px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
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
  );
}
