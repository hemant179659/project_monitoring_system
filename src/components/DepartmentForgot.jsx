import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function DepartmentForgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return toast.warn("Please provide your email");

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/department/forgot-password", { email });

      // Show toast message
      toast.success("Reset link sent on your email");

      // Wait 2.5 seconds before navigating
      setTimeout(() => {
        navigate("/dept-login");
      }, 2500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Inline styles
  const styles = {
    loginPage: {
      display: "flex",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
    },
    leftSection: {
      flex: 1,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
    },
    rightSection: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    loginBox: {
      width: "80%",
      maxWidth: "400px",
      padding: "40px",
      backgroundColor: "#fff",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      textAlign: "center",
    },
    heading: {
      fontSize: "26px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#000",
      opacity: 1, // fully visible
    },
    inputField: {
      width: "100%",
      padding: "10px",
      margin: "15px 0",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "16px",
      opacity: 1,
    },
    loginBtn: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#3498db",
      color: "#fff",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 1,
    },
    spinner: {
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #fff",
      borderRadius: "50%",
      width: "18px",
      height: "18px",
      animation: "spin 1s linear infinite",
    },
    keyframes: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
  };

  return (
    <div style={styles.loginPage}>
      <style>{styles.keyframes}</style>

      {/* ToastContainer is REQUIRED for toast messages */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div style={styles.leftSection}>
        <BackButton />
      </div>

      <div style={styles.rightSection}>
        <div style={styles.loginBox}>
          <h2 style={styles.heading}>Forgot Password</h2>

          <input
            style={styles.inputField}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <button
            style={styles.loginBtn}
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? <div style={styles.spinner}></div> : "Send Reset Link"}
          </button>

          <button
            style={{ ...styles.loginBtn, backgroundColor: "#2ecc71" }}
            onClick={() => navigate("/dept-login")}
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
