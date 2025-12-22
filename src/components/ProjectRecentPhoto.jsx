import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/dashboard.module.css";
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

  // Handle Resize for Responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------------
  // Login protection
  // -------------------------------
  useEffect(() => {
    if (!loggedDept) {
      toast.error("Please login first");
      window.location.replace("/dept-login");
      return;
    }
  }, [loggedDept]);

  // -------------------------------
  // Load projects
  // -------------------------------
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await axios.get(
          `/api/department/projects?department=${loggedDept}`
        );
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Failed to fetch projects");
      }
    };
    if (loggedDept) loadProjects();
  }, [loggedDept]);

  // -------------------------------
  // Carousel controls
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
        {/* Page Title */}
        <h1
          style={{
            fontSize: isMobile ? "22px" : "28px",
            fontWeight: 700,
            marginBottom: "25px",
            color: "#111",
          }}
        >
          📸 {loggedDept} Projects – Recent Photos
        </h1>

        {/* Projects */}
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              style={{
                background: "#fff",
                padding: isMobile ? "15px" : "20px",
                borderRadius: "12px",
                marginBottom: "25px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {/* Project Name */}
              <h2
                style={{
                  fontSize: isMobile ? "18px" : "22px",
                  fontWeight: 700,
                  marginBottom: "15px",
                  wordBreak: "break-word",
                  color: "#222",
                }}
              >
                {project.name}
              </h2>

              {/* Photos Grid */}
              {project.photos?.length ? (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, 150px)", 
                  gap: isMobile ? "10px" : "15px" 
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
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid #ddd",
                      }}
                    >
                      <img
                        src={photo.url}
                        alt="Project detail"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#666", fontSize: "14px" }}>No photos yet.</p>
              )}
            </div>
          ))
        )}
      </main>

      {/* -------------------------------
          Image Preview Modal (Mobile Optimized)
      -------------------------------- */}
      {preview.images.length > 0 && (
        <div
          onClick={closePreview}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "10px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "800px",
              textAlign: "center",
            }}
          >
            {/* Image */}
            <img
              src={currentImage}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: isMobile ? "65vh" : "80vh",
                borderRadius: "8px",
                transform: preview.zoom ? "scale(1.5)" : "scale(1)",
                transition: "transform 0.3s",
                cursor: preview.zoom ? "zoom-out" : "zoom-in",
                objectFit: "contain"
              }}
              onClick={() =>
                setPreview((p) => ({ ...p, zoom: !p.zoom }))
              }
            />

            {/* Controls: Previous / Download / Next */}
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <button onClick={prevImage} style={controlBtn}>◀</button>
              <a
                href={currentImage}
                download
                style={{ ...controlBtn, textDecoration: "none", display: 'flex', alignItems: 'center' }}
              >
                ⬇
              </a>
              <button onClick={nextImage} style={controlBtn}>▶</button>
            </div>

            {/* Close Button */}
            <button
              onClick={closePreview}
              style={{
                position: "absolute",
                top: isMobile ? "-45px" : "-15px",
                right: isMobile ? "0px" : "-15px",
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: "bold",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
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

const controlBtn = {
  padding: "10px 18px",
  fontSize: "18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#4CAF50",
  color: "#fff",
  fontWeight: 600,
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
};