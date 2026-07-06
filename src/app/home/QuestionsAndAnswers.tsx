import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

const QAS = [
  {
    question: "What is ResumeFlow?",
    answer:
      "ResumeFlow is a privacy-focused AI career platform. It helps you design professional resumes, tailor them to specific jobs, run ATS scoring scans, and export complete application bundles — resume, cover letter, and score report — in seconds.",
  },
  {
    question: "How does the ATS matching algorithm work?",
    answer:
      "Your resume is analyzed against the target job description across multiple dimensions: keyword matching, semantic relevance, experience alignment, project relevance, education fit, and formatting quality. You get an actionable heatmap and a missing-skills checklist, not just a number.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "Yes. Your resumes, job targets, cover letters, and logs are stored in your browser's local storage by default — nothing is uploaded to our servers to build your documents. You stay in complete control of your career data.",
  },
  {
    question: "How do I download my application package?",
    answer:
      "Once you've configured your resume and target job and generated a cover letter, the package exporter bundles everything into a structured ZIP: print-ready PDF, Word-compatible DOCX, and your ATS score report.",
  },
  {
    question: "Will my resume actually pass ATS screeners?",
    answer:
      "Every template uses a parse-safe layout — no tables, text boxes, or graphics that trip up parsers. Combined with keyword tailoring, your resume is structured the way ATS platforms like Workday and Greenhouse expect.",
  },
];

export const QuestionsAndAnswers = () => (
  <Section id="faq">
    <SectionHeader
      kicker="FAQ"
      title="Frequently asked questions"
      subtitle="Everything you need to know before you hit export."
    />
    <div className="mx-auto max-w-3xl space-y-3">
      {QAS.map(({ question, answer }, i) => (
        <Reveal key={question} delay={i * 60}>
          <details className="faq-item group rounded-2xl border border-border bg-card shadow-e1 transition-colors open:border-primary/25">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 text-left text-base font-semibold text-foreground sm:p-6">
              {question}
              <ChevronDownIcon
                className="faq-chevron h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
              {answer}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  </Section>
);
