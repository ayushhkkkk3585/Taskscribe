import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 400 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 400 });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return new Response(JSON.stringify({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      position: user.position,
    },
    token
  }), { status: 200 });
}
