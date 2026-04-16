import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link जोड़ा गया
import API from "../api/axios"; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  FaTachometerAlt, FaList, FaSignOutAlt,
  FaUserCircle, FaChartBar, FaImages, FaLanguage,
  FaMoneyBillWave, FaWallet, FaCheckCircle, FaBars, FaArrowLeft
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const [totals, setTotals] = useState({ 
    districtTotal: 0, 
    totalSpent: 0, 
    totalRemaining: 0 
  });
  
  const [lang, setLang] = useState("hi");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) setIsCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = {
    hi: {
      title: "जिला योजना (Jila Yojna) - मुख्य डैशबोर्ड",
      totalB: "कुल जिला बजट",
      totalS: "कुल खर्च (SPENT)",
      totalR: "कुल अवशेष (REMAINING)",
      dept: "विभाग का नाम",
      budget: "बजट (लाख)",
      shesh: "शेष (लाख)",
      projects: "कुल प्रोजेक्ट्स",
      purn: "पूर्ण",
      lambit: "लंबित",
      util: "उपयोग %",
      top: "टॉप 5 विभाग",
      low: "पिछड़े 5 विभाग",
      dash: "डैशबोर्ड",
      pList: "प्रोजेक्ट लिस्ट",
      dStat: "विभाग स्थिति",
      bAlloc: "बजट आवंटन",
      uBudg: "बजट अपडेट",
      photos: "फोटो",
      logout: "लॉगआउट"
    },
    en: {
      title: "District Planning - Main Dashboard",
      totalB: "DISTRICT TOTAL",
      totalS: "TOTAL SPENT",
      totalR: "TOTAL REMAINING",
      dept: "Department Name",
      budget: "Budget (L)",
      shesh: "Remaining (L)",
      projects: "Total Projects",
      purn: "Completed",
      lambit: "Pending",
      util: "Utilization %",
      top: "TOP 5 PERFORMERS",
      low: "LOWER 5 PERFORMERS",
      dash: "Dashboard",
      pList: "Project List",
      dStat: "Dept Status",
      bAlloc: "Budget Allocation",
      uBudg: "Update Budget",
      photos: "Photos",
      logout: "Logout"
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("destoToken");
    if (!token) {
      navigate("/desto-login", { replace: true });
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const districtRes = await API.get("/department/get-district-total");
        const districtTotalVal = districtRes.data.totalJilaBudget || 0;
        const res = await API.get("/department/budget-summary");
        const data = res.data || [];

        const processedData = data.map(dept => ({
          ...dept,
          utilization: dept.totalBudget > 0 ? parseFloat((dept.totalSpent / dept.totalBudget * 100).toFixed(2)) : 0
        }));

        const spentSum = processedData.reduce((acc, curr) => acc + curr.totalSpent, 0);
        const remainingSum = districtTotalVal - spentSum;

        setSummaryData(processedData);
        setTotals({
          districtTotal: districtTotalVal,
          totalSpent: spentSum,
          totalRemaining: remainingSum
        });

      } catch (err) {
        console.error("Dashboard Error:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/desto-login", { replace: true });
        } else {
          toast.error(err.response?.data?.message || "Data load error!");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const sortedData = [...summaryData].sort((a, b) => b.utilization - a.utilization);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontWeight: 'bold' }}>लोड हो रहा है...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <ToastContainer />
      
      {/* Sidebar */}
      <aside style={{ 
        width: isMobile ? '100%' : (isCollapsed ? '80px' : '250px'), 
        backgroundColor: '#002147', 
        color: '#fff', 
        position: isMobile ? 'relative' : 'sticky', 
        top: 0, 
        height: isMobile ? 'auto' : '100vh',
        transition: 'width 0.3s ease-in-out',
        zIndex: 10
      }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #1a3a5a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUserCircle size={30} />
            {(!isCollapsed || isMobile) && <span style={{ fontSize: '14px', fontWeight: 'bold' }}>DESTO ADMIN</span>}
          </div>
          <div onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer', background: '#1a3a5a', padding: '5px 10px', borderRadius: '5px' }}>
            {isCollapsed ? <FaBars /> : <FaArrowLeft />}
          </div>
        </div>

        <nav style={{ display: (isMobile && isCollapsed) ? 'none' : 'block', marginTop: '10px' }}>
          <div style={navLink} onClick={() => navigate("/admin-dashboard")}><FaTachometerAlt /> {!isCollapsed && <span style={{marginLeft: '10px'}}>{t[lang].dash}</span>}</div>
          <div style={navLink} onClick={() => navigate("/desto-all-projects")}><FaList /> {!isCollapsed && <span style={{marginLeft: '10px'}}>{t[lang].pList}</span>}</div>
          <div style={navLink} onClick={() => navigate("/department-status")}><FaChartBar /> {!isCollapsed && <span style={{marginLeft: '10px'}}>{t[lang].dStat}</span>}</div>
          <div style={navLink} onClick={() => navigate("/budgetallocation")}><FaMoneyBillWave /> {!isCollapsed && <span style={{marginLeft: '10px'}}>{t[lang].bAlloc}</span>}</div>
          <div style={navLink} onClick={() => navigate("/update-budget")}><FaWallet /> {!isCollapsed && <span style={{marginLeft: '10px'}}>{t[lang].uBudg}</span>}</div>
          <div style={navLink} onClick={() => navigate("/projectrecentphotoadmin")}><FaImages /> {!isCollapsed && <span style={{marginLeft: '10px'}}>{t[lang].photos}</span>}</div>
          <div style={{ ...navLink, color: '#ff4d4f' }} onClick={() => { localStorage.clear(); navigate("/desto-login", { replace: true }); }}>
            <FaSignOutAlt /> {!isCollapsed && <span style={{marginLeft: '10px'}}>{t[lang].logout}</span>}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: isMobile ? '15px' : '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontWeight: '900', color: '#000', margin: 0, fontSize: isMobile ? '18px' : '24px' }}>{t[lang].title}</h1>
            <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} style={toggleBtn}>
              <FaLanguage /> {lang === "hi" ? "EN" : "HI"}
            </button>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '15px', marginBottom: '30px' }}>
            <div style={{ ...statsCard, borderLeft: '10px solid #0056b3' }}>
              <FaMoneyBillWave size={30} color="#0056b3" />
              <div><p style={cardLabel}>{t[lang].totalB}</p><h2 style={cardValue}>₹ {totals.districtTotal} L</h2></div>
            </div>
            <div style={{ ...statsCard, borderLeft: '10px solid #28a745' }}>
              <FaCheckCircle size={30} color="#28a745" />
              <div><p style={cardLabel}>{t[lang].totalS}</p><h2 style={{ ...cardValue, color: '#28a745' }}>₹ {totals.totalSpent} L</h2></div>
            </div>
            <div style={{ ...statsCard, borderLeft: '10px solid #dc3545' }}>
              <FaWallet size={30} color="#dc3545" />
              <div><p style={cardLabel}>{t[lang].totalR}</p><h2 style={{ ...cardValue, color: '#dc3545' }}>₹ {totals.totalRemaining} L</h2></div>
            </div>
          </div>

          {/* Table */}
         <div style={{ 
            ...tableContainer, 
            maxHeight: '300px', // Isse lagbhag 5-6 rows hi dikhengi
            overflowY: 'auto',   // Vertical scroll enable kiya
            position: 'relative' 
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}> {/* Header ko freeze kiya */}
                <tr style={{ backgroundColor: '#0056b3', color: '#fff' }}>
                  <th style={thStyle}>{t[lang].dept}</th>
                  <th style={thStyle}>{t[lang].budget}</th>
                  <th style={thStyle}>{t[lang].shesh}</th>
                  <th style={thStyle}>{t[lang].projects}</th>
                  <th style={thStyle}>{t[lang].purn}</th>
                  <th style={thStyle}>{t[lang].lambit}</th>
                  <th style={thStyle}>{t[lang].util}</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((dept, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{dept.department}</td>
                    <td style={tdStyle}>₹{dept.totalBudget}</td>
                    <td style={{ ...tdStyle, color: 'red' }}>₹{dept.remaining}</td>
                    <td style={tdStyle}>{dept.totalProjects}</td>
                    <td style={{ ...tdStyle, color: 'green' }}>{dept.completed}</td>
                    <td style={{ ...tdStyle, color: 'orange' }}>{dept.pending}</td>
                    <td style={tdStyle}><b style={utilText(dept.utilization)}>{dept.utilization}%</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Graphs */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginTop: '30px' }}>
            
            {/* Top Performers Chart */}
            <div style={chartBox}>
              <h4 style={{ 
                textAlign: 'center', 
                color: '#000000', 
                fontWeight: '900', 
                fontSize: '18px', 
                marginBottom: '15px' 
              }}>{t[lang].top} (%)</h4>
              
              <ResponsiveContainer width="100%" height={450}>
                <BarChart 
                  data={sortedData.slice(0, 5)} 
                  margin={{ top: 10, right: 10, left: 40, bottom: 60 }} // Left margin 40 aur Bottom 60 kiya
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="department" 
                    fontSize={10} 
                    interval={0} 
                    angle={-40} 
                    textAnchor="end"
                    height={150} // Labels ke liye reserved space
                    axisLine={false} 
                    tickLine={false}
                    dx={-10} // Left shift fix
                  />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="utilization" fill="#28a745" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Low Performers Chart */}
            <div style={chartBox}>
              <h4 style={{ 
                textAlign: 'center', 
                color: '#000000', 
                fontWeight: '900', 
                fontSize: '18px', 
                marginBottom: '15px' 
              }}>{t[lang].low} (%)</h4>
              
              <ResponsiveContainer width="100%" height={450}>
                <BarChart 
                  data={[...sortedData].reverse().slice(0, 5)} 
                  margin={{ top: 10, right: 10, left: 40, bottom: 60 }} // Left margin 40 aur Bottom 60 kiya
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="department" 
                    fontSize={10} 
                    interval={0} 
                    angle={-40} 
                    textAnchor="end"
                    height={150} // Labels ke liye reserved space
                    axisLine={false} 
                    tickLine={false}
                    dx={-10} // Left shift fix
                  />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="utilization" fill="#dc3545" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
          </div>
        </main>

        {/* ================= BALANCED FOOTER ================= */}
        <footer style={footerStyle}>
          <div style={footerContainer}>
            <div style={footerBrand}>
              <strong>{lang === "hi" ? "जिला प्रशासन, उत्तराखंड" : "DISTRICT ADMINISTRATION, UTTARAKHAND"}</strong>
            </div>
            <nav style={footerLinksWrapper}>
              <Link to="/privacy" style={fLink}>Privacy Policy</Link>
              <span style={fSep}>|</span>
              <Link to="/terms" style={fLink}>Terms & Conditions</Link>
              <span style={fSep}>|</span>
              <Link to="/accessibility" style={fLink}>Accessibility</Link>
              <span style={fSep}>|</span>
              <Link to="/contact" style={fLink}>Contact Us</Link>
            </nav>
            <p style={copyright}>
              © {new Date().getFullYear()} Designed & Developed by District Administration
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Sidebar Link Style
const navLink = { padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #1a3a5a', fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: '14px' };

// Stats Card Style
const statsCard = { flex: 1, backgroundColor: '#fff', padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const cardLabel = { margin: 0, fontSize: '11px', fontWeight: 'bold', opacity: 1,color: '#666' };
const cardValue = { 
  margin: '5px 0 0 0', 
  fontWeight: '900', 
  fontSize: '24px',       // वैल्यू को और उभारा
  color: '#002147'        // गहरा नीला
};

// Table Styles
const tableContainer = { backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflowX: 'auto' };
const thStyle = { padding: '15px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const tdStyle = { padding: '15px', fontSize: '13px', color: '#000', whiteSpace: 'nowrap' };

const chartBox = { flex: 1, backgroundColor: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd' };
const toggleBtn = { backgroundColor: '#0056b3', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' };
const utilText = (val) => ({ color: val > 70 ? 'green' : val > 40 ? 'orange' : 'red' });

/* ===================== FOOTER STYLES ===================== */
const footerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px 0",
  borderTop: "5px solid #21618c",
  width: "100%"
};

const footerContainer = {
  width: "90%",
  maxWidth: "550px",
  margin: "0 auto",
  textAlign: "center",
};

const footerBrand = {
  fontSize: "0.8rem",
  fontWeight: "700",
  color: "#333",
  marginBottom: "5px",
};

const footerLinksWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  marginBottom: "5px",
};

const fLink = {
  color: "#21618c",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "0.7rem",
};

const fSep = { color: "#ddd", fontSize: "0.7rem" };

const copyright = {
  fontSize: "0.65rem",
  color: "#666",
  margin: 0,
  borderTop: "1px solid #f0f0f0",
  paddingTop: "5px"
};