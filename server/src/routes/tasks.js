import { Router } from "express";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";

const r = Router();

// Tüm uçlar auth gerektirir
r.use(auth);

// Listele (en yeni üstte)
r.get("/", async (req, res) => {
  const list = await Task.find({ user: req.user.sub }).sort({ createdAt: -1 }).lean();
  res.json(list);
});

// Ekle
r.post("/", async (req, res) => {
  const { title, priority = "medium" } = req.body ?? {};
  if (!title?.trim()) return res.status(400).json({ message: "Title required" });

  const t = await Task.create({
    user: req.user.sub,
    title: title.trim(),
    priority
  });
  res.status(201).json(t);
});

// Güncelle
r.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, priority, done } = req.body ?? {};
  const update = {};
  if (title !== undefined) update.title = String(title).trim();
  if (priority !== undefined) update.priority = priority;
  if (done !== undefined) update.done = !!done;

  const t = await Task.findOneAndUpdate({ _id: id, user: req.user.sub }, update, { new: true });
  if (!t) return res.status(404).json({ message: "Task not found" });
  res.json(t);
});

// Sil
r.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const ok = await Task.findOneAndDelete({ _id: id, user: req.user.sub });
  if (!ok) return res.status(404).json({ message: "Task not found" });
  res.json({ ok: true });
});

// (Opsiyonel) Done toggle
r.patch("/:id/toggle", async (req, res) => {
  const { id } = req.params;
  const t = await Task.findOne({ _id: id, user: req.user.sub });
  if (!t) return res.status(404).json({ message: "Task not found" });
  t.done = !t.done;
  await t.save();
  res.json(t);
});

// Dashboard için küçük istatistik
r.get("/stats/summary", async (req, res) => {
  const agg = await Task.aggregate([
    { $match: { user: new (Task.db.base.Types.ObjectId)(req.user.sub) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        done: { $sum: { $cond: ["$done", 1, 0] } }
      }
    }
  ]);
  const { total = 0, done = 0 } = agg[0] || {};
  const pending = total - done;

  const recent = await Task.find({ user: req.user.sub })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  res.json({ total, done, pending, recent });
});

export default r;
