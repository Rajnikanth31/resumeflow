import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { AIRequestPipeline } from "lib/ai/pipeline";
import { db } from "lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role || "USER";
    const userTier = (session.user as any).tier || "FREE";

    const body = await req.json();
    const { resumeId, jobId, tone = "Formal" } = body;

    if (!resumeId) {
      return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
    }

    const resume = await db.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
      include: {
        profile: true,
        workHistory: true,
        projects: true,
        skills: true,
        education: true,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const job = jobId ? await db.jobDescription.findFirst({
      where: { id: jobId, userId },
    }) : null;

    const company = job?.company || "Target Company";
    const role = job?.title || "Target Role";
    const industry = job?.industry || "Software Industry";
    const hiringStyle = job?.hiringFocus || "Standard Recruiter Style";

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
      skills: resume.skills.map((s) => s.name),
    });

    const aiOutput = await AIRequestPipeline.execute({
      featureId: "cover-letter-generator",
      variables: {
        resume: resumeString,
        jobDescription: job?.description || "Generic Application",
        tone,
        company,
        role,
        industry,
        hiringStyle,
      },
      userContext: { id: userId, role: userRole, tier: userTier },
    });

    let contentObj;
    try {
      contentObj = typeof aiOutput.content === "string" ? JSON.parse(aiOutput.content) : aiOutput.content;
    } catch (e) {
      throw new Error("Invalid cover letter generator response format");
    }

    // Save in DB
    const coverLetter = await db.coverLetter.create({
      data: {
        resumeId,
        jobId: jobId || null,
        title: `Cover Letter for ${role} at ${company}`,
        content: contentObj.content ?? "",
        tone,
        qualityScore: contentObj.qualityScore ?? {},
        explanations: contentObj.explanations ?? {},
      },
    });

    // Create Initial Version
    const version = await db.coverLetterVersion.create({
      data: {
        coverLetterId: coverLetter.id,
        versionName: "Initial Version",
        content: contentObj.content ?? "",
      },
    });

    return NextResponse.json({
      success: true,
      coverLetter,
      version,
    });
  } catch (error: any) {
    console.error("Cover Letter Generator Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
