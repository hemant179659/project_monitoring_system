import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProject() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [progress, setProgress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [designation, setDesignation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [budget, setBudget] = useState("");
  const [remarks, setRemarks] = useState("");

  const loggedDept = localStorage.getItem("loggedInDepartment");

  useEffect(() => {
    if (!loggedDept) {
      toast.error("You must log in first");
      navigate("/dept-login", { replace: true });
    }
  }, [loggedDept, navigate]);

  const handleAddProject = async () => {
    // Convert numeric fields
    const progressValue = Number(progress);
    const budgetValue = Number(budget);

    if (
      !name ||
      !startDate ||
      !endDate ||
      !contactPerson ||
      !designation ||
      !contactNumber ||
      progress === "" ||
      isNaN(progressValue) ||
      progressValue < 0 ||
      progressValue > 100 ||
      budget === "" ||
      isNaN(budgetValue) ||
      budgetValue <= 0
    ) {
      toast.warning(
        "Please fill all fields correctly. Progress must be 0–100 and budget must be greater than 0."
      );
      return;
    }

    try {
      await axios.post("http://localhost:8000/department/add-project", {
        name,
        progress: progressValue,
        startDate,
        endDate,
        department: loggedDept,
        contactPerson,
        designation,
        contactNumber,
        budgetAllocated: budgetValue,
        remarks,
      });

      toast.success("Project added successfully!");
      setTimeout(() => navigate("/dept-dashboard", { replace: true }), 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add project");
    }
  };

  // Inline styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f4f6f9",
    padding: "20px",
  };

  const formStyle = {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px",
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  };

  const labelStyle = {
    marginBottom: "6px",
    fontWeight: 600,
    color: "#333",
  };

  const inputStyle = {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "80px",
    resize: "vertical",
  };

  const buttonStyle = {
    marginTop: "15px",
    padding: "12px",
    width: "100%",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div style={containerStyle}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div style={formStyle}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#000",
            fontWeight: 700,
            opacity: 1,
            letterSpacing: "0.5px",
          }}
        >
          Add Project
        </h2>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Progress (%)</label>
          <input
            type="number"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            min="0"
            max="100"
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Estimated End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Contact Person Name</label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Contact Number</label>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Budget Allocated (in lakhs)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            min="0"
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Remarks (optional)</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={textareaStyle}
          ></textarea>
        </div>

        <button style={buttonStyle} onClick={handleAddProject}>
          Add Project
        </button>
      </div>
    </div>
  );
}
