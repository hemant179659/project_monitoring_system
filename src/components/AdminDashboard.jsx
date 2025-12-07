import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FaTachometerAlt, FaList, FaSignOutAlt, FaUserCircle, FaChartBar } from "react-icons/fa";
import styles from "../styles/dashboard.module.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [deptStats, setDeptStats] = useState([]);
  const [totalCounts, setTotalCounts] = useState({ total: 0, completed: 0, pending: 0 });

  const adminName = "Admin";

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin-login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(allProjects);

    const total = allProjects.length;
    const completed = allProjects.filter(p => p.progress === 100).length;
    const pending = total - completed;

    setTotalCounts({ total, completed, pending });

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
      ...depts[d]
    }));

    setDeptStats(statsArray);
  }, []);

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#FF5722", "#9C27B0", "#FFC107"];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login", { replace: true });
  };

  return (
    <div className={styles.container}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.profile}>
          <FaUserCircle size={48} color="#fff" />
          <h3 style={{ opacity: 1 }}>{adminName}</h3>
        </div>

        <ul className={styles.menu}>
          <li onClick={() => navigate("/admin-dashboard")}><FaTachometerAlt /> Dashboard</li>
          <li onClick={() => navigate("/admin-project-list")}><FaList /> Project List</li>
          <li onClick={() => navigate("/department-status")}><FaChartBar /> Department Status</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <h1 style={{ opacity: 1 }}>Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className={styles.cards}>
          <div className={styles.card} onClick={() => navigate("/admin-project-list")}>
            <h3 style={{ opacity: 1 }}>Total Projects</h3>
            <p style={{ opacity: 1 }}>{totalCounts.total}</p>
          </div>

          <div className={styles.card} onClick={() => navigate("/completed")}>
            <h3 style={{ opacity: 1 }}>Completed</h3>
            <p style={{ color: "#4CAF50", opacity: 1 }}>{totalCounts.completed}</p>
          </div>

          <div className={styles.card} onClick={() => navigate("/pending")}>
            <h3 style={{ opacity: 1 }}>Pending</h3>
            <p style={{ color: "#FF9800", opacity: 1 }}>{totalCounts.pending}</p>
          </div>
        </div>

        {/* Pie Charts */}
        <div style={{
          maxWidth: "900px",
          margin: "40px auto",
          display: "flex",
          gap: "50px",
          flexWrap: "wrap",
          alignItems: "flex-start",
          opacity: 1
        }}>

          {/* Completed chart */}
          <div style={{
            flex: 1,
            minWidth: "300px",
            height: "420px"
          }}>
            <h3 style={{
              textAlign: "center",
              opacity: 1,
              color: "#000",
              minHeight: "50px"   // ⭐ FIX HERE
            }}>
              Completed Projects by Department
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deptStats}
                  dataKey="completed"
                  nameKey="department"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={{ fill: "#000", opacity: 1 }}
                >
                  {deptStats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip contentStyle={{ opacity: 1, color: "#000" }} itemStyle={{ opacity: 1 }} />
                <Legend wrapperStyle={{ opacity: 1, color: "#000" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Pending chart */}
          <div style={{
            flex: 1,
            minWidth: "300px",
            height: "420px"
          }}>
            <h3 style={{
              textAlign: "center",
              opacity: 1,
              color: "#000",
              minHeight: "50px"   // ⭐ FIX HERE
            }}>
              Pending Projects by Department
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deptStats}
                  dataKey="pending"
                  nameKey="department"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={{ fill: "#000", opacity: 1 }}
                >
                  {deptStats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip contentStyle={{ opacity: 1, color: "#000" }} itemStyle={{ opacity: 1 }} />
                <Legend wrapperStyle={{ opacity: 1, color: "#000" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </main>
    </div>
  );
}
