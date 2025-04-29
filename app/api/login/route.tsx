import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json(); // username is actually email for owner

  // --- Admin check ---
  if (username === "admin" && password === "password123") {
    const response = NextResponse.json(
      { message: "Authentication successful (admin)" },
      { status: 200 }
    );
    response.cookies.set("auth", "true", { httpOnly: true });
    return response;
  }

  // --- Owner check ---
  try {
    const ownerRes = await fetch("http://localhost:3000/api/owner", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });

    if (!ownerRes.ok) {
      return NextResponse.json(
        { message: "Failed to fetch owner data." },
        { status: 500 }
      );
    }

    const { owners } = await ownerRes.json();

    // Hash the password entered by user using MD5
    const hashedPassword = crypto.createHash("md5").update(password).digest("hex");

    const matchedOwner = owners.find(
      (owner) => owner.email === username && owner.password === hashedPassword
    );

    if (matchedOwner) {
      const response = NextResponse.json(
        {
          message: "Authentication successful (owner)",
          role: "owner",
          ownerId: matchedOwner._id, // include the ID
        },
        { status: 200 }
      );
      response.cookies.set("auth", "true", { httpOnly: true });
      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server error during authentication." },
      { status: 500 }
    );
  }
}
