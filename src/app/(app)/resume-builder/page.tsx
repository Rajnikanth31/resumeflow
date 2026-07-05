"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { ResumeBuilderLayout } from "components/ResumeBuilder/ResumeBuilderLayout";

export default function Create() {
  return (
    <Provider store={store}>
      <ResumeBuilderLayout
        editorChildren={<ResumeForm />}
        previewChildren={<Resume />}
        renderType="pdf"
      />
    </Provider>
  );
}
