import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { AIProviderFactory } from "lib/ai/factory";
import { AIPromptRegistry } from "lib/ai/prompts";
import { z } from "zod";

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 30;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(userId) || [];
  const active = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (active.length >= MAX_REQUESTS) {
    return true;
  }

  active.push(now);
  rateLimitMap.set(userId, active);
  return false;
}

const chatPayloadSchema = z.object({
  promptId: z.string(),
  version: z.string().default("v1"),
  variables: z.record(z.string(), z.string()).default({}),
  config: z.object({
    provider: z.enum(["lm-studio", "openai", "gemini", "anthropic", "ollama", "azure-openai"]),
    model: z.string(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(1).max(8192).optional(),
    timeout: z.number().min(1000).max(60000).optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    if (checkRateLimit(userId)) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    const body = await req.json();
    const validated = chatPayloadSchema.parse(body);

    const { promptId, version, variables, config } = validated;

    const promptDef = AIPromptRegistry.getPrompt(promptId, version);
    const systemMessage = AIPromptRegistry.compile(promptDef.systemTemplate, variables);
    const userMessage = AIPromptRegistry.compile(promptDef.userTemplate, variables);

    const messages = [
      { role: "system" as const, content: systemMessage },
      { role: "user" as const, content: userMessage },
    ];

    const provider = AIProviderFactory.getProvider(config.provider);
    const rawResponse = await provider.generate(messages, config);

    let validatedContent;
    try {
      validatedContent = AIPromptRegistry.validate(promptDef, rawResponse.content);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Output validation failed", details: err.message, raw: rawResponse.content },
        { status: 422 }
      );
    }

    return NextResponse.json({
      content: validatedContent,
      model: rawResponse.model,
      provider: rawResponse.provider,
      usage: rawResponse.usage,
    });
  } catch (error: any) {
    console.error("AI Gateway Chat Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
