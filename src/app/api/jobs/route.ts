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
    const {
      title,
      company,
      description,
      statusCollection,
      industry,
      remoteType,
      salaryMin,
      salaryMax,
      seniority,
    } = body;

    if (!title || !company || !description) {
      return NextResponse.json(
        { error: "title, company and description are required" },
        { status: 400 }
      );
    }

    const job = await db.jobDescription.create({
      data: {
        userId,
        title,
        company,
        description,
        statusCollection: statusCollection || "SAVED",
        industry,
        remoteType,
        salaryMin,
        salaryMax,
        seniority,
      },
    });

    return NextResponse.json(job);
  } catch (error: any) {
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

    const jobs = await db.jobDescription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
