import dbConnect from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
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

    let meetings = [];  // Initialize as empty array
    if (decoded.role === "manager") {
      meetings = await Meeting.find({ managerId: decoded.id })
        .populate("tasks")
        .populate({
          path: "summary.assignedTo",
          select: "name email",
          model: "User"
        })
        .populate({
          path: "tasks",
          populate: {
            path: "assignedTo",
            select: "name email",
            model: "User"
          }
        })
        .lean() || [];
    } else {
      meetings = await Meeting.find({ "summary.assignedTo": decoded.id })
        .populate("tasks")
        .populate({
          path: "summary.assignedTo",
          select: "name email",
          model: "User"
        })
        .populate({
          path: "tasks",
          populate: {
            path: "assignedTo",
            select: "name email",
            model: "User"
          }
        })
        .lean() || [];
    }

    // Ensure meetings is always an array
    if (!Array.isArray(meetings)) {
      meetings = [];
    }

    return NextResponse.json({ meetings }, { status: 200 });
  } catch (error) {
    console.error("Meetings fetch error:", error);
    return NextResponse.json({ meetings: [], error: error.message }, { status: 500 });
  }
}