import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    name: { type: String, default: "Guest" },
    theme: { type: String, enum: ["light", "dark"], default: "light" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
