import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBuilding, FaImages, FaArrowLeft, FaDownload, FaTimes, FaChevronLeft, FaChevronRight, FaRegIdBadge } from "react-icons/fa";

export default function ProjectPhotoAdmin() {
  const navigate = useNavigate();
  const [deptProjects, setDeptProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState({
    images: [],
    index: 0,
    zoom: false,
  });

  // ✅ Auth Protection
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const token = localStorage.getItem("destoToken") || localStorage.getItem("adminToken");
    if (!isAdmin || !token) {
      toast.error("Access Denied! Please login as Admin.");
      navigate("/desto-login", { replace: true });
    }
  }, [navigate]);

  // ✅ Load Data
  useEffect(() => {
    const loadAllProjects = async () => {
      setLoading(true);
      try {
        const res = await API.get("/department/projects?all=true");
        const projects = res.data.projects || [];

        const grouped = projects.reduce((acc, p) => {
          if (p.photos && p.photos.length > 0) {
            if (!acc[p.department]) acc[p.department] = [];
            acc[p.department].push(p);
          }
          return acc;
        }, {});

        setDeptProjects(grouped);
      } catch (err) {
        if (err.response?.status !== 401) toast.error("Error loading photos.");
      } finally {
        setLoading(false);
      }
    };
    loadAllProjects();
  }, []);

  const nextImage = () => setPreview(p => ({ ...p, index: (p.index + 1) % p.images.length, zoom: false }));
  const prevImage = () => setPreview(p => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length, zoom: false }));
  const closePreview = () => setPreview({ images: [], index: 0, zoom: false });

  return (
    <div style={pageWrapper}>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* --- HEADER --- */}
      <header style={headerBox}>
        <div style={headerContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => navigate(-1)} style={backBtnStyle} title="Go Back">
              <FaArrowLeft />
            </button>
            <div>
              <h1 style={headerTitle}>District Project Gallery</h1>
              <p style={headerSubtitle}>Visual Progress Monitoring - All Departments</p>
            </div>
          </div>
          <FaImages size={30} color="#21618c" style={{ opacity: 0.8 }} />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main style={mainContent}>
        {loading ? (
          <div style={loaderStyle}>Fetching visual records...</div>
        ) : Object.keys(deptProjects).length === 0 ? (
          <div style={emptyState}>No media uploads found in the system.</div>
        ) : (
          Object.keys(deptProjects).map((dept, idx) => (
            <section key={idx} style={{ marginBottom: "60px" }}>
              <div style={deptHeader}>
                <FaBuilding size={18} />
                <span>{dept} Department</span>
              </div>

              <div style={gridSystem}>
                {deptProjects[dept].map((project) => (
                  <div key={project._id} style={projectCard}>
                    <div style={cardHeader}>
                       <h3 style={projectTitle}>{project.name}</h3>
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
                          style={thumbnailBox}
                        >
                          <img src={photo.url} alt="project" style={imgFit} />
                        </div>
                      ))}
                    </div>

                    <div style={cardFooter}>
                       <div style={footerTag}><FaImages /> {project.photos.length} Files</div>
                       <div style={footerTag}><FaRegIdBadge /> {project._id.slice(-6).toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
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

      {/* --- LIGHTBOX MODAL --- */}
      {preview.images.length > 0 && (
        <div onClick={closePreview} style={modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={modalContent}>
            <img
              src={preview.images[preview.index]}
              alt="preview"
              style={{
                ...previewImg,
                transform: preview.zoom ? "scale(1.4)" : "scale(1)",
                cursor: preview.zoom ? "zoom-out" : "zoom-in",
              }}
              onClick={() => setPreview((p) => ({ ...p, zoom: !p.zoom }))}
            />

            <div style={modalControls}>
              <button onClick={prevImage} style={controlBtn}><FaChevronLeft /> PREV</button>
              <a href={preview.images[preview.index]} download style={{ ...controlBtn, background: "#16a34a" }}>
                <FaDownload /> DOWNLOAD
              </a>
              <button onClick={nextImage} style={controlBtn}>NEXT <FaChevronRight /></button>
            </div>

            <button onClick={closePreview} style={closeBtn}><FaTimes /> Close Preview</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const pageWrapper = { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f1f5f9" };

const headerBox = { backgroundColor: "#fff", padding: "15px 0", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 4px rgba(0,0,0,0.02)" };
const headerContainer = { width: "95%", maxWidth: "1300px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" };
const headerTitle = { margin: 0, fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" };
const headerSubtitle = { margin: 0, fontSize: "0.85rem", color: "#64748b", fontWeight: "600" };

const backBtnStyle = { background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center" };

const mainContent = { flex: 1, width: "95%", maxWidth: "1300px", margin: "40px auto", paddingBottom: "40px" };
const loaderStyle = { textAlign: "center", padding: "100px", color: "#64748b", fontSize: "1.1rem", fontWeight: "600" };
const emptyState = { textAlign: "center", padding: "80px", background: "#fff", borderRadius: "20px", color: "#94a3b8", fontWeight: "600", border: "2px dashed #cbd5e1" };

const deptHeader = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", fontSize: "1.2rem", fontWeight: "800", color: "#1e293b", background: "#fff", padding: "12px 20px", borderRadius: "12px", width: "fit-content", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", borderLeft: "5px solid #21618c" };

const gridSystem = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "25px" };

const projectCard = { background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" };
const cardHeader = { padding: "18px 20px", borderBottom: "1px solid #f1f5f9" };
const projectTitle = { margin: 0, fontSize: "1rem", fontWeight: "700", color: "#334155", lineHeight: "1.5" };

const photoGrid = { padding: "15px 20px", display: "flex", gap: "10px", flexWrap: "wrap", flex: 1, backgroundColor: "#f8fafc" };
const thumbnailBox = { width: "75px", height: "75px", borderRadius: "10px", overflow: "hidden", cursor: "pointer", border: "2px solid #fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" };
const imgFit = { width: "100%", height: "100%", objectFit: "cover" };

const cardFooter = { padding: "12px 20px", background: "#fff", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" };
const footerTag = { fontSize: "11px", fontWeight: "700", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px" };

/* ================= PROFESSIONAL FOOTER STYLES ================= */
const footerStyle = { backgroundColor: "#ffffff", padding: "25px 0", borderTop: "5px solid #21618c", width: '100%', marginTop: 'auto' };
const footerContainer = { width: "90%", maxWidth: "600px", margin: "0 auto", textAlign: "center" };
const footerBrand = { fontSize: "0.9rem", fontWeight: "800", color: "#1e293b", marginBottom: "12px" };
const footerLinksWrapper = { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "12px", flexWrap: "wrap" };
const fLink = { color: "#21618c", textDecoration: "none", fontWeight: "700", fontSize: "0.8rem" };
const fSep = { color: "#cbd5e1", fontSize: "0.8rem" };
const copyright = { fontSize: "0.75rem", color: "#64748b", margin: 0, borderTop: "1px solid #f1f5f9", paddingTop: "12px" };

// --- Lightbox Styles ---
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.98)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(10px)" };
const modalContent = { position: "relative", maxWidth: "90%", display: 'flex', flexDirection: 'column', alignItems: 'center' };
const previewImg = { maxHeight: "75vh", borderRadius: "12px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", transition: "0.3s ease" };
const modalControls = { marginTop: "30px", display: "flex", gap: "15px" };
const controlBtn = { padding: "12px 24px", fontSize: "14px", borderRadius: "12px", border: "none", cursor: "pointer", background: "#334155", color: "#fff", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" };
const closeBtn = { position: "absolute", top: "-60px", right: "0", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "8px 16px", cursor: "pointer", fontWeight: "600" };