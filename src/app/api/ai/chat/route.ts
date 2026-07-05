import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { AIProviderFactory } from "lib/ai/factory";
import { AIPromptRegistry } from "lib/ai/prompts";
import { db } from "lib/db";
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

async function logTelemetry({
  userId,
  provider,
  model,
  tokensSent,
  tokensRecv,
  latencyMs,
  purpose,
  promptVersion,
  success,
  errorDetails,
}: {
  userId: string;
  provider: string;
  model: string;
  tokensSent: number;
  tokensRecv: number;
  latencyMs: number;
  purpose: string;
  promptVersion: string;
  success: boolean;
  errorDetails?: string;
}) {
  try {
    await db.aIRequestLog.create({
      data: {
        userId,
        provider,
        model,
        tokensSent,
        tokensRecv,
        latencyMs,
        purpose,
        promptVersion,
        success,
        errorDetails,
      },
    });
  } catch (err) {
    console.error("Telemetry logging error:", err);
  }
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
    streaming: z.boolean().optional(),
  }),
});

export async function POST(req: Request) {
  const startTime = performance.now();
  let userId = "anonymous";
  let promptId = "unknown";
  let version = "v1";
  let config: any = { provider: "unknown", model: "unknown" };

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = (session.user as any).id;

    if (checkRateLimit(userId)) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    const body = await req.json();
    const validated = chatPayloadSchema.parse(body);

    promptId = validated.promptId;
    version = validated.version;
    config = validated.config;

    const promptDef = AIPromptRegistry.getPrompt(promptId, version);
    const systemMessage = AIPromptRegistry.compile(promptDef.systemTemplate, validated.variables);
    const userMessage = AIPromptRegistry.compile(promptDef.userTemplate, validated.variables);

    const messages = [
      { role: "system" as const, content: systemMessage },
      { role: "user" as const, content: userMessage },
    ];

    const provider = AIProviderFactory.getProvider(config.provider);

    // Streaming branch
    if (config.streaming) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const rawResponse = await provider.generateStream!(
              messages,
              config,
              (chunk) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
              }
            );

            const latencyMs = Math.round(performance.now() - startTime);
            const tokensSent = Math.ceil(JSON.stringify(messages).length / 4);
            const tokensRecv = Math.ceil(rawResponse.content.length / 4);

            await logTelemetry({
              userId,
              provider: config.provider,
              model: config.model,
              tokensSent,
              tokensRecv,
              latencyMs,
              purpose: promptId,
              promptVersion: version,
              success: true,
            });

            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err: any) {
            const latencyMs = Math.round(performance.now() - startTime);
            await logTelemetry({
              userId,
              provider: config.provider,
              model: config.model,
              tokensSent: 0,
              tokensRecv: 0,
              latencyMs,
              purpose: promptId,
              promptVersion: version,
              success: false,
              errorDetails: err.message,
            });
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Standard Non-streaming branch
    const rawResponse = await provider.generate(messages, config);

    let validatedContent;
    try {
      validatedContent = AIPromptRegistry.validate(promptDef, rawResponse.content);
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      await logTelemetry({
        userId,
        provider: config.provider,
        model: config.model,
        tokensSent: Math.ceil(JSON.stringify(messages).length / 4),
        tokensRecv: Math.ceil(rawResponse.content.length / 4),
        latencyMs,
        purpose: promptId,
        promptVersion: version,
        success: false,
        errorDetails: `Output validation failed: ${err.message}`,
      });

      return NextResponse.json(
        { error: "Output validation failed", details: err.message, raw: rawResponse.content },
        { status: 422 }
      );
    }

    const latencyMs = Math.round(performance.now() - startTime);
    const tokensSent = rawResponse.usage?.promptTokens || Math.ceil(JSON.stringify(messages).length / 4);
    const tokensRecv = rawResponse.usage?.completionTokens || Math.ceil(rawResponse.content.length / 4);

    await logTelemetry({
      userId,
      provider: config.provider,
      model: config.model,
      tokensSent,
      tokensRecv,
      latencyMs,
      purpose: promptId,
      promptVersion: version,
      success: true,
    });

    return NextResponse.json({
      content: validatedContent,
      model: rawResponse.model,
      provider: rawResponse.provider,
      usage: {
        promptTokens: tokensSent,
        completionTokens: tokensRecv,
        totalTokens: tokensSent + tokensRecv,
      },
    });
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    console.error("AI Gateway Chat Error:", error);

    if (userId !== "anonymous") {
      await logTelemetry({
        userId,
        provider: config?.provider || "unknown",
        model: config?.model || "unknown",
        tokensSent: 0,
        tokensRecv: 0,
        latencyMs,
        purpose: promptId,
        promptVersion: version,
        success: false,
        errorDetails: error.message || "Internal Server Error",
      });
    }

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
