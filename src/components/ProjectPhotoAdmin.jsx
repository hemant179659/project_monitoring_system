import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectPhotoAdmin() {
  const navigate = useNavigate();
  const [deptProjects, setDeptProjects] = useState({});
  const [preview, setPreview] = useState({
    images: [],
    index: 0,
    zoom: false,
  });

  // -------------------------------
  // 🔐 Admin protection
  // -------------------------------
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      toast.error("Please login first");
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // -------------------------------
  // 📦 Load all projects (ADMIN)
  // -------------------------------
  useEffect(() => {
    const loadAllProjects = async () => {
      try {
        const res = await axios.get(
          "/api/department/projects?all=true"
        );

        const projects = res.data.projects || [];

        // ✅ Group projects by department
        const grouped = projects.reduce((acc, p) => {
          if (!acc[p.department]) acc[p.department] = [];
          acc[p.department].push(p);
          return acc;
        }, {});

        setDeptProjects(grouped);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load projects");
      }
    };

    loadAllProjects();
  }, []);

  // -------------------------------
  // 🔍 Preview helpers
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
      style={{
        padding: "30px",
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* Page Heading */}
      <h1
        style={{
          fontSize: "30px",
          fontWeight: 700,
          marginBottom: "30px",
          color: "#111",
          opacity: 1,
          textAlign: "center",
        }}
      >
        📸 Department-wise Project Recent Photos
      </h1>

      {Object.keys(deptProjects).length === 0 && (
        <p style={{ textAlign: "center", color: "#444", opacity: 1 }}>
          No project photos available.
        </p>
      )}

      {/* -------------------------------
          Department Loop
      -------------------------------- */}
      {Object.keys(deptProjects).map((dept, idx) => (
        <div key={idx} style={{ marginBottom: "50px" }}>
          {/* Department Title */}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "20px",
              color: "#000",
              opacity: 1,
              borderLeft: "6px solid #4CAF50",
              paddingLeft: "12px",
            }}
          >
            {dept} Department
          </h2>

          {/* Projects */}
          {deptProjects[dept].map((project) => (
            <div
              key={project._id}
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "25px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {/* Project Name */}
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "15px",
                  color: "#222",
                  opacity: 1,
                }}
              >
                {project.name}
              </h3>

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
                <p style={{ color: "#555", opacity: 1 }}>
                  No photos uploaded yet.
                </p>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* -------------------------------
          🔍 Image Preview Modal
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

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "center",
                gap: "15px",
              }}
            >
              <button onClick={prevImage} style={controlBtn}>◀</button>
              <a
                href={currentImage}
                download
                style={{ ...controlBtn, textDecoration: "none" }}
              >
                ⬇
              </a>
              <button onClick={nextImage} style={controlBtn}>▶</button>
            </div>

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
   Button style
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
