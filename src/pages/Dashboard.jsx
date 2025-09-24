import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getSummary } from "../utils/tasksApi";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, done: 0, pending: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const s = await getSummary();            // { total, done, pending, recent: [] }
      setStats({ total: s.total, done: s.done, pending: s.pending });
      setRecent(s.recent || []);
    } catch (e) {
      setErr(e.message || "Özet getirilemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
  const onChanged = () => load();
  window.addEventListener("tasks:changed", onChanged);

  // (İsteğe bağlı) Sekmeye geri dönünce güncelle:
  const onFocus = () => load();
  window.addEventListener("visibilitychange", onFocus);

  return () => {
    window.removeEventListener("tasks:changed", onChanged);
    window.removeEventListener("visibilitychange", onFocus);
  };
}, []);


  return (
    <div className="content">
      {/* Başlık + sağ üstte hızlı aksiyonlar */}
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <div className="right-actions" style={{marginLeft: "auto", display:"flex", gap:8}}>
          <button className="btn" onClick={load}>Yenile</button>
          <a href="/tasks" className="btn primary">+ Yeni Görev</a>
        </div>
      </div>

      {err && <p style={{color:"tomato", marginTop:8}}>{err}</p>}

      {/* KPI kartları */}
      <div className="card-grid" style={{marginTop:12}}>
        <div className="card kpi">
          <div>
            <div className="label">Toplam Görev</div>
            <div className="value">{stats.total}</div>
          </div>
        </div>
        <div className="card kpi">
          <div>
            <div className="label">Tamamlanan</div>
            <div className="value">{stats.done}</div>
          </div>
        </div>
        <div className="card kpi">
          <div>
            <div className="label">Bekleyen</div>
            <div className="value">{stats.pending}</div>
          </div>
        </div>
      </div>

      {/* İki sütunlu içerik */}
      <div className="grid-2" style={{marginTop:16}}>
        {/* SOL: Son eklenen görevler */}
        <section>
          <div className="section-title">Son Eklenen Görevler</div>
          <div className="card" style={{padding:0}}>
            {loading ? (
              <div style={{padding:12, color:"var(--muted)"}}>Yükleniyor…</div>
            ) : (
              <ul style={{listStyle:"none", margin:0, padding:0}}>
                {recent.length === 0 && (
                  <li style={{padding:12, color:"var(--muted)"}}>Henüz görev eklenmemiş.</li>
                )}
                {recent.map(t=>(
                  <li key={t._id} style={{padding:"12px 14px", borderBottom:"1px solid var(--border)"}}>
                    <div style={{fontWeight:600}}>{t.title}</div>
                    <small style={{color:"var(--muted)"}}>
                      Öncelik: {t.priority} • {t.done ? "Tamamlandı" : "Bekliyor"} • {new Date(t.createdAt).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* SAĞ: Pasta grafik + legend */}
        <section>
          <div className="section-title">Tamamlanma Oranı</div>
          <div className="card" style={{height:280, display:"flex", flexDirection:"column", justifyContent:"center"}}>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Tamamlanan", value: stats.done },
                      { name: "Bekleyen", value: stats.pending },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    stroke="none"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">
              <span><span className="dot" style={{background:"#22c55e"}}></span> Tamamlanan</span>
              <span><span className="dot" style={{background:"#ef4444"}}></span> Bekleyen</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
