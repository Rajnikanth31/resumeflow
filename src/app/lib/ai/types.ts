export type AIProviderType =
  | "lm-studio"
  | "openai"
  | "gemini"
  | "anthropic"
  | "ollama"
  | "azure-openai";

export interface AIConfig {
  provider: AIProviderType;
  model: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  timeout?: number;
}

export interface AIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: AIProviderType;
}

export interface AIProvider {
  generate(messages: AIChatMessage[], config: AIConfig): Promise<AIResponse>;
  generateStream?(
    messages: AIChatMessage[],
    config: AIConfig,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse>;
}
