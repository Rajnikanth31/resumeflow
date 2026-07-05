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

    const job = await db.jobDescription.findFirst({
      where: { id: params.id, userId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const job = await db.jobDescription.findFirst({
      where: { id: params.id, userId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updated = await db.jobDescription.update({
      where: { id: params.id },
      data: {
        ...(title ? { title } : {}),
        ...(company ? { company } : {}),
        ...(description ? { description } : {}),
        ...(statusCollection ? { statusCollection } : {}),
        ...(industry ? { industry } : {}),
        ...(remoteType ? { remoteType } : {}),
        ...(salaryMin !== undefined ? { salaryMin } : {}),
        ...(salaryMax !== undefined ? { salaryMax } : {}),
        ...(seniority ? { seniority } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const job = await db.jobDescription.findFirst({
      where: { id: params.id, userId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await db.jobDescription.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
