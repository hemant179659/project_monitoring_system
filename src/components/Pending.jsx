import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

export default function Pending() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  // State to track if the screen is mobile size (e.g., < 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Function to update isMobile state
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // -------------------------------------------------------------
  // ❗ Page Load: Validate admin login and load pending projects
  // -------------------------------------------------------------
  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Redirect if admin is not logged in
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin-login", { replace: true });

    // Load all projects from localStorage
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // Filter only pending projects (progress < 100)
    const pendingProjects = allProjects.filter(p => p.progress < 100);

    // Save filtered projects to state
    setProjects(pendingProjects);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  // -------------------------------------------------------------
  // 📌 Group pending projects by department
  // -------------------------------------------------------------
  const departmentGroups = projects.reduce((acc, p) => {
    if (!acc[p.department]) acc[p.department] = []; // Initialize group if empty
    acc[p.department].push(p);                      // Add project under department
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
      {/* Page Title */}
      <h1
        style={{
          opacity: 1,
          marginBottom: isMobile ? "20px" : "30px",
          textAlign: "center",
          color: "#333",
          fontSize: isMobile ? "24px" : "32px", // Smaller font size on mobile
        }}
      >
        Pending Projects
      </h1>

      {/* Message when no pending projects exist */}
      {Object.keys(departmentGroups).length === 0 && (
        <p style={{ opacity: 1, textAlign: "center", color: "#555" }}>
          No pending projects found.
        </p>
      )}

      {/* Render each department section */}
      {Object.keys(departmentGroups).map((dept, idx) => (
        <div
          key={idx}
          style={departmentCardStyle}
        >
          {/* Department Title */}
          <h2 style={{ opacity: 1, marginBottom: "20px", color: "#222", fontSize: isMobile ? "20px" : "24px" }}>
            {dept} Department
          </h2>

          {/* Project Table Wrapper for Horizontal Scrolling */}
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
                {departmentGroups[dept].map((p, i) => (
                  <tr
                    key={i}
                    // Alternating row background for better readability
                    style={{
                      backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff"
                    }}
                  >
                    {/* Project Name */}
                    <td style={cellStyle}>{p.name}</td>

                    {/* Progress Bar */}
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
                            background: "#FF9800",
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

                    {/* Remarks */}
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

// ----------------------------------------------------------------------
// 🎨 CSS-in-JS Styles for table headers & cells (UNCHANGED)
// ----------------------------------------------------------------------
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