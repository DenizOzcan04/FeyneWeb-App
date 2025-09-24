import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserName } from "../utils/user";

function isAuthed() {
  const legacy = localStorage.getItem("isLoggedIn") === "true";
  const token = !!localStorage.getItem("token"); // backend sonrası
  return legacy || token;
}

export default function Navbar() {
  const navigate = useNavigate();
  const [name, setName] = useState(getUserName());
  const [authed, setAuthed] = useState(isAuthed());

  useEffect(() => {
    const onProfile = () => setName(getUserName());
    const onStorage = () => setAuthed(isAuthed());
    window.addEventListener("profile:updated", onProfile);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("profile:updated", onProfile);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthed(false);
    navigate("/");
  };

  const linkStyle = { marginRight: 12, textDecoration: "none" };

  return (
    <nav
      style={{
        padding: 12,
        borderBottom: "1px solid var(--border, #eee)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* sol: marka + herkese açık linkler */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link to="/" style={{ ...linkStyle, fontWeight: 700 }}>FeyneTask</Link>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/about" style={linkStyle}>Hakkımızda</Link>

        {/* sadece oturum açılmışsa admin linkleri */}
        {authed && (
          <>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/tasks" style={linkStyle}>Tasks</Link>
            <Link to="/settings" style={linkStyle}>Settings</Link>
          </>
        )}
      </div>

      {/* sağ taraf */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        {authed ? (
          <>
            <span style={{ opacity: 0.8 }}>👤 {name}</span>
            <button onClick={handleLogout}>Çıkış</button>
          </>
        ) : (
          <Link to="/login" style={linkStyle}>Giriş Yap</Link>
        )}
      </div>
    </nav>
  );
}
