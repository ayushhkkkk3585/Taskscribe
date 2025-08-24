import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true },
  transcript: {
    text: { type: String, required: true },
  },
  date: { type: Date, required: true },
  tags: [{ type: String, trim: true }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // manual tasks
  summary: [{
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deadline: { type: Date },
    status: { type: String, enum: ["pending","in-progress","completed"], default: "pending" }
  }],
  status: { type: String, enum: ["active", "archived"], default: "active" },
}, { timestamps: true });

MeetingSchema.index({ managerId: 1, date: -1 });

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
