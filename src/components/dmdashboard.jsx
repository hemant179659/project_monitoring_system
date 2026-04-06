import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ Custom API instance use karein
import API from "../api/axios"; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  FaTachometerAlt, FaList, FaSignOutAlt,
  FaUserCircle, FaChartBar, FaImages, FaLanguage,
  FaMoneyBillWave, FaWallet, FaCheckCircle
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export default function DMDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  
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
      low: "पिछड़े 5 विभाग"
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
      low: "LOWER 5 PERFORMERS"
    }
  };

  useEffect(() => {
    // ✅ 1. Security Check: Agar token nahi hai toh login pe bhej do
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. District Total Budget Fetch
        const districtRes = await API.get("/department/get-district-total");
        const districtTotalVal = districtRes.data.totalJilaBudget || 0;

        // 2. Department Summary Fetch
        const res = await API.get("/department/budget-summary");
        const data = res.data || [];

        const processedData = data.map(dept => ({
          ...dept,
          utilization: dept.totalBudget > 0 ? parseFloat((dept.totalSpent / dept.totalBudget * 100).toFixed(2)) : 0
        }));

        // 3. Totals Calculation
        const spentSum = processedData.reduce((acc, curr) => acc + curr.totalSpent, 0);
        const remainingSum = districtTotalVal - spentSum;

        setSummaryData(processedData);
        setTotals({
          districtTotal: districtTotalVal,
          totalSpent: spentSum,
          totalRemaining: remainingSum
        });

      } catch (err) {
        console.error("DM Dashboard Error:", err);
        // ✅ 2. 401/403 Error par session clear karke login bhej do
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          navigate("/admin-login", { replace: true });
        } else {
          toast.error(err.response?.data?.message || "डेटा लोड करने में समस्या आई!");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const sortedData = [...summaryData].sort((a, b) => b.utilization - a.utilization);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', fontWeight: 'bold' }}>
        डेटा लोड हो रहा है...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', color: '#000' }}>
      <ToastContainer />
      
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#002147', color: '#fff', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #1a3a5a' }}>
          <FaUserCircle size={50} />
          <h2 style={{ fontSize: '18px', marginTop: '10px' }}>ADMINISTRATION DASHBOARD</h2>
        </div>
        <nav style={{ marginTop: '20px' }}>
          <div style={navLink} onClick={() => navigate("/dmdashboard")}><FaTachometerAlt /> Dashboard</div>
          <div style={navLink} onClick={() => navigate("/admin-project-list")}><FaList /> Project List</div>
          <div style={navLink} onClick={() => navigate("/department-status")}><FaChartBar /> Dept Status</div>
          <div style={navLink} onClick={() => navigate("/projectrecentphotoadmin")}><FaImages /> Photos</div>
          
          {/* ✅ 3. Logout logic with replace: true */}
          <div style={{ ...navLink, color: '#ff4d4f' }} onClick={() => {
            localStorage.clear(); 
            navigate("/admin-login", { replace: true }); 
          }}><FaSignOutAlt /> Logout</div>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontWeight: '900', color: '#000', margin: 0 }}>{t[lang].title}</h1>
          <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} style={toggleBtn}>
            <FaLanguage /> {lang === "hi" ? "English" : "हिंदी"}
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ ...statsCard, borderLeft: '10px solid #0056b3' }}>
            <FaMoneyBillWave size={35} color="#0056b3" />
            <div>
              <p style={cardLabel}>{t[lang].totalB}</p>
              <h2 style={cardValue}>₹ {totals.districtTotal} L</h2>
            </div>
          </div>

          <div style={{ ...statsCard, borderLeft: '10px solid #28a745' }}>
            <FaCheckCircle size={35} color="#28a745" />
            <div>
              <p style={cardLabel}>{t[lang].totalS}</p>
              <h2 style={{ ...cardValue, color: '#28a745' }}>₹ {totals.totalSpent} L</h2>
            </div>
          </div>

          <div style={{ ...statsCard, borderLeft: '10px solid #dc3545' }}>
            <FaWallet size={35} color="#dc3545" />
            <div>
              <p style={cardLabel}>{t[lang].totalR}</p>
              <h2 style={{ ...cardValue, color: '#dc3545' }}>₹ {totals.totalRemaining} L</h2>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div style={tableContainer}>
          <table style={mainTable}>
            <thead>
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
              {summaryData.length > 0 ? summaryData.map((dept, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{dept.department}</td>
                  <td style={tdStyle}>₹{dept.totalBudget}</td>
                  <td style={{ ...tdStyle, color: 'red' }}>₹{dept.remaining}</td>
                  <td style={tdStyle}>{dept.totalProjects}</td>
                  <td style={{ ...tdStyle, color: 'green' }}>{dept.completed}</td>
                  <td style={{ ...tdStyle, color: 'orange' }}>{dept.pending}</td>
                  <td style={tdStyle}>
                    <b style={utilText(dept.utilization)}>{dept.utilization}%</b>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>डेटा उपलब्ध नहीं है।</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Graphs Section */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
          <div style={chartBox}>
            <h4 style={{ textAlign: 'center' }}>{t[lang].top} (%)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sortedData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" fontSize={10} stroke="#000" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={chartBox}>
            <h4 style={{ textAlign: 'center' }}>{t[lang].low} (%)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[...sortedData].reverse().slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" fontSize={10} stroke="#000" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" fill="#dc3545" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Global Styles (No changes here, kept as per your design)
const navLink = { padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #1a3a5a', fontWeight: 'bold' };
const statsCard = { flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const cardLabel = { margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#666' };
const cardValue = { margin: 0, fontSize: '22px', fontWeight: '900' };
const tableContainer = { backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden' };
const mainTable = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { padding: '15px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' };
const tdStyle = { padding: '15px', fontSize: '13px', color: '#000' };
const chartBox = { flex: 1, backgroundColor: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd' };
const toggleBtn = { backgroundColor: '#0056b3', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };
const utilText = (val) => ({ color: val > 70 ? 'green' : val > 40 ? 'orange' : 'red' });