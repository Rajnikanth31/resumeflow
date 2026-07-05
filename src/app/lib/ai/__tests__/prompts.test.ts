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
});
