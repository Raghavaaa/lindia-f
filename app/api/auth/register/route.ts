import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", email);
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create new user
    const userId = `user_${Date.now()}`;
    await db.run(
      "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
      userId,
      name,
      email,
      password
    );

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name,
        email,
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
