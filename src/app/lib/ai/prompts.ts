import { z } from "zod";

export interface PromptDefinition {
  id: string;
  version: string;
  systemTemplate: string;
  userTemplate: string;
  outputFormat: "JSON" | "JSON_SCHEMA" | "MARKDOWN" | "PLAIN_TEXT" | "HTML";
  schema?: z.ZodType<any>;
}

export class AIPromptRegistry {
  private static prompts: Record<string, Record<string, PromptDefinition>> = {
    "resume-optimization": {
      "v1": {
        id: "resume-optimization",
        version: "v1",
        systemTemplate: "You are an expert ATS recruiter. Your job is to optimize this resume section for impact and clarity.",
        userTemplate: "Optimize the following experience description: {{content}}",
        outputFormat: "PLAIN_TEXT",
      },
      "v2": {
        id: "resume-optimization",
        version: "v2",
        systemTemplate: "You are an expert career advisor. Return a structured JSON containing optimized bullet points and estimated impact improvements.",
        userTemplate: "Optimize the following description: {{content}}",
        outputFormat: "JSON",
        schema: z.object({
          bullets: z.array(z.string().min(1)),
          impactScoreIncrease: z.number().min(0).max(100),
        }),
      },
    },
    "ats-analyzer": {
      "v1": {
        id: "ats-analyzer",
        version: "v1",
        systemTemplate: "You are an advanced ATS scanner. Return a JSON structure containing score (0-100), matchingKeywords, missingKeywords, and improvementTips.",
        userTemplate: "Resume content:\n{{resume}}\n\nJob Description:\n{{jobDescription}}",
        outputFormat: "JSON",
        schema: z.object({
          score: z.number().min(0).max(100),
          matchingKeywords: z.array(z.string()),
          missingKeywords: z.array(z.string()),
          improvementTips: z.array(z.string()),
        }),
      },
    },
  };

  static getPrompt(id: string, version = "v1"): PromptDefinition {
    const promptVersions = this.prompts[id];
    if (!promptVersions) {
      throw new Error(`Prompt ID not registered: ${id}`);
    }
    const prompt = promptVersions[version];
    if (!prompt) {
      throw new Error(`Prompt version not found: ${id} (${version})`);
    }
    return prompt;
  }

  static compile(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replaceAll(`{{${key}}}`, value);
    }
    return result;
  }

  static sanitizeOutput(content: string, format: string): string {
    if (format === "JSON" || format === "JSON_SCHEMA") {
      let clean = content.trim();
      if (clean.startsWith("```json")) {
        clean = clean.substring(7);
      } else if (clean.startsWith("```")) {
        clean = clean.substring(3);
      }
      if (clean.endsWith("```")) {
        clean = clean.substring(0, clean.length - 3);
      }
      return clean.trim();
    }
    return content;
  }

  static validate(prompt: PromptDefinition, content: string): any {
    const cleanContent = this.sanitizeOutput(content, prompt.outputFormat);

    if (prompt.outputFormat === "JSON" || prompt.outputFormat === "JSON_SCHEMA") {
      try {
        const parsed = JSON.parse(cleanContent);
        if (prompt.schema) {
          return prompt.schema.parse(parsed);
        }
        return parsed;
      } catch (err: any) {
        throw new Error(`Structured output validation failed: ${err.message}. Original content: ${content}`);
      }
    }

    return cleanContent;
  }
}
export type { z };
