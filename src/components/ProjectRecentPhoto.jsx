import { useEffect, useState } from "react";
// ✅ Tera Custom API instance
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera, FaDownload, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

export default function ProjectRecentPhoto() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [preview, setPreview] = useState({
    images: [],
    index: 0,
    zoom: false,
  });

  const loggedDept = localStorage.getItem("loggedInDepartment");

  // 📱 Responsiveness Listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔐 Auth Protection (Silently handles redirect via API instance if unauthorized)
  useEffect(() => {
    if (!loggedDept) {
      toast.error("Session expired. Please login again.");
      window.location.replace("/dept-login");
    }
  }, [loggedDept]);

  // 📡 Fetch Projects using Custom API Instance
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        // Backend se sirf apne department ke projects mangwa rahe hain
        const res = await API.get(`/department/projects?department=${loggedDept}`);
        
        // Filter: Sirf wahi projects dikhao jinme photos hain
        const filtered = (res.data.projects || []).filter(
          (p) => p.photos && p.photos.length > 0
        );
        setProjects(filtered);
      } catch (err) {
        console.error("Fetch Error:", err);
        if (err.response?.status !== 401) {
          toast.error("Photos load karne mein error aaya.");
        }
      } finally {
        setLoading(false);
      }
    };
    if (loggedDept) loadProjects();
  }, [loggedDept]);

  // 🔍 Preview Handlers
  const nextImage = () => setPreview((p) => ({ ...p, index: (p.index + 1) % p.images.length, zoom: false }));
  const prevImage = () => setPreview((p) => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length, zoom: false }));
  const closePreview = () => setPreview({ images: [], index: 0, zoom: false });

  const currentImage = preview.images[preview.index];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: "#f8fafc" }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <main style={{ flex: 1, padding: isMobile ? "15px" : "40px" }}>
        <header style={{ marginBottom: "30px", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px" }}>
          <h1 style={{ fontSize: isMobile ? "20px" : "26px", fontWeight: 800, color: "#1e293b", margin: 0 }}>
            <FaCamera style={{ marginRight: "12px", color: "#0056b3" }} />
            Recent Project Photos: <span style={{ color: "#2563eb" }}>{loggedDept}</span>
          </h1>
        </header>

        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>Loading Media...</p>
        ) : projects.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>Aapke vibhag ke liye abhi tak koi photos upload nahi hui hain.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} style={cardStyle}>
              <h2 title={project.name} style={projectTitleStyle}>
                {project.name}
              </h2>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(100px, 1fr))" : "repeat(auto-fill, 160px)", 
                gap: "15px" 
              }}>
                {project.photos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => setPreview({
                      images: project.photos.map((p) => p.url),
                      index: i,
                      zoom: false,
                    })}
                    style={thumbnailStyle}
                  >
                    <img src={photo.url} alt="Project" loading="lazy" style={imgStyle} />
                  </div>
                ))}
              </div>
              <div style={cardFooter}>
                Total Photos: <strong>{project.photos.length}</strong>
              </div>
            </div>
          ))
        )}
      </main>

      {/* 🔍 Preview Modal */}
      {preview.images.length > 0 && (
        <div onClick={closePreview} style={modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={modalContent}>
            <img
              src={currentImage}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: isMobile ? "70vh" : "80vh",
                borderRadius: "8px",
                transform: preview.zoom ? "scale(1.4)" : "scale(1)",
                transition: "transform 0.3s ease",
                cursor: preview.zoom ? "zoom-out" : "zoom-in",
                boxShadow: "0 10px 40px rgba(0,0,0,0.6)"
              }}
              onClick={() => setPreview((p) => ({ ...p, zoom: !p.zoom }))}
            />

            <div style={modalControls}>
              <button onClick={prevImage} style={controlBtn}><FaChevronLeft /> PREV</button>
              <a href={currentImage} download style={{ ...controlBtn, background: "#2563eb" }}><FaDownload /> SAVE</a>
              <button onClick={nextImage} style={controlBtn}>NEXT <FaChevronRight /></button>
            </div>

            <button onClick={closePreview} style={closeBtn}><FaTimes /></button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={footerStyle}>
        <p style={{ margin: 0, fontWeight: "bold" }}>District Administration Monitoring System</p>
        <p style={{ fontSize: "11px", opacity: 0.7 }}>&copy; {new Date().getFullYear()} NIC Udham Singh Nagar</p>
      </footer>
    </div>
  );
}

// --- Styles ---
const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "30px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  border: "1px solid #e2e8f0"
};

const projectTitleStyle = {
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "18px",
  color: "#334155",
  borderLeft: "5px solid #10b981",
  paddingLeft: "12px",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  overflow: "hidden"
};

const thumbnailStyle = {
  aspectRatio: "1/1",
  cursor: "pointer",
  borderRadius: "8px",
  overflow: "hidden",
  border: "2px solid #f1f5f9",
  transition: "all 0.2s ease"
};

const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };

const cardFooter = { marginTop: "15px", textAlign: "right", fontSize: "12px", color: "#64748b" };

const modalOverlay = { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.98)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "15px" };

const modalContent = { position: "relative", width: "100%", maxWidth: "1000px", textAlign: "center" };

const modalControls = { marginTop: "30px", display: "flex", justifyContent: "center", gap: "15px" };

const controlBtn = { padding: "12px 20px", fontSize: "14px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#334155", color: "#fff", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" };

const closeBtn = { position: "absolute", top: "-50px", right: "0", background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "18px", fontWeight: "bold" };

const emptyStateStyle = { textAlign: 'center', marginTop: '100px', padding: '40px', background: '#fff', borderRadius: '15px', color: '#94a3b8' };

const footerStyle = { width: '100%', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', padding: '20px', color: '#64748b', textAlign: 'center', marginTop: 'auto' };