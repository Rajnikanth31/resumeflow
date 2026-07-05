"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  PlayIcon,
  CpuChipIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function AIPlaygroundPage() {
  const [promptId, setPromptId] = useState("resume-optimization");
  const [version, setVersion] = useState("v1");
  const [variables, setVariables] = useState<Record<string, string>>({
    content: "Developed GraphQL APIs to improve system latency by 20%.",
  });

  const [provider, setProvider] = useState<string>("lm-studio");
  const [model, setModel] = useState<string>("local-model");
  const [temperature, setTemperature] = useState(0.7);
  const [streaming, setStreaming] = useState(false);
  const [maxTokens, setMaxTokens] = useState(1024);

  const [responseContent, setResponseContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [tokenUsage, setTokenUsage] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (promptId === "resume-optimization") {
      setVariables({ content: "Developed GraphQL APIs to improve system latency by 20%." });
    } else if (promptId === "ats-analyzer") {
      setVariables({
        resume: "Experienced developer with GraphQL API expertise.",
        jobDescription: "Required: Senior developer with GraphQL API design experience.",
      });
    }
  }, [promptId]);

  async function handleTest() {
    setIsLoading(true);
    setErrorMsg("");
    setResponseContent("");
    setLatencyMs(null);
    setTokenUsage(null);

    const startTime = performance.now();
    try {
      if (streaming) {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            promptId,
            version,
            variables,
            config: {
              provider,
              model,
              temperature,
              maxTokens,
              streaming: true,
            },
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to initiate stream");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        if (!reader) throw new Error("No readable stream");

        setIsLoading(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "data: [DONE]") continue;

            if (trimmed.startsWith("data: ")) {
              try {
                const data = JSON.parse(trimmed.slice(6));
                if (data.chunk) {
                  setResponseContent((prev) => prev + data.chunk);
                } else if (data.error) {
                  setErrorMsg(data.error);
                }
              } catch (e) {
                // Ignore partial JSON chunks
              }
            }
          }
        }
        setLatencyMs(Math.round(performance.now() - startTime));
      } else {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            promptId,
            version,
            variables,
            config: {
              provider,
              model,
              temperature,
              maxTokens,
              streaming: false,
            },
          }),
        });

        const latency = Math.round(performance.now() - startTime);
        setLatencyMs(latency);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.details || err.error || "Generation failed");
        }

        const data = await res.json();
        setResponseContent(
          typeof data.content === "object"
            ? JSON.stringify(data.content, null, 2)
            : data.content
        );
        setTokenUsage(data.usage);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl tracking-tight text-foreground">
          AI Platform Playground
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Directly test system prompt configurations, providers, and response validation.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1 bg-card rounded-lg border border-border p-5 shadow-sm">
          <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
            Configuration
          </h2>

          <div className="space-y-4 text-sm">
            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Prompt ID</label>
              <select
                value={promptId}
                onChange={(e) => setPromptId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="resume-optimization">resume-optimization</option>
                <option value="ats-analyzer">ats-analyzer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Prompt Version</label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="v1">v1 (Plain text)</option>
                <option value="v2">v2 (Structured Zod JSON)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">AI Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="lm-studio">LM Studio (Local)</option>
                <option value="ollama">Ollama (Local)</option>
                <option value="openai">OpenAI (Cloud)</option>
                <option value="gemini">Google Gemini (Cloud)</option>
                <option value="anthropic">Anthropic (Cloud)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Model Target</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. gpt-4 or local-model"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="font-medium text-foreground">Temperature</label>
                <span className="font-semibold text-primary">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <label className="font-medium text-foreground">Stream Chunk Delivery</label>
              <input
                type="checkbox"
                checked={streaming}
                onChange={(e) => setStreaming(e.target.checked)}
                className="h-4 w-4 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border border-border p-5 shadow-sm space-y-4">
            <h2 className="font-heading font-semibold text-lg">Input Parameters</h2>
            <div className="space-y-3">
              {Object.keys(variables).map((key) => (
                <div key={key} className="space-y-1.5 text-sm">
                  <label className="font-medium text-foreground uppercase tracking-wider text-[10px]">
                    Variable: {`{{${key}}}`}
                  </label>
                  <textarea
                    rows={promptId === "ats-analyzer" ? 4 : 2}
                    value={variables[key]}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleTest}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/95 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
                Run Model Generation
              </button>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-heading font-semibold text-lg">Model Output</h2>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
                {latencyMs && (
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    Latency: {latencyMs}ms
                  </span>
                )}
                {tokenUsage && (
                  <span className="flex items-center gap-1">
                    <CpuChipIcon className="h-4 w-4" />
                    Tokens: {tokenUsage.totalTokens}
                  </span>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-400">
                <span className="font-bold">Execution Error:</span> {errorMsg}
              </div>
            )}

            <div className="min-h-48 rounded-lg bg-zinc-900 dark:bg-zinc-950 p-4 font-mono text-sm text-zinc-100 overflow-x-auto whitespace-pre-wrap">
              {responseContent || (
                <span className="text-zinc-500 italic">No output. Press Run Model Generation to execute...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
