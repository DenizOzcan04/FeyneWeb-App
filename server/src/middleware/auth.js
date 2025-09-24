import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { sub,email,role,name,theme }
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(_req, res, next) {
  if (_req.user?.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}
