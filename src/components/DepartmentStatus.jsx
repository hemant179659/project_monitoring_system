import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";

export default function DepartmentStatus() {
  const navigate = useNavigate();
  const [deptStats, setDeptStats] = useState([]);

  // Inline CSS styles used for the department status table
  const tableStyles = {
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
    th: { padding: "8px", borderBottom: "1px solid #ccc", textAlign: "left", opacity: 1, color: "#000" },
    td: { padding: "8px", borderBottom: "1px solid #eee", opacity: 1, color: "#000" },
    completed: { color: "#4CAF50", fontWeight: "bold", opacity: 1 },
    pending: { color: "#FF9800", fontWeight: "bold", opacity: 1 },
    header: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "20px", opacity: 1, color: "#fff" },
  };

  useEffect(() => {
    // Check if admin is logged in; if not, redirect to admin login
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin-login", { replace: true });

    // Retrieve all project data from localStorage
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // Temporary object to group project statistics by department
    const depts = {};

    // Loop through each project and calculate totals, completed, pending
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

    // Convert object structure into an array for rendering
    const statsArray = Object.keys(depts).map(d => ({
      department: d,
      ...depts[d],
      percentCompleted: ((depts[d].completed / depts[d].total) * 100).toFixed(1)
    }));

    // Store final computed department stats in state
    setDeptStats(statsArray);
  }, [navigate]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Section */}
      <aside style={{ width: "250px", background: "#1f1f1f", color: "#fff", padding: "20px" }}>
        {/* Admin profile section */}
        <div style={{ textAlign: "center", marginBottom: "30px", opacity: 1 }}>
          <FaUserCircle size={48} color="#fff" />
          <h3 style={{ opacity: 1 }}>Admin</h3>
        </div>

        {/* Navigation back to dashboard */}
        <div style={tableStyles.header} onClick={() => navigate("/admin-dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "40px", background: "#f5f5f5" }}>
        <h1 style={{ opacity: 1 }}>Department Status</h1>

        {/* Department summary table */}
        <table style={tableStyles.table}>
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
      </main>
    </div>
  );
}
