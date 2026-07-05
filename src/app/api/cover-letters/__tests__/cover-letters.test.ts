/**
 * @jest-environment node
 */
import { POST as generatePOST } from "../generate/route";
import { GET as listGET } from "../../resumes/[id]/cover-letters/route";
import { POST as packagePOST } from "../../application-packages/create/route";
import { GET as versionsGET, POST as versionsPOST } from "../[id]/versions/route";
import { db } from "lib/db";
import { getServerSession } from "next-auth/next";
import { AIRequestPipeline } from "lib/ai/pipeline";

jest.mock("lib/db");
jest.mock("next-auth/next");
jest.mock("lib/ai/pipeline");

describe("Cover Letter & Application Package APIs", () => {
  const mockUser = { id: "user-1", email: "test@example.com", role: "USER", tier: "FREE" };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue({ user: mockUser });
  });

  describe("POST /api/cover-letters/generate", () => {
    it("generates and persists cover letter and creates initial version", async () => {
      const mockResume = {
        id: "resume-1",
        userId: "user-1",
        profile: { summary: "Software Engineer" },
        workHistory: [],
        projects: [],
        skills: [],
        education: [],
      };

      const mockJob = {
        id: "job-1",
        userId: "user-1",
        title: "DevOps",
        company: "Stripe",
        description: "Scale infrastructure",
      };

      (db.resume.findFirst as jest.Mock).mockResolvedValue(mockResume);
      (db.jobDescription.findFirst as jest.Mock).mockResolvedValue(mockJob);

      (AIRequestPipeline.execute as jest.Mock).mockResolvedValue({
        content: JSON.stringify({
          content: "Tailored letter content",
          qualityScore: { relevance: 95, professionalism: 90, grammar: 90, atsAlignment: 92 },
          explanations: { whySectionsWritten: ["A"], jobRequirementsAddressed: ["B"], resumeExperiencesEmphasized: ["C"] },
        }),
      });

      const mockCoverLetter = { id: "cl-1", content: "Tailored letter content" };
      (db.coverLetter.create as jest.Mock).mockResolvedValue(mockCoverLetter);
      (db.coverLetterVersion.create as jest.Mock).mockResolvedValue({ id: "v-1" });

      const req = new Request("http://localhost/api/cover-letters/generate", {
        method: "POST",
        body: JSON.stringify({ resumeId: "resume-1", jobId: "job-1" }),
      });

      const res = await generatePOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.coverLetter.id).toBe("cl-1");
    });
  });

  describe("POST /api/application-packages/create", () => {
    it("creates and logs a new application package record", async () => {
      (db.resume.findFirst as jest.Mock).mockResolvedValue({ id: "resume-1" });
      (db.applicationPackage.create as jest.Mock).mockResolvedValue({ id: "package-1" });

      const req = new Request("http://localhost/api/application-packages/create", {
        method: "POST",
        body: JSON.stringify({ resumeId: "resume-1", jobId: "job-1", coverLetterId: "cl-1" }),
      });

      const res = await packagePOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.package.id).toBe("package-1");
    });
  });
});
