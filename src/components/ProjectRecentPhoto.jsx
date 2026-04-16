import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera, FaDownload, FaChevronLeft, FaChevronRight, FaTimes, FaArrowLeft } from "react-icons/fa";

export default function ProjectRecentPhoto() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [preview, setPreview] = useState({
    images: [],
    index: 0,
    zoom: false,
  });

  const loggedDept = localStorage.getItem("loggedInDepartment");
  const token = localStorage.getItem("deptToken");
  
  useEffect(() => {
    if (!loggedDept || !token) {
      toast.error("Access Denied. Please login as Admin.");
      navigate("/dept-login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loggedDept) {
      toast.error("Session expired. Please login again.");
      navigate("/dept-login", { replace: true });
    }
  }, [loggedDept, navigate]);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/department/projects?department=${loggedDept}`);
        const filtered = (res.data.projects || []).filter(
          (p) => p.photos && p.photos.length > 0
        );
        setProjects(filtered);
      } catch (err) {
        if (err.response?.status !== 401) {
          toast.error("Photos load karne mein error aaya.");
        }
      } finally {
        setLoading(false);
      }
    };
    if (loggedDept) loadProjects();
  }, [loggedDept]);

  const nextImage = () => setPreview((p) => ({ ...p, index: (p.index + 1) % p.images.length, zoom: false }));
  const prevImage = () => setPreview((p) => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length, zoom: false }));
  const closePreview = () => setPreview({ images: [], index: 0, zoom: false });

  return (
    <div style={pageWrapper}>
      <ToastContainer position="top-right" autoClose={2000} />

      <header style={headerBox}>
        <div style={headerContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? "10px" : "20px" }}>
            <button onClick={() => navigate(-1)} style={backBtn} title="Back">
              <FaArrowLeft />
            </button>
            <div>
              <h1 style={headerTitle}>
                <FaCamera style={{ marginRight: "10px", color: "#21618c" }} />
                Project Media Gallery
              </h1>
              <p style={headerSubtitle}>{loggedDept}</p>
            </div>
          </div>
        </div>
      </header>

      <main style={mainContent}>
        {loading ? (
          <div style={loaderWrapper}><p>Loading project images...</p></div>
        ) : projects.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: "50px", marginBottom: "20px" }}>📸</div>
            <p style={{ fontSize: "18px", fontWeight: "700", color: "#333" }}>No photos found!</p>
          </div>
        ) : (
          <div style={gridSystem}>
            {projects.map((project) => (
              <div key={project._id} style={cardStyle}>
                <div style={cardHeader}>
                  <h2 style={projectTitleStyle}>{project.name}</h2>
                </div>
                <div style={photoGrid}>
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
                      <img src={photo.url} alt="Project" style={imgStyle} />
                    </div>
                  ))}
                </div>
                <div style={cardFooter}>
                  <span>Visual Evidence</span>
                  <span style={photoCountBadge}>{project.photos.length} Photos</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= EXACT FOOTER FROM HOME.JSX ================= */}
      <footer style={footerStyle}>
        <div style={footerContainer}>
          <div style={footerBrand}>
            <strong>DISTRICT ADMINISTRATION, UTTARAKHAND</strong>
          </div>
          
          <nav style={footerLinks}>
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

      {/* --- PREVIEW MODAL --- */}
      {preview.images.length > 0 && (
        <div onClick={closePreview} style={modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={modalContent}>
            <img
              src={preview.images[preview.index]}
              alt="preview"
              style={{ ...modalImgStyle, transform: preview.zoom ? "scale(1.2)" : "scale(1)" }}
              onClick={() => setPreview((p) => ({ ...p, zoom: !p.zoom }))}
            />
            <div style={modalControls}>
              <button onClick={prevImage} style={controlBtn}><FaChevronLeft /> PREV</button>
              <a href={preview.images[preview.index]} download style={{ ...controlBtn, background: "#16a34a" }}><FaDownload /> SAVE</a>
              <button onClick={nextImage} style={controlBtn}>NEXT <FaChevronRight /></button>
            </div>
            <button onClick={closePreview} style={closeBtn}><FaTimes /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const pageWrapper = { minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f4f7f6" };
const headerBox = { background: "#fff", borderBottom: "5px solid #21618c", padding: "15px 0", position: "sticky", top: 0, zIndex: 100 };
const headerContainer = { width: "95%", maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center" };
const headerTitle = { margin: 0, fontSize: "1.2rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center" };
const headerSubtitle = { margin: 0, fontSize: "0.85rem", color: "#21618c", fontWeight: "700" };
const backBtn = { background: "#f8fafc", border: "1px solid #ddd", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", color: "#333" };

const mainContent = { flex: 1, padding: "30px 20px", maxWidth: "1200px", margin: "0 auto", width: "100%" };
const gridSystem = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" };

const cardStyle = { background: "#fff", borderRadius: "8px", border: "1px solid #ddd", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" };
const cardHeader = { padding: "12px 15px", borderBottom: "1px solid #eee", background: "#f8fafc" };
const projectTitleStyle = { margin: 0, fontSize: "13px", fontWeight: "700", color: "#000", lineHeight: "1.4" };

const photoGrid = { padding: "15px", display: "flex", gap: "10px", flexWrap: "wrap", background: "#fff" };
const thumbnailStyle = { width: "75px", height: "75px", cursor: "pointer", borderRadius: "4px", overflow: "hidden", border: "1px solid #ddd" };
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };

const cardFooter = { padding: "10px 15px", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#666", fontWeight: "700" };
const photoCountBadge = { background: "#21618c", color: "#fff", padding: "3px 8px", borderRadius: "4px" };

// --- FOOTER STYLES (EXACT FROM HOME.JSX) ---
const footerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px 0",
  borderTop: "5px solid #21618c",
  marginTop: "auto"
};
const footerContainer = { width: "90%", maxWidth: "550px", margin: "0 auto", textAlign: "center" };
const footerBrand = { fontSize: "0.85rem", fontWeight: "700", color: "#333", marginBottom: "8px" };
const footerLinks = { display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "8px" };
const fLink = { color: "#21618c", textDecoration: "none", fontWeight: "600", fontSize: "0.75rem" };
const fSep = { color: "#ddd", fontSize: "0.75rem" };
const copyright = { fontSize: "0.7rem", color: "#666", margin: 0, borderTop: "1px solid #f0f0f0", paddingTop: "8px" };

// --- Lightbox ---
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 };
const modalContent = { position: "relative", width: "90%", maxWidth: "800px", textAlign: "center" };
const modalImgStyle = { maxWidth: "100%", maxHeight: "80vh", borderRadius: "4px", transition: "transform 0.2s" };
const modalControls = { marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" };
const controlBtn = { padding: "10px 15px", borderRadius: "4px", border: "none", cursor: "pointer", background: "#444", color: "#fff", fontWeight: "700" };
const closeBtn = { position: "absolute", top: "-40px", right: "0", background: "none", color: "#fff", border: "none", fontSize: "24px", cursor: "pointer" };

const loaderWrapper = { textAlign: "center", marginTop: "100px", fontWeight: "bold" };
const emptyStateStyle = { textAlign: 'center', marginTop: '80px', color: '#666' };