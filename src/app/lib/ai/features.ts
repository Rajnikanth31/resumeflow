import { AIConfig, AIProviderType } from "./types";
import { z } from "zod";

export interface AIFeatureConfig {
  id: string;
  promptId: string;
  version: string;
  provider: AIProviderType;
  model: string;
  temperature: number;
  streaming: boolean;
  permissions: string[];
  outputSchema?: z.ZodType<any>;
}

export class AIFeatureRegistry {
  private static features: Record<string, AIFeatureConfig> = {
    "resume-bullet-optimize": {
      id: "resume-bullet-optimize",
      promptId: "resume-optimization",
      version: "v2",
      provider: "lm-studio",
      model: "local-model",
      temperature: 0.5,
      streaming: false,
      permissions: ["user-role"],
      outputSchema: z.object({
        bullets: z.array(z.string().min(1)),
        impactScoreIncrease: z.number().min(0).max(100),
      }),
    },
    "resume-ats-scan": {
      id: "resume-ats-scan",
      promptId: "ats-analyzer",
      version: "v1",
      provider: "lm-studio",
      model: "local-model",
      temperature: 0.2,
      streaming: false,
      permissions: ["premium-tier"],
      outputSchema: z.object({
        score: z.number().min(0).max(100),
        matchingKeywords: z.array(z.string()),
        missingKeywords: z.array(z.string()),
        improvementTips: z.array(z.string()),
      }),
    },
    "resume-suggestions": {
      id: "resume-suggestions",
      promptId: "resume-suggestions",
      version: "v1",
      provider: "lm-studio",
      model: "local-model",
      temperature: 0.7,
      streaming: false,
      permissions: ["user-role"],
    },
    "job-parser": {
      id: "job-parser",
      promptId: "job-parser",
      version: "v1",
      provider: "lm-studio",
      model: "local-model",
      temperature: 0.1,
      streaming: false,
      permissions: ["user-role"],
    },
    "resume-tailor": {
      id: "resume-tailor",
      promptId: "resume-tailor",
      version: "v1",
      provider: "lm-studio",
      model: "local-model",
      temperature: 0.3,
      streaming: false,
      permissions: ["user-role"],
    },
  };

  static getFeature(id: string): AIFeatureConfig {
    const feat = this.features[id];
    if (!feat) {
      throw new Error(`AI Feature not registered: ${id}`);
    }
    return feat;
  }
}
