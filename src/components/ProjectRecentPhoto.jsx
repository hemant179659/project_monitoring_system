import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectRecentPhoto() {
  const [projects, setProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [preview, setPreview] = useState({
    images: [],
    index: 0,
    zoom: false,
  });

  const loggedDept = localStorage.getItem("loggedInDepartment");

  // -------------------------------
  // 📱 Mobile Responsiveness Listener
  // -------------------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------------
  // 🔐 Auth Protection
  // -------------------------------
  useEffect(() => {
    if (!loggedDept) {
      toast.error("Please login first");
      window.location.replace("/dept-login");
    }
  }, [loggedDept]);

  // -------------------------------
  // 📡 Fetch Data (Filtered for Photos)
  // -------------------------------
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await axios.get(
          `/api/department/projects?department=${loggedDept}`
        );
        // ✅ Only keep projects that have photos to avoid empty cards
        const filtered = (res.data.projects || []).filter(
          (p) => p.photos && p.photos.length > 0
        );
        setProjects(filtered);
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Failed to fetch projects");
      }
    };
    if (loggedDept) loadProjects();
  }, [loggedDept]);

  // -------------------------------
  // 🔍 Image Preview Helpers
  // -------------------------------
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

  const closePreview = () =>
    setPreview({ images: [], index: 0, zoom: false });

  const currentImage = preview.images[preview.index];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: "#f4f6f9" }}>
      
      <main style={{ flex: 1, padding: isMobile ? "15px" : "30px" }}>
        <h1
          style={{
            fontSize: isMobile ? "22px" : "28px",
            fontWeight: 700,
            marginBottom: "25px",
            color: "#111",
            textAlign: isMobile ? "center" : "left"
          }}
        >
          📸 Recent Photos – <span style={{ color: "#0056b3" }}>{loggedDept}</span>
        </h1>

        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px', color: '#666' }}>
            <p style={{ fontSize: "1.1rem" }}>No projects with photos found for your department.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              style={{
                background: "#fff",
                padding: isMobile ? "15px" : "25px",
                borderRadius: "12px",
                marginBottom: "25px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                border: "1px solid #eee",
                overflow: "hidden" // Prevents child elements from bleeding out
              }}
            >
              {/* --- 🛠 HANDLED LONG PROJECT NAME --- */}
              <h2
                title={project.name} // Full name on hover
                style={{
                  fontSize: isMobile ? "18px" : "22px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "#222",
                  borderLeft: "5px solid #4CAF50",
                  paddingLeft: "15px",
                  lineHeight: "1.4",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  display: "-webkit-box",
                  WebkitLineClamp: "2", // Limits to 2 lines then adds "..."
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {project.name}
              </h2>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(100px, 1fr))" : "repeat(auto-fill, 180px)", 
                gap: isMobile ? "10px" : "18px" 
              }}>
                {project.photos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setPreview({
                        images: project.photos.map((p) => p.url),
                        index: i,
                        zoom: false,
                      })
                    }
                    style={{
                      aspectRatio: "1/1",
                      cursor: "pointer",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "2px solid #f0f0f0",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <img
                      src={photo.url}
                      alt="Project detail"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
              <p style={{ marginTop: "15px", fontSize: "12px", color: "#888", textAlign: "right" }}>
                Total Photos: {project.photos.length}
              </p>
            </div>
          ))
        )}
      </main>

      {/* 🔍 Image Preview Modal */}
      {preview.images.length > 0 && (
        <div
          onClick={closePreview}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            padding: "10px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1000px",
              textAlign: "center",
            }}
          >
            <img
              src={currentImage}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: isMobile ? "65vh" : "80vh",
                borderRadius: "4px",
                transform: preview.zoom ? "scale(1.5)" : "scale(1)",
                transition: "transform 0.3s ease",
                cursor: preview.zoom ? "zoom-out" : "zoom-in",
                boxShadow: "0 5px 25px rgba(0,0,0,0.5)"
              }}
              onClick={() => setPreview((p) => ({ ...p, zoom: !p.zoom }))}
            />

            <div style={{ marginTop: "25px", display: "flex", justifyContent: "center", gap: "20px" }}>
              <button onClick={prevImage} style={controlBtn}>PREV</button>
              <a href={currentImage} download style={{ ...controlBtn, textDecoration: "none", background: "#0056b3" }}>DOWNLOAD</a>
              <button onClick={nextImage} style={controlBtn}>NEXT</button>
            </div>

            <button
              onClick={closePreview}
              style={{
                position: "absolute",
                top: isMobile ? "-60px" : "-30px",
                right: "0",
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: "bold",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 🏛 FOOTER */}
      <footer style={{
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '3px solid #0056b3',
        padding: '20px 10px',
        color: '#333',
        textAlign: 'center',
        fontFamily: "serif",
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: 'bold', color: '#002147' }}>
            District Administration
          </p>
          <p style={{ margin: '5px 0', fontSize: '0.8rem', opacity: 0.8 }}>
            Designed and Developed by <strong>District Administration</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '15px',
            fontSize: '0.75rem',
            borderTop: '1px solid #ddd',
            marginTop: '12px',
            paddingTop: '12px'
          }}>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
            <span>|</span>
            <span>Official Departmental Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const controlBtn = {
  padding: "10px 18px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  background: "#4CAF50",
  color: "#fff",
  fontWeight: 600,
  letterSpacing: "0.5px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  transition: "background 0.2s ease"
};