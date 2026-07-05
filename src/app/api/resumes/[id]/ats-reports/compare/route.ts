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

    const { searchParams } = new URL(req.url);
    const reportIdA = searchParams.get("reportIdA");
    const reportIdB = searchParams.get("reportIdB");

    if (!reportIdA || !reportIdB) {
      return NextResponse.json({ error: "reportIdA and reportIdB are required" }, { status: 400 });
    }

    const [reportA, reportB] = await Promise.all([
      db.aTSReport.findFirst({ where: { id: reportIdA, resumeId: params.id } }),
      db.aTSReport.findFirst({ where: { id: reportIdB, resumeId: params.id } }),
    ]);

    if (!reportA || !reportB) {
      return NextResponse.json({ error: "One or both reports not found" }, { status: 404 });
    }

    const newlyMatchedKeywords = reportB.matchedKeywords.filter(
      (k) => !reportA.matchedKeywords.includes(k)
    );

    const newlyMissingKeywords = reportB.missingKeywords.filter(
      (k) => !reportA.missingKeywords.includes(k)
    );

    return NextResponse.json({
      success: true,
      reportA: {
        id: reportA.id,
        createdAt: reportA.createdAt,
        overallScore: reportA.overallScore,
        keywordScore: reportA.keywordScore,
        semanticScore: reportA.semanticScore,
        experienceScore: reportA.experienceScore,
        projectScore: reportA.projectScore,
        educationScore: reportA.educationScore,
        qualityScore: reportA.qualityScore,
        matchedKeywords: reportA.matchedKeywords,
        missingKeywords: reportA.missingKeywords,
      },
      reportB: {
        id: reportB.id,
        createdAt: reportB.createdAt,
        overallScore: reportB.overallScore,
        keywordScore: reportB.keywordScore,
        semanticScore: reportB.semanticScore,
        experienceScore: reportB.experienceScore,
        projectScore: reportB.projectScore,
        educationScore: reportB.educationScore,
        qualityScore: reportB.qualityScore,
        matchedKeywords: reportB.matchedKeywords,
        missingKeywords: reportB.missingKeywords,
      },
      delta: {
        overallScore: reportB.overallScore - reportA.overallScore,
        keywordScore: reportB.keywordScore - reportA.keywordScore,
        semanticScore: reportB.semanticScore - reportA.semanticScore,
        experienceScore: reportB.experienceScore - reportA.experienceScore,
        projectScore: reportB.projectScore - reportA.projectScore,
        educationScore: reportB.educationScore - reportA.educationScore,
        qualityScore: reportB.qualityScore - reportA.qualityScore,
        newlyMatchedKeywords,
        newlyMissingKeywords,
      },
    });
  } catch (error: any) {
    console.error("Compare ATS Reports Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
