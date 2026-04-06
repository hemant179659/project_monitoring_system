import React, { useState, useEffect } from "react";
// ✅ Tera Custom API instance use kiya
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
import { useNavigate } from "react-router-dom";

export default function BudgetAllocation() {
  const navigate = useNavigate();
  
  // States
  const [totalDistrictBudget, setTotalDistrictBudget] = useState("");
  const [dbTotalDistrict, setDbTotalDistrict] = useState(0); 
  const [department, setDepartment] = useState("");
  const [amount, setAmount] = useState("");
  const [currentAllocated, setCurrentAllocated] = useState(0);
  const [loading, setLoading] = useState(false);

  // Departments List (As per District Plan)
  const departments = ["PWD", "Health", "Education", "Irrigation", "Agriculture", "Rural Development", "Panchayati Raj"];

  // ✅ 1. Admin Protection (Security Check)
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const token = localStorage.getItem("adminToken");
    if (!isAdmin || !token) {
      toast.error("Unauthorized! Please login as Admin.");
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // ✅ 2. Data Fetching using API Instance
  const loadData = async () => {
    try {
      // Fetch Overall District Total
      const resTotal = await API.get("/department/get-district-total");
      const districtTotal = resTotal.data.totalJilaBudget || 0;
      setDbTotalDistrict(districtTotal);
      setTotalDistrictBudget(districtTotal);

      // Fetch Department Summary to calculate already allocated amount
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

  // ✅ 3. Set Overall District Budget (Jila Yojna Total)
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
      loadData(); // Refresh counts
    } catch (err) {
      toast.error("Limit set karne mein problem aayi.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 4. Allocate Budget to Specific Department
  const handleAllocate = async () => {
    if (!department || !amount || amount <= 0) {
      toast.warning("Department aur Amount dono bharna zaroori hai.");
      return;
    }

    // Checking if District Limit is set and exceeded
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
      
      // Cleanup & Refresh
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
      
      <button onClick={() => navigate(-1)} style={backBtnStyle}>
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div style={cardStyle}>
        <h2 style={headerStyle}>
          <FaChartPie style={{ marginRight: '10px', color: '#0056b3' }} />
          District Budget Control
        </h2>

        {/* SECTION 1: DISTRICT OVERALL LIMIT */}
        <div style={sectionBox}>
          <label style={labelStyle}><FaGlobeAmericas color="#0056b3" /> Total District Plan (Lakhs)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="number" 
              value={totalDistrictBudget} 
              onChange={(e) => setTotalDistrictBudget(e.target.value)}
              placeholder="Total Jila Yojna Budget"
              style={inputStyle}
            />
            <button 
              onClick={handleSetDistrictTotal} 
              style={saveBtnStyle}
              disabled={loading}
            >
              {loading ? "..." : "Set"}
            </button>
          </div>
          <div style={statusRow}>
            <span>Allocated: <b>₹{currentAllocated} L</b></span>
            <span>Available: <b style={{ color: (dbTotalDistrict - currentAllocated) < 0 ? '#d32f2f' : '#2e7d32' }}>
              ₹{dbTotalDistrict - currentAllocated} L
            </b></span>
          </div>
        </div>

        <hr style={dividerStyle} />

        {/* SECTION 2: DEPT ALLOCATION */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}><FaBuilding color="#0056b3" /> Choose Department</label>
          <select 
            value={department} 
            onChange={(e) => setDepartment(e.target.value)}
            style={inputStyle}
          >
            <option value="">-- Select Department --</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={labelStyle}><FaMoneyCheckAlt color="#0056b3" /> Allocation Amount (Lakhs)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount for department"
            style={inputStyle}
          />
        </div>

        <button 
          onClick={handleAllocate}
          style={primaryBtnStyle}
          disabled={loading}
        >
          {loading ? "Allocating..." : "Confirm Department Allocation"}
        </button>
      </div>
    </div>
  );
}

// --- Professional Styles ---
const containerStyle = { backgroundColor: "#f4f7f6", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px" };
const cardStyle = { background: "#ffffff", padding: "35px", borderRadius: "12px", width: "100%", maxWidth: "500px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid #e0e0e0" };
const headerStyle = { textAlign: "center", color: "#002147", marginBottom: "30px", fontWeight: "800", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center" };
const sectionBox = { background: "#eef2f7", padding: "18px", borderRadius: "10px", border: "1px solid #d1d9e6" };
const labelStyle = { display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", marginBottom: "8px", color: "#333", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "15px", outline: "none", boxSizing: "border-box" };
const statusRow = { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#444", marginTop: "12px" };
const saveBtnStyle = { background: "#28a745", color: "white", border: "none", padding: "0 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const primaryBtnStyle = { width: "100%", padding: "15px", background: "#0056b3", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", transition: "0.3s" };
const backBtnStyle = { position: "absolute", top: "25px", left: "25px", background: "#fff", color: "#0056b3", border: "1px solid #0056b3", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" };
const dividerStyle = { margin: '25px 0', border: '0', borderTop: '1px solid #eee' };