export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://bookmyshow-backend.onrender.com"
    : "http://localhost:5000";