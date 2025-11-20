import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  timeout: 15000,
});

// helper to set/remove auth header
export function setToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// for quick debug in console
if (typeof window !== "undefined") window.api = api;

export default api;
