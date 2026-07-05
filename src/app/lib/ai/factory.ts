import { AIConfig, AIChatMessage, AIResponse, AIProvider, AIProviderType } from "./types";

class OpenAICompatibleProvider implements AIProvider {
  private baseUrl: string;
  private apiKey: string;
  private providerType: AIProviderType;

  constructor(providerType: AIProviderType, baseUrl: string, apiKey: string) {
    this.providerType = providerType;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async generate(messages: AIChatMessage[], config: AIConfig): Promise<AIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000);

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          temperature: config.temperature ?? 0.7,
          max_tokens: config.maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`AI Provider ${this.providerType} returned status ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      return {
        content: data.choices?.[0]?.message?.content || "",
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens || 0,
          completionTokens: data.usage.completion_tokens || 0,
          totalTokens: data.usage.total_tokens || 0,
        } : undefined,
        model: config.model,
        provider: this.providerType,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  async generateStream(
    messages: AIChatMessage[],
    config: AIConfig,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000);

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          temperature: config.temperature ?? 0.7,
          max_tokens: config.maxTokens,
          stream: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`AI Provider ${this.providerType} returned status ${res.status}: ${errorText}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullContent = "";

      if (!reader) {
        throw new Error("No readable stream in response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const deltaContent = data.choices?.[0]?.delta?.content || "";
              if (deltaContent) {
                fullContent += deltaContent;
                onChunk(deltaContent);
              }
            } catch (e) {
              // Ignore partial parsing errors
            }
          }
        }
      }

      return {
        content: fullContent,
        model: config.model,
        provider: this.providerType,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

class GeminiProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(messages: AIChatMessage[], config: AIConfig): Promise<AIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000);

    const systemInstruction = messages.find((m) => m.role === "system")?.content;
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: {
            temperature: config.temperature ?? 0.7,
            maxOutputTokens: config.maxTokens,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini returned status ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return {
        content,
        usage: data.usageMetadata ? {
          promptTokens: data.usageMetadata.promptTokenCount || 0,
          completionTokens: data.usageMetadata.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata.totalTokenCount || 0,
        } : undefined,
        model: config.model,
        provider: "gemini",
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

class AnthropicProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(messages: AIChatMessage[], config: AIConfig): Promise<AIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000);

    const system = messages.find((m) => m.role === "system")?.content;
    const mappedMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: config.model,
          messages: mappedMessages,
          system,
          temperature: config.temperature ?? 0.7,
          max_tokens: config.maxTokens || 4096,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Anthropic returned status ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const content = data.content?.[0]?.text || "";
      return {
        content,
        usage: data.usage ? {
          promptTokens: data.usage.input_tokens || 0,
          completionTokens: data.usage.output_tokens || 0,
          totalTokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
        } : undefined,
        model: config.model,
        provider: "anthropic",
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

export class AIProviderFactory {
  static getProvider(providerType: AIProviderType): AIProvider {
    switch (providerType) {
      case "lm-studio": {
        const url = process.env.LM_STUDIO_BASE_URL || "http://localhost:1234/v1";
        return new OpenAICompatibleProvider("lm-studio", url, "");
      }
      case "ollama": {
        const url = process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1";
        return new OpenAICompatibleProvider("ollama", url, "");
      }
      case "openai": {
        const url = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
        const key = process.env.OPENAI_API_KEY || "";
        return new OpenAICompatibleProvider("openai", url, key);
      }
      case "azure-openai": {
        const url = process.env.AZURE_OPENAI_BASE_URL || "";
        const key = process.env.AZURE_OPENAI_API_KEY || "";
        return new OpenAICompatibleProvider("azure-openai", url, key);
      }
      case "gemini": {
        const key = process.env.GEMINI_API_KEY || "";
        return new GeminiProvider(key);
      }
      case "anthropic": {
        const key = process.env.ANTHROPIC_API_KEY || "";
        return new AnthropicProvider(key);
      }
      default:
        throw new Error(`Unsupported AI provider: ${providerType}`);
    }
  }
}
export type { AIProvider };
