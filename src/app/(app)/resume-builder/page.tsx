"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";

export default function Create() {
  return (
    <Provider store={store}>
      <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-8 overflow-hidden lg:grid-cols-2">
        {/* Left Pane: Form Editor (Scrollable) */}
        <section className="flex h-full flex-col overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-sm">
          <ResumeForm />
        </section>

        {/* Right Pane: PDF Preview Panel (Scrollable) */}
        <section className="flex h-full flex-col items-center justify-start overflow-y-auto rounded-lg border border-border bg-zinc-100 p-6 shadow-sm dark:bg-zinc-900">
          <Resume />
        </section>
      </div>
    </Provider>
  );
}
