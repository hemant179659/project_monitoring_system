import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Request Interceptor (Token chipkane ke liye)
API.interceptors.request.use((config) => {
  // ✅ Dono tokens check karo, jo mil jaye wo bhej do
  const adminToken = localStorage.getItem("adminToken");
  const deptToken = localStorage.getItem("deptToken");
  const destoToken = localStorage.getItem("destoToken");
  
  const token = deptToken || adminToken || destoToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;