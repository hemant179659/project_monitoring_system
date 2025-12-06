// 📌 ProjectList.jsx — Displays department-specific project list with login protection
// NOTE: No logic changed — only detailed comments added for clarity.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  // ✅ Get currently logged-in department from localStorage
  const loggedDept = localStorage.getItem("loggedInDepartment");

  // ------------------------------------------------------------
  // 🔐 LOGIN VALIDATION + BACK BUTTON PROTECTION
  // ------------------------------------------------------------
  useEffect(() => {
    // If user is not logged in, redirect to department login page
    if (!loggedDept) {
      window.location.replace("/dept-login"); 
    }

    // 🚫 Prevent using browser BACK button to access protected pages
    const handlePopState = () => {
      // If user logs out and tries to go back, force redirect again
      if (!localStorage.getItem("loggedInDepartment")) {
        window.location.replace("/dept-login");
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loggedDept]);

  // ------------------------------------------------------------
  // 📦 LOAD PROJECTS FROM LOCALSTORAGE (department-wise filtering)
  // ------------------------------------------------------------
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects")) || [];

    // Filter projects only belonging to the logged-in department
    const deptProjects = stored.filter(p => p.department === loggedDept);

    setProjects(deptProjects);
  }, [loggedDept]);

  // ------------------------------------------------------------
  // 🗑️ DELETE PROJECT (only inside current department)
  // ------------------------------------------------------------
  const handleDelete = (name) => {
    if (window.confirm(`Are you sure you want to delete project "${name}"?`)) {
      const stored = JSON.parse(localStorage.getItem("projects")) || [];

      // Remove only the project that matches both name + department
      const updated = stored.filter(
        p => !(p.name === name && p.department === loggedDept)
      );

      // Save updated list in localStorage
      localStorage.setItem("projects", JSON.stringify(updated));

      // Refresh UI with department-filtered data
      setProjects(updated.filter(p => p.department === loggedDept));
    }
  };

  return (
    <div className={styles.projectWrapper}>
      {/* Page Header */}
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>📋 {loggedDept} Project List</h1>
      </div>

      {/* Main Card */}
      <div className={styles.projectCard}>
        {/* Message if department has no projects */}
        {projects.length === 0 && (
          <p className={styles.emptyMsg}>No projects found for {loggedDept}.</p>
        )}

        {/* Project Table */}
        <table className={styles.projectTable}>
          <thead>
            <tr>
              <th className={styles.tableHeading}>Project Name</th>
              <th className={styles.tableHeading}>Progress</th>
              <th className={styles.tableHeading}>Start Date</th>
              <th className={styles.tableHeading}>End Date</th>
              <th className={styles.tableHeading}>Remarks</th>
              <th className={styles.tableHeading}>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p, idx) => (
              <tr key={idx} className={styles.tableRow}>
                
                {/* Project name */}
                <td>{p.name}</td>

                {/* Progress bar */}
                <td>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${p.progress}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>{p.progress}%</span>
                </td>

                {/* Dates */}
                <td>{p.startDate}</td>
                <td>{p.endDate}</td>

                {/* Remarks */}
                <td>
                  <span className={styles.remarkTag}>
                    {p.remarks || "No remarks"}
                  </span>
                </td>

                {/* Delete button */}
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(p.name)}
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
