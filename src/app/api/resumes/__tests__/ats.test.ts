/**
 * @jest-environment node
 */
import { POST as scanHandler } from "../[id]/ats-scan/route";
import { GET as reportsHandler } from "../[id]/ats-reports/route";
import { GET as compareHandler } from "../[id]/ats-reports/compare/route";
import { getServerSession } from "next-auth/next";
import { AIRequestPipeline } from "lib/ai/pipeline";
import { db } from "lib/db";

jest.mock("next-auth/next");
jest.mock("lib/db");
jest.mock("lib/ai/pipeline");

describe("ATS Intelligence Engine API Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/resumes/[id]/ats-scan", () => {
    it("should successfully run ATS scan and log report to db", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-1", role: "USER", tier: "FREE" },
      });
      (db.resume.findFirst as jest.Mock).mockResolvedValue({
        id: "resume-1",
        profile: { summary: "Frontend engineer" },
        workHistory: [],
        projects: [],
        skills: [{ name: "TypeScript" }],
      });
      (db.jobDescription.findFirst as jest.Mock).mockResolvedValue({
        id: "job-1",
        description: "Need a TypeScript developer",
      });
      (AIRequestPipeline.execute as jest.Mock).mockResolvedValue({
        content: JSON.stringify({
          overallScore: 85,
          keywordScore: 90,
          semanticScore: 80,
          experienceScore: 75,
          projectScore: 80,
          educationScore: 90,
          qualityScore: 85,
          reasoning: "Excellent TypeScript matches",
          matchedKeywords: ["TypeScript"],
          missingKeywords: ["React"],
          improvementSuggestions: [
            { suggestion: "Add React projects", category: "Keywords", estimatedScoreGain: 10 },
          ],
        }),
      });
      (db.aTSReport.create as jest.Mock).mockResolvedValue({
        id: "report-1",
        overallScore: 85,
      });

      const req = new Request("http://localhost/api/resumes/resume-1/ats-scan", {
        method: "POST",
        body: JSON.stringify({ jobId: "job-1" }),
      });

      const res = await scanHandler(req, { params: { id: "resume-1" } });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.report.overallScore).toBe(85);
    });
  });

  describe("GET /api/resumes/[id]/ats-reports", () => {
    it("should retrieve historical report logs for a resume", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-1" },
      });
      (db.resume.findFirst as jest.Mock).mockResolvedValue({
        id: "resume-1",
      });
      (db.aTSReport.findMany as jest.Mock).mockResolvedValue([
        { id: "report-1", overallScore: 85 },
      ]);

      const req = new Request("http://localhost/api/resumes/resume-1/ats-reports", {
        method: "GET",
      });

      const res = await reportsHandler(req, { params: { id: "resume-1" } });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.reports).toHaveLength(1);
    });
  });

  describe("GET /api/resumes/[id]/ats-reports/compare", () => {
    it("should compute delta calculations comparing two report entries", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-1" },
      });
      (db.resume.findFirst as jest.Mock).mockResolvedValue({
        id: "resume-1",
      });
      (db.aTSReport.findFirst as jest.Mock)
        .mockResolvedValueOnce({
          id: "report-1",
          overallScore: 70,
          keywordScore: 70,
          semanticScore: 70,
          experienceScore: 70,
          projectScore: 70,
          educationScore: 70,
          qualityScore: 70,
          matchedKeywords: ["TypeScript"],
          missingKeywords: ["React", "Redux"],
        })
        .mockResolvedValueOnce({
          id: "report-2",
          overallScore: 85,
          keywordScore: 85,
          semanticScore: 85,
          experienceScore: 85,
          projectScore: 85,
          educationScore: 85,
          qualityScore: 85,
          matchedKeywords: ["TypeScript", "React"],
          missingKeywords: ["Redux"],
        });

      const req = new Request("http://localhost/api/resumes/resume-1/ats-reports/compare?reportIdA=report-1&reportIdB=report-2", {
        method: "GET",
      });

      const res = await compareHandler(req, { params: { id: "resume-1" } });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.delta.overallScore).toBe(15);
      expect(data.delta.newlyMatchedKeywords).toContain("React");
    });
  });
});
