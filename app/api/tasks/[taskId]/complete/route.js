import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "employee") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Await params for dynamic route as per Next.js requirements
    const awaitedParams = await params;
    const { taskId } = awaitedParams;
    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 });
    }

    // Only allow employee to mark their own assigned task as complete
    const task = await Task.findOne({ _id: taskId, assignedTo: decoded.id });
    if (!task) {
      return NextResponse.json({ error: "Task not found or not assigned to you" }, { status: 404 });
    }

    // Update the status field instead of completed
    task.status = "completed";
    await task.save();

    return NextResponse.json({ message: "Task marked as complete", task }, { status: 200 });
  } catch (error) {
    console.error("Task complete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
