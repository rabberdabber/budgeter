import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const usersRef = db.collection("users");
    const existingUser = await usersRef
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Firestore
    const newUserRef = await usersRef.add({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: newUserRef.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
