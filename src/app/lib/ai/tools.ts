export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface AIToolResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface AIResumeTool {
  optimizeBullet(bullet: string): Promise<AIToolResponse>;
  suggestSkills(resumeText: string): Promise<AIToolResponse>;
}

export interface AIATSTool {
  analyzeScore(resumeText: string, jobDescription: string): Promise<AIToolResponse>;
}

export interface AIPortfolioTool {
  generateLayout(sections: any): Promise<AIToolResponse>;
}

export interface AIJobDescriptionTool {
  extractRequirements(jobDescription: string): Promise<AIToolResponse>;
}

export interface AIResumeDatabaseTool {
  matchResumes(query: string, limit: number): Promise<AIToolResponse>;
}

export interface AIInterviewTool {
  generateQuestions(resumeText: string, jobDescription: string): Promise<AIToolResponse>;
}
