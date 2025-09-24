import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const r = Router();

/** DEV: Admin seed (sadece geliştirme amaçlı) */
r.post("/seed-admin", async (req, res) => {
  if (process.env.NODE_ENV === "production")
    return res.status(403).json({ message: "Not allowed in production" });

  const { email = "admin@local", password = "1234", name = "Admin" } = req.body ?? {};
  const exists = await User.findOne({ email });
  if (exists) return res.json({ ok: true, note: "already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, role: "admin", name });
  res.json({ ok: true });
});

/** Login */
r.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role, name: user.name, theme: user.theme },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role, name: user.name, theme: user.theme }
  });
});

/** Me (token doğrulama testi) */
r.get("/me", auth, async (req, res) => {
  const u = await User.findById(req.user.sub).lean();
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json({ id: u._id, email: u.email, role: u.role, name: u.name, theme: u.theme });
});

export default r;

r.put("/me", auth, async (req, res) => {
  const { name, theme } = req.body ?? {};
  const update = {};
  if (name !== undefined) update.name = String(name).trim() || "Guest";
  if (theme && ["light", "dark"].includes(theme)) update.theme = theme;

  const u = await User.findByIdAndUpdate(req.user.sub, update, { new: true });
  if (!u) return res.status(404).json({ message: "User not found" });

  res.json({ id: u._id, email: u.email, role: u.role, name: u.name, theme: u.theme });
});
