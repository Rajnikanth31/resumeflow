import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { AIRequestPipeline } from "lib/ai/pipeline";
import { db } from "lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role || "USER";
    const userTier = (session.user as any).tier || "FREE";

    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const resume = await db.resume.findFirst({
      where: { id: params.id, userId, deletedAt: null },
      include: {
        profile: true,
        workHistory: true,
        projects: true,
      },
    });

    const job = await db.jobDescription.findFirst({
      where: { id: jobId, userId },
    });

    if (!resume || !job) {
      return NextResponse.json({ error: "Resume or Job not found" }, { status: 404 });
    }

    const resumeString = JSON.stringify({
      summary: resume.profile?.summary || "",
      workExperiences: resume.workHistory.map((w) => ({
        company: w.company,
        descriptions: w.descriptions,
      })),
      projects: resume.projects.map((p) => ({
        project: p.name,
        descriptions: p.descriptions,
      })),
    });

    const tailorOutput = await AIRequestPipeline.execute({
      featureId: "resume-tailor",
      variables: {
        resume: resumeString,
        jobDescription: job.description,
      },
      userContext: { id: userId, role: userRole, tier: userTier },
    });

    // Track relation link between this resume and this job
    await db.resumeJobLink.upsert({
      where: {
        resumeId_jobDescriptionId: {
          resumeId: params.id,
          jobDescriptionId: jobId,
        },
      },
      update: {},
      create: {
        resumeId: params.id,
        jobDescriptionId: jobId,
      },
    });

    return NextResponse.json({
      success: true,
      tailored: tailorOutput.content,
    });
  } catch (error: any) {
    console.error("Resume Tailoring Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
