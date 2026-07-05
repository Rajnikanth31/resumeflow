import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";
import { z } from "zod";

const resumeUpdateSchema = z.object({
  title: z.string().optional(),
  language: z.string().optional(),
  themeColor: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  documentSize: z.string().optional(),
  spacing: z.number().optional(),
  profile: z
    .object({
      name: z.string().default(""),
      email: z.string().default(""),
      phone: z.string().default(""),
      location: z.string().default(""),
      url: z.string().default(""),
      summary: z.string().default(""),
    })
    .optional(),
  workHistory: z
    .array(
      z.object({
        company: z.string(),
        position: z.string(),
        location: z.string().nullable().optional(),
        startDate: z.string(),
        endDate: z.string().nullable().optional(),
        current: z.boolean().default(false),
        descriptions: z.array(z.string()),
        orderIndex: z.number().default(0),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        school: z.string(),
        degree: z.string(),
        fieldOfStudy: z.string().nullable().optional(),
        location: z.string().nullable().optional(),
        startDate: z.string(),
        endDate: z.string(),
        gpa: z.string().nullable().optional(),
        descriptions: z.array(z.string()),
        orderIndex: z.number().default(0),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().nullable().optional(),
        url: z.string().nullable().optional(),
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional(),
        descriptions: z.array(z.string()),
        orderIndex: z.number().default(0),
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string(),
        level: z.number().default(3),
        category: z.string().nullable().optional(),
        orderIndex: z.number().default(0),
      })
    )
    .optional(),
  customs: z
    .array(
      z.object({
        heading: z.string(),
        descriptions: z.array(z.string()),
        orderIndex: z.number().default(0),
      })
    )
    .optional(),
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
      where: {
        id: resumeId,
        userId,
        deletedAt: null,
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

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("Resume fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await req.json();
    const validatedData = resumeUpdateSchema.parse(body);

    const {
      profile,
      workHistory,
      education,
      projects,
      skills,
      customs,
      ...resumeFields
    } = validatedData;

    const updatedResume = await db.$transaction(async (tx) => {
      await tx.resume.update({
        where: { id: resumeId },
        data: resumeFields,
      });

      if (profile) {
        await tx.profile.upsert({
          where: { resumeId },
          update: profile,
          create: { ...profile, resumeId },
        });
      }

      if (workHistory !== undefined) {
        await tx.workExperience.deleteMany({ where: { resumeId } });
        if (workHistory.length > 0) {
          await tx.workExperience.createMany({
            data: workHistory.map((item) => ({ ...item, resumeId })),
          });
        }
      }

      if (education !== undefined) {
        await tx.education.deleteMany({ where: { resumeId } });
        if (education.length > 0) {
          await tx.education.createMany({
            data: education.map((item) => ({ ...item, resumeId })),
          });
        }
      }

      if (projects !== undefined) {
        await tx.project.deleteMany({ where: { resumeId } });
        if (projects.length > 0) {
          await tx.project.createMany({
            data: projects.map((item) => ({ ...item, resumeId })),
          });
        }
      }

      if (skills !== undefined) {
        await tx.skill.deleteMany({ where: { resumeId } });
        if (skills.length > 0) {
          await tx.skill.createMany({
            data: skills.map((item) => ({ ...item, resumeId })),
          });
        }
      }

      if (customs !== undefined) {
        await tx.customSection.deleteMany({ where: { resumeId } });
        if (customs.length > 0) {
          await tx.customSection.createMany({
            data: customs.map((item) => ({ ...item, resumeId })),
          });
        }
      }

      return tx.resume.findUnique({
        where: { id: resumeId },
        include: {
          profile: true,
          workHistory: true,
          education: true,
          projects: true,
          skills: true,
          customs: true,
        },
      });
    });

    return NextResponse.json({ resume: updatedResume });
  } catch (error: any) {
    console.error("Resume update error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await db.resume.update({
      where: { id: resumeId },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resume delete error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
