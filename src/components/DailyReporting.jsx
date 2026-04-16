import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link जोड़ा गया
import API from "../api/axios"; 
import styles from "../styles/dashboard.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DailyReporting() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [progressUpdate, setProgressUpdate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [images, setImages] = useState([]);
  const [lang, setLang] = useState("hi"); // कंसिस्टेंसी के लिए
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

const loggedDept = localStorage.getItem("loggedInDepartment");
  const token = localStorage.getItem("deptToken");
  
  useEffect(() => {
    if (!loggedDept || !token) {
      toast.error("Access Denied. Please login as Admin.");
      navigate("/dept-login", { replace: true });
    }
  }, [navigate]);

  // Layout handle
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Login check
  useEffect(() => {
    if (!loggedDept) {
      toast.error("Please login first");
      navigate("/dept-login");
    }
  }, [loggedDept, navigate]);

  // PROJECTS LOAD
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await API.get(`/department/projects?department=${loggedDept}`);
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Error loading projects:", err);
        toast.error("Failed to load projects");
      }
    };
    if (loggedDept) loadProjects();
  }, [loggedDept]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.warning("Maximum 5 images allowed");
      return;
    }
    const validFiles = files.filter(
      (file) => file.type === "image/jpeg" && file.size <= 2 * 1024 * 1024
    );
    if (validFiles.length !== files.length) {
      toast.warning("Only JPG images ≤ 2MB are allowed");
    }
    setImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleUpdate = async () => {
    if (!selectedProject || progressUpdate === "") {
      toast.warning("Please select a project and enter progress");
      return;
    }

    const formData = new FormData();
    formData.append("progress", progressUpdate);
    formData.append("remarks", remarks || "");
    images.forEach((img) => formData.append("photos", img));

    try {
      const res = await API.put(
        `/department/project/update/${selectedProject}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data.message || "Progress updated successfully!");

      setProgressUpdate("");
      setRemarks("");
      setImages([]);
      setSelectedProject("");

      setTimeout(() => {
        navigate("/dept-dashboard");
      }, 1500);
    } catch (err) {
      console.error("Update error:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to update progress");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: "#f4f6f9" }}>
      <ToastContainer position="top-right" autoClose={2500} />

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '20px 10px' : '40px 20px' }}>
        <div style={{ width: "100%", maxWidth: "650px" }}>
          <h1 style={{ textAlign: "center", marginBottom: "25px", color: "#002147", fontWeight: "800", fontSize: isMobile ? '1.5rem' : '2.2rem' }}>
            Daily Reporting – {loggedDept}
          </h1>

          <div className={styles.reportingCard} style={{ background: "#ffffff", padding: isMobile ? "20px" : "35px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid #e0e0e0" }}>
            <h2 style={{ marginBottom: "20px", color: "#333", fontWeight: 700, fontSize: "1.2rem", borderBottom: "2px solid #f1f1f1", paddingBottom: "10px" }}>Update Project Progress</h2>

            <label style={labelStyle}>Select Project</label>
            <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={inputStyle}>
              <option value="">-- Select Project --</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <label style={labelStyle}>Progress (%)</label>
            <input type="number" min="0" max="100" value={progressUpdate} onChange={(e) => setProgressUpdate(e.target.value)} placeholder="Enter progress (e.g. 45)" style={inputStyle} />

            <label style={labelStyle}>Remarks</label>
            <textarea rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add work details or status remarks" style={{ ...inputStyle, resize: "vertical" }} />

            <label style={labelStyle}>Upload up to 5 JPG Photos (≤2MB each)</label>
            <input type="file" accept="image/jpeg" multiple onChange={handleImageChange} style={{ marginTop: "8px", fontSize: "14px" }} />

            <div style={imageGridStyle}>
              {images.map((img, i) => (
                <div key={i} style={imageBoxStyle}>
                  <img src={URL.createObjectURL(img)} alt="upload" style={imageStyle} />
                  <button onClick={() => removeImage(i)} style={removeBtnStyle}>×</button>
                </div>
              ))}
            </div>

            <button onClick={handleUpdate} style={submitBtnStyle}>Update Progress</button>
          </div>
        </div>
      </main>

      {/* ================= BALANCED FOOTER (SYNCED) ================= */}
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

/* --- Inline Styles --- */
const labelStyle = { fontWeight: 700, color: "#333", display: "block", marginBottom: "5px", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "12px", marginTop: "6px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "15px", outline: "none", boxSizing: "border-box" };
const submitBtnStyle = { marginTop: "25px", width: "100%", background: "#0056b3", color: "#fff", padding: "15px", fontSize: "16px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "0.3s" };
const imageGridStyle = { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "15px" };
const imageBoxStyle = { position: "relative", width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", border: "2px solid #fff" };
const imageStyle = { width: "100%", height: "100%", objectFit: "cover" };
const removeBtnStyle = { position: "absolute", top: "2px", right: "2px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" };

/* ===================== FOOTER STYLES (SYNCED) ===================== */
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