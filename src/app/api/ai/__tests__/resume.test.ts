/**
 * @jest-environment node
 */
import { POST as feedbackHandler } from "../resume/feedback/route";
import { POST as optimizeHandler } from "../resume/optimize/route";
import { getServerSession } from "next-auth/next";
import { AIProviderFactory } from "lib/ai/factory";
import { db } from "lib/db";

jest.mock("next-auth/next");
jest.mock("lib/ai/factory");
jest.mock("lib/db");

describe("AI Resume Intelligence APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/ai/resume/feedback", () => {
    it("should update feedback status", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-1" },
      });
      (db.aISuggestionLog.findFirst as jest.Mock).mockResolvedValue({
        id: "sug-1",
        userId: "user-1",
      });
      (db.aISuggestionLog.update as jest.Mock).mockResolvedValue({
        id: "sug-1",
        feedback: "HELPFUL",
      });

      const req = new Request("http://localhost/api/ai/resume/feedback", {
        method: "POST",
        body: JSON.stringify({ suggestionId: "sug-1", feedback: "HELPFUL" }),
      });

      const res = await feedbackHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(db.aISuggestionLog.update).toHaveBeenCalled();
    });
  });

  describe("POST /api/ai/resume/optimize", () => {
    it("should initiate streaming responses", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-1" },
      });
      (AIProviderFactory.getProvider as jest.Mock).mockReturnValue({
        generateStream: jest.fn().mockResolvedValue({
          content: JSON.stringify({
            suggestions: [],
          }),
        }),
      });

      const req = new Request("http://localhost/api/ai/resume/optimize", {
        method: "POST",
        body: JSON.stringify({
          content: "Experienced coder",
          sectionType: "summary",
        }),
      });

      const res = await optimizeHandler(req);
      expect(res.status).toBe(200);
    });
  });
});
