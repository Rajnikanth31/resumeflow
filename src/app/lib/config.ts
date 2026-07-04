/**
 * ResumeFlow Central Configuration Module
 */

import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3001"),
});

const serverEnvSchema = z.object({
  PORT: z.string().default("3000").transform((v) => parseInt(v, 10)),
  DATABASE_URL: z.string().url().optional().or(z.literal("")),
  REDIS_URL: z.string().optional().or(z.literal("")),
  NEXTAUTH_SECRET: z.string().optional().or(z.literal("")),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  AI_PROVIDER: z.enum(["lm-studio", "gemini", "openai", "anthropic"]).default("lm-studio"),
  AI_ENDPOINT: z.string().url().default("http://localhost:1234/v1"),
  AI_MODEL_NAME: z.string().default("meta-llama-3-8b-instruct"),
  AI_API_KEY: z.string().default("not-needed-for-lm-studio"),
  AI_MAX_RETRIES: z.string().default("3").transform((v) => parseInt(v, 10)),
});

const isServer = typeof window === "undefined";

const parsedClient = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsedClient.success) {
  console.error("❌ Invalid client environment variables:", parsedClient.error.format());
  throw new Error("Invalid client environment variables");
}

let parsedServer: any = {};
if (isServer) {
  const result = serverEnvSchema.safeParse({
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AI_PROVIDER: process.env.AI_PROVIDER,
    AI_ENDPOINT: process.env.AI_ENDPOINT,
    AI_MODEL_NAME: process.env.AI_MODEL_NAME,
    AI_API_KEY: process.env.AI_API_KEY,
    AI_MAX_RETRIES: process.env.AI_MAX_RETRIES,
  });

  if (!result.success) {
    console.error("❌ Invalid server environment variables:", result.error.format());
    throw new Error("Invalid server environment variables");
  }
  parsedServer = result.data;
}

export const config = {
  api: {
    url: parsedClient.data.NEXT_PUBLIC_API_URL,
    port: isServer ? parsedServer.PORT : 3000,
  },
  database: {
    url: isServer ? parsedServer.DATABASE_URL || "" : "",
  },
  redis: {
    url: isServer ? parsedServer.REDIS_URL || "" : "",
  },
  auth: {
    secret: isServer ? parsedServer.NEXTAUTH_SECRET || "" : "",
    url: isServer ? parsedServer.NEXTAUTH_URL : "http://localhost:3000",
  },
  ai: {
    provider: isServer ? parsedServer.AI_PROVIDER : "lm-studio",
    endpoint: isServer ? parsedServer.AI_ENDPOINT : "http://localhost:1234/v1",
    modelName: isServer ? parsedServer.AI_MODEL_NAME : "meta-llama-3-8b-instruct",
    apiKey: isServer ? parsedServer.AI_API_KEY : "not-needed-for-lm-studio",
    maxRetries: isServer ? parsedServer.AI_MAX_RETRIES : 3,
  },
};
