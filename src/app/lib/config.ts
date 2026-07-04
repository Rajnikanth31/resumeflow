/**
 * ResumeFlow Central Configuration Module
 */

export const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    port: parseInt(process.env.PORT || "3000", 10),
  },
  database: {
    url: process.env.DATABASE_URL || "",
  },
  redis: {
    url: process.env.REDIS_URL || "",
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET || "",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
  ai: {
    provider: process.env.AI_PROVIDER || "lm-studio",
    endpoint: process.env.AI_ENDPOINT || "http://localhost:1234/v1",
    modelName: process.env.AI_MODEL_NAME || "meta-llama-3-8b-instruct",
    apiKey: process.env.AI_API_KEY || "not-needed-for-lm-studio",
    maxRetries: parseInt(process.env.AI_MAX_RETRIES || "3", 10),
  },
};
