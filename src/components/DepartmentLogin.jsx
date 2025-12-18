import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DepartmentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) {
      navigate("/dept-dashboard", { replace: true });
    }
  }, [navigate]);

  // Prevent back navigation
  useEffect(() => {
    window.history.replaceState({ page: "login" }, "", window.location.href);
    window.history.pushState({ page: "login_dummy" }, "", window.location.href);

    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const handleLogin = async () => {

    if (!email || !password) {
      return toast.error("Please enter email and password");
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/department/login",
        { email, password }
      );

      // Save department into localStorage for dashboard access
      localStorage.setItem("loggedInDepartment", response.data.deptName);

      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/dept-dashboard");
      }, 1200);

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className={styles.loginPage}>
        <div
          className={styles.leftSection}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <BackButton onClick={() => navigate("/", { replace: true })} />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.loginBox}>
            <h2>Department Login</h2>

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

            <div className={styles.linkGroup}>
              <button
                className={styles.loginBtn}
                onClick={() => navigate("/dept-signup")}
              >
                Signup
              </button>

              <button
                className={styles.loginBtn}
                onClick={() => navigate("/dept-forgot")}
              >
                Forgot Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
