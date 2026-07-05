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
    "resume-suggestions": {
      "v1": {
        id: "resume-suggestions",
        version: "v1",
        systemTemplate: "You are an expert career consultant. Provide optimized suggestions for this resume section. If a Job Description is provided, align your suggestions directly with it. You must return a JSON array of suggestion items.",
        userTemplate: "Section Content:\n{{content}}\n\nJob Description (Optional):\n{{jobDescription}}\n\nSection Type:\n{{sectionType}}",
        outputFormat: "JSON",
        schema: z.object({
          suggestions: z.array(
            z.object({
              suggestionText: z.string(),
              explanation: z.string(),
              expectedBenefit: z.string(),
              confidenceScore: z.number().min(0).max(1),
              atsImpact: z.number().min(0).max(10),
              category: z.enum([
                "Grammar",
                "ATS",
                "Keywords",
                "Action Verbs",
                "Quantification",
                "Readability",
                "Recruiter Recommendations",
              ]),
            })
          ),
        }),
      },
    },
    "job-parser": {
      "v1": {
        id: "job-parser",
        version: "v1",
        systemTemplate: "You are an expert technical recruiter. Analyze this Job Description text and extract structured company metadata, requirements, and hiring focus profiles.",
        userTemplate: "Job Description:\n{{description}}",
        outputFormat: "JSON",
        schema: z.object({
          title: z.string(),
          company: z.string(),
          industry: z.string().optional(),
          remoteType: z.enum(["remote", "hybrid", "onsite"]).default("onsite"),
          salaryMin: z.number().optional(),
          salaryMax: z.number().optional(),
          seniority: z.string().optional(),
          techStack: z.array(z.string()),
          hiringFocus: z.string().optional(),
          responsibilities: z.array(z.string()),
          requiredSkills: z.array(z.string()),
          preferredSkills: z.array(z.string()),
          experienceYearsRequired: z.number().default(0),
          educationRequired: z.string().optional(),
        }),
      },
    },
    "resume-tailor": {
      "v1": {
        id: "resume-tailor",
        version: "v1",
        systemTemplate: "You are an expert resume optimizer. Rewrite the resume profile summary, work descriptions, and project descriptions to highlight match alignments with the target Job Description. Maintain all core facts, numbers, dates, companies, and roles.",
        userTemplate: "Resume Content:\n{{resume}}\n\nJob Description:\n{{jobDescription}}",
        outputFormat: "JSON",
        schema: z.object({
          summary: z.string(),
          workExperiences: z.array(
            z.object({
              company: z.string(),
              descriptions: z.array(z.string()),
            })
          ),
          projects: z.array(
            z.object({
              project: z.string(),
              descriptions: z.array(z.string()),
            })
          ),
        }),
      },
    },
    "ats-scanner": {
      "v1": {
        id: "ats-scanner",
        version: "v1",
        systemTemplate: "You are an advanced ATS (Applicant Tracking System) scan analyzer. Evaluate the provided resume text against the target Job Description. Compute independent score categories (0-100) and compile explainable feedback suggestions with estimated score gains.",
        userTemplate: "Resume Content:\n{{resume}}\n\nJob Description:\n{{jobDescription}}",
        outputFormat: "JSON",
        schema: z.object({
          overallScore: z.number().min(0).max(100),
          keywordScore: z.number().min(0).max(100),
          semanticScore: z.number().min(0).max(100),
          experienceScore: z.number().min(0).max(100),
          projectScore: z.number().min(0).max(100),
          educationScore: z.number().min(0).max(100),
          qualityScore: z.number().min(0).max(100),
          reasoning: z.string(),
          matchedKeywords: z.array(z.string()),
          missingKeywords: z.array(z.string()),
          improvementSuggestions: z.array(
            z.object({
              suggestion: z.string(),
              category: z.enum([
                "Grammar",
                "ATS",
                "Keywords",
                "Action Verbs",
                "Quantification",
                "Readability",
                "Recruiter Recommendations",
              ]),
              estimatedScoreGain: z.number(),
            })
          ),
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
