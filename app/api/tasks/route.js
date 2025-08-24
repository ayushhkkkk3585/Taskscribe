import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    let query = {};
    if (decoded.role === "employee") {
      query.assignedTo = decoded.id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('meetingId', 'title')
      .lean() || [];

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Tasks fetch error:", error);
    return NextResponse.json({ tasks: [], error: error.message }, { status: 500 });
  }
}