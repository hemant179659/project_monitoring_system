import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link add kiya gaya
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProject() {
  const navigate = useNavigate();

  // States
  const [name, setName] = useState("");
  const [progress, setProgress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [designation, setDesignation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [budget, setBudget] = useState("");
  const [remarks, setRemarks] = useState("");
  const [lang, setLang] = useState("en"); // Footer consistency ke liye

  const [totalAllocated, setTotalAllocated] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

const loggedDept = localStorage.getItem("loggedInDepartment");
  const token = localStorage.getItem("deptToken");
  
  useEffect(() => {
    if (!loggedDept || !token) {
      toast.error("Access Denied. Please login as Admin.");
      navigate("/dept-login", { replace: true });
    }
  }, [navigate]);

  // Fetch Budget Info
  useEffect(() => {
    const fetchBudgetInfo = async () => {
      if (!loggedDept) return;
      try {
        const res = await API.get(`/department/budget-summary`);
        const deptData = res.data.find(d => d.department === loggedDept);
        if (deptData) {
          setTotalAllocated(deptData.totalBudget);
          setRemainingBudget(deptData.remaining);
        }
      } catch (err) {
        console.error("Budget fetch error:", err);
        if(err.response?.status === 401) {
             toast.error("Session expired. Please login again.");
             navigate("/dept-login");
        }
      }
    };
    fetchBudgetInfo();
  }, [loggedDept, navigate]);

  useEffect(() => {
    if (!loggedDept) {
      toast.error("You must log in first");
      navigate("/dept-login", { replace: true });
    }
  }, [loggedDept, navigate]);

  const handleAddProject = async () => {
    const progressValue = Number(progress);
    const budgetValue = Number(budget);

    if (!name || !startDate || !endDate || !contactPerson || !designation || !contactNumber || 
        progress === "" || isNaN(progressValue) || progressValue < 0 || progressValue > 100 || 
        budget === "" || isNaN(budgetValue) || budgetValue <= 0) {
      toast.warning("Please fill all fields correctly.");
      return;
    }

    if (budgetValue > remainingBudget) {
      toast.error(`Limit Exceeded! Only ₹${remainingBudget} Lakhs remaining.`);
      return;
    }

    try {
      await API.post("/department/add-project", {
        name,
        progress: progressValue,
        startDate,
        endDate,
        department: loggedDept,
        contactPerson,
        designation,
        contactNumber,
        budgetAllocated: budgetValue,
        remarks,
      });

      toast.success("Project added successfully!");
      setTimeout(() => navigate("/dept-dashboard", { replace: true }), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add project");
    }
  };

  // --- Styles ---
  const mainContainerStyle = { display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f6f9" };
  const formWrapperStyle = { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px" };
  const formStyle = { background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "600px" };
  const inputGroupStyle = { display: "flex", flexDirection: "column", marginBottom: "15px" };
  const labelStyle = { marginBottom: "6px", fontWeight: 600, color: "#333" };
  const inputStyle = { padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" };
  const textareaStyle = { ...inputStyle, minHeight: "80px", resize: "vertical" };
  const buttonStyle = { marginTop: "15px", padding: "12px", width: "100%", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "16px" };

  return (
    <div style={mainContainerStyle}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div style={formWrapperStyle}>
        <div style={formStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#000", fontWeight: 700 }}>Add Project</h2>
          
          <div style={{ display: "flex", justifyContent: "space-between", background: "#eef2f7", padding: "12px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #d1d9e6" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#555", display: "block" }}>Total Allocated</span>
              <strong style={{ color: "#002147" }}>₹{totalAllocated} L</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: "#555", display: "block" }}>Remaining Balance</span>
              <strong style={{ color: remainingBudget < (totalAllocated * 0.1) ? "red" : "green" }}>₹{remainingBudget} L</strong>
            </div>
          </div>

          <div style={inputGroupStyle}><label style={labelStyle}>Project Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} /></div>
          <div style={inputGroupStyle}><label style={labelStyle}>Progress (%)</label><input type="number" value={progress} onChange={(e) => setProgress(e.target.value)} style={inputStyle} /></div>
          <div style={inputGroupStyle}><label style={labelStyle}>Start Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} /></div>
          <div style={inputGroupStyle}><label style={labelStyle}>Estimated End Date</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} /></div>
          <div style={inputGroupStyle}><label style={labelStyle}>Contact Person Name</label><input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} style={inputStyle} /></div>
          <div style={inputGroupStyle}><label style={labelStyle}>Designation</label><input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} style={inputStyle} /></div>
          <div style={inputGroupStyle}><label style={labelStyle}>Contact Number</label><input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} style={inputStyle} /></div>
          <div style={inputGroupStyle}><label style={labelStyle}>Budget Allocated (in lakhs)</label><input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} style={{...inputStyle, borderColor: Number(budget) > remainingBudget ? "red" : "#ccc"}} /></div>
          <div style={inputGroupStyle}><label style={labelStyle}>Remarks (optional)</label><textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} style={textareaStyle}></textarea></div>

          <button style={{...buttonStyle, background: "#4CAF50"}} onClick={handleAddProject}>Add Project</button>
        </div>
      </div>

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

/* ===================== FOOTER STYLES ===================== */
const footerStyle = {
  position: "relative",
  zIndex: 1,
  backgroundColor: "#ffffff",
  padding: "15px 0",
  borderTop: "5px solid #21618c",
  marginTop: "auto" // Isse footer hamesha bottom par rahega
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