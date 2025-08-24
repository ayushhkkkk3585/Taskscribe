import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true }, // hashed with bcrypt
  role: { type: String, enum: ["manager", "employee"], default: "employee" },
  department: { type: String, trim: true },
  position: { type: String, trim: true },
}, { timestamps: true });

UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
