import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";

export default function DepartmentStatus() {
  const navigate = useNavigate();
  const [deptStats, setDeptStats] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin-login", { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(
           "/api/department/projects?all=true"
        );

        const allProjects = res.data.projects || [];
        const depts = {};

        allProjects.forEach((p) => {
          if (!depts[p.department]) {
            depts[p.department] = {
              completed: 0,
              pending: 0,
              total: 0,
            };
          }

          depts[p.department].total += 1;

          if (p.progress === 100) {
            depts[p.department].completed += 1;
          } else {
            depts[p.department].pending += 1;
          }
        });

        const statsArray = Object.keys(depts).map((d) => ({
          department: d,
          ...depts[d],
          percentCompleted: (
            (depts[d].completed / depts[d].total) *
            100
          ).toFixed(1),
        }));

        setDeptStats(statsArray);
      } catch (err) {
        console.error("Failed to fetch department stats", err);
      }
    };

    fetchStats();

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const tableStyles = {
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
    th: {
      padding: "8px",
      borderBottom: "1px solid #ccc",
      textAlign: "left",
      opacity: 1,
      color: "#000",
      fontWeight: "700",
    },
    td: {
      padding: "8px",
      borderBottom: "1px solid #eee",
      opacity: 1,
      color: "#000",
    },
    completed: { color: "#4CAF50", fontWeight: "bold", opacity: 1 },
    pending: { color: "#FF9800", fontWeight: "bold", opacity: 1 },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      marginBottom: "20px",
      opacity: 1,
      color: "#fff",
    },
  };

  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    flexDirection: isMobile ? "column" : "row",
  };

  const sidebarStyle = {
    width: isMobile ? "100%" : "250px",
    background: "#1f1f1f",
    color: "#fff",
    padding: isMobile ? "15px 20px" : "20px",
    display: isMobile ? "flex" : "block",
    justifyContent: isMobile ? "space-between" : "normal",
    alignItems: isMobile ? "center" : "normal",
    order: isMobile ? 1 : 0,
  };

  const mainStyle = {
    flex: 1,
    padding: isMobile ? "20px 15px" : "40px",
    background: "#f5f5f5",
    order: isMobile ? 0 : 1,
  };

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <div
          style={{
            textAlign: "center",
            display: isMobile ? "none" : "block",
            opacity: 1,
          }}
        >
          <FaUserCircle size={48} color="#fff" />
          <h3 style={{ opacity: 1 }}>Admin</h3>
        </div>

        <div
          style={tableStyles.header}
          onClick={() => navigate("/admin-dashboard")}
        >
          <FaArrowLeft /> Back to Dashboard
        </div>
      </aside>

      <main style={mainStyle}>
        <h1
         style={{
    opacity: 1,
    color: "#000",
    fontWeight: 700,
    fontSize: isMobile ? "24px" : "32px",
    marginBottom: "20px",
  }}
        >
          Department Status
        </h1>

        <div style={{ overflowX: isMobile ? "auto" : "visible" }}>
          <table
            style={{
              ...tableStyles.table,
              minWidth: isMobile ? "500px" : "100%",
            }}
          >
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
              {deptStats.map((d, idx) => (
                <tr key={idx}>
                  <td style={tableStyles.td}>{d.department}</td>
                  <td style={tableStyles.td}>{d.total}</td>
                  <td
                    style={{
                      ...tableStyles.td,
                      ...tableStyles.completed,
                    }}
                  >
                    {d.completed}
                  </td>
                  <td
                    style={{
                      ...tableStyles.td,
                      ...tableStyles.pending,
                    }}
                  >
                    {d.pending}
                  </td>
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
