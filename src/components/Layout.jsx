import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserName } from "../utils/user";   // eski fallback
import { clearAuth, getUser } from "../utils/api"; // ⬅️ ekle
import { FiHome, FiSettings, FiLogOut, FiCheckSquare } from "react-icons/fi";

function readDisplayName() {
  // Öncelik: backend'den gelen user.name; yoksa eski local profil ismi
  const u = getUser();
  return (u && u.name) || getUserName() || "Guest";
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [name, setName] = useState(readDisplayName()); // ⬅️ değişti

  useEffect(() => {
    const refresh = () => setName(readDisplayName());
    // profil veya auth değiştiğinde sidebar adını güncelle
    window.addEventListener("profile:updated", refresh);
    window.addEventListener("auth:changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("profile:updated", refresh);
      window.removeEventListener("auth:changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const logout = () => { clearAuth(); navigate("/"); };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">⚡ FeyneTasks</div>
        <div className="nav">
          <NavLink to="/dashboard" className={({isActive})=>isActive?"active":undefined}>
            <FiHome/> Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({isActive})=>isActive?"active":undefined}>
            <FiCheckSquare/> Tasks
          </NavLink>
          <NavLink to="/settings" className={({isActive})=>isActive?"active":undefined}>
            <FiSettings/> Settings
          </NavLink>
        </div>
        <div style={{marginTop:"auto",fontSize:14,opacity:.8}}>
          👤 {name}
        </div>
      </aside>

      <main>
        <div className="topbar">
          <button className="btn ghost" onClick={logout}><FiLogOut/> Logout</button>
        </div>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
