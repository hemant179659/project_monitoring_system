import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

export default function Completed() {
  const navigate = useNavigate();

  // State to store only completed projects
  const [projects, setProjects] = useState([]);

  /**
   * -------------------------------
   * 🔐 Admin Authentication + Data Load
   * -------------------------------
   * - Check if admin is logged in
   * - If not → redirect to login page
   * - Load all projects from localStorage
   * - Filter only projects that have 100% progress
   */
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    // Redirect if admin not logged in
    if (!isAdmin) navigate("/admin-login", { replace: true });

    // Load all projects from storage
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // Filter only completed projects
    const completedProjects = allProjects.filter((p) => p.progress === 100);

    // Save completed projects into state
    setProjects(completedProjects);
  }, [navigate]);

  /**
   * -----------------------------------------
   * 📌 Group completed projects by department
   * -----------------------------------------
   * Example format:
   * {
   *   "Health": [...projects],
   *   "Education": [...projects]
   * }
   */
  const departmentGroups = projects.reduce((acc, p) => {
    if (!acc[p.department]) acc[p.department] = [];  // create department if not exists
    acc[p.department].push(p);                       // push project into department list
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      {/* Page Heading */}
      <h1
        style={{ opacity: 1, marginBottom: "30px", textAlign: "center", color: "#333" }}
      >
        Completed Projects
      </h1>

      {/* Show message if no completed projects exist */}
      {Object.keys(departmentGroups).length === 0 && (
        <p style={{ opacity: 1, textAlign: "center", color: "#555" }}>
          No completed projects found.
        </p>
      )}

      {/* Loop through each department and list its completed projects */}
      {Object.keys(departmentGroups).map((dept, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "40px",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            opacity: 1
          }}
        >
          {/* Department Title */}
          <h2 style={{ opacity: 1, marginBottom: "20px", color: "#222" }}>
            {dept} Department
          </h2>

          {/* Table for completed projects */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={headerStyle}>Project Name</th>
                <th style={headerStyle}>Progress</th>
                <th style={headerStyle}>Start Date</th>
                <th style={headerStyle}>End Date</th>
                <th style={headerStyle}>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {/* List all completed projects under this department */}
              {departmentGroups[dept].map((p, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff" // alternate row color
                  }}
                >
                  <td style={cellStyle}>{p.name}</td>

                  {/* Completed progress bar */}
                  <td style={cellStyle}>
                    <div
                      style={{
                        background: "#eee",
                        borderRadius: "8px",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          width: `${p.progress}%`,
                          background: "#4CAF50",
                          padding: "4px 0",
                          textAlign: "center",
                          color: "#fff",
                          fontWeight: "bold"
                        }}
                      >
                        {p.progress}%
                      </div>
                    </div>
                  </td>

                  <td style={cellStyle}>{p.startDate}</td>
                  <td style={cellStyle}>{p.endDate}</td>

                  {/* If no remarks → display "No remarks" */}
                  <td style={cellStyle}>{p.remarks || "No remarks"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------
// Inline CSS Styles for Table Headers and Cells
// ----------------------------------------------

const headerStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f0f0f0",
  opacity: 1,
  color: "#333"
};

const cellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  opacity: 1,
  color: "#333"
};
