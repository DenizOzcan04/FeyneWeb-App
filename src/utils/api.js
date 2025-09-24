// src/utils/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); }
  catch { return {}; }
};

export function setAuth({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  // Eski sahte login kalıntısını da temizledim:
  localStorage.removeItem("isLoggedIn");
  // Navbar gibi yerlere bilgi iletimi yaptım
  window.dispatchEvent(new Event("auth:changed"));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");
  window.dispatchEvent(new Event("auth:changed"));
}

export async function api(path, opts = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && data.message) || res.statusText;
    throw new Error(msg);
  }
  return data;
}

// (İstersen dışarıdan erişmek için BASE'i de açıyoruz)
export { BASE };
