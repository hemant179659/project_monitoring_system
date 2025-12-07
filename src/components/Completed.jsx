import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

export default function Completed() {
  const navigate = useNavigate();

  // State to store only completed projects
  const [projects, setProjects] = useState([]);
  
  // State to track if the screen is mobile size (e.g., < 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Function to update isMobile state
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  /**
   * -------------------------------
   * 🔐 Admin Authentication + Data Load
   * -------------------------------
   */
  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    
    const isAdmin = localStorage.getItem("isAdmin");

    // Redirect if admin not logged in
    if (!isAdmin) navigate("/admin-login", { replace: true });

    // Load all projects from storage
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // Filter only completed projects
    const completedProjects = allProjects.filter((p) => p.progress === 100);

    // Save completed projects into state
    setProjects(completedProjects);
    
    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  /**
   * -----------------------------------------
   * 📌 Group completed projects by department
   * -----------------------------------------
   */
  const departmentGroups = projects.reduce((acc, p) => {
    if (!acc[p.department]) acc[p.department] = [];  // create department if not exists
    acc[p.department].push(p);                       // push project into department list
    return acc;
  }, {});
  
  // Conditional styles for the main container
  const mainContainerStyle = {
    // Mobile: Reduced padding
    padding: isMobile ? "15px" : "20px", 
  };
  
  // Conditional styles for the department card
  const departmentCardStyle = {
    marginBottom: "40px",
    padding: isMobile ? "15px" : "20px", // Reduced padding on mobile
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    opacity: 1
  };

  return (
    <div style={mainContainerStyle}>
      {/* Page Heading */}
      <h1
        style={{ 
            opacity: 1, 
            marginBottom: isMobile ? "20px" : "30px", 
            textAlign: "center", 
            color: "#333",
            fontSize: isMobile ? "24px" : "32px", // Smaller font size on mobile
        }}
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
          style={departmentCardStyle}
        >
          {/* Department Title */}
          <h2 style={{ opacity: 1, marginBottom: "20px", color: "#222", fontSize: isMobile ? "20px" : "24px" }}>
            {dept} Department
          </h2>

          {/* Table Wrapper for Horizontal Scrolling on Mobile */}
          <div style={{ overflowX: isMobile ? "auto" : "visible" }}>
            <table 
                style={{ 
                    width: "100%", 
                    borderCollapse: "collapse",
                    // Ensure the table is wide enough to scroll horizontally on mobile
                    minWidth: isMobile ? "700px" : "100%", 
                }}
            >
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
                    {/* Project Name */}
                    <td style={cellStyle}>{p.name}</td>

                    {/* Completed progress bar */}
                    <td style={cellStyle}>
                      <div
                        style={{
                          background: "#eee",
                          borderRadius: "8px",
                          overflow: "hidden",
                          height: isMobile ? "15px" : "20px" // Thinner bar on mobile
                        }}
                      >
                        <div
                          style={{
                            width: `${p.progress}%`,
                            background: "#4CAF50", // Green for completed
                            padding: isMobile ? "2px 0" : "4px 0", // Smaller padding
                            textAlign: "center",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: isMobile ? "10px" : "12px" // Smaller text
                          }}
                        >
                          {p.progress}%
                        </div>
                      </div>
                    </td>

                    {/* Start Date */}
                    <td style={cellStyle}>{p.startDate}</td>
                    
                    {/* End Date */}
                    <td style={cellStyle}>{p.endDate}</td>

                    {/* If no remarks → display "No remarks" */}
                    <td style={cellStyle}>{p.remarks || "No remarks"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------
// Inline CSS Styles for Table Headers and Cells (UNCHANGED)
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