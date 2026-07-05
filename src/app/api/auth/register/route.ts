import { NextResponse } from "next/server";
import { db } from "lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = validatedData.data;

    // Check if duplicate user exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
