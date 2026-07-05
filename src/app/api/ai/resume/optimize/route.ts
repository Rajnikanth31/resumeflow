import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth-options";
import { AIProviderFactory } from "lib/ai/factory";
import { AIPromptRegistry } from "lib/ai/prompts";
import { db } from "lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json();
    const { content, sectionType, jobDescription, provider: bodyProvider, model: bodyModel } = body;

    if (!content || !sectionType) {
      return NextResponse.json({ error: "content and sectionType are required" }, { status: 400 });
    }

    const promptDef = AIPromptRegistry.getPrompt("resume-suggestions", "v1");
    const systemMessage = promptDef.systemTemplate;
    const userMessage = AIPromptRegistry.compile(promptDef.userTemplate, {
      content,
      sectionType,
      jobDescription: jobDescription || "None provided",
    });

    const messages = [
      { role: "system" as const, content: systemMessage },
      { role: "user" as const, content: userMessage },
    ];

    const activeProvider = bodyProvider || "lm-studio";
    const activeModel = bodyModel || "local-model";

    const provider = AIProviderFactory.getProvider(activeProvider);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const rawResponse = await provider.generateStream!(
            messages,
            { provider: activeProvider, model: activeModel, temperature: 0.7, streaming: true },
            (chunk) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
            }
          );

          try {
            const validated = AIPromptRegistry.validate(promptDef, rawResponse.content);
            if (validated && Array.isArray(validated.suggestions)) {
              for (const sug of validated.suggestions) {
                await db.aISuggestionLog.create({
                  data: {
                    userId,
                    promptId: "resume-suggestions",
                    suggestionText: sug.suggestionText,
                    explanation: sug.explanation,
                    expectedBenefit: sug.expectedBenefit,
                    confidenceScore: sug.confidenceScore,
                    atsImpact: sug.atsImpact,
                    category: sug.category,
                    state: "PENDING",
                    feedback: "NONE",
                  },
                });
              }
            }
          } catch (err) {
            console.error("Failed to parse and log suggestions to DB:", err);
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err: any) {
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
  } catch (error: any) {
    console.error("AI Suggestion Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
