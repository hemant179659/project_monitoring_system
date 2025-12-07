import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";

export default function DepartmentStatus() {
  const navigate = useNavigate();
  const [deptStats, setDeptStats] = useState([]);
  // State to track if the screen is mobile size (e.g., < 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Function to update isMobile state
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check for admin login
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin-login", { replace: true });

    // Project data calculation logic (remains unchanged)
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const depts = {};

    allProjects.forEach(p => {
      if (!depts[p.department]) {
        depts[p.department] = { completed: 0, pending: 0, total: 0 };
      }

      depts[p.department].total += 1;

      if (p.progress === 100) {
        depts[p.department].completed += 1;
      } else {
        depts[p.department].pending += 1;
      }
    });

    const statsArray = Object.keys(depts).map(d => ({
      department: d,
      ...depts[d],
      percentCompleted: ((depts[d].completed / depts[d].total) * 100).toFixed(1)
    }));

    setDeptStats(statsArray);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  // Inline CSS styles used for the department status table (unchanged)
  const tableStyles = {
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
    th: { padding: "8px", borderBottom: "1px solid #ccc", textAlign: "left", opacity: 1, color: "#000" },
    td: { padding: "8px", borderBottom: "1px solid #eee", opacity: 1, color: "#000" },
    completed: { color: "#4CAF50", fontWeight: "bold", opacity: 1 },
    pending: { color: "#FF9800", fontWeight: "bold", opacity: 1 },
    header: { 
        display: "flex", 
        alignItems: "center", 
        gap: "10px", 
        cursor: "pointer", 
        marginBottom: "20px", 
        opacity: 1, 
        color: "#fff" 
    },
  };

  // Conditional styles based on screen size
  const containerStyle = { 
    display: "flex", 
    minHeight: "100vh",
    // Mobile: Stack content vertically
    flexDirection: isMobile ? "column" : "row", 
  };

  const sidebarStyle = { 
    // Mobile: Full width, horizontal navigation
    width: isMobile ? "100%" : "250px", 
    background: "#1f1f1f", 
    color: "#fff", 
    padding: isMobile ? "15px 20px" : "20px",
    display: isMobile ? "flex" : "block",
    justifyContent: isMobile ? "space-between" : "normal",
    alignItems: isMobile ? "center" : "normal",
    order: isMobile ? 1 : 0, // Push sidebar to the top or bottom on mobile 
  };
  
  const mainStyle = { 
    flex: 1, 
    // Mobile: Reduced padding
    padding: isMobile ? "20px 15px" : "40px", 
    background: "#f5f5f5",
    order: isMobile ? 0 : 1, // Main content above sidebar on mobile
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar Section */}
      <aside style={sidebarStyle}>
        {/* Admin profile section (Hidden on mobile for space) */}
        <div style={{ textAlign: "center", display: isMobile ? "none" : "block", opacity: 1 }}>
          <FaUserCircle size={48} color="#fff" />
          <h3 style={{ opacity: 1 }}>Admin</h3>
        </div>

        {/* Navigation back to dashboard */}
        <div style={tableStyles.header} onClick={() => navigate("/admin-dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={mainStyle}>
        <h1 style={{ opacity: 1, fontSize: isMobile ? "24px" : "32px" }}>Department Status</h1>

        {/* Department summary table */}
        {/* On mobile, wrapping in a div for horizontal scrolling */}
        <div style={{ overflowX: isMobile ? "auto" : "visible" }}>
          <table style={{...tableStyles.table, minWidth: isMobile ? "500px" : "100%"}}>
            <thead>
              <tr>
                <th style={tableStyles.th}>Department</th>
                <th style={tableStyles.th}>Total Projects</th>
                <th style={tableStyles.th}>Completed</th>
                <th style={tableStyles.th}>Pending</th>
                <th style={tableStyles.th}>Completed %</th>
              </tr>
            </thead>

            <tbody>
              {/* Render dynamic department statistics */}
              {deptStats.map((d, idx) => (
                <tr key={idx}>
                  <td style={tableStyles.td}>{d.department}</td>
                  <td style={tableStyles.td}>{d.total}</td>
                  <td style={{ ...tableStyles.td, ...tableStyles.completed }}>{d.completed}</td>
                  <td style={{ ...tableStyles.td, ...tableStyles.pending }}>{d.pending}</td>
                  <td style={tableStyles.td}>{d.percentCompleted}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}