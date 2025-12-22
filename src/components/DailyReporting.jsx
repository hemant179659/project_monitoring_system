import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/dashboard.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DailyReporting() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [progressUpdate, setProgressUpdate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [remainingBudget, setRemainingBudget] = useState("");
  const [images, setImages] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const loggedDept = localStorage.getItem("loggedInDepartment");

  // Handle Resize for layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------------
  // Login check
  // -------------------------------
  useEffect(() => {
    if (!loggedDept) {
      toast.error("Please login first");
      window.location.replace("/dept-login");
    }
  }, [loggedDept]);

  // -------------------------------
  // Load department projects
  // -------------------------------
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await axios.get(
          `/api/department/projects?department=${loggedDept}`
        );
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Error loading projects:", err);
        toast.error("Failed to load projects");
      }
    };
    if (loggedDept) loadProjects();
  }, [loggedDept]);

  // -------------------------------
  // Handle image selection
  // -------------------------------
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

  // -------------------------------
  // Handle project update
  // -------------------------------
  const handleUpdate = async () => {
    if (!selectedProject || progressUpdate === "") {
      toast.warning("Please select a project and enter progress");
      return;
    }

    const formData = new FormData();
    formData.append("progress", progressUpdate);
    formData.append("remarks", remarks || "");
    formData.append("remainingBudget", remainingBudget || "");
    images.forEach((img) => formData.append("photos", img));

    try {
      const res = await axios.put(
        `/api/department/project/update/${selectedProject}`,
        formData
      );

      toast.success(res.data.message || "Progress updated successfully!");

      // Clear state
      setProgressUpdate("");
      setRemarks("");
      setRemainingBudget("");
      setImages([]);
      setSelectedProject("");

      // Delay navigation slightly so user can see the success toast
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
      {/* ✅ Notification Issue Solved: ToastContainer added here */}
      <ToastContainer position="top-right" autoClose={2500} />

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div style={{ width: "100%", maxWidth: "650px" }}>
          <h1
            style={{
              textAlign: "center",
              marginBottom: "25px",
              color: "#222",
              fontWeight: "700",
            }}
          >
            Daily Reporting – {loggedDept}
          </h1>

          <div
            className={styles.reportingCard}
            style={{
              background: "#ffffff",
              padding: "28px",
              borderRadius: "12px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            <h2 style={{ marginBottom: "20px", color: "#333", fontWeight: 600 }}>
              Update Project Progress
            </h2>

            <label style={labelStyle}>Select Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Select Project --</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <label style={labelStyle}>Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={progressUpdate}
              onChange={(e) => setProgressUpdate(e.target.value)}
              placeholder="Enter progress"
              style={inputStyle}
            />

            <label style={labelStyle}>Remaining Budget</label>
            <input
              type="number"
              min="0"
              value={remainingBudget}
              onChange={(e) => setRemainingBudget(e.target.value)}
              placeholder="Enter remaining budget"
              style={inputStyle}
            />

            <label style={labelStyle}>Remarks</label>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks"
              style={{ ...inputStyle, resize: "vertical" }}
            />

            <label style={labelStyle}>
              Upload up to 5 JPG Photos (≤2MB each)
            </label>
            <input
              type="file"
              accept="image/jpeg"
              multiple
              onChange={handleImageChange}
              style={{ marginTop: "8px" }}
            />

            <div style={imageGridStyle}>
              {images.map((img, i) => (
                <div key={i} style={imageBoxStyle}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt="upload"
                    style={imageStyle}
                  />
                  <button
                    onClick={() => removeImage(i)}
                    style={removeBtnStyle}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleUpdate} style={submitBtnStyle}>
              Update Progress
            </button>
          </div>
        </div>
      </main>

      {/* ✅ Footer added at the bottom */}
      <footer style={{
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '3px solid #0056b3',
        padding: '12px 10px',
        color: '#333',
        textAlign: 'center',
        fontFamily: "serif",
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: 'bold', color: '#002147' }}>
            District Administration
          </p>
          <p style={{ margin: '4px 0', fontSize: '0.7rem', opacity: 0.8 }}>
            Designed and Developed by <strong>District Administration</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px',
            fontSize: '0.65rem',
            borderTop: '1px solid #ddd',
            marginTop: '8px',
            paddingTop: '8px'
          }}>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
            <span>|</span>
            <span>Official Digital Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- Inline Styles --- */
const labelStyle = { fontWeight: 600, color: "#222" };
const inputStyle = { width: "100%", padding: "10px", marginTop: "6px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #bbb", color: "#000" };
const submitBtnStyle = { marginTop: "25px", width: "100%", background: "#4CAF50", color: "#fff", padding: "12px", fontSize: "16px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 };
const imageGridStyle = { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "15px" };
const imageBoxStyle = { position: "relative", width: "90px", height: "90px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" };
const imageStyle = { width: "100%", height: "100%", objectFit: "cover" };
const removeBtnStyle = { position: "absolute", top: "4px", right: "4px", background: "rgba(255,77,79,1)", color: "#fff", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontWeight: "bold" };