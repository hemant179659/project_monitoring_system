import React, { useState, useEffect } from "react";
// ✅ Tera Custom API instance
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UpdateBudget() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [currentBudget, setCurrentBudget] = useState(0);
  const [newBudget, setNewBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const departments = ["PWD", "Health", "Education", "Irrigation", "Agriculture", "Rural Development", "Panchayati Raj"];

  // ✅ 1. Protection Logic
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // ✅ 2. Fetch Current Budget (Using API Instance)
  const fetchCurrentBudget = async (deptName) => {
    if (!deptName) {
      setCurrentBudget(0);
      return;
    }
    try {
      // Backend route update kiya tere API setup ke hisaab se
      const res = await API.get(`/department/budget/${deptName}`);
      setCurrentBudget(res.data.totalBudget || 0);
    } catch (err) {
      setCurrentBudget(0);
      // Agar 404 aaye matlab pehle kabhi allocate nahi hua
      if (err.response?.status === 404) {
        toast.info("Is vibhag ka pehle se koi budget set nahi hai.");
      }
    }
  };

  // ✅ 3. Update Budget Logic
  const handleUpdate = async () => {
    if (!department || !newBudget || newBudget < 0) {
      toast.warning("Kripya vibhag select karein aur sahi budget bharein.");
      return;
    }

    setLoading(true);
    try {
      await API.put("/department/update-budget", {
        department,
        newBudget: Number(newBudget),
      });
      
      toast.success(`${department} ka budget update ho gaya!`);
      setCurrentBudget(newBudget); 
      setNewBudget("");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Update fail ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <ToastContainer position="top-center" autoClose={2500} />
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} style={backBtnStyle}>
        <FaArrowLeft /> Back
      </button>
      
      <div style={cardStyle}>
        <h2 style={headerStyle}>
          <FaEdit style={{ marginRight: '10px' }} />
          Update Dept Budget
        </h2>
        
        {/* Department Selection */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Select Department</label>
          <select 
            value={department} 
            onChange={(e) => {
              setDepartment(e.target.value);
              fetchCurrentBudget(e.target.value);
            }}
            style={inputStyle}
          >
            <option value="">-- Choose Department --</option>
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>

        {/* Current Info Display */}
        {department && (
          <div style={infoBox}>
            <p style={{ margin: 0, fontSize: "14px", color: "#444" }}>
              Presently Allocated: <strong style={{fontSize: "16px", color: "#d32f2f"}}>₹{currentBudget} Lakhs</strong>
            </p>
          </div>
        )}

        {/* New Budget Input */}
        <div style={{ marginBottom: "25px" }}>
          <label style={labelStyle}>New Total Budget (Lakhs)</label>
          <input 
            type="number" 
            value={newBudget} 
            onChange={(e) => setNewBudget(e.target.value)}
            placeholder="Enter revised amount"
            style={inputStyle}
          />
        </div>

        {/* Update Button */}
        <button 
          onClick={handleUpdate}
          disabled={loading}
          style={{ 
            ...primaryBtnStyle, 
            background: loading ? "#94a3b8" : "#d32f2f" 
          }}
        >
          {loading ? "Processing..." : "Confirm & Update Budget"}
        </button>

        <div style={warningStyle}>
          <FaExclamationTriangle style={{ marginRight: '5px' }} />
          <span>Careful: This will overwrite previous allocations for this department.</span>
        </div>
      </div>
    </div>
  );
}

// --- Styles (Matching your DPMS Theme) ---
const containerStyle = { 
  backgroundColor: "#0a192f", 
  minHeight: "100vh", 
  display: "flex", 
  flexDirection: "column",
  justifyContent: "center", 
  alignItems: "center",
  padding: "20px"
};

const cardStyle = { 
  background: "#ffffff", 
  padding: "35px", 
  borderRadius: "15px", 
  width: "100%", 
  maxWidth: "450px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
};

const headerStyle = { 
  textAlign: "center", 
  color: "#1e293b", 
  marginBottom: "30px",
  fontWeight: "900",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const labelStyle = { 
  fontWeight: "700", 
  display: "block", 
  marginBottom: "8px", 
  color: "#334155",
  fontSize: "14px"
};

const inputStyle = { 
  width: "100%", 
  padding: "12px", 
  borderRadius: "8px", 
  border: "2px solid #e2e8f0",
  outline: "none",
  color: "#000",
  boxSizing: "border-box"
};

const infoBox = { 
  background: "#fee2e2", 
  padding: "15px", 
  borderRadius: "8px", 
  marginBottom: "20px",
  borderLeft: "5px solid #d32f2f" 
};

const primaryBtnStyle = { 
  width: "100%", 
  padding: "14px", 
  color: "#fff", 
  border: "none", 
  borderRadius: "8px", 
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)"
};

const backBtnStyle = {
  position: "absolute",
  top: "30px",
  left: "30px",
  background: "transparent",
  color: "#fff",
  border: "1px solid #fff",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "bold"
};

const warningStyle = { 
  fontSize: "11px", 
  color: "#64748b", 
  marginTop: "20px", 
  textAlign: "center", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center" 
};