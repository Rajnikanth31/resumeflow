import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "New password must be at least 8 characters long").optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = settingsSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, currentPassword, newPassword } = validatedData.data;
    const userId = (session.user as any).id;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }

      if (!user.passwordHash) {
        return NextResponse.json(
          { error: "Current password is not set for OAuth users" },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Incorrect current password" },
          { status: 400 }
        );
      }

      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
