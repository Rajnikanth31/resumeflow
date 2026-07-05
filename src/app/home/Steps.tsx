import {
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  FolderArrowDownIcon
} from "@heroicons/react/24/outline";

const STEPS = [
  {
    icon: DocumentPlusIcon,
    title: "1. Create Resume Profile",
    text: "Import an existing PDF or build from scratch in our high-fidelity editor workspace."
  },
  {
    icon: MagnifyingGlassIcon,
    title: "2. Input Job Profile",
    text: "Import target job details including company, tech stack, and hiring style preferences."
  },
  {
    icon: SparklesIcon,
    title: "3. Run AI Alignment",
    text: "Review ATS score reports, generate cover letter canvas edits, and polish bullet metrics."
  },
  {
    icon: FolderArrowDownIcon,
    title: "4. Export Package Bundle",
    text: "Download a ZIP package containing print-ready PDFs, Word-compatible DOCX documents, and ATS logs."
  }
];

export const Steps = () => {
  return (
    <section className="py-16 bg-zinc-950 text-white rounded-3xl px-8 lg:px-16 border border-zinc-900 mt-12">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">How It Works</h2>
        <p className="text-sm text-zinc-400">Follow our simple workflow to optimize your career outcomes.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col gap-4 p-6 border border-zinc-800/80 bg-zinc-900/20 rounded-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-zinc-100">{title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
