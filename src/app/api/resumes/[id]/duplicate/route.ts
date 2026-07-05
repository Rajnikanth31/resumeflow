import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";

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

    const copy = await db.$transaction(async (tx) => {
      const newResume = await tx.resume.create({
        data: {
          userId,
          title: `Copy of ${source.title}`,
          language: source.language,
          themeColor: source.themeColor,
          fontFamily: source.fontFamily,
          fontSize: source.fontSize,
          documentSize: source.documentSize,
          spacing: source.spacing,
          profile: source.profile
            ? {
                create: {
                  name: source.profile.name,
                  email: source.profile.email,
                  phone: source.profile.phone,
                  location: source.profile.location,
                  url: source.profile.url,
                  summary: source.profile.summary,
                },
              }
            : undefined,
          workHistory: {
            createMany: {
              data: source.workHistory.map((item) => ({
                company: item.company,
                position: item.position,
                location: item.location,
                startDate: item.startDate,
                endDate: item.endDate,
                current: item.current,
                descriptions: item.descriptions,
                orderIndex: item.orderIndex,
              })),
            },
          },
          education: {
            createMany: {
              data: source.education.map((item) => ({
                school: item.school,
                degree: item.degree,
                fieldOfStudy: item.fieldOfStudy,
                location: item.location,
                startDate: item.startDate,
                endDate: item.endDate,
                gpa: item.gpa,
                descriptions: item.descriptions,
                orderIndex: item.orderIndex,
              })),
            },
          },
          projects: {
            createMany: {
              data: source.projects.map((item) => ({
                name: item.name,
                role: item.role,
                url: item.url,
                startDate: item.startDate,
                endDate: item.endDate,
                descriptions: item.descriptions,
                orderIndex: item.orderIndex,
              })),
            },
          },
          skills: {
            createMany: {
              data: source.skills.map((item) => ({
                name: item.name,
                level: item.level,
                category: item.category,
                orderIndex: item.orderIndex,
              })),
            },
          },
          customs: {
            createMany: {
              data: source.customs.map((item) => ({
                heading: item.heading,
                descriptions: item.descriptions,
                orderIndex: item.orderIndex,
              })),
            },
          },
        },
        include: {
          profile: true,
          workHistory: true,
          education: true,
          projects: true,
          skills: true,
          customs: true,
        },
      });

      return newResume;
    });

    return NextResponse.json({ resume: copy }, { status: 201 });
  } catch (error) {
    console.error("Resume duplicate error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
