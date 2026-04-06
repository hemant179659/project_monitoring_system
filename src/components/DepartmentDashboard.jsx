import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ Custom API instance use karein
import API from "../api/axios"; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  FaTachometerAlt, FaPlus, FaList,
  FaSignOutAlt, FaUserCircle, FaClipboardCheck,
} from "react-icons/fa";
import styles from "../styles/dashboard.module.css";
import { toast, ToastContainer } from "react-toastify";
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
  const [animatedCounts, setAnimatedCounts] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // ✅ 1. Token aur Dept Name sahi se fetch karein
  const deptName = localStorage.getItem("loggedInDepartment");
  const token = localStorage.getItem("deptToken") || localStorage.getItem("adminToken");

  const [totalAllocated, setTotalAllocated] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ 2. Security Check: Login par redirect karein agar session nahi hai
  useEffect(() => {
    if (!token) {
      navigate("/dept-login", { replace: true });
    }
  }, [token, navigate]);

  // Fetch Budget Data
  useEffect(() => {
    const fetchBudget = async () => {
      if (!deptName || !token) return;
      try {
        const res = await API.get(`/department/budget-summary`);
        const deptData = res.data.find(d => d.department === deptName);
        if (deptData) {
          setTotalAllocated(deptData.totalBudget);
          setRemainingBudget(deptData.remaining);
        }
      } catch (err) {
        console.error("Budget fetch error:", err);
      }
    };
    fetchBudget();
  }, [deptName, token]);

  // Fetch Projects Data
  useEffect(() => {
    if (!deptName || !token) return;

    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get(`/department/projects?department=${deptName}`);

        if (res.data?.projects) {
          const fetchedProjects = res.data.projects;
          setProjects(fetchedProjects);

          const total = fetchedProjects.length;
          const completed = fetchedProjects.filter((p) => p.progress === 100).length;
          const pending = total - completed;

          // Animation Logic
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
          }, 30);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/dept-login", { replace: true });
        }
        setError("Failed to fetch projects.");
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [deptName, token, navigate]);

  const barData = projects.map((p) => ({
    name: p.name,
    progress: p.progress,
  }));

  const getBarColor = (progress) => progress === 100 ? "#4CAF50" : "#FF9800";

  // ✅ 3. Logout handler fixed with navigation replace
  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate("/", { replace: true });
  };

  if (!token) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <ToastContainer position="top-center" autoClose={2000} />
      <div style={{ display: 'flex', flex: 1, flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* SIDEBAR */}
        <aside className={styles.sidebar} style={{ position: isMobile ? 'relative' : 'sticky', top: 0, height: isMobile ? 'auto' : '100vh' }}>
          <div className={styles.profile}>
            <FaUserCircle size={48} color="#fff" />
            <h3 style={{fontSize: '14px', marginTop: '10px'}}>{deptName || "Department"}</h3>
          </div>
          <ul className={styles.menu}>
            <li onClick={() => navigate("/dept-dashboard")}><FaTachometerAlt /> Dashboard</li>
            <li onClick={() => navigate("/add-project")}><FaPlus /> Add Project</li>
            <li onClick={() => navigate("/project-list")}><FaList /> Project List</li>
            <li onClick={() => navigate("/daily-reporting")}><FaClipboardCheck /> Daily Reporting</li>
            <li onClick={() => navigate("/project-photos")}><FaList /> Project Photos</li>
            <li onClick={handleLogout} style={{color: '#ff9b9b', fontWeight: 'bold'}}><FaSignOutAlt /> Logout</li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.main} style={{ flex: 1, padding: isMobile ? '15px' : '30px' }}>
          <h1 style={{ fontWeight: '900', color: '#002147' }}>{deptName} Monitoring Dashboard</h1>

          {/* BUDGET CARDS */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "25px", flexWrap: "wrap" }}>
            <div style={{ background: "#002147", color: "white", padding: "15px 25px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", flex: 1, minWidth: "220px" }}>
              <span style={{ fontSize: "13px", opacity: 0.9 }}>Total Allocated Budget</span>
              <h2 style={{ margin: "5px 0 0 0", color: "#fff", fontSize: "24px" }}>₹{totalAllocated.toLocaleString()} L</h2>
            </div>

            <div style={{ background: "#ffffff", color: "#333", padding: "15px 25px", borderRadius: "10px", border: "2px solid #4CAF50", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", flex: 1, minWidth: "220px" }}>
              <span style={{ fontSize: "13px", color: "#666" }}>Remaining Budget</span>
              <h2 style={{ margin: "5px 0 0 0", color: "#4CAF50", fontSize: "24px" }}>₹{remainingBudget.toLocaleString()} L</h2>
            </div>
          </div>

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

              {/* CHART SECTION */}
              <div className={styles.chartBox} style={{ maxWidth: "950px", margin: "40px auto", width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontWeight: 800, fontSize: isMobile ? "18px" : "22px", color: "#1f2937", marginBottom: "20px" }}>
                  Project Progress Analytics
                </h2>

                <div style={{ width: "100%", height: isMobile ? 400 : 500 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={barData} margin={{ top: 10, right: 30, left: isMobile ? 60 : 80, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={isMobile ? 140 : 260} 
                        tick={<WrappedYAxisTick isMobile={isMobile} />}
                        interval={0}
                      />
                      <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                      <Bar dataKey="progress" barSize={18}>
                        {barData.map((entry, i) => (
                          <Cell key={i} fill={getBarColor(entry.progress)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer style={{ width: '100%', backgroundColor: '#f8f9fa', borderTop: '3px solid #0056b3', padding: '15px', color: '#333', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: 'bold', color: '#002147' }}>District Administration Udham Singh Nagar</p>
        <p style={{ margin: '4px 0', fontSize: '0.7rem' }}>Official DPMS Portal &copy; {new Date().getFullYear()} | Designed by NIC</p>
      </footer>
    </div>
  );
}