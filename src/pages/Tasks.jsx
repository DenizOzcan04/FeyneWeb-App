import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  listTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} from "../utils/tasksApi";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  // Listeyi yükle
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await listTasks();
      setTasks(data); // [{ _id, title, priority, done, createdAt }]
    } catch (e) {
      toast.error(e.message || "Görevler alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // CRUD
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warn("Başlık boş olamaz!");
      return;
    }
    try {
      const newTask = await createTask({ title: title.trim(), priority });
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setPriority("medium");
      toast.success("Görev eklendi ✅");
      window.dispatchEvent(new Event("tasks:changed"));
    } catch (e) {
      toast.error(e.message || "Ekleme hatası");
    }
  };

  const onToggle = async (id) => {
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.info("Görev durumu değiştirildi 🔄");
      window.dispatchEvent(new Event("tasks:changed"));
    } catch (e) {
      toast.error(e.message || "Durum değiştirilemedi");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Bu görevi silmek istediğine emin misin?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (editingId === id) cancelEdit();
      toast.error("Görev silindi ❌");
      window.dispatchEvent(new Event("tasks:changed"));
    } catch (e) {
      toast.error(e.message || "Silme hatası");
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  const saveEdit = async (e) => {
    e?.preventDefault?.();
    if (!editTitle.trim()) {
      toast.warn("Görev boş olamaz!");
      return;
    }
    try {
      const updated = await updateTask(editingId, {
        title: editTitle.trim(),
        priority: editPriority,
      });
      setTasks((prev) => prev.map((t) => (t._id === editingId ? updated : t)));
      cancelEdit();
      toast.success("Görev güncellendi ✏️");
    } catch (e) {
      toast.error(e.message || "Güncelleme hatası");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditPriority("medium");
  };

  // filtre + arama (client-side)
  const filtered = tasks
    .filter((t) =>
      filter === "all" ? true : filter === "done" ? t.done : !t.done
    )
    .filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Tasks</h2>

      {/* Ekleme Formu */}
      <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Yeni görev başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
        <button type="submit">Ekle</button>
      </form>

      {/* Arama & Filtre */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Ara..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 8 }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Hepsi</option>
          <option value="todo">Bekleyen</option>
          <option value="done">Tamamlanan</option>
        </select>
      </div>

      {/* Liste */}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <ul style={{ display: "grid", gap: 8, listStyle: "none", padding: 0 }}>
          {filtered.length === 0 && <li>Görev yok.</li>}

          {filtered.map((t) => (
            <li
              key={t._id}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: t.done ? "#f2fff2" : "white",
              }}
            >
              <div style={{ flex: 1, marginRight: 12 }}>
                {editingId === t._id ? (
                  <form onSubmit={saveEdit} style={{ display: "flex", gap: 8 }}>
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ padding: 8, flex: 1 }}
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </form>
                ) : (
                  <>
                    <div
                      style={{
                        textDecoration: t.done ? "line-through" : "none",
                        fontWeight: 600,
                      }}
                    >
                      {t.title}
                    </div>
                    <small>
                      Öncelik: {t.priority} •{" "}
                      {new Date(t.createdAt).toLocaleString()}
                    </small>
                  </>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {editingId === t._id ? (
                  <>
                    <button onClick={saveEdit}>Kaydet</button>
                    <button onClick={cancelEdit}>İptal</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => onToggle(t._id)}>
                      {t.done ? "Geri Al" : "Tamamla"}
                    </button>
                    <button onClick={() => startEdit(t)}>Düzenle</button>
                    <button onClick={() => onDelete(t._id)}>Sil</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
