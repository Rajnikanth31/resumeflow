import { AIPromptRegistry } from "../prompts";

describe("AIPromptRegistry", () => {
  it("should compile template variables correctly", () => {
    const template = "Hello {{name}}, welcome to {{place}}!";
    const compiled = AIPromptRegistry.compile(template, { name: "Alice", place: "Wonderland" });
    expect(compiled).toBe("Hello Alice, welcome to Wonderland!");
  });

  it("should sanitize markdown code block wrappers from JSON", () => {
    const markdownJson = "```json\n{\n  \"score\": 85\n}\n```";
    const sanitized = AIPromptRegistry.sanitizeOutput(markdownJson, "JSON");
    expect(sanitized).toBe('{\n  "score": 85\n}');
  });

  it("should parse and validate structured outputs", () => {
    const prompt = AIPromptRegistry.getPrompt("resume-optimization", "v2");
    const jsonResponse = '{"bullets": ["A", "B"], "impactScoreIncrease": 15}';
    const validated = AIPromptRegistry.validate(prompt, jsonResponse);

    expect(validated.bullets).toEqual(["A", "B"]);
    expect(validated.impactScoreIncrease).toBe(15);
  });

  it("should throw validation error on schema mismatches", () => {
    const prompt = AIPromptRegistry.getPrompt("resume-optimization", "v2");
    const badJsonResponse = '{"bullets": ["A"], "impactScoreIncrease": "not-a-number"}';
    expect(() => AIPromptRegistry.validate(prompt, badJsonResponse)).toThrow();
  });

  it("should validate resume suggestions schema cleanly", () => {
    const prompt = AIPromptRegistry.getPrompt("resume-suggestions", "v1");
    const jsonResponse = JSON.stringify({
      suggestions: [
        {
          suggestionText: "Use 'Orchestrated' instead of 'Worked on'.",
          explanation: "More active verb.",
          expectedBenefit: "Increased resume impact.",
          confidenceScore: 0.95,
          atsImpact: 8,
          category: "Action Verbs",
        },
      ],
    });
    const validated = AIPromptRegistry.validate(prompt, jsonResponse);
    expect(validated.suggestions[0].category).toBe("Action Verbs");
  });

  it("should validate cover letter generator schema cleanly", () => {
    const prompt = AIPromptRegistry.getPrompt("cover-letter-generator", "v1");
    const jsonResponse = JSON.stringify({
      content: "Dear Hiring Manager, this is a test cover letter.",
      qualityScore: {
        relevance: 90,
        professionalism: 95,
        grammar: 92,
        atsAlignment: 88,
      },
      explanations: {
        whySectionsWritten: ["Section 1 introduces background"],
        jobRequirementsAddressed: ["Requirement 1 addressed via experience"],
        resumeExperiencesEmphasized: ["Emphasized experience at Vercel"],
      },
    });
    const validated = AIPromptRegistry.validate(prompt, jsonResponse);
    expect(validated.content).toBe("Dear Hiring Manager, this is a test cover letter.");
    expect(validated.qualityScore.relevance).toBe(90);
    expect(validated.explanations.whySectionsWritten[0]).toBe("Section 1 introduces background");
  });
});
