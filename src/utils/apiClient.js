import axios from "axios";
import i18n from "../i18n";

// Centralized Axios instance for talking to the Laravel backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://nexuscapitalredsea.com/api",
  withCredentials: true, // Allow cookies / session for cross-origin requests
  headers: {
    Accept: "application/json",
  },
});

// Attach the active UI language to every request so the backend can return
// localized blog post / project content (falls back to English server-side
// for any field missing a translation).
apiClient.interceptors.request.use((config) => {
  config.params = { ...(config.params || {}), lang: i18n.language || "en" };
  return config;
});

export default apiClient;


