import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ATSDashboard from "../page";

global.fetch = jest.fn();

describe("ATSDashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders scan history reports list on mount", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reports: [
          {
            id: "report-1",
            overallScore: 85,
            keywordScore: 90,
            semanticScore: 80,
            experienceScore: 75,
            projectScore: 80,
            educationScore: 90,
            qualityScore: 85,
            reasoning: "Excellent matches",
            matchedKeywords: ["TypeScript"],
            missingKeywords: ["React"],
            improvementSuggestions: [
              { suggestion: "Add React projects", category: "Keywords", estimatedScoreGain: 10 },
            ],
            job: { title: "Software Engineer", company: "Google" },
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    });

    render(<ATSDashboard params={{ id: "resume-1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Latest Audit: Software Engineer")).toBeInTheDocument();
    });

    expect(screen.getByText(/Company: Google/)).toBeInTheDocument();
    expect(screen.getByText("Explainable Scorer Reasoning")).toBeInTheDocument();
    expect(screen.getByText("Excellent matches")).toBeInTheDocument();
  });
});
