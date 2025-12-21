import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill email and password");
      return;
    }

    if (email === "diousn@nic.in" && password === "diousn@123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflowX: 'hidden' 
    }}>
      <div className={styles.loginPage} style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row' // Only change flow direction
      }}>
        
        {/* LEFT SECTION */}
        <div
          className={styles.leftSection}
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: isMobile ? 'cover' : '115%', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 20%',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: '20px',
            // On mobile we give it a height, on desktop it stays as per your CSS
            height: isMobile ? '250px' : 'calc(100vh - 50px)', 
            borderRight: isMobile ? 'none' : '1px solid #eee'
          }}
        >
          <BackButton onClick={() => navigate("/")} />
        </div>

        {/* RIGHT SECTION */}
        <div 
          className={styles.rightSection} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            // Desktop keeps your 100px padding, Mobile gets 120px to clear footer
            paddingBottom: isMobile ? '120px' : '100px', 
            height: isMobile ? 'auto' : 'calc(100vh - 50px)',
            paddingTop: isMobile ? '40px' : '0'
          }}
        >
          <div className={styles.loginBox} style={isMobile ? { width: '85%', maxWidth: '400px' } : {}}>
            <h2 className={styles.loginTitle}>Admin Login</h2>

            <input
              className={styles.inputField}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className={styles.loginBtn} onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>

      {/* SLIM STICKY FOOTER */}
      <footer style={{
        position: isMobile ? 'relative' : 'fixed', 
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '3px solid #0056b3',
        padding: '8px 10px',
        color: '#333',
        textAlign: 'center',
        zIndex: 1000,
        fontFamily: "serif",
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ margin: '0', fontSize: '0.8rem', fontWeight: 'bold', color: '#002147' }}>
            District Administration
          </p>
          <p style={{ margin: '2px 0', fontSize: '0.65rem', opacity: 0.8 }}>
            Designed and Developed by <strong>District Administration</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px',
            fontSize: '0.6rem',
            borderTop: '1px solid #ddd',
            marginTop: '4px',
            paddingTop: '4px'
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