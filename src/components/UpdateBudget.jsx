import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft, FaEdit, FaExclamationTriangle, FaWallet, FaBuilding } from "react-icons/fa";

export default function UpdateBudget() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [currentBudget, setCurrentBudget] = useState(0);
  const [newBudget, setNewBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
    if (!isAdmin) {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  const fetchCurrentBudget = async (deptName) => {
    if (!deptName) {
      setCurrentBudget(0);
      return;
    }
    try {
      const res = await API.get(`/department/budget/${deptName}`);
      setCurrentBudget(res.data.totalBudget || 0);
    } catch (err) {
      setCurrentBudget(0);
      if (err.response?.status === 404) {
        toast.info("No prior budget set for this department.");
      }
    }
  };

  const handleUpdate = async () => {
    if (!department || !newBudget || newBudget < 0) {
      toast.warning("Please select a department and enter a valid budget.");
      return;
    }

    setLoading(true);
    try {
      await API.put("/department/update-budget", {
        department,
        newBudget: Number(newBudget),
      });
      
      toast.success(`${department} budget updated successfully!`);
      setCurrentBudget(newBudget); 
      setNewBudget("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <ToastContainer position="top-right" autoClose={2500} />

      {/* --- HEADER --- */}
      <header style={headerBox}>
        <div style={headerContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? "10px" : "20px" }}>
            <button onClick={() => navigate(-1)} style={backBtnStyle} title="Go Back">
              <FaArrowLeft />
            </button>
            <div>
              <h1 style={headerTitle}>Budget Management</h1>
              <p style={headerSubtitle}>Financial Allocation & Planning Portal</p>
            </div>
          </div>
          {!isMobile && <FaWallet size={30} color="#21618c" style={{ opacity: 0.8 }} />}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main style={mainContent}>
        <div style={{...cardStyle, width: isMobile ? "100%" : "500px"}}>
          <h2 style={cardHeading}>
            <FaEdit style={{ marginRight: '12px', color: '#2563eb' }} />
            Update Department Budget
          </h2>
          
          <div style={formGroup}>
            <label style={labelStyle}><FaBuilding style={{marginRight: '5px'}}/> Choose Department</label>
            <select 
              value={department} 
              onChange={(e) => {
                setDepartment(e.target.value);
                fetchCurrentBudget(e.target.value);
              }}
              style={inputStyle}
            >
              <option value="">-- Select --</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>

          {department && (
            <div style={infoBox}>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b", fontWeight: '600' }}>
                CURRENT ALLOCATION:
              </p>
              <p style={{ margin: "5px 0 0", fontSize: "1.2rem", fontWeight: "800", color: "#b91c1c" }}>
                ₹ {currentBudget} Lakhs
              </p>
            </div>
          )}

          <div style={formGroup}>
            <label style={labelStyle}>New Budget Amount (in Lakhs)</label>
            <input 
              type="number" 
              value={newBudget} 
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="e.g. 500"
              style={inputStyle}
            />
          </div>

          <button 
            onClick={handleUpdate}
            disabled={loading}
            style={{ 
              ...primaryBtnStyle, 
              background: loading ? "#94a3b8" : "#21618c",
            }}
          >
            {loading ? "Processing..." : "Update Allocation"}
          </button>

          <div style={warningStyle}>
            <FaExclamationTriangle style={{ marginRight: '8px', color: '#f59e0b' }} />
            <span>Note: This will overwrite previous budget data.</span>
          </div>
        </div>
      </main>

      {/* ================= UPDATED PROFESSIONAL FOOTER ================= */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>DISTRICT ADMINISTRATION, UTTARAKHAND</strong>
          </div>
          
          <nav style={footerLinksWrapper}>
            <Link to="/privacy-policy" style={fLink}>Privacy Policy</Link>
            <span style={fSep}>|</span>
            <Link to="/terms-conditions" style={fLink}>Terms & Conditions</Link>
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

// --- Styles ---
const pageWrapper = { 
  minHeight: "100vh", 
  display: "flex", 
  flexDirection: "column", 
  background: "#f1f5f9" 
};

const headerBox = { 
  backgroundColor: "#fff", 
  padding: "15px 0", 
  borderBottom: "1px solid #e2e8f0", 
  position: "sticky", 
  top: 0, 
  zIndex: 100, 
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)" 
};

const headerContainer = { width: "90%", maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" };
const headerTitle = { margin: 0, fontSize: "1.4rem", fontWeight: "800", color: "#0f172a" };
const headerSubtitle = { margin: 0, fontSize: "0.85rem", color: "#64748b", fontWeight: "600" };
const backBtnStyle = { background: "#f8fafc", border: "1px solid #cbd5e1", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#475569" };

const mainContent = { 
  flex: 1, 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  padding: "40px 20px" 
};

const cardStyle = { 
  background: "#fff", 
  padding: "40px", 
  borderRadius: "20px", 
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)", 
  border: "1px solid #e2e8f0",
  boxSizing: "border-box" 
};

const cardHeading = { textAlign: "center", color: "#1e293b", marginBottom: "35px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" };
const formGroup = { marginBottom: "25px" };
const labelStyle = { fontWeight: "700", display: "block", marginBottom: "10px", color: "#334155", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "12px 15px", borderRadius: "10px", border: "2px solid #f1f5f9", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box" };
const infoBox = { background: "#fff1f2", padding: "20px", borderRadius: "12px", marginBottom: "25px", borderLeft: "6px solid #e11d48", textAlign: "center" };
const primaryBtnStyle = { width: "100%", padding: "15px", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", fontSize: "16px", boxShadow: "0 4px 12px rgba(33, 97, 140, 0.2)" };
const warningStyle = { fontSize: "12px", color: "#94a3b8", marginTop: "25px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" };

/* ================= PROFESSIONAL FOOTER STYLES ================= */
const footerStyle = { backgroundColor: "#ffffff", padding: "25px 0", borderTop: "5px solid #21618c", width: '100%', marginTop: 'auto' };
const footerContainer = { width: "90%", maxWidth: "600px", margin: "0 auto", textAlign: "center" };
const footerBrand = { fontSize: "0.9rem", fontWeight: "800", color: "#1e293b", marginBottom: "12px" };
const footerLinksWrapper = { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "12px", flexWrap: "wrap" };
const fLink = { color: "#21618c", textDecoration: "none", fontWeight: "700", fontSize: "0.8rem" };
const fSep = { color: "#cbd5e1", fontSize: "0.8rem" };
const copyright = { fontSize: "0.75rem", color: "#64748b", margin: 0, borderTop: "1px solid #f1f5f9", paddingTop: "12px" };