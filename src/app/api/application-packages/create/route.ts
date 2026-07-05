import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json();
    const { resumeId, jobId, coverLetterId, atsReportId, exportMetadata = {}, additionalAssets = {} } = body;

    if (!resumeId) {
      return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
    }

    const resume = await db.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found or unauthorized" }, { status: 404 });
    }

    const appPackage = await db.applicationPackage.create({
      data: {
        resumeId,
        jobId: jobId || null,
        coverLetterId: coverLetterId || null,
        atsReportId: atsReportId || null,
        exportMetadata: exportMetadata,
        additionalAssets: additionalAssets,
      },
    });

    return NextResponse.json({
      success: true,
      package: appPackage,
    });
  } catch (error: any) {
    console.error("Application Package Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
