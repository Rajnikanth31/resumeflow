import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";
import { z } from "zod";

const createSnapshotSchema = z.object({
  versionName: z.string().min(1, "Version name is required").max(100),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const resumeId = params.id;

    const resume = await db.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const versions = await db.resumeVersion.findMany({
      where: { resumeId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        resumeId: true,
        versionName: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("Resume versions fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const resumeId = params.id;

    const source = await db.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
      include: {
        profile: true,
        workHistory: true,
        education: true,
        projects: true,
        skills: true,
        customs: true,
      },
    });

    if (!source) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = createSnapshotSchema.parse(body);

    const snapshot = {
      title: source.title,
      language: source.language,
      themeColor: source.themeColor,
      fontFamily: source.fontFamily,
      fontSize: source.fontSize,
      documentSize: source.documentSize,
      spacing: source.spacing,
      profile: source.profile ? {
        name: source.profile.name,
        email: source.profile.email,
        phone: source.profile.phone,
        location: source.profile.location,
        url: source.profile.url,
        summary: source.profile.summary,
      } : null,
      workHistory: source.workHistory.map((w) => ({
        company: w.company,
        position: w.position,
        location: w.location,
        startDate: w.startDate,
        endDate: w.endDate,
        current: w.current,
        descriptions: w.descriptions,
        orderIndex: w.orderIndex,
      })),
      education: source.education.map((e) => ({
        school: e.school,
        degree: e.degree,
        fieldOfStudy: e.fieldOfStudy,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        gpa: e.gpa,
        descriptions: e.descriptions,
        orderIndex: e.orderIndex,
      })),
      projects: source.projects.map((p) => ({
        name: p.name,
        role: p.role,
        url: p.url,
        startDate: p.startDate,
        endDate: p.endDate,
        descriptions: p.descriptions,
        orderIndex: p.orderIndex,
      })),
      skills: source.skills.map((s) => ({
        name: s.name,
        level: s.level,
        category: s.category,
        orderIndex: s.orderIndex,
      })),
      customs: source.customs.map((c) => ({
        heading: c.heading,
        descriptions: c.descriptions,
        orderIndex: c.orderIndex,
      })),
    };

    const newVersion = await db.$transaction(async (tx) => {
      const count = await tx.resumeVersion.count({ where: { resumeId } });
      if (count >= 10) {
        const oldest = await tx.resumeVersion.findFirst({
          where: { resumeId },
          orderBy: { createdAt: "asc" },
        });
        if (oldest) {
          await tx.resumeVersion.delete({ where: { id: oldest.id } });
        }
      }

      return tx.resumeVersion.create({
        data: {
          resumeId,
          versionName: validatedData.versionName,
          snapshot,
        },
      });
    });

    return NextResponse.json({ version: newVersion }, { status: 201 });
  } catch (error: any) {
    console.error("Resume version creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
