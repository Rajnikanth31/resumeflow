import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CoverLetterPage from "../page";

global.fetch = jest.fn();

describe("CoverLetterPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve target jobs and cover letters on mount", async () => {
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
          coverLetters: [
            {
              id: "cl-1",
              title: "My Cover Letter",
              content: "Dear hiring manager, I am applying for SRE role.",
              tone: "Formal",
              qualityScore: { relevance: 90, professionalism: 95, grammar: 90, atsAlignment: 88 },
              explanations: {
                whySectionsWritten: ["A"],
                jobRequirementsAddressed: ["B"],
                resumeExperiencesEmphasized: ["C"],
              },
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          reports: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          versions: [{ id: "v-1", versionName: "Initial Version", content: "Dear hiring manager", createdAt: new Date().toISOString() }],
        }),
      });

    render(<CoverLetterPage params={{ id: "resume-1" }} />);

    await waitFor(() => {
      expect(screen.getByText("DevOps Engineer - Google")).toBeInTheDocument();
    });

    expect(screen.getByText("Explainable AI Scorer Logic")).toBeInTheDocument();
    expect(screen.getByText("Why Key Sections Were Written")).toBeInTheDocument();
    expect(screen.getByText("Cover Letter Quality Score")).toBeInTheDocument();
  });
});
