/**
 * @jest-environment node
 */
import { POST as tailorHandler } from "../[id]/tailor/route";
import { getServerSession } from "next-auth/next";
import { AIRequestPipeline } from "lib/ai/pipeline";
import { db } from "lib/db";

jest.mock("next-auth/next");
jest.mock("lib/db");
jest.mock("lib/ai/pipeline");

describe("AI Resume Tailoring API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate tailored summaries and descriptions", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1" },
    });
    (db.resume.findFirst as jest.Mock).mockResolvedValue({
      id: "resume-1",
      profile: { summary: "Frontend dev" },
      workHistory: [{ company: "Google", descriptions: ["Code TS"] }],
      projects: [{ project: "ResumeFlow", descriptions: ["Design UI"] }],
    });
    (db.jobDescription.findFirst as jest.Mock).mockResolvedValue({
      id: "job-1",
      description: "Require Next.js expert",
    });
    (AIRequestPipeline.execute as jest.Mock).mockResolvedValue({
      content: {
        summary: "Tailored frontend dev",
        workExperiences: [{ company: "Google", descriptions: ["Tailored Next.js Code"] }],
        projects: [{ project: "ResumeFlow", descriptions: ["Tailored Next.js UI"] }],
      },
    });
    (db.resumeJobLink.upsert as jest.Mock).mockResolvedValue({});

    const req = new Request("http://localhost/api/resumes/resume-1/tailor", {
      method: "POST",
      body: JSON.stringify({ jobId: "job-1" }),
    });

    const res = await tailorHandler(req, { params: { id: "resume-1" } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.tailored.summary).toBe("Tailored frontend dev");
  });
});
