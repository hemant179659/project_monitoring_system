import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

export default function AdminProjectList() {
  const navigate = useNavigate();

  // State to store all projects
  const [projects, setProjects] = useState([]);

  // State to store unique department names (for grouping)
  const [deptList, setDeptList] = useState([]);

  /**
   * -------------------------------------------
   * 🔐 Admin Authentication & Back Button Handling
   * -------------------------------------------
   * - Checks if admin is logged in using localStorage.
   * - If not logged in → redirect to admin login.
   * - Blocks browser back button from accessing previous pages without login.
   */
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    // If admin not logged in, redirect to login page
    if (!isAdmin) {
      navigate("/admin-login", { replace: true });
    }

    // Prevents unauthorized access via browser back button
    const handlePopState = () => {
      if (!localStorage.getItem("isAdmin")) {
        navigate("/admin-login", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  /**
   * -------------------------------------------
   * 📦 Load Projects & Extract Department List
   * -------------------------------------------
   * - Loads project data stored in localStorage.
   * - Creates a unique department list from that data.
   */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(stored);

    // Get unique list of departments
    const departments = [...new Set(stored.map((p) => p.department))];
    setDeptList(departments);
  }, []);

  /**
   * -------------------------------------------
   * ❌ Delete Project Handler
   * -------------------------------------------
   * - Confirms delete action.
   * - Removes the specific project from localStorage.
   * - Updates UI after deletion.
   */
  const handleDelete = (name, department) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}" from "${department}"?`
      )
    ) {
      const stored = JSON.parse(localStorage.getItem("projects")) || [];

      // Remove the selected project
      const updated = stored.filter(
        (p) => !(p.name === name && p.department === department)
      );

      // Save updated list back to localStorage
      localStorage.setItem("projects", JSON.stringify(updated));

      // Update UI
      setProjects(updated);
    }
  };

  return (
    <div className={styles.projectWrapper}>
      {/* Page Title */}
      <div className={styles.headerSection}>
        <h1 style={{ opacity: 1, color: "#000" }} className={styles.pageTitle}>
          📋 All Department Projects
        </h1>
      </div>

      {/* Message for empty project list */}
      {deptList.length === 0 && (
        <p style={{ opacity: 1, color: "#000" }}>No projects found.</p>
      )}

      {/* Loop through each department and render tables */}
      {deptList.map((dept, idx) => {
        // Filter projects belonging to the current department
        const deptProjects = projects.filter((p) => p.department === dept);

        return (
          <div key={idx} style={{ marginBottom: "40px" }}>
            {/* Department Name */}
            <h2 style={{ opacity: 1, color: "#000" }}>{dept}</h2>

            {/* Project Table */}
            <table className={styles.projectTable}>
              <thead>
                <tr>
                  <th style={{ opacity: 1, color: "#000" }}>Project Name</th>
                  <th style={{ opacity: 1, color: "#000" }}>Progress</th>
                  <th style={{ opacity: 1, color: "#000" }}>Start Date</th>
                  <th style={{ opacity: 1, color: "#000" }}>End Date</th>
                  <th style={{ opacity: 1, color: "#000" }}>Remarks</th>
                  <th style={{ opacity: 1, color: "#000" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* List all projects under this department */}
                {deptProjects.map((p, i) => (
                  <tr key={i}>
                    <td style={{ opacity: 1, color: "#000" }}>{p.name}</td>

                    {/* Progress Bar Display */}
                    <td style={{ opacity: 1, color: "#000" }}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${p.progress}%` }}
                        ></div>
                      </div>
                      <span style={{ opacity: 1, color: "#000" }}>
                        {p.progress}%
                      </span>
                    </td>

                    <td style={{ opacity: 1, color: "#000" }}>
                      {p.startDate}
                    </td>
                    <td style={{ opacity: 1, color: "#000" }}>{p.endDate}</td>

                    {/* Remarks field */}
                    <td style={{ opacity: 1, color: "#000" }}>
                      {p.remarks || "No remarks"}
                    </td>

                    {/* Delete button */}
                    <td style={{ opacity: 1, color: "#000" }}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(p.name, p.department)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
