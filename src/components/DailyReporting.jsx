// Updated DailyReporting.jsx with department-based filtering, login protection, and remarks saving
// No CSS or layout changes

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

export default function DailyReporting() {
  const navigate = useNavigate();

  // State to store department projects
  const [projects, setProjects] = useState([]);

  // Selected project for updating
  const [selectedProject, setSelectedProject] = useState("");

  // Progress value entered by user
  const [progressUpdate, setProgressUpdate] = useState("");

  // Remarks entered by user
  const [remarks, setRemarks] = useState("");

  // ✅ Get currently logged-in department from localStorage
  const loggedDept = localStorage.getItem("loggedInDepartment");

  /**
   * ---------------------------------------------------------
   * 🔐 LOGIN VALIDATION + BLOCKING BROWSER BACK/FORWARD
   * ---------------------------------------------------------
   * - If department is not logged in → redirect to login page
   * - Use window.location.replace() to prevent going back
   * - Add popstate listener to block browser back/forward access
   */
  useEffect(() => {
    // If not logged in, redirect immediately
    if (!loggedDept) {
      window.location.replace("/dept-login");
    }

    // Block back/forward navigation if logged out
    const handlePopState = () => {
      if (!localStorage.getItem("loggedInDepartment")) {
        window.location.replace("/dept-login");
      }
    };

    // Attach event listener
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loggedDept]);

  /**
   * ---------------------------------------------------------
   * 📌 LOAD PROJECTS BELONGING ONLY TO LOGGED-IN DEPARTMENT
   * ---------------------------------------------------------
   * - Fetch all projects stored in localStorage
   * - Filter only those that match this department
   * - Store department-specific projects in state
   */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects")) || [];

    // Filter department-wise projects
    const deptProjects = stored.filter(
      (p) => p.department === loggedDept
    );

    setProjects(deptProjects);
  }, [loggedDept]);

  /**
   * ---------------------------------------------------------
   * 🚀 UPDATE PROJECT PROGRESS & REMARKS
   * ---------------------------------------------------------
   * - Must select a project and enter progress
   * - Update the matching project inside localStorage
   * - Save remarks (if any)
   * - Refresh department project list
   * - Redirect to dashboard after update
   */
  const handleUpdate = () => {
    // Validation for required inputs
    if (!selectedProject || progressUpdate === "") {
      return alert("Please select a project and enter progress.");
    }

    const stored = JSON.parse(localStorage.getItem("projects")) || [];

    // Update matching project with new progress & remarks
    const updatedAll = stored.map((p) =>
      p.name === selectedProject && p.department === loggedDept
        ? {
            ...p,
            progress: Number(progressUpdate),
            remarks: remarks || ""
          }
        : p
    );

    // Store updated data back to storage
    localStorage.setItem("projects", JSON.stringify(updatedAll));

    // Refresh UI with only this department's updated projects
    setProjects(updatedAll.filter((p) => p.department === loggedDept));

    alert("Progress updated successfully!");

    // Reset fields
    setProgressUpdate("");
    setRemarks("");

    // Redirect back to department dashboard
    navigate("/dept-dashboard");
  };

  return (
    <div className={styles.reportingMain}>
      {/* Page Heading */}
      <h1 className={styles.pageTitle}>Daily Reporting - {loggedDept}</h1>

      {/* Reporting Card */}
      <div className={styles.reportingCard}>
        <h2 className={styles.sectionTitle}>Update Project Progress</h2>

        {/* Project Dropdown */}
        <label className={styles.reportingLabel}>Select Project</label>
        <select
          className={styles.reportingSelect}
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">-- Select Project --</option>
          {projects.map((p, idx) => (
            <option key={idx} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Progress Input */}
        <label className={styles.reportingLabel}>Progress (%)</label>
        <input
          className={styles.reportingInput}
          type="number"
          placeholder="Enter progress"
          value={progressUpdate}
          onChange={(e) => setProgressUpdate(e.target.value)}
          min="0"
          max="100"
        />

        {/* Remarks */}
        <label className={styles.ReportingLabel}>Remarks</label>
        <textarea
          className={styles.reportingTextarea}
          placeholder="Add remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        ></textarea>

        {/* Submit Button */}
        <button className={styles.reportingButton} onClick={handleUpdate}>
          Update Progress
        </button>
      </div>
    </div>
  );
}
