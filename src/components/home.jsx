import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import backgroundImage from '../assets/work.jpeg';

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 400);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 400);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#001529',
      fontFamily: "'serif', 'Times New Roman', Times, serif",
      overflowX: 'hidden'
    }}>
      
      {/* Background Layer */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.45, 
        zIndex: 1
      }} />

      {/* Main Content Layer */}
      <div style={{ 
        position: 'relative', 
        zIndex: 3, 
        textAlign: 'center', 
        color: '#ffffff', 
        width: '90%',
        paddingTop: isMobile ? '40px' : '80px',
        paddingBottom: isMobile ? '160px' : '100px' // Added cushion so buttons don't hit the footer
      }}>
        <h1 style={{ 
          fontSize: isSmallMobile ? '1.5rem' : isMobile ? '1.8rem' : '2.8rem', 
          marginBottom: '10px', 
          fontWeight: 'bold',
          letterSpacing: '1px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          lineHeight: '1.2'
        }}>
          PROJECT MONITORING DASHBOARD
        </h1>
        
        <div style={{ 
            width: '80px', 
            height: '4px', 
            backgroundColor: '#ff9933', 
            margin: '0 auto 30px auto' 
        }}></div>

        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '15px' : '25px', 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Link to="/admin-login" style={govButtonStyle('#0056b3', isMobile)}>ADMIN LOGIN</Link>
          <Link to="/dept-login" style={govButtonStyle('#28a745', isMobile)}>DEPARTMENT LOGIN</Link>
        </div>
      </div>

      {/* SLIM FOOTER */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 10,
        backgroundColor: '#f8f9fa',
        borderTop: '3px solid #0056b3',
        padding: '8px 10px', // Greatly reduced padding
        color: '#333',
        textAlign: 'center',
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

const govButtonStyle = (bgColor, isMobile) => ({
  padding: '12px 20px',
  backgroundColor: bgColor,
  color: 'white',
  textDecoration: 'none',
  borderRadius: '2px',
  fontWeight: '600',
  fontSize: '0.85rem',
  textAlign: 'center',
  width: isMobile ? '85%' : '210px',
  maxWidth: '300px',
  display: 'inline-block',
  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.2)',
  letterSpacing: '0.5px'
});