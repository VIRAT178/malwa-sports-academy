// Frontend API URL Configuration
// During local dev or combined deployment, this defaults to empty string so that relative URLs work.
// For Vercel deployment, configure VITE_API_URL pointing to your Render backend URL.
const apiUrl = (import.meta as any).env.VITE_API_URL || "";
export const API_BASE = apiUrl && !apiUrl.includes("your-backend-on-render") ? apiUrl : "";
