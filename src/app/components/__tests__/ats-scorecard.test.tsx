import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ATSScorecard from "../ats-scorecard";

global.fetch = jest.fn();

describe("ATSScorecard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve target jobs and historical logs on mount", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jobs: [{ id: "job-1", title: "DevOps Engineer", company: "Google" }],
        }),
      })
      .mockResolvedValueOnce({
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
              reasoning: "Good match",
              matchedKeywords: ["TypeScript"],
              missingKeywords: ["React"],
              improvementSuggestions: [
                { suggestion: "Add React projects", category: "Keywords", estimatedScoreGain: 10 },
              ],
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      });

    render(<ATSScorecard resumeId="resume-1" />);

    // Wait for the job options list to be updated
    await waitFor(() => {
      expect(screen.getByText("DevOps Engineer (Google)")).toBeInTheDocument();
    });

    // Check score gauge is displayed
    expect(screen.getAllByText(/85/)[0]).toBeInTheDocument();
    expect(screen.getByText("Matched Keywords")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Missing Keywords")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});
