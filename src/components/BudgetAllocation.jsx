import React, { useState, useEffect } from "react";
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaGlobeAmericas, 
  FaBuilding, 
  FaMoneyCheckAlt, 
  FaChartPie, 
  FaArrowLeft 
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom"; // Link जोड़ा गया

export default function BudgetAllocation() {
  const navigate = useNavigate();
  
  // States
  const [totalDistrictBudget, setTotalDistrictBudget] = useState("");
  const [dbTotalDistrict, setDbTotalDistrict] = useState(0); 
  const [department, setDepartment] = useState("");
  const [amount, setAmount] = useState("");
  const [currentAllocated, setCurrentAllocated] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [lang, setLang] = useState("hi"); // कंसिस्टेंसी के लिए

  // Resize Listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const departments = ["District Industry Centre",
  "District Horticulture Office",
  "Chief Agriculture Office",
  "Agriculture Soil Conservation Office (Rudrapur)",
  "Agriculture Soil Conservation Office (Kashipur)",
  "Minor Irrigation Department",
  "District Development Office",
  "District Panchayati Raj Office",
  "Youth Welfare PRD Department",
  "Chief Veterinary Office",
  "Dairy Development Department",
  "Cooperative Societies Office",
  "District Sports Office",
  "Cane Commissioner Office",
  "Chief Medical Office",
  "Ayurvedic Yunani Office",
  "Homeopathy Medical Office",
  "Economic Statistics Office",
  "District Programme Office",
  "District Probation Office",
  "District Magistrate (Grants)",
  "District Magistrate Office",
  "PWD (PD) Rudrapur",
  "PWD (CD) Kashipur",
  "PWD (CD) Khatima",
  "Fisheries Department",
  "District Education Office",
  "Elementary Education Office",
  "District Employment Office",
  "District Social Welfare Office",
  "District Information Office",
  "Irrigation Division (Rudrapur)",
  "Irrigation Division (Kashipur)",
  "Irrigation Division (Sitarganj)",
  "Tubewell Division (Bazpur)"];

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const token = localStorage.getItem("destoToken") ;
    if (!isAdmin || !token) {
      toast.error("Unauthorized! Please login as Admin.");
      navigate("/desto-login", { replace: true });
    }
  }, [navigate]);

  const loadData = async () => {
    try {
      const resTotal = await API.get("/department/get-district-total");
      const districtTotal = resTotal.data.totalJilaBudget || 0;
      setDbTotalDistrict(districtTotal);
      setTotalDistrictBudget(districtTotal);

      const resSum = await API.get("/department/budget-summary");
      const totalAllocated = (resSum.data || []).reduce((sum, d) => sum + (Number(d.totalBudget) || 0), 0);
      setCurrentAllocated(totalAllocated);
    } catch (err) {
      console.error("Data loading error:", err);
      if (err.response?.status !== 401) {
        toast.error("Database se budget details nahi mil payi!");
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSetDistrictTotal = async () => {
    if (!totalDistrictBudget || totalDistrictBudget <= 0) {
      toast.warning("Kripya valid budget amount bharein.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/department/set-district-total", {
        total: Number(totalDistrictBudget)
      });
      setDbTotalDistrict(Number(totalDistrictBudget));
      toast.success("District Total Budget Update ho gaya!");
      loadData(); 
    } catch (err) {
      toast.error("Limit set karne mein problem aayi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = async () => {
    if (!department || !amount || amount <= 0) {
      toast.warning("Department aur Amount dono bharna zaroori hai.");
      return;
    }
    const newTotal = currentAllocated + Number(amount);
    if (dbTotalDistrict > 0 && newTotal > dbTotalDistrict) {
      const bachaHua = dbTotalDistrict - currentAllocated;
      toast.error(`Limit Exceeded! District ke paas sirf ₹${bachaHua} L bache hain.`);
      return;
    }

    setLoading(true);
    try {
      await API.post("/department/allocate-budget", {
        department,
        totalBudget: Number(amount),
      });
      toast.success(`${department} ko ₹${amount} L successfully allocate hue.`);
      setAmount("");
      setDepartment("");
      loadData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Allocation Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <ToastContainer position="top-center" autoClose={2500} />
      
      <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? "10px" : "40px" }}>
        
        <button onClick={() => navigate(-1)} style={{
          ...backBtnStyle, 
          position: isMobile ? "static" : "absolute", 
          left: "20px",
          top: "20px",
          marginBottom: isMobile ? "15px" : "0",
          alignSelf: isMobile ? "flex-start" : "auto"
        }}>
          <FaArrowLeft /> Back
        </button>

        <div style={{
          ...cardStyle, 
          padding: isMobile ? "20px" : "35px",
          marginTop: isMobile ? "0" : "20px"
        }}>
          <h2 style={{...headerStyle, fontSize: isMobile ? "18px" : "22px"}}>
            <FaChartPie style={{ marginRight: '10px', color: '#0056b3' }} />
            District Budget Control
          </h2>

          {/* SECTION 1: DISTRICT OVERALL LIMIT */}
          <div style={sectionBox}>
            <label style={labelStyle}><FaGlobeAmericas color="#0056b3" /> Total Plan (Lakhs)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="number" 
                value={totalDistrictBudget} 
                onChange={(e) => setTotalDistrictBudget(e.target.value)}
                placeholder="Total Budget"
                style={{...inputStyle, flex: 1}}
              />
              <button 
                onClick={handleSetDistrictTotal} 
                style={{...saveBtnStyle, padding: isMobile ? "0 15px" : "0 20px"}}
                disabled={loading}
              >
                {loading ? "..." : "Set"}
              </button>
            </div>
            <div style={{...statusRow, flexDirection: isMobile ? 'column' : 'row', gap: '5px'}}>
              <span>Allocated: <b>₹{currentAllocated} L</b></span>
              <span>Available: <b style={{ color: (dbTotalDistrict - currentAllocated) < 0 ? '#d32f2f' : '#2e7d32' }}>
                ₹{dbTotalDistrict - currentAllocated} L
              </b></span>
            </div>
          </div>

          <hr style={dividerStyle} />

          {/* SECTION 2: DEPT ALLOCATION */}
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}><FaBuilding color="#0056b3" /> Department</label>
            <select 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Select --</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}><FaMoneyCheckAlt color="#0056b3" /> Amount (Lakhs)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              style={inputStyle}
            />
          </div>

          <button 
            onClick={handleAllocate}
            style={{...primaryBtnStyle, fontSize: isMobile ? "14px" : "16px"}}
            disabled={loading}
          >
            {loading ? "Allocating..." : "Confirm Allocation"}
          </button>
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
  );
}

// --- Professional Styles ---
const containerStyle = { 
  backgroundColor: "#f4f7f6", 
  minHeight: "100vh", 
  display: "flex", 
  flexDirection: "column" 
};

const cardStyle = { background: "#ffffff", borderRadius: "12px", width: "95%", maxWidth: "500px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid #e0e0e0", boxSizing: "border-box" };
const headerStyle = { textAlign: "center", color: "#002147", marginBottom: "25px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" };
const sectionBox = { background: "#eef2f7", padding: "15px", borderRadius: "10px", border: "1px solid #d1d9e6" };
const labelStyle = { display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", marginBottom: "8px", color: "#333", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "15px", outline: "none", boxSizing: "border-box" };
const statusRow = { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#444", marginTop: "12px" };
const saveBtnStyle = { background: "#28a745", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const primaryBtnStyle = { width: "100%", padding: "15px", background: "#0056b3", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", transition: "0.3s" };
const backBtnStyle = { background: "#fff", color: "#0056b3", border: "1px solid #0056b3", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", zIndex: 10 };
const dividerStyle = { margin: '20px 0', border: '0', borderTop: '1px solid #eee' };

/* ===================== FOOTER STYLES ===================== */
const footerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px 0",
  borderTop: "5px solid #21618c",
  marginTop: "auto"
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

const footerLinksWrapper = {
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

const fSep = { color: "#ddd", fontSize: "0.75rem" };

const copyright = {
  fontSize: "0.7rem",
  color: "#666",
  margin: 0,
  borderTop: "1px solid #f0f0f0",
  paddingTop: "8px"
};