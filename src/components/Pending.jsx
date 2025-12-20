import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/dashboard.module.css";

export default function Pending() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  /**
   * -------------------------------------------------------------
   * 🔐 Admin Auth + Fetch Pending Projects
   * -------------------------------------------------------------
   */
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin-login", { replace: true });
      return;
    }

    const fetchPendingProjects = async () => {
      try {
        const res = await axios.get(
          "/api/department/projects?all=true"
        );

        if (res.data?.projects) {
          const pendingProjects = res.data.projects.filter(
            (p) => p.progress < 100
          );
          setProjects(pendingProjects);
        }
      } catch (error) {
        console.error("Failed to fetch pending projects", error);
      }
    };

    fetchPendingProjects();

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  /**
   * -------------------------------------------------------------
   * 📌 Group pending projects by department
   * -------------------------------------------------------------
   */
  const departmentGroups = projects.reduce((acc, p) => {
    if (!acc[p.department]) acc[p.department] = [];
    acc[p.department].push(p);
    return acc;
  }, {});

  const mainContainerStyle = {
    padding: isMobile ? "15px" : "20px",
  };

  const departmentCardStyle = {
    marginBottom: "40px",
    padding: isMobile ? "15px" : "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    opacity: 1,
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
          fontSize: isMobile ? "24px" : "32px",
        }}
      >
        Pending Projects
      </h1>

      {/* Empty State */}
      {Object.keys(departmentGroups).length === 0 && (
        <p style={{ opacity: 1, textAlign: "center", color: "#555" }}>
          No pending projects found.
        </p>
      )}

      {/* Department-wise pending projects */}
      {Object.keys(departmentGroups).map((dept, idx) => (
        <div key={idx} style={departmentCardStyle}>
          <h2
            style={{
              opacity: 1,
              marginBottom: "20px",
              color: "#222",
              fontSize: isMobile ? "20px" : "24px",
            }}
          >
            {dept} Department
          </h2>

          <div style={{ overflowX: isMobile ? "auto" : "visible" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
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
                    style={{
                      backgroundColor:
                        i % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    }}
                  >
                    <td style={cellStyle}>{p.name}</td>

                    <td style={cellStyle}>
                      <div
                        style={{
                          background: "#eee",
                          borderRadius: "8px",
                          overflow: "hidden",
                          height: isMobile ? "15px" : "20px",
                        }}
                      >
                        <div
                          style={{
                            width: `${p.progress}%`,
                            background: "#FF9800",
                            textAlign: "center",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: isMobile ? "10px" : "12px",
                          }}
                        >
                          {p.progress}%
                        </div>
                      </div>
                    </td>

                    <td style={cellStyle}>
                      {new Date(p.startDate).toLocaleDateString()}
                    </td>

                    <td style={cellStyle}>
                      {new Date(p.endDate).toLocaleDateString()}
                    </td>

                    <td style={cellStyle}>
                      {p.remarks || "No remarks"}
                    </td>
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

/* --------------------------------------------------
   🎨 Table Styles (UNCHANGED)
-------------------------------------------------- */

const headerStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f0f0f0",
  opacity: 1,
  color: "#333",
};

const cellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  opacity: 1,
  color: "#333",
};
