import { AIRequestPipeline } from "../pipeline";
import { AIProviderFactory } from "../factory";
import { db } from "lib/db";

jest.mock("../factory");
jest.mock("lib/db");

describe("AIRequestPipeline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block request if user context has insufficient privileges", async () => {
    await expect(
      AIRequestPipeline.execute({
        featureId: "resume-ats-scan",
        variables: {},
        userContext: { id: "user-1", role: "USER", tier: "FREE" },
      })
    ).rejects.toThrow("Forbidden");
  });

  it("should run full request pipeline on valid privileges", async () => {
    (AIProviderFactory.getProvider as jest.Mock).mockReturnValue({
      generate: jest.fn().mockResolvedValue({
        content: JSON.stringify({
          score: 90,
          matchingKeywords: ["React"],
          missingKeywords: [],
          improvementTips: [],
        }),
        model: "local-model",
        provider: "lm-studio",
      }),
    });

    const output = await AIRequestPipeline.execute({
      featureId: "resume-ats-scan",
      variables: { resume: "React dev", jobDescription: "React dev" },
      userContext: { id: "user-1", role: "USER", tier: "PREMIUM" },
    });

    expect(output.content.score).toBe(90);
    expect(db.aIRequestLog.create).toHaveBeenCalled();
  });
});
