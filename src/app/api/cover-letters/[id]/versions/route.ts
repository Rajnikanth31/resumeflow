import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const coverLetter = await db.coverLetter.findFirst({
      where: { id: params.id, resume: { userId } },
    });

    if (!coverLetter) {
      return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
    }

    const versions = await db.coverLetterVersion.findMany({
      where: { coverLetterId: params.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      versions,
    });
  } catch (error: any) {
    console.error("Fetch Versions Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const coverLetter = await db.coverLetter.findFirst({
      where: { id: params.id, resume: { userId } },
    });

    if (!coverLetter) {
      return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
    }

    const body = await req.json();
    const { versionName, content } = body;

    if (!versionName || !content) {
      return NextResponse.json({ error: "versionName and content are required" }, { status: 400 });
    }

    const version = await db.coverLetterVersion.create({
      data: {
        coverLetterId: params.id,
        versionName,
        content,
      },
    });

    // Update main cover letter content
    await db.coverLetter.update({
      where: { id: params.id },
      data: { content },
    });

    return NextResponse.json({
      success: true,
      version,
    });
  } catch (error: any) {
    console.error("Create Version Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
