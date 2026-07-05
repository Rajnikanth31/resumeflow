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
    const { description } = body;

    if (!description) {
      return NextResponse.json({ error: "description is required" }, { status: 400 });
    }

    const parserOutput = await AIRequestPipeline.execute({
      featureId: "job-parser",
      variables: { description },
      userContext: { id: userId, role: userRole, tier: userTier },
    });

    const parsed = parserOutput.content;

    const latestResume = await db.resume.findFirst({
      where: { userId, deletedAt: null },
      include: {
        skills: true,
        workHistory: true,
      },
    });

    let resumeSkills: string[] = [];
    if (latestResume) {
      resumeSkills = latestResume.skills.map((s) => s.name.toLowerCase().trim());
    }

    const jobSkills = Array.from(new Set([...parsed.requiredSkills, ...parsed.techStack]));
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    jobSkills.forEach((s) => {
      if (resumeSkills.includes(s.toLowerCase().trim())) {
        matchedSkills.push(s);
      } else {
        missingSkills.push(s);
      }
    });

    const totalCount = jobSkills.length || 1;
    const matchScore = Math.round((matchedSkills.length / totalCount) * 100);

    const matchedKeywords = matchedSkills;
    const missingKeywords = missingSkills;
    const weakKeywords = parsed.preferredSkills.filter(
      (s: string) => !resumeSkills.includes(s.toLowerCase().trim())
    );

    const suggestedSkills = parsed.preferredSkills;
    const learningRecommendations = missingSkills.map(
      (s) => `Study documentation and build a sandbox app for: ${s}`
    );

    const job = await db.jobDescription.create({
      data: {
        userId,
        title: parsed.title,
        company: parsed.company,
        description,
        industry: parsed.industry || "Technology",
        remoteType: parsed.remoteType,
        salaryMin: parsed.salaryMin || null,
        salaryMax: parsed.salaryMax || null,
        seniority: parsed.seniority || "Mid",
        techStack: parsed.techStack,
        hiringFocus: parsed.hiringFocus || "Product Engineering",
        matchScore,
        statusCollection: "SAVED",
        matchedKeywords,
        weakKeywords,
        missingKeywords,
        matchedSkills,
        missingSkills,
        suggestedSkills,
        learningRecommendations,
      },
    });

    return NextResponse.json(job);
  } catch (error: any) {
    console.error("Import Job Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
