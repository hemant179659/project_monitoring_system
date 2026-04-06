import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ Tera Custom API instance
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBuilding, FaImages, FaArrowLeft, FaDownload, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ProjectPhotoAdmin() {
  const navigate = useNavigate();
  const [deptProjects, setDeptProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState({
    images: [],
    index: 0,
    zoom: false,
  });

  // ✅ 1. Admin Protection Logic
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const token = localStorage.getItem("adminToken");
    if (!isAdmin || !token) {
      toast.error("Access Denied! Please login as Admin.");
      navigate("/desto-login", { replace: true });
    }
  }, [navigate]);

  // ✅ 2. Load all projects using Custom API Instance
  useEffect(() => {
    const loadAllProjects = async () => {
      setLoading(true);
      try {
        // Query param 'all=true' ke saath fetch kar rahe hain
        const res = await API.get("/department/projects?all=true");
        const projects = res.data.projects || [];

        // Grouping projects by department (Sirf wahi jinme photos hain)
        const grouped = projects.reduce((acc, p) => {
          if (p.photos && p.photos.length > 0) {
            if (!acc[p.department]) acc[p.department] = [];
            acc[p.department].push(p);
          }
          return acc;
        }, {});

        setDeptProjects(grouped);
      } catch (err) {
        console.error("Gallery Load Error:", err);
        if (err.response?.status !== 401) {
          toast.error("Photos load karne mein dikkat aayi.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAllProjects();
  }, []);

  // 🔍 Preview Handlers
  const nextImage = () =>
    setPreview((p) => ({
      ...p,
      index: (p.index + 1) % p.images.length,
      zoom: false,
    }));

  const prevImage = () =>
    setPreview((p) => ({
      ...p,
      index: (p.index - 1 + p.images.length) % p.images.length,
      zoom: false,
    }));

  const closePreview = () => setPreview({ images: [], index: 0, zoom: false });

  const currentImage = preview.images[preview.index];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: "#f8fafc" }}>
      <ToastContainer position="top-center" autoClose={2000} />

      {/* HEADER SECTION */}
      <header style={headerBox}>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>
          <FaArrowLeft /> Back
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b", margin: 0 }}>
          <FaImages style={{ marginRight: '12px', color: '#0056b3' }} /> 
          District Project Gallery
        </h1>
        <div style={{ width: '80px' }}></div> {/* Spacer for alignment */}
      </header>

      <main style={{ flex: 1, padding: "20px 40px" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "100px", color: "#64748b" }}>Loading Project Media...</div>
        ) : Object.keys(deptProjects).length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "100px", background: '#fff', padding: '50px', borderRadius: '15px' }}>
             <p style={{ color: "#94a3b8", fontSize: "18px", fontWeight: '600' }}>No recent photos uploaded yet.</p>
          </div>
        ) : (
          Object.keys(deptProjects).map((dept, idx) => (
            <div key={idx} style={{ marginBottom: "50px" }}>
              <h2 style={deptTitleStyle}>
                <FaBuilding style={{ marginRight: '10px' }} /> {dept} Department
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
                {deptProjects[dept].map((project) => (
                  <div key={project._id} style={projectCardStyle}>
                    <h3 title={project.name} style={projectNameStyle}>
                      {project.name}
                    </h3>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flex: 1 }}>
                      {project.photos.map((photo, i) => (
                        <div
                          key={i}
                          onClick={() => setPreview({
                            images: project.photos.map((p) => p.url),
                            index: i,
                            zoom: false,
                          })}
                          style={thumbnailWrapper}
                        >
                          <img
                            src={photo.url}
                            alt="project"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={cardFooter}>
                       <span>{project.photos.length} Photo(s)</span>
                       <span>ID: {project._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* FOOTER */}
      <footer style={footerStyle}>
          <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: '700' }}>NIC Udham Singh Nagar - District Administration</p>
          <p style={{ margin: '4px 0', fontSize: '0.7rem', opacity: 0.7 }}>&copy; {new Date().getFullYear()} Official Monitoring Portal</p>
      </footer>

      {/* 🔍 Image Preview Modal */}
      {preview.images.length > 0 && (
        <div onClick={closePreview} style={modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={modalContent}>
            <img
              src={currentImage}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                borderRadius: "8px",
                transform: preview.zoom ? "scale(1.4)" : "scale(1)",
                transition: "transform 0.3s ease",
                cursor: preview.zoom ? "zoom-out" : "zoom-in",
                boxShadow: "0 0 40px rgba(0,0,0,0.5)"
              }}
              onClick={() => setPreview((p) => ({ ...p, zoom: !p.zoom }))}
            />

            <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "15px" }}>
              <button onClick={prevImage} style={controlBtn}><FaChevronLeft /> PREV</button>
              <a href={currentImage} download style={{ ...controlBtn, background: "#16a34a" }}><FaDownload /> DOWNLOAD</a>
              <button onClick={nextImage} style={controlBtn}>NEXT <FaChevronRight /></button>
            </div>

            <button onClick={closePreview} style={closeBtn}>
              <FaTimes /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Dynamic Styles ---
const headerBox = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 10 };
const backBtnStyle = { display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", color: "#475569" };
const deptTitleStyle = { fontSize: "20px", fontWeight: 800, marginBottom: "20px", color: "#0f172a", borderLeft: "5px solid #0056b3", padding: "10px 18px", backgroundColor: "#fff", borderRadius: "0 8px 8px 0", boxShadow: "0 2px 4px rgba(0,0,0,0.04)" };
const projectCardStyle = { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0", display: 'flex', flexDirection: 'column' };
const projectNameStyle = { fontSize: "16px", fontWeight: 700, marginBottom: "15px", color: "#334155", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "45px" };
const thumbnailWrapper = { width: "85px", height: "85px", cursor: "pointer", borderRadius: "8px", overflow: "hidden", transition: "all 0.2s", border: "2px solid #f1f5f9", ":hover": { transform: "translateY(-3px)", borderColor: "#0056b3" } };
const cardFooter = { marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", fontWeight: "600" };
const footerStyle = { width: '100%', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', padding: '20px', color: '#64748b', textAlign: 'center', marginTop: 'auto' };
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.95)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContent = { position: "relative", maxWidth: "90%", textAlign: "center" };
const controlBtn = { display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", fontSize: "14px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#334155", color: "#fff", fontWeight: "700" };
const closeBtn = { position: "absolute", top: "-50px", right: "0", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" };