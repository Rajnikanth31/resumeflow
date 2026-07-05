/**
 * @jest-environment node
 */
import { POST as chatHandler } from "../chat/route";
import { GET as healthHandler } from "../health/route";
import { getServerSession } from "next-auth/next";
import { AIProviderFactory } from "lib/ai/factory";
import { db } from "lib/db";

jest.mock("next-auth/next");
jest.mock("lib/ai/factory");
jest.mock("lib/db");

describe("AI Gateway and Health API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/ai/chat", () => {
    it("should return 401 if unauthenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/ai/chat", { method: "POST" });
      const res = await chatHandler(req);
      expect(res.status).toBe(401);
    });

    it("should execute client prompts on success", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-1" },
      });
      (AIProviderFactory.getProvider as jest.Mock).mockReturnValue({
        generate: jest.fn().mockResolvedValue({
          content: "Optimized Resume",
          model: "local-model",
          provider: "lm-studio",
        }),
      });

      const req = new Request("http://localhost/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          promptId: "resume-optimization",
          version: "v1",
          variables: { content: "software engineer" },
          config: { provider: "lm-studio", model: "local-model" },
        }),
      });

      const res = await chatHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.content).toBe("Optimized Resume");
      expect(db.aIRequestLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-1",
            provider: "lm-studio",
            model: "local-model",
            purpose: "resume-optimization",
            success: true,
          }),
        })
      );
    });
  });

  describe("GET /api/ai/health", () => {
    it("should report active providers", async () => {
      const res = await healthHandler();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe("ok");
    });
  });
});
