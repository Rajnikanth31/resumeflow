import { NextResponse } from "next/server";

export async function GET() {
  const providersStatus = {
    "lm-studio": {
      configured: true,
      endpoint: process.env.LM_STUDIO_BASE_URL || "http://localhost:1234/v1",
    },
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
    },
    gemini: {
      configured: !!process.env.GEMINI_API_KEY,
    },
    anthropic: {
      configured: !!process.env.ANTHROPIC_API_KEY,
    },
  };

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    providers: providersStatus,
  });
}
