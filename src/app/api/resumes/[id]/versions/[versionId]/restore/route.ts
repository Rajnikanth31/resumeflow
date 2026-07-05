import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const resumeId = params.id;
    const versionId = params.versionId;

    const version = await db.resumeVersion.findFirst({
      where: {
        id: versionId,
        resumeId,
        resume: {
          userId,
        },
      },
    });

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    const snapshot = version.snapshot as any;

    await db.$transaction(async (tx) => {
      await tx.resume.update({
        where: { id: resumeId },
        data: {
          title: snapshot.title,
          language: snapshot.language,
          themeColor: snapshot.themeColor,
          fontFamily: snapshot.fontFamily,
          fontSize: snapshot.fontSize,
          documentSize: snapshot.documentSize,
          spacing: snapshot.spacing,
        },
      });

      if (snapshot.profile) {
        await tx.profile.upsert({
          where: { resumeId },
          update: snapshot.profile,
          create: { ...snapshot.profile, resumeId },
        });
      } else {
        await tx.profile.deleteMany({ where: { resumeId } });
      }

      await tx.workExperience.deleteMany({ where: { resumeId } });
      if (snapshot.workHistory && snapshot.workHistory.length > 0) {
        await tx.workExperience.createMany({
          data: snapshot.workHistory.map((item: any) => ({ ...item, resumeId })),
        });
      }

      await tx.education.deleteMany({ where: { resumeId } });
      if (snapshot.education && snapshot.education.length > 0) {
        await tx.education.createMany({
          data: snapshot.education.map((item: any) => ({ ...item, resumeId })),
        });
      }

      await tx.project.deleteMany({ where: { resumeId } });
      if (snapshot.projects && snapshot.projects.length > 0) {
        await tx.project.createMany({
          data: snapshot.projects.map((item: any) => ({ ...item, resumeId })),
        });
      }

      await tx.skill.deleteMany({ where: { resumeId } });
      if (snapshot.skills && snapshot.skills.length > 0) {
        await tx.skill.createMany({
          data: snapshot.skills.map((item: any) => ({ ...item, resumeId })),
        });
      }

      await tx.customSection.deleteMany({ where: { resumeId } });
      if (snapshot.customs && snapshot.customs.length > 0) {
        await tx.customSection.createMany({
          data: snapshot.customs.map((item: any) => ({ ...item, resumeId })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resume version restore error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
