import { AIPermissionLayer } from "./permissions";
import { AIFeatureRegistry } from "./features";
import { AIPromptRegistry } from "./prompts";
import { AIProviderFactory } from "./factory";
import { AIConversationMemory } from "./memory";
import { db } from "lib/db";

export interface AIRequestPipelineInput {
  featureId: string;
  variables: Record<string, string>;
  userContext: {
    id: string;
    role: any;
    tier: any;
  };
  conversationId?: string;
}

export interface AIRequestPipelineOutput {
  content: any;
  latencyMs: number;
  tokensSent: number;
  tokensRecv: number;
  model: string;
  provider: string;
}

export class AIRequestPipeline {
  static async execute(input: AIRequestPipelineInput): Promise<AIRequestPipelineOutput> {
    const startTime = performance.now();
    const { featureId, variables, userContext, conversationId } = input;

    const feature = AIFeatureRegistry.getFeature(featureId);

    const hasPermission = AIPermissionLayer.checkPermission(feature.permissions, {
      role: userContext.role,
      tier: userContext.tier,
    });
    if (!hasPermission) {
      throw new Error(`Forbidden: User does not have access permissions for feature ${featureId}`);
    }

    const promptDef = AIPromptRegistry.getPrompt(feature.promptId, feature.version);
    const systemMessage = AIPromptRegistry.compile(promptDef.systemTemplate, variables);
    const userMessage = AIPromptRegistry.compile(promptDef.userTemplate, variables);

    const messages = [
      { role: "system" as const, content: systemMessage },
      { role: "user" as const, content: userMessage },
    ];

    const provider = AIProviderFactory.getProvider(feature.provider);
    const config = {
      provider: feature.provider,
      model: feature.model,
      temperature: feature.temperature,
      streaming: feature.streaming,
    };

    const rawResponse = await provider.generate(messages, config);

    let validatedContent;
    try {
      validatedContent = AIPromptRegistry.validate(promptDef, rawResponse.content);
    } catch (err: any) {
      throw new Error(`Output validation failed: ${err.message}`);
    }

    const latencyMs = Math.round(performance.now() - startTime);
    const tokensSent = Math.ceil(JSON.stringify(messages).length / 4);
    const tokensRecv = Math.ceil(rawResponse.content.length / 4);

    try {
      await db.aIRequestLog.create({
        data: {
          userId: userContext.id,
          provider: feature.provider,
          model: feature.model,
          tokensSent,
          tokensRecv,
          latencyMs,
          purpose: featureId,
          promptVersion: feature.version,
          success: true,
        },
      });
    } catch (telemetryErr) {
      console.error("Pipeline telemetry error:", telemetryErr);
    }

    if (conversationId) {
      try {
        await AIConversationMemory.appendMessage(conversationId, "user", userMessage);
        await AIConversationMemory.appendMessage(
          conversationId,
          "assistant",
          typeof validatedContent === "object"
            ? JSON.stringify(validatedContent)
            : validatedContent
        );
      } catch (memoryErr) {
        console.error("Pipeline memory persistence error:", memoryErr);
      }
    }

    return {
      content: validatedContent,
      latencyMs,
      tokensSent,
      tokensRecv,
      model: feature.model,
      provider: feature.provider,
    };
  }
}
