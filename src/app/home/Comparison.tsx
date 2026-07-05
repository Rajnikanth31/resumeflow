import React from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const Comparison = () => {
  const rows = [
    { name: "Multi-Metric ATS Analyzer", rf: true, trad: false },
    { name: "Contextual AI Bullet Point Rewriting", rf: true, trad: false },
    { name: "Recruiter-Aligned Cover Letters", rf: true, trad: false },
    { name: "ZIP Application Packages (PDF + Word DOCX)", rf: true, trad: false },
    { name: "Local Storage Data Privacy (No Signup Required)", rf: true, trad: false },
  ];

  return (
    <section className="max-w-[1180px] mx-auto py-16 px-6 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-block rounded-full bg-indigo-500/10 px-3.5 py-1 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
          COMPARISON
        </div>
        <h2 className="text-3xl font-extrabold font-heading tracking-tight text-foreground">
          Why choose ResumeFlow?
        </h2>
        <p className="text-sm text-muted-foreground">
          ResumeFlow is engineered to build cohesive job applications, not just single resume PDFs.
        </p>
      </div>

      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-zinc-500/5">
              <th className="p-4 lg:p-6 text-xs font-bold uppercase text-muted-foreground">Capabilities</th>
              <th className="p-4 lg:p-6 text-xs font-bold uppercase text-indigo-500 dark:text-indigo-400 text-center">ResumeFlow</th>
              <th className="p-4 lg:p-6 text-xs font-bold uppercase text-muted-foreground text-center">Traditional Builders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.name} className="hover:bg-zinc-500/5 transition-colors">
                <td className="p-4 lg:p-6 text-sm font-semibold text-foreground">{row.name}</td>
                <td className="p-4 lg:p-6 text-center">
                  {row.rf ? (
                    <CheckIcon className="h-5 w-5 text-emerald-500 mx-auto" />
                  ) : (
                    <XMarkIcon className="h-5 w-5 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="p-4 lg:p-6 text-center">
                  {row.trad ? (
                    <CheckIcon className="h-5 w-5 text-emerald-500 mx-auto" />
                  ) : (
                    <XMarkIcon className="h-5 w-5 text-rose-500/60 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
