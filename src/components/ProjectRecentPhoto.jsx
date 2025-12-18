import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/dashboard.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectRecentPhoto() {
  const [projects, setProjects] = useState([]);
  const [preview, setPreview] = useState({
    images: [],
    index: 0,
    zoom: false,
  });

  const loggedDept = localStorage.getItem("loggedInDepartment");

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
          `http://localhost:8000/department/projects?department=${loggedDept}`
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
    <div
      className={styles.projectWrapper}
      style={{
        padding: "30px",
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* Page Title */}
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          marginBottom: "30px",
          color: "#111", // ✅ full visibility
          opacity: 1,   // ✅ full visibility
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
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* Project Name */}
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "15px",
                wordBreak: "break-word",
                color: "#222", // ✅ full visibility
                opacity: 1,    // ✅ full visibility
              }}
            >
              {project.name}
            </h2>

            {/* Photos */}
            {project.photos?.length ? (
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
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
                      width: "150px",
                      height: "150px",
                      cursor: "pointer",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >
                    <img
                      src={photo.url}
                      alt=""
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
              <p>No photos yet.</p>
            )}
          </div>
        ))
      )}

      {/* -------------------------------
          Image Preview Modal
      -------------------------------- */}
      {preview.images.length > 0 && (
        <div
          onClick={closePreview}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              textAlign: "center",
            }}
          >
            {/* Image */}
            <img
              src={currentImage}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "10px",
                transform: preview.zoom ? "scale(1.5)" : "scale(1)",
                transition: "transform 0.3s",
                cursor: preview.zoom ? "zoom-out" : "zoom-in",
              }}
              onClick={() =>
                setPreview((p) => ({ ...p, zoom: !p.zoom }))
              }
            />

            {/* Controls: Previous / Download / Next */}
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "center",
                gap: "15px",
              }}
            >
              <button onClick={prevImage} style={controlBtn}>
                ◀
              </button>
              <a
                href={currentImage}
                download
                style={{ ...controlBtn, textDecoration: "none" }}
              >
                ⬇
              </a>
              <button onClick={nextImage} style={controlBtn}>
                ▶
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={closePreview}
              style={{
                position: "absolute",
                top: "-12px",
                right: "-12px",
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------
   Control button style
-------------------------------- */
const controlBtn = {
  padding: "8px 14px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  background: "#4CAF50",
  color: "#fff",
  fontWeight: 600,
};
