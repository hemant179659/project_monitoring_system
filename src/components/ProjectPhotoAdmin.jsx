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
        const res = await axios.get("/api/department/projects?all=true");
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
        console.error(err);
        toast.error("Failed to load projects");
      }
    };

    loadAllProjects();
  }, []);

  // 🔍 Preview helpers
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: "#f4f6f9" }}>
      
      <main style={{ flex: 1, padding: "30px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "35px",
            color: "#1a1a1a",
            textAlign: "center",
          }}
        >
          📸 Recent Project Gallery (Admin View)
        </h1>

        {Object.keys(deptProjects).length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
             <p style={{ color: "#777", fontSize: "18px" }}>No recent photos found in any department.</p>
          </div>
        ) : (
          Object.keys(deptProjects).map((dept, idx) => (
            <div key={idx} style={{ marginBottom: "50px" }}>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "#0056b3",
                  borderLeft: "6px solid #0056b3",
                  paddingLeft: "15px",
                  backgroundColor: "#eef2f7",
                  padding: "10px 15px",
                  borderRadius: "0 8px 8px 0"
                }}
              >
                🏢 {dept} Department
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
                {deptProjects[dept].map((project) => (
                  <div
                    key={project._id}
                    style={{
                      background: "#fff",
                      padding: "15px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      border: "1px solid #eee",
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* --- 🛠 HANDLED LONG PROJECT NAME HERE --- */}
                    <h3 
                      title={project.name} // Shows full text on mouse hover
                      style={{ 
                        fontSize: "17px", 
                        fontWeight: 700, 
                        marginBottom: "12px", 
                        color: "#333", 
                        borderBottom: "1px solid #f0f0f0", 
                        paddingBottom: "8px",
                        lineHeight: "1.4",
                        minHeight: "3em", // Keeps cards aligned even with short titles
                        /* Line Clamping Logic */
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordBreak: "break-word"
                      }}
                    >
                      {project.name}
                    </h3>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", flex: 1 }}>
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
                            width: "80px",
                            height: "80px",
                            cursor: "pointer",
                            borderRadius: "8px",
                            overflow: "hidden",
                            transition: "transform 0.2s",
                            border: "1px solid #eee"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                          <img
                            src={photo.url}
                            alt="project"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>
                      {project.photos.length} Photo(s)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* FOOTER */}
      <footer style={{
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '3px solid #0056b3',
        padding: '15px 10px',
        color: '#333',
        textAlign: 'center',
        fontFamily: "serif",
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ margin: '0', fontSize: '0.9rem', fontWeight: 'bold', color: '#002147' }}>
            District Administration
          </p>
          <p style={{ margin: '4px 0', fontSize: '0.75rem', opacity: 0.8 }}>
            Designed and Developed by <strong>District Administration</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px',
            fontSize: '0.7rem',
            borderTop: '1px solid #ddd',
            marginTop: '10px',
            paddingTop: '10px'
          }}>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
            <span>|</span>
            <span>Official Digital Portal</span>
          </div>
        </div>
      </footer>

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
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "95%",
              maxHeight: "95%",
              textAlign: "center",
            }}
          >
            <img
              src={currentImage}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "4px",
                transform: preview.zoom ? "scale(1.5)" : "scale(1)",
                transition: "transform 0.3s",
                cursor: preview.zoom ? "zoom-out" : "zoom-in",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)"
              }}
              onClick={() => setPreview((p) => ({ ...p, zoom: !p.zoom }))}
            />

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
              <button onClick={prevImage} style={controlBtn}>PREV</button>
              <a href={currentImage} download style={{ ...controlBtn, textDecoration: "none", background: "#0056b3" }}>DOWNLOAD</a>
              <button onClick={nextImage} style={controlBtn}>NEXT</button>
            </div>

            <button
              onClick={closePreview}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0px",
                background: "transparent",
                color: "#fff",
                border: "1px solid #fff",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              CLOSE [X]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const controlBtn = {
  padding: "10px 20px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  background: "#444",
  color: "#fff",
  fontWeight: 600,
  letterSpacing: "1px"
};