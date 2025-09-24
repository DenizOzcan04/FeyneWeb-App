// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuth } from "../utils/api";
import { setTheme } from "../utils/theme";
import logoImage from "../images/logo.png";

export default function Login() {
  const [username, setUsername] = useState(""); // e-posta
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Backend login
      const { token, user } = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: username, password }),
      });

      // Kimliği tarayıcıya yaz ve temayı uygula
      setAuth({ token, user });
      setTheme(user?.theme || "light");

      // Rol bazlı yönlendirme
      navigate(user?.role === "admin" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #fdf6ec, #fffaf0)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#e0d2d2ff",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "360px",
          textAlign: "center",
        }}
      >
        <img
          src={logoImage}
          alt="Logo"
          style={{
            width: "145px",
            marginBottom: "1rem",
            filter: "brightness(1.5)",
          }}
        />

        <h2 style={{ marginBottom: "1.6rem", color: "#333" }}>Giriş Yap</h2>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Kullanıcı Adı (e-posta)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #ddd",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #ddd",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "none",
            background: "#4facfe",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.3s ease",
            opacity: loading ? 0.8 : 1,
          }}
          onMouseOver={(e) => (e.target.style.background = "#00c6ff")}
          onMouseOut={(e) => (e.target.style.background = "#4facfe")}
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
