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

    // Check resume ownership
    const resume = await db.resume.findFirst({
      where: { id: params.id, userId, deletedAt: null },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const reports = await db.aTSReport.findMany({
      where: { resumeId: params.id },
      include: {
        job: {
          select: {
            title: true,
            company: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error: any) {
    console.error("Fetch ATS Reports Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
