import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// TaskSchema.index({ assignedTo: 1, deadline: 1 });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
