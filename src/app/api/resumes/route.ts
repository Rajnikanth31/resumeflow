import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";
import { z } from "zod";

const createResumeSchema = z.object({
  title: z.string().min(1, "Title is required").default("My Resume"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      // Allow empty payload for default creation
    }

    const validatedData = createResumeSchema.parse(body);

    const resume = await db.resume.create({
      data: {
        userId,
        title: validatedData.title,
        profile: {
          create: {
            name: session.user.name || "",
            email: session.user.email || "",
            summary: "",
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error: any) {
    console.error("Resume create error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const resumes = await db.resume.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Resumes fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
