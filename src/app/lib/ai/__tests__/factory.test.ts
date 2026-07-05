import { AIProviderFactory } from "../factory";

describe("AIProviderFactory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: "Mocked Response" } }],
            usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
          }),
      })
    ) as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return OpenAICompatibleProvider for lm-studio", async () => {
    const provider = AIProviderFactory.getProvider("lm-studio");
    const response = await provider.generate(
      [{ role: "user", content: "hello" }],
      { provider: "lm-studio", model: "local-model" }
    );

    expect(response.content).toBe("Mocked Response");
    expect(response.provider).toBe("lm-studio");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("localhost:1234"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("local-model"),
      })
    );
  });

  it("should return OpenAICompatibleProvider for openai with api key", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const provider = AIProviderFactory.getProvider("openai");
    const response = await provider.generate(
      [{ role: "user", content: "hello" }],
      { provider: "openai", model: "gpt-4" }
    );

    expect(response.content).toBe("Mocked Response");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("openai.com"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });
});
