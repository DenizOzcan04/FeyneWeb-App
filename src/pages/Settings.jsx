import { useEffect, useState } from "react";
import { getTheme, setTheme } from "../utils/theme";
import { getUserName, setUserName } from "../utils/user";
import { api } from "../utils/api";
import { toast } from "react-toastify";

export default function Settings() {
  const hasToken = !!localStorage.getItem("token");

  const [theme, setThemeState] = useState(getTheme());
  const [name, setName] = useState(getUserName());
  const [loading, setLoading] = useState(false);

  // Tema seçildiğinde uygulamaya uygula
  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  // Token varsa açılışta backend'den me çek
  useEffect(() => {
    if (!hasToken) return;
    (async () => {
      try {
        setLoading(true);
        const me = await api("/auth/me");
        setName(me.name ?? "Guest");
        setThemeState(me.theme ?? "light");
        setTheme(me.theme ?? "light");
      } catch (e) {
        // sessizce geç
      } finally {
        setLoading(false);
      }
    })();
  }, [hasToken]);

  const handleThemeChange = (e) => {
    const next = e.target.value;
    setThemeState(next);
    setTheme(next);
  };

  const handleNameSave = async (e) => {
    e.preventDefault();
    try {
      if (hasToken) {
        const updated = await api("/auth/me", {
          method: "PUT",
          body: JSON.stringify({ name, theme }),
        });

        // Navbar'ın ismi güncellemesi için:
        const uStr = localStorage.getItem("user");
        if (uStr) {
          const u = JSON.parse(uStr);
          u.name = updated.name;
          u.theme = updated.theme;
          localStorage.setItem("user", JSON.stringify(u));
        }
        window.dispatchEvent(new Event("profile:updated"));

        toast.success("Profil güncellendi");
      } else {
        const saved = setUserName(name);
        setName(saved);
        toast.success("Profil güncellendi ");
      }
    } catch (err) {
      toast.error(err.message || "Güncelleme başarısız");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Ayarlar</h2>
      {loading && (
        <p style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          Bilgiler yükleniyor...
        </p>
      )}

      <section style={{ marginTop: 16, border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
        <h3>Tema</h3>
        <label style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <span>Seç:</span>
          <select value={theme} onChange={handleThemeChange}>
            <option value="light">Açık</option>
            <option value="dark">Koyu</option>
          </select>
        </label>
      </section>

      <section style={{ marginTop: 16, border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
        <h3>Profil</h3>
        <form onSubmit={handleNameSave} style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            placeholder="Adınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 8 }}
          />
          <button type="submit" disabled={loading}>Kaydet</button>
        </form>
        <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          Menüde isim olarak gösterilir.
        </p>
      </section>
    </div>
  );
}
