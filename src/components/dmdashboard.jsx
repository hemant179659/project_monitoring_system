import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios"; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import {
  FaTachometerAlt, FaList, FaSignOutAlt,
  FaUserCircle, FaChartBar, FaImages, FaLanguage,
  FaMoneyBillWave, FaWallet, FaCheckCircle, FaBars, FaArrowLeft, FaTimes
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export default function DMDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const [totals, setTotals] = useState({ 
    districtTotal: 0, 
    totalSpent: 0, 
    totalRemaining: 0 
  });
  
  const [lang, setLang] = useState("hi");

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
      photos: "Photos",
      logout: "Logout"
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const token = localStorage.getItem("adminToken");
    if (!token) { navigate("/admin-login", { replace: true }); return; }

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
        setSummaryData(processedData);
        setTotals({
          districtTotal: districtTotalVal,
          totalSpent: spentSum,
          totalRemaining: districtTotalVal - spentSum
        });
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear(); navigate("/admin-login", { replace: true });
        } else { toast.error("डेटा लोड करने में समस्या आई!"); }
      } finally { setLoading(false); }
    };
    fetchDashboardData();
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const sortedData = [...summaryData].sort((a, b) => b.utilization - a.utilization);

  const SidebarLinks = () => (
    <>
      <div style={navLink} onClick={() => { navigate("/dmdashboard"); setShowMobileMenu(false); }}><FaTachometerAlt /> {(!isCollapsed || isMobile) && <span style={{marginLeft: '15px'}}>{t[lang].dash}</span>}</div>
      <div style={navLink} onClick={() => { navigate("/admin-project-list"); setShowMobileMenu(false); }}><FaList /> {(!isCollapsed || isMobile) && <span style={{marginLeft: '15px'}}>{t[lang].pList}</span>}</div>
      <div style={navLink} onClick={() => { navigate("/department-status"); setShowMobileMenu(false); }}><FaChartBar /> {(!isCollapsed || isMobile) && <span style={{marginLeft: '15px'}}>{t[lang].dStat}</span>}</div>
      <div style={navLink} onClick={() => { navigate("/projectrecentphotoadmin"); setShowMobileMenu(false); }}><FaImages /> {(!isCollapsed || isMobile) && <span style={{marginLeft: '15px'}}>{t[lang].photos}</span>}</div>
      <div style={{ ...navLink, color: '#ff4d4f', marginTop: 'auto' }} onClick={() => { localStorage.clear(); navigate("/admin-login", { replace: true }); }}><FaSignOutAlt /> {(!isCollapsed || isMobile) && <span style={{marginLeft: '15px'}}>{t[lang].logout}</span>}</div>
    </>
  );

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7f6' }}>लोड हो रहा है...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b' }}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* SIDEBAR */}
      {!isMobile && (
        <aside style={{ width: isCollapsed ? '80px' : '260px', backgroundColor: '#002147', color: '#fff', position: 'sticky', top: 0, height: '100vh', transition: '0.3s', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
          <div style={{ padding: '25px 20px', textAlign: 'center', borderBottom: '1px solid #1a3a5a' }}>
            <FaUserCircle size={isCollapsed ? 35 : 55} color="#cbd5e1" />
            {!isCollapsed && <h2 style={{ fontSize: '14px', marginTop: '15px', letterSpacing: '1px', fontWeight: '800' }}>ADMIN PORTAL</h2>}
            <div onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer', marginTop: '15px', background: '#1a3a5a', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>
              {isCollapsed ? <FaBars /> : <FaArrowLeft />}
            </div>
          </div>
          <nav style={{ marginTop: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}><SidebarLinks /></nav>
        </aside>
      )}

      {/* MOBILE DRAWER */}
      {isMobile && showMobileMenu && (
        <div style={drawerOverlay} onClick={() => setShowMobileMenu(false)}>
          <div style={drawerContent} onClick={e => e.stopPropagation()}>
            <div style={{textAlign: 'right', padding: '20px'}}><FaTimes size={24} onClick={() => setShowMobileMenu(false)} /></div>
            <SidebarLinks />
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* MOBILE HEADER */}
        {isMobile && (
            <div style={mobileHeader}>
                <FaBars size={22} onClick={() => setShowMobileMenu(true)} />
                <h2 style={{ fontSize: '16px', margin: 0, fontWeight: '800' }}>DM Dashboard</h2>
                <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} style={langBtnMobile}>
                    {lang === "hi" ? "EN" : "HI"}
                </button>
            </div>
        )}

        <div style={{ flex: 1, padding: isMobile ? '15px' : '30px 40px' }}>
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontWeight: '900', color: '#0f172a', margin: 0, fontSize: '24px' }}>{t[lang].title}</h1>
              <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} style={toggleBtn}>
                <FaLanguage size={20} /> {lang === "hi" ? "English" : "हिंदी"}
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginBottom: '35px' }}>
            <div style={{ ...statsCard, borderTop: '5px solid #2563eb' }}>
              <div style={iconBox}><FaMoneyBillWave size={24} color="#2563eb" /></div>
              <div><p style={cardLabel}>{t[lang].totalB}</p><h2 style={cardValue}>₹ {totals.districtTotal} L</h2></div>
            </div>
            <div style={{ ...statsCard, borderTop: '5px solid #16a34a' }}>
              <div style={{...iconBox, backgroundColor: '#f0fdf4'}}><FaCheckCircle size={24} color="#16a34a" /></div>
              <div><p style={cardLabel}>{t[lang].totalS}</p><h2 style={{ ...cardValue, color: '#16a34a' }}>₹ {totals.totalSpent} L</h2></div>
            </div>
            <div style={{ ...statsCard, borderTop: '5px solid #dc2626' }}>
              <div style={{...iconBox, backgroundColor: '#fef2f2'}}><FaWallet size={24} color="#dc2626" /></div>
              <div><p style={cardLabel}>{t[lang].totalR}</p><h2 style={{ ...cardValue, color: '#dc2626' }}>₹ {totals.totalRemaining} L</h2></div>
            </div>
          </div>

          {/* Table */}
          <div style={{ 
            ...tableContainer, 
            maxHeight: '300px', // Isse lagbhag 5-6 rows dikhengi
            overflowY: 'auto',   // Vertical scroll enable kiya
            position: 'relative'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{width: '100%', borderCollapse: 'collapse', minWidth: '900px'}}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}> {/* Header freeze kiya */}
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
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
                    <tr key={idx} style={rowStyle}>
                      <td style={{ ...tdStyle, fontWeight: '700', color: '#1e293b' }}>{dept.department}</td>
                      <td style={tdStyle}>₹{dept.totalBudget}</td>
                      <td style={{ ...tdStyle, color: '#ef4444', fontWeight: '600' }}>₹{dept.remaining}</td>
                      <td style={tdStyle}>{dept.totalProjects}</td>
                      <td style={{ ...tdStyle, color: '#16a34a', fontWeight: '600' }}>{dept.completed}</td>
                      <td style={{ ...tdStyle, color: '#f59e0b', fontWeight: '600' }}>{dept.pending}</td>
                      <td style={tdStyle}><b style={utilText(dept.utilization)}>{dept.utilization}%</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Graphs Area */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '25px', marginTop: '40px' }}>
  <div style={chartBox}>
    <h4 style={chartTitle}>{t[lang].top} (%)</h4>
    <ResponsiveContainer width="100%" height={450}>
      <BarChart 
        data={sortedData.slice(0, 5)} 
        margin={{ top: 10, right: 10, left: 40, bottom: 60 }} // LEFT margin badha kar 40 kiya
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="department" 
          fontSize={10} 
          interval={0} 
          angle={-40} 
          textAnchor="end"
          height={150}
          axisLine={false} 
          tickLine={false}
          dx={-10} // Labels ko thoda right shift kiya taaki edge se na takrayein
        />
        <YAxis fontSize={10} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: '#f8fafc' }} />
        <Bar dataKey="utilization" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div style={chartBox}>
    <h4 style={chartTitle}>{t[lang].low} (%)</h4>
    <ResponsiveContainer width="100%" height={450}>
      <BarChart 
        data={[...sortedData].reverse().slice(0, 5)} 
        margin={{ top: 10, right: 10, left: 40, bottom: 60 }} // LEFT margin yahan bhi 40 kiya
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="department" 
          fontSize={10} 
          interval={0} 
          angle={-40} 
          textAnchor="end"
          height={150}
          axisLine={false} 
          tickLine={false}
          dx={-10}
        />
        <YAxis fontSize={10} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: '#f8fafc' }} />
        <Bar dataKey="utilization" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
        </div>

        {/* ================= HOME.JSX BALANCED FOOTER ================= */}
        <footer style={footerStyle}>
          <div style={footerContainer}>
            <div style={footerBrand}>
              <strong>{lang === "hi" ? "जिला प्रशासन, उत्तराखंड" : "DISTRICT ADMINISTRATION, UTTARAKHAND"}</strong>
            </div>
            
            <nav style={footerLinks}>
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

// ===================== STYLES =====================

const mobileHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#002147', color: '#fff', position: 'sticky', top: 0, zIndex: 999 };
const langBtnMobile = { background: '#1a3a5a', color: '#fff', border: '1px solid #334155', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' };
const drawerOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000 };
const drawerContent = { width: '280px', height: '100%', backgroundColor: '#002147', color: '#fff', display: 'flex', flexDirection: 'column' };
const navLink = { padding: '16px 25px', cursor: 'pointer', borderBottom: '1px solid #1a3a5a', fontWeight: '600', display: 'flex', alignItems: 'center', fontSize: '14px', color: '#cbd5e1' };
const statsCard = { flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' };
const iconBox = { padding: '12px', backgroundColor: '#eff6ff', borderRadius: '12px' };
const cardLabel = { margin: 0, fontSize: '12px', fontWeight: '800', color: '#000', textTransform: 'uppercase' };
const cardValue = { margin: '5px 0 0', fontWeight: '900', fontSize: '20px', color: '#0f172a' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0' };
const thStyle = { padding: '16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', color: '#000', letterSpacing: '0.05em', fontWeight: '900' };
const tdStyle = { padding: '16px', fontSize: '13px', color: '#334155', whiteSpace: 'nowrap' };
const rowStyle = { borderBottom: '1px solid #f1f5f9', transition: '0.2s' };
const chartBox = { flex: 1, backgroundColor: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const chartTitle = { textAlign: 'center', fontSize: '13px', fontWeight: '900', color: '#000', marginBottom: '20px', textTransform: 'uppercase' };
const toggleBtn = { backgroundColor: '#fff', color: '#2563eb', border: '1.5px solid #e2e8f0', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' };
const utilText = (val) => ({ color: val > 75 ? '#16a34a' : val > 40 ? '#f59e0b' : '#ef4444' });

/* ===================== FOOTER STYLES (HOME.JSX STYLE) ===================== */
const footerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px 0",
  borderTop: "5px solid #21618c",
  width: "100%",
  marginTop: "auto" // यह फुटर को हमेशा नीचे रखता है
};

const footerContainer = {
  width: "90%",
  maxWidth: "550px",
  margin: "0 auto",
  textAlign: "center",
};

const footerBrand = {
  fontSize: "0.85rem",
  fontWeight: "700",
  color: "#333",
  marginBottom: "8px",
};

const footerLinks = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  marginBottom: "8px",
};

const fLink = {
  color: "#21618c",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "0.75rem",
};

const fSep = {
  color: "#ddd",
  fontSize: "0.75rem"
};

const copyright = {
  fontSize: "0.7rem",
  color: "#666",
  margin: 0,
  borderTop: "1px solid #f0f0f0",
  paddingTop: "8px"
};