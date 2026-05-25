// api.js - Centralized API helper using axios
// Instead of writing the full URL and headers in every component,
// we create one axios instance with defaults set up

import axios from "axios";

// Create an axios instance with the base URL of our backend
const api = axios.create({
  // In production use Render URL, in development use localhost
  baseURL: process.env.REACT_APP_API_URL || "https://rbac-system-k0b2.onrender.com",
});

// "Interceptor" — runs before every request automatically
// This attaches the JWT token to every API call so we don't have to do it manually
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // "Bearer" is a standard prefix for JWT tokens in Authorization header , this barer sends the jwt token with every api request
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
