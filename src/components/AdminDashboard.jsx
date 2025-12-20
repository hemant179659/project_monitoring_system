import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaTachometerAlt,
  FaList,
  FaSignOutAlt,
  FaUserCircle,
  FaChartBar,
  FaImages,
} from "react-icons/fa";
import styles from "../styles/dashboard.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [deptStats, setDeptStats] = useState([]);
  const [animatedCounts, setAnimatedCounts] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  const adminName = "Admin";

  // -------------------------------
  // 🔐 Admin Auth
  // -------------------------------
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      toast.warning("Please login first");
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // -------------------------------
  // 📡 Fetch all projects
  // -------------------------------
  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "/api/department/projects?all=true"
        );

        if (res.data?.projects) {
          const allProjects = res.data.projects;
          setProjects(allProjects);

          const total = allProjects.length;
          const completed = allProjects.filter(
            (p) => p.progress === 100
          ).length;
          const pending = total - completed;

          // Animate counters
          let count = 0;
          const interval = setInterval(() => {
            setAnimatedCounts({
              total: Math.min(count, total),
              completed: Math.min(count, completed),
              pending: Math.min(count, pending),
            });
            count++;
            if (count > Math.max(total, completed, pending))
              clearInterval(interval);
          }, 50);

          // Department stats
          const depts = {};
          allProjects.forEach((p) => {
            if (!depts[p.department])
              depts[p.department] = { completed: 0, pending: 0 };

            if (p.progress === 100)
              depts[p.department].completed += 1;
            else depts[p.department].pending += 1;
          });

          const statsArray = Object.keys(depts).map((d) => ({
            department: d,
            ...depts[d],
          }));

          setDeptStats(statsArray);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  const COLORS = [
    "#4CAF50",
    "#FF9800",
    "#2196F3",
    "#FF5722",
    "#9C27B0",
    "#FFC107",
  ];

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
          <h3>{adminName}</h3>
        </div>

        <ul className={styles.menu}>
          <li onClick={() => navigate("/admin-dashboard")}>
            <FaTachometerAlt /> Dashboard
          </li>

          <li onClick={() => navigate("/admin-project-list")}>
            <FaList /> Project List
          </li>

          <li onClick={() => navigate("/department-status")}>
            <FaChartBar /> Department Status
          </li>

          {/* ⭐ NEW TAB */}
          <li onClick={() => navigate("/projectrecentphotoadmin")}>
            <FaImages /> Project Recent Photos
          </li>

          <li onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </aside>

      <main className={styles.main}>
        <h1>{adminName} Dashboard</h1>

        {!loading && (
          <>
            {/* Summary Cards */}
            <div className={styles.cards}>
              <div className={styles.card}>
                <h3>Total Projects</h3>
                <p>{animatedCounts.total}</p>
              </div>

              {/* ✅ CLICK → COMPLETED */}
              <div
                className={styles.card}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/completed")}
              >
                <h3>Completed</h3>
                <p style={{ color: "#4CAF50" }}>
                  {animatedCounts.completed}
                </p>
              </div>

              {/* ✅ CLICK → PENDING */}
              <div
                className={styles.card}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/Pending")}
              >
                <h3>Pending</h3>
                <p style={{ color: "#FF9800" }}>
                  {animatedCounts.pending}
                </p>
              </div>
            </div>

            {/* Pie Charts */}
            <div
              style={{
                maxWidth: "900px",
                margin: "40px auto",
                display: "flex",
                gap: "50px",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              {/* Completed Pie */}
              <div
                style={{
                  flex: 1,
                  minWidth: "300px",
                  height: "420px",
                }}
              >
                <h3
                  style={{
                    textAlign: "center",
                    color: "#000",
                    minHeight: "50px",
                  }}
                >
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
                      label={{ fill: "#000" }}
                    >
                      {deptStats.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Pending Pie */}
              <div
                style={{
                  flex: 1,
                  minWidth: "300px",
                  height: "420px",
                }}
              >
                <h3
                  style={{
                    textAlign: "center",
                    color: "#000",
                    minHeight: "50px",
                  }}
                >
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
                      label={{ fill: "#000" }}
                    >
                      {deptStats.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
