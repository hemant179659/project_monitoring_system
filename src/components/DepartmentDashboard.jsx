import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  FaTachometerAlt,
  FaPlus,
  FaList,
  FaSignOutAlt,
  FaUserCircle,
  FaClipboardCheck,
} from "react-icons/fa";
import styles from "../styles/dashboard.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* -------------------------------------------------
   Y-axis tick with REAL wrapping (no cut)
------------------------------------------------- */
const WrappedYAxisTick = ({ x, y, payload }) => {
  return (
    <foreignObject x={x - 260} y={y - 28} width={240} height={56}>
      <div
        style={{
          fontSize: "12px",
          lineHeight: "1.3",
          color: "#374151",
          textAlign: "right",
          whiteSpace: "normal",
          wordBreak: "break-word",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          height: "100%",
          paddingRight: "6px",
        }}
      >
        {payload.value}
      </div>
    </foreignObject>
  );
};

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [animatedCounts, setAnimatedCounts] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deptName = localStorage.getItem("loggedInDepartment");

  useEffect(() => {
    if (!deptName) {
      toast.warning("Please login first");
      navigate("/dept-login", { replace: true });
    }
  }, [deptName, navigate]);

  useEffect(() => {
    if (!deptName) return;

    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `/api/department/projects?department=${deptName}`
        );

        if (res.data?.projects) {
          setProjects(res.data.projects);

          const total = res.data.projects.length;
          const completed = res.data.projects.filter(
            (p) => p.progress === 100
          ).length;
          const pending = total - completed;

          let count = 0;
          const interval = setInterval(() => {
            setAnimatedCounts({
              total: Math.min(count, total),
              completed: Math.min(count, completed),
              pending: Math.min(count, pending),
            });
            count++;
            if (count > Math.max(total, completed, pending)) {
              clearInterval(interval);
            }
          }, 50);
        }
      } catch {
        setError("Failed to fetch projects from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [deptName]);

  const barData = projects.map((p) => ({
    name: p.name,
    progress: p.progress,
  }));

  const getBarColor = (progress) =>
    progress === 100 ? "#4CAF50" : "#FF9800";

  const handleLogout = () => {
    localStorage.removeItem("loggedInDepartment");
    navigate("/dept-login", { replace: true });
  };

  if (!deptName) return null;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.profile}>
          <FaUserCircle size={48} color="#fff" />
          <h3>{deptName}</h3>
        </div>
        <ul className={styles.menu}>
          <li onClick={() => navigate("/dept-dashboard")}>
            <FaTachometerAlt /> Dashboard
          </li>
          <li onClick={() => navigate("/add-project")}>
            <FaPlus /> Add Project
          </li>
          <li onClick={() => navigate("/project-list")}>
            <FaList /> Project List
          </li>
          <li onClick={() => navigate("/daily-reporting")}>
            <FaClipboardCheck /> Daily Reporting
          </li>
          <li onClick={() => navigate("/project-photos")}>
            <FaList /> Projects Recent Photos
          </li>
          <li onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </aside>

      <main className={styles.main}>
        <h1>{deptName} Dashboard</h1>

        {!loading && !error && (
          <>
            <div className={styles.cards}>
              <div className={styles.card}>
                <h3>Total Projects</h3>
                <p>{animatedCounts.total}</p>
              </div>
              <div className={styles.card}>
                <h3>Completed</h3>
                <p style={{ color: "#4CAF50" }}>
                  {animatedCounts.completed}
                </p>
              </div>
              <div className={styles.card}>
                <h3>Pending</h3>
                <p style={{ color: "#FF9800" }}>
                  {animatedCounts.pending}
                </p>
              </div>
            </div>

            <div
              className={styles.chartBox}
              style={{ maxWidth: "900px", margin: "40px auto" }}
            >
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "22px",
                  color: "#1f2937",
                  letterSpacing: "0.6px",
                  marginBottom: "16px",
                  textShadow: "0 1px 1px rgba(0,0,0,0.15)",
                }}
              >
                Project Progress Overview
              </h2>

              <div style={{ width: "100%", height: 520 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={barData}
                    margin={{ top: 30, right: 20, left: 80, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={280}
                      tick={<WrappedYAxisTick />}
                    />
                    <Legend />
                    <Bar dataKey="progress" barSize={20}>
                      {barData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={getBarColor(entry.progress)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ✅ FULLY VISIBLE PROGRESS BAR TITLES */}
              <div style={{ marginTop: "34px" }}>
                {projects.map((p, idx) => (
                  <div key={idx} style={{ marginBottom: "22px" }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "14px",
                        lineHeight: "1.5",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        width: "100%",
                        marginBottom: "6px",
                        color: "#111827",
                      }}
                    >
                      {p.name}
                    </div>

                    <div
                      style={{
                        background: "#ddd",
                        borderRadius: "8px",
                        height: "16px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${p.progress}%`,
                          background:
                            p.progress === 100
                              ? "#4CAF50"
                              : "#FF9800",
                          height: "100%",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
