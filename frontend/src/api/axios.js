import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const saved = localStorage.getItem("userInfo");

  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }

  return config;
});

export default API;