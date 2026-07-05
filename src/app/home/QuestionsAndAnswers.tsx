import { Link } from "components/documentation";

const QAS = [
  {
    question: "What is ResumeFlow?",
    answer: (
      <p>
        ResumeFlow is a premium, privacy-focused AI Career Platform built to help job seekers design professional resumes, tailor applications, run ATS scoring scans, and export unified application bundles containing resumes and cover letters in seconds.
      </p>
    )
  },
  {
    question: "How does the ATS matching algorithm work?",
    answer: (
      <p>
        ResumeFlow analyzes your resume content against target job descriptions across multiple scoring dimensions, including Keyword Matching, Semantic Relevance, Experience Alignment, Project Relevance, Education fit, and general formatting quality. It provides actionable keyword heatmaps and missing skills checklists to maximize compliance.
      </p>
    )
  },
  {
    question: "Is my personal data safe?",
    answer: (
      <p>
        Yes. ResumeFlow is designed with privacy as a first-class citizen. All input details, resumes, jobs, cover letters, and logs are stored securely in your browser's local storage and database connection setup, giving you absolute control over your career data.
      </p>
    )
  },
  {
    question: "How do I download the application packages?",
    answer: (
      <p>
        Once you configure your resume, target job, and generate/tailor a matching cover letter, you can use our unified package exporter workspace to download a structured ZIP archive. This bundles print-ready PDFs, Word-compatible DOCX cover letters, and ATS score reports.
      </p>
    )
  }
];

export const QuestionsAndAnswers = () => {
  return (
    <section className="py-20 lg:py-28 bg-card text-foreground rounded-3xl px-8 lg:px-16 border border-border mt-12 mb-12">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
        <p className="text-sm text-muted-foreground">Common questions about the ResumeFlow platform and features.</p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-border">
        {QAS.map(({ question, answer }) => (
          <div key={question} className="py-6 space-y-3">
            <h3 className="text-base font-bold text-foreground">{question}</h3>
            <div className="text-sm text-muted-foreground leading-relaxed">{answer}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
