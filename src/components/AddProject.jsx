import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

export default function AddProject() {
  const navigate = useNavigate();

  // 🔹 Local state for form fields
  const [name, setName] = useState("");
  const [progress, setProgress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔹 Fetch logged-in department from localStorage
  //    This ensures the project is linked to the correct department
  const loggedDept = localStorage.getItem("loggedInDepartment");

  // 🔒 Restrict access to AddProject page
  useEffect(() => {
    // If department is NOT logged in → redirect to login page
    if (!loggedDept) {
      window.location.replace("/dept-login");
    }

    // 🔐 Prevent navigating back to this page after logout
    const handlePopState = () => {
      // If no department is logged in anymore → block access
      if (!localStorage.getItem("loggedInDepartment")) {
        window.location.replace("/dept-login");
      }
    };

    // Listen for browser back/forward navigation
    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loggedDept]);

  // ➕ Add new project to localStorage
  const handleAddProject = () => {
    // Basic validation for fields + progress range 0–100
    if (!name || !startDate || !endDate || progress === "" || progress < 0 || progress > 100) {
      return alert("Please fill all fields correctly. Progress should be 0-100.");
    }

    // Get previous projects or initialize empty array
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // New project object linked to the logged-in department
    const newProject = {
      name,
      progress: Number(progress),
      startDate,
      endDate,
      department: loggedDept,
    };

    // Add new project to list
    storedProjects.push(newProject);

    // Save updated array back to localStorage
    localStorage.setItem("projects", JSON.stringify(storedProjects));

    alert(`Project "${name}" added successfully!`);

    // Redirect to dashboard (replace prevents going back)
    window.location.replace("/dept-dashboard");
  };

  return (
    <div className={styles.main}>
      <div className={styles.formPage}>
        <h2>Add Project</h2>

        {/* 🔹 Project Name Input */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Project Name</label>
        </div>

        {/* 🔹 Progress Input */}
        <div className={styles.inputGroup}>
          <input
            type="number"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            min="0"
            max="100"
            required
          />
          <label>Progress (%)</label>
        </div>

        {/* 🔹 Start Date Input */}
        <div className={styles.inputGroup}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <label>Start Date</label>
        </div>

        {/* 🔹 End Date Input */}
        <div className={styles.inputGroup}>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <label>Estimated End Date</label>
        </div>

        {/* Submit Button */}
        <button className={styles.submitBtn} onClick={handleAddProject}>
          Add Project
        </button>
      </div>
    </div>
  );
}
