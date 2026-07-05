import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { db } from "lib/db";
import JSZip from "jszip";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const appPackage = await db.applicationPackage.findFirst({
      where: {
        id: params.id,
        resume: { userId },
      },
      include: {
        resume: {
          include: {
            profile: true,
            workHistory: true,
            projects: true,
            skills: true,
            education: true,
          },
        },
        job: true,
        coverLetter: true,
        atsReport: true,
      },
    });

    if (!appPackage) {
      return NextResponse.json({ error: "Application package not found" }, { status: 404 });
    }

    const zip = new JSZip();

    // 1. Resume text/markdown
    const resume = appPackage.resume;
    let resumeText = `# ${resume.profile?.name || "Candidate Resume"}\n\n`;
    resumeText += `Email: ${resume.profile?.email || ""}\nPhone: ${resume.profile?.phone || ""}\n\n`;
    resumeText += `## Summary\n${resume.profile?.summary || ""}\n\n`;
    resumeText += `## Work History\n`;
    resume.workHistory.forEach((w) => {
      resumeText += `### ${w.position} - ${w.company} (${w.startDate} - ${w.endDate || "Present"})\n`;
      w.descriptions.forEach((d) => {
        resumeText += `- ${d}\n`;
      });
      resumeText += `\n`;
    });
    resumeText += `## Projects\n`;
    resume.projects.forEach((p) => {
      resumeText += `### ${p.name} (${p.startDate || ""} - ${p.endDate || ""})\n`;
      p.descriptions.forEach((d) => {
        resumeText += `- ${d}\n`;
      });
      resumeText += `\n`;
    });
    zip.file("resume.txt", resumeText);

    // 2. Cover letter formats (TXT & DOCX via HTML-Word)
    const coverLetter = appPackage.coverLetter;
    if (coverLetter) {
      zip.file("cover_letter.txt", coverLetter.content);

      // DOCX HTML wrapper
      const wordHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${coverLetter.title}</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 1in;">
  ${coverLetter.content.replace(/\n/g, "<br>")}
</body>
</html>
      `.trim();
      zip.file("cover_letter.docx", wordHtml);
    }

    // 3. ATS Report markdown
    const report = appPackage.atsReport;
    if (report) {
      let atsText = `# ATS Scorer Report Summary\n\n`;
      atsText += `Overall Score: ${report.overallScore}%\n`;
      atsText += `Keyword Match Score: ${report.keywordScore}%\n`;
      atsText += `Semantic Match Score: ${report.semanticScore}%\n\n`;
      atsText += `## Scorer Reasoning\n${report.reasoning}\n\n`;
      atsText += `## Matched Keywords\n${report.matchedKeywords.join(", ") || "None"}\n\n`;
      atsText += `## Missing Keywords\n${report.missingKeywords.join(", ") || "None"}\n`;
      zip.file("ats_report.txt", atsText);
    }

    // 4. Job Description Snapshot
    const job = appPackage.job;
    if (job) {
      let jobText = `# Job Description Snapshot\n\n`;
      jobText += `Role: ${job.title}\n`;
      jobText += `Company: ${job.company}\n`;
      jobText += `Industry: ${job.industry || "N/A"}\n\n`;
      jobText += `## Description\n${job.description}\n`;
      zip.file("job_description.txt", jobText);
    }

    // 5. Package Metadata JSON
    const metadata = {
      packageId: appPackage.id,
      resumeId: appPackage.resumeId,
      jobId: appPackage.jobId,
      coverLetterId: appPackage.coverLetterId,
      atsReportId: appPackage.atsReportId,
      exportMetadata: appPackage.exportMetadata,
      createdAt: appPackage.createdAt,
    };
    zip.file("metadata.json", JSON.stringify(metadata, null, 2));

    // 6. Future-proof additional assets folder
    const assetsObj = (appPackage.additionalAssets as any) || {};
    if (Object.keys(assetsObj).length > 0) {
      let assetsText = `# Additional Links & Assets\n\n`;
      for (const [key, value] of Object.entries(assetsObj)) {
        assetsText += `${key}: ${value}\n`;
      }
      zip.file("additional_assets/assets_links.txt", assetsText);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=application_package_${appPackage.id}.zip`,
      },
    });
  } catch (error: any) {
    console.error("Export Application Package Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
