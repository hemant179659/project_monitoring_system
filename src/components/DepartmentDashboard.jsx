import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import { FaTachometerAlt, FaPlus, FaList, FaSignOutAlt, FaUserCircle, FaClipboardCheck } from "react-icons/fa";
import styles from "../styles/dashboard.module.css";

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  
  // Stores list of projects of the logged-in department
  const [projects, setProjects] = useState([]);

  // Stores animated values for dashboard cards
  const [animatedCounts, setAnimatedCounts] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  // Get logged-in department name
  const deptName = localStorage.getItem("loggedInDepartment");

  // ----------------------------------------
  // 🔐 Protect Dashboard Page
  // Redirect user to login if not authenticated
  // ----------------------------------------
  useEffect(() => {
    if (!deptName) {
      navigate("/dept-login", { replace: true });
    }
  }, [deptName, navigate]);

  // ----------------------------------------
  // 📥 Load department projects + animate numbers
  // ----------------------------------------
  useEffect(() => {
    if (!deptName) return;

    // Load all stored projects
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // Filter only current department’s projects
    const deptProjects = allProjects.filter((p) => p.department === deptName);

    setProjects(deptProjects);

    // Count numbers for cards
    const total = deptProjects.length;
    const completed = deptProjects.filter((p) => p.progress === 100).length;
    const pending = total - completed;

    // Smooth animation increment
    let count = 0;
    const interval = setInterval(() => {
      setAnimatedCounts({
        total: Math.min(count, total),
        completed: Math.min(count, completed),
        pending: Math.min(count, pending),
      });

      count++;
      if (count > Math.max(total, completed, pending)) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [deptName]);

  // ----------------------------------------
  // 📊 Prepare chart data
  // ----------------------------------------
  const barData = projects.map((p) => ({
    name: p.name,
    progress: p.progress
  }));

  // Dynamic bar color
  const getBarColor = (progress) => (progress === 100 ? "#4CAF50" : "#FF9800");

  // ----------------------------------------
  // 🟡 Custom Tooltip for Bar Chart
  // ----------------------------------------
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: "#fff", border: "1px solid #ccc", padding: "10px", borderRadius: "8px", opacity: 1 }}>
          <p style={{ opacity: 1, fontWeight: 600, color: "#000" }}>{data.name}</p>
          <p style={{ opacity: 1, color: "#000" }}>Progress: {data.progress}%</p>
        </div>
      );
    }
    return null;
  };

  // ----------------------------------------
  // 🚪 Logout Department
  // ----------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("loggedInDepartment");
    navigate("/dept-login", { replace: true });
  };

  // ----------------------------------------
  // 🖥 Dashboard UI
  // ----------------------------------------
  return (
    <div className={styles.container}>

      {/* Sidebar Menu */}
      <aside className={styles.sidebar}>
        <div className={styles.profile}>
          <FaUserCircle size={48} color="#fff" />
          <h3 style={{ opacity: 1 }}>{deptName}</h3>
        </div>

        {/* Navigation Options */}
        <ul className={styles.menu}>
          <li onClick={() => navigate("/dept-dashboard")}><FaTachometerAlt /> Dashboard</li>
          <li onClick={() => navigate("/add-project")}><FaPlus /> Add Project</li>
          <li onClick={() => navigate("/project-list")}><FaList /> Project List</li>
          <li onClick={() => navigate("/daily-reporting")}><FaClipboardCheck /> Daily Reporting</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </aside>

      {/* Main Content Section */}
      <main className={styles.main}>
        <h1 style={{ opacity: 1, color: "#000" }}>{deptName} Dashboard</h1>

        {/* Summary Cards */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3 style={{ opacity: 1, color: "#000" }}>Total Projects</h3>
            <p style={{ opacity: 1, color: "#000" }}>{animatedCounts.total}</p>
          </div>

          <div className={styles.card}>
            <h3 style={{ opacity: 1, color: "#000" }}>Completed</h3>
            <p style={{ color: "#4CAF50", opacity: 1 }}>{animatedCounts.completed}</p>
          </div>

          <div className={styles.card}>
            <h3 style={{ opacity: 1, color: "#000" }}>Pending</h3>
            <p style={{ color: "#FF9800", opacity: 1 }}>{animatedCounts.pending}</p>
          </div>
        </div>

        {/* Progress Chart Section */}
        <div className={styles.chartBox} style={{ maxWidth: "900px", margin: "40px auto" }}>
          <h2 style={{ opacity: 1, color: "#000" }}>Project Progress Overview</h2>

          {/* Bar Chart */}
          <div style={{ width: "100%", height: 500 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={barData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#000" }} />
                <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 12, fill: "#000" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ opacity: 1 }} />
                <Bar dataKey="progress" barSize={20}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={getBarColor(entry.progress)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Individual Project Progress Bars */}
          <div style={{ marginTop: "30px" }}>
            {projects.map((p, idx) => (
              <div key={idx} style={{ marginBottom: "16px" }}>
                <span style={{ fontWeight: 600, color: "#000" }}>{p.name}</span>
                <div style={{ background: "#ddd", borderRadius: "8px", overflow: "hidden", height: "16px", marginTop: "6px" }}>
                  <div
                    style={{
                      width: `${p.progress}%`,
                      background: p.progress === 100 ? "#4CAF50" : "#FF9800",
                      height: "100%",
                      transition: "width 0.6s ease",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
