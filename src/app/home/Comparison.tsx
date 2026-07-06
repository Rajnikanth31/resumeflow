import React from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

const ROWS = [
  "Multi-metric ATS analyzer",
  "Contextual AI bullet rewriting",
  "Recruiter-aligned cover letters",
  "ZIP application packages (PDF + DOCX)",
  "Privacy-first — no signup required",
];

export const Comparison = () => (
  <Section id="comparison" className="bg-card/50 border-y border-border">
    <SectionHeader
      kicker="Comparison"
      title="Built for applications, not just documents"
      subtitle="Traditional builders stop at a PDF. ResumeFlow ships the whole application."
    />
    <Reveal>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-e2">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <caption className="sr-only">
            Feature comparison between ResumeFlow and traditional resume builders
          </caption>
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th scope="col" className="p-5 text-sm font-semibold text-muted-foreground lg:p-6">
                Capability
              </th>
              <th scope="col" className="p-5 text-center text-sm font-bold text-primary lg:p-6">
                ResumeFlow
              </th>
              <th scope="col" className="p-5 text-center text-sm font-semibold text-muted-foreground lg:p-6">
                Traditional builders
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ROWS.map((name) => (
              <tr key={name} className="transition-colors hover:bg-muted/40">
                <th scope="row" className="p-5 text-sm font-medium text-foreground lg:p-6">
                  {name}
                </th>
                <td className="p-5 text-center lg:p-6">
                  <CheckIcon className="mx-auto h-5 w-5 text-success" aria-hidden="true" />
                  <span className="sr-only">Yes</span>
                </td>
                <td className="p-5 text-center lg:p-6">
                  <XMarkIcon className="mx-auto h-5 w-5 text-muted-foreground/50" aria-hidden="true" />
                  <span className="sr-only">No</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  </Section>
);
