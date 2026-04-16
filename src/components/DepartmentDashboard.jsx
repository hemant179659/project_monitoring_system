import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios"; 
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  FaTachometerAlt, FaPlus, FaList, FaBars,
  FaSignOutAlt, FaUserCircle, FaClipboardCheck, FaLanguage, FaCamera, FaTimes
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* --- Fixed Y-axis tick wrapping --- */
const WrappedYAxisTick = ({ x, y, payload, isMobile, isCollapsed }) => {
  // Logic: Mobile pe kam width, Desktop pe zyada
  const width = isMobile ? 100 : (isCollapsed ? 120 : 180);
  
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject 
        x={-(width + 10)} 
        y={-20} 
        width={width} 
        height={50} 
        style={{ overflow: 'visible' }}
      >
        <div style={{
            fontSize: isMobile ? "9px" : "11px",
            lineHeight: "1.2",
            color: "#374151",
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            fontWeight: "500",
            wordBreak: "break-word",
            paddingRight: "5px"
          }}>
          {payload.value}
        </div>
      </foreignObject>
    </g>
  );
};

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const [lang, setLang] = useState("hi");
  const [animatedCounts, setAnimatedCounts] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  const deptName = localStorage.getItem("loggedInDepartment");
  const token = localStorage.getItem("deptToken") || localStorage.getItem("adminToken");

  const t = {
    en: { 
      dash: "Dashboard", add: "Add Project", list: "Project List", daily: "Daily Reporting", 
      photos: "Project Photos", logout: "Logout", total: "Total Projects",
      comp: "Completed", pend: "Pending", budget: "Total Budget",
      rem: "Remaining", title: "Department Dashboard", chart: "Project Progress Analytics",
      deptAdmin: "DISTRICT ADMINISTRATION, UTTARAKHAND"
    },
    hi: { 
      dash: "डैशबोर्ड", add: "नया प्रोजेक्ट", list: "प्रोजेक्ट सूची", daily: "दैनिक रिपोर्टिंग", 
      photos: "प्रोजेक्ट फोटो", logout: "लॉगआउट", total: "कुल परियोजनाएं",
      comp: "पूर्ण", pend: "लंबित", budget: "कुल बजट",
      rem: "शेष बजट", title: "विभाग डैशबोर्ड", chart: "परियोजना प्रगति विश्लेषण",
      deptAdmin: "जिला प्रशासन, उत्तराखंड"
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!token) navigate("/dept-login", { replace: true });
  }, [token, navigate]);

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
      } catch (err) { console.error("Budget error:", err); }
    };
    fetchBudget();
  }, [deptName, token]);

  useEffect(() => {
    if (!deptName || !token) return;
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/department/projects?department=${deptName}`);
        if (res.data?.projects) {
          const fetchedProjects = res.data.projects;
          setProjects(fetchedProjects);
          const total = fetchedProjects.length;
          const completed = fetchedProjects.filter((p) => p.progress === 100).length;
          const pending = total - completed;

          let count = 0;
          const interval = setInterval(() => {
            setAnimatedCounts({
              total: Math.min(count, total),
              completed: Math.min(count, completed),
              pending: Math.min(count, pending),
            });
            count++;
            if (count > Math.max(total, completed, pending)) clearInterval(interval);
          }, 30);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/dept-login", { replace: true });
        }
        toast.error("Error loading dashboard data");
      } finally { setLoading(false); }
    };
    fetchProjects();
  }, [deptName, token, navigate]);

  const barData = projects.map((p) => ({ name: p.name, progress: p.progress }));
  const getBarColor = (progress) => progress === 100 ? "#10b981" : "#f59e0b";

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate("/", { replace: true });
  };

  if (!token) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      
      {/* Upper Section: Sidebar + Content */}
      <div style={{ display: 'flex', flex: 1, width: '100%' }}>
        <ToastContainer position="top-center" autoClose={2000} />
        
        {/* --- SIDEBAR --- */}
        <motion.aside 
          initial={false}
          animate={{ 
            width: isCollapsed ? (isMobile ? 0 : 80) : 260,
            x: isMobile && isCollapsed ? -260 : 0 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={sidebarStyle}
        >
          <div style={sidebarHeader}>
            <motion.div animate={{ scale: isCollapsed ? 0.8 : 1 }}>
              <FaUserCircle size={isCollapsed ? 35 : 50} color="#cbd5e1" />
              {!isCollapsed && (
                <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={deptTitle}>
                  {deptName}
                </motion.h3>
              )}
            </motion.div>
          </div>

          <nav style={{ padding: '15px 10px' }}>
            {[
              { icon: <FaTachometerAlt />, text: t[lang].dash, path: "/dept-dashboard" },
              { icon: <FaPlus />, text: t[lang].add, path: "/add-project" },
              { icon: <FaList />, text: t[lang].list, path: "/project-list" },
              { icon: <FaClipboardCheck />, text: t[lang].daily, path: "/daily-reporting" },
              { icon: <FaCamera />, text: t[lang].photos, path: "/project-photos" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)', x: 5 }}
                onClick={() => navigate(item.path)}
                style={{ ...menuItemStyle, justifyContent: isCollapsed ? 'center' : 'flex-start' }}
              >
                <span style={{ fontSize: '20px', minWidth: '25px' }}>{item.icon}</span>
                {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.text}</span>}
              </motion.div>
            ))}

            <div onClick={handleLogout} style={{ ...menuItemStyle, color: '#fda4af', marginTop: '20px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
              <FaSignOutAlt size={20} />
              {!isCollapsed && <span style={{ fontWeight: 'bold' }}>{t[lang].logout}</span>}
            </div>
          </nav>
        </motion.aside>

        {/* --- MAIN PANEL --- */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <header style={topHeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={() => setIsCollapsed(!isCollapsed)} style={toggleBtnStyle}>
                {isCollapsed ? <FaBars size={18} /> : <FaTimes size={18} />}
              </button>
              <h2 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: '#002147', margin: 0 }}>
                {t[lang].title}
              </h2>
            </div>
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={langBtnStyle}>
              <FaLanguage size={18} /> {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </header>

          <main style={{ padding: isMobile ? '20px' : '40px', flex: 1 }}>
            <div style={budgetGrid}>
              <motion.div whileHover={{ y: -5 }} style={budgetCardPrimary}>
                <p style={cardLabel}>{t[lang].budget}</p>
                <h2 style={cardValue}>₹{totalAllocated.toLocaleString()} L</h2>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} style={budgetCardSecondary}>
                <p style={{ ...cardLabel, color: "#64748b" }}>{t[lang].rem}</p>
                <h2 style={{ ...cardValue, color: "#10b981" }}>₹{remainingBudget.toLocaleString()} L</h2>
              </motion.div>
            </div>

            {!loading && (
              <>
                <div style={statsGrid}>
                  <div style={{ ...statBox, borderBottom: '4px solid #3b82f6' }}>
                    <p style={statLabel}>{t[lang].total}</p>
                    <p style={statNumber}>{animatedCounts.total}</p>
                  </div>
                  <div style={{ ...statBox, borderBottom: '4px solid #10b981' }}>
                    <p style={statLabel}>{t[lang].comp}</p>
                    <p style={{ ...statNumber, color: '#10b981' }}>{animatedCounts.completed}</p>
                  </div>
                  <div style={{ ...statBox, borderBottom: '4px solid #f59e0b' }}>
                    <p style={statLabel}>{t[lang].pend}</p>
                    <p style={{ ...statNumber, color: '#f59e0b' }}>{animatedCounts.pending}</p>
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={chartContainer}>
                  <h2 style={chartTitle}>{t[lang].chart}</h2>
                  <div style={{ width: "100%", height: isMobile ? 400 : 500 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        layout="vertical" 
                        data={barData} 
                        margin={{ top: 5, right: 30, left: isMobile ? 110 : 190, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 100]} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={1} // Important: Tick handle karega foreignObject se
                          tick={<WrappedYAxisTick isMobile={isMobile} isCollapsed={isCollapsed} />}
                          interval={0}
                        />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={tooltipStyle} />
                        <Bar dataKey="progress" barSize={isMobile ? 15 : 22} radius={[0, 6, 6, 0]}>
                          {barData.map((entry, i) => (
                            <Cell key={i} fill={getBarColor(entry.progress)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </>
            )}
          </main>
        </div>
      </div>

      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>{t[lang].deptAdmin}</strong>
          </div>
          <nav style={footerLinksWrapper}>
            <Link to="#" style={fLink}>Privacy Policy</Link>
            <span style={fSep}>|</span>
            <Link to="#" style={fLink}>Terms & Conditions</Link>
            <span style={fSep}>|</span>
            <Link to="#" style={fLink}>Accessibility</Link>
            <span style={fSep}>|</span>
            <Link to="#" style={fLink}>Contact Us</Link>
          </nav>
          <p style={copyright}>
            © {new Date().getFullYear()} Designed & Developed by District Administration
          </p>
        </div>
      </footer>
    </div>
  );
}

/* --- Styles remain same --- */
const sidebarStyle = {
  background: 'linear-gradient(180deg, #002147 0%, #003366 100%)',
  color: '#fff',
  position: 'sticky',
  top: 0,
  height: '100vh',
  zIndex: 1000,
  boxShadow: '4px 0 15px rgba(0,0,0,0.1)'
};

const sidebarHeader = { padding: '25px 15px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' };
const deptTitle = { fontSize: '14px', marginTop: '12px', letterSpacing: '0.5px', color: '#fff', fontWeight: '600' };

const menuItemStyle = { 
  display: 'flex', alignItems: 'center', padding: '15px', 
  cursor: 'pointer', gap: '15px', borderRadius: '8px', marginBottom: '4px',
  transition: '0.2s'
};

const topHeaderStyle = { 
  height: '70px', background: '#fff', display: 'flex', alignItems: 'center', 
  justifyContent: 'space-between', padding: '0 25px', position: 'sticky', top: 0, zIndex: 900,
  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
};

const toggleBtnStyle = { background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex' };
const langBtnStyle = { background: '#002147', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' };

const budgetGrid = { display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" };
const budgetCardPrimary = { background: "linear-gradient(135deg, #002147 0%, #004080 100%)", color: "white", padding: "25px", borderRadius: "16px", flex: 1, minWidth: "260px", boxShadow: "0 10px 20px rgba(0,33,71,0.2)" };
const budgetCardSecondary = { background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0", flex: 1, minWidth: "260px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" };
const cardLabel = { fontSize: "12px", textTransform: 'uppercase', opacity: 1, fontWeight: '600', margin: 0 };
const cardValue = { margin: "10px 0 0 0", fontSize: "28px", fontWeight: '800' };

const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' };
const statBox = { background: '#fff', padding: '20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const statLabel = { color: '#64748b', fontSize: '13px', fontWeight: '600', margin: 0 };
const statNumber = { fontSize: '32px', fontWeight: '900', color: '#1e293b', margin: '5px 0' };

const chartContainer = { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' };
const chartTitle = { fontWeight: 800, fontSize: '18px', color: '#1e293b', marginBottom: '25px', textAlign: 'center' };
const tooltipStyle = { borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', padding: '12px' };

const footerStyle = { 
  backgroundColor: "#ffffff", 
  padding: "20px 0", 
  borderTop: "5px solid #002147", 
  width: "100%", 
  position: "relative",
  zIndex: 1100 
};
const footerContainer = { width: "90%", maxWidth: "800px", margin: "0 auto", textAlign: "center" };
const footerBrand = { fontSize: "0.85rem", fontWeight: "700", color: "#333", marginBottom: "8px" };
const footerLinksWrapper = { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "8px", flexWrap: "wrap" };
const fLink = { color: "#002147", textDecoration: "none", fontWeight: "600", fontSize: "0.75rem" };
const fSep = { color: "#ddd", fontSize: "0.75rem" };
const copyright = { fontSize: "0.7rem", color: "#666", margin: 0, borderTop: "1px solid #f0f0f0", paddingTop: "8px" };