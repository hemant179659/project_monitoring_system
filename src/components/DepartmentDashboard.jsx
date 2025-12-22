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
    Y-axis tick with REAL wrapping (Mobile Optimized)
------------------------------------------------- */
const WrappedYAxisTick = ({ x, y, payload, isMobile }) => {
  const width = isMobile ? 150 : 240;
  const xOffset = isMobile ? 155 : 260; 

  return (
    <foreignObject 
      x={x - xOffset} 
      y={y - 25} 
      width={width} 
      height={60}
      style={{ overflow: 'visible' }}
    >
      <div
        style={{
          fontSize: isMobile ? "10px" : "12px",
          lineHeight: "1.2",
          color: "#374151",
          textAlign: "right",
          whiteSpace: "normal",
          wordBreak: "break-word",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          height: "100%",
          paddingRight: "10px",
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [animatedCounts, setAnimatedCounts] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deptName = localStorage.getItem("loggedInDepartment");

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#f4f7f6' 
    }}>
      {/* WRAPPER FOR SIDEBAR + MAIN */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        flexDirection: isMobile ? 'column' : 'row' 
      }}>
        <aside className={styles.sidebar}>
          <div className={styles.profile}>
            <FaUserCircle size={48} color="#fff" />
            <h3>{deptName}</h3>
          </div>
          <ul className={styles.menu}>
            <li onClick={() => navigate("/dept-dashboard")}><FaTachometerAlt /> Dashboard</li>
            <li onClick={() => navigate("/add-project")}><FaPlus /> Add Project</li>
            <li onClick={() => navigate("/project-list")}><FaList /> Project List</li>
            <li onClick={() => navigate("/daily-reporting")}><FaClipboardCheck /> Daily Reporting</li>
            <li onClick={() => navigate("/project-photos")}><FaList /> Projects Recent Photos</li>
            <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
          </ul>
        </aside>

        <main className={styles.main} style={{ flex: 1, padding: isMobile ? '15px' : '30px' }}>
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
                  <p style={{ color: "#4CAF50" }}>{animatedCounts.completed}</p>
                </div>
                <div className={styles.card}>
                  <h3>Pending</h3>
                  <p style={{ color: "#FF9800" }}>{animatedCounts.pending}</p>
                </div>
              </div>

              <div
                className={styles.chartBox}
                style={{ 
                  maxWidth: "900px", 
                  margin: "40px auto", 
                  width: '100%',
                  overflowX: 'hidden' 
                }}
              >
                <h2 style={{ fontWeight: 800, fontSize: isMobile ? "18px" : "22px", color: "#1f2937", marginBottom: "16px" }}>
                  Project Progress Overview
                </h2>

                <div style={{ width: "100%", height: isMobile ? 450 : 520 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={barData}
                      margin={{ 
                        top: 10, 
                        right: 30, 
                        left: isMobile ? 70 : 80, 
                        bottom: 10 
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={isMobile ? 160 : 280} 
                        tick={<WrappedYAxisTick isMobile={isMobile} />}
                        interval={0}
                      />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="progress" barSize={20}>
                        {barData.map((entry, i) => (
                          <Cell key={i} fill={getBarColor(entry.progress)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* ✅ PROGRESS BARS WITH WRAPPING TEXT FOR LONG NAMES */}
                <div style={{ marginTop: "34px" }}>
                  {projects.map((p, idx) => (
                    <div key={idx} style={{ marginBottom: "25px" }}>
                      <div 
                        style={{ 
                          fontWeight: 700, 
                          fontSize: isMobile ? "13px" : "14px",
                          lineHeight: "1.4", 
                          whiteSpace: "normal", 
                          wordBreak: "break-word", 
                          width: "100%",
                          marginBottom: "8px", 
                          color: "#111827",
                          display: "block"
                        }}
                      >
                        {p.name}
                      </div>
                      <div style={{ background: "#ddd", borderRadius: "8px", height: "16px", overflow: "hidden" }}>
                        <div style={{ width: `${p.progress}%`, background: p.progress === 100 ? "#4CAF50" : "#FF9800", height: "100%", transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* FOOTER - ONLY VISIBLE AT BOTTOM OF CONTENT */}
      <footer style={{
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '3px solid #0056b3',
        padding: '12px 10px',
        color: '#333',
        textAlign: 'center',
        fontFamily: "serif",
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: 'bold', color: '#002147' }}>
            District Administration
          </p>
          <p style={{ margin: '4px 0', fontSize: '0.7rem', opacity: 0.8 }}>
            Designed and Developed by <strong>District Administration</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px',
            fontSize: '0.65rem',
            borderTop: '1px solid #ddd',
            marginTop: '8px',
            paddingTop: '8px'
          }}>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
            <span>|</span>
            <span>Official Digital Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}