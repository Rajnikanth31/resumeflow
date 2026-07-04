"use client";
import { useState, useMemo } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "components/Resume/ResumeControlBar";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative">
          <section className="relative h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-hidden md:p-[var(--resume-padding)]">
            <ResumeIframeCSR
              documentSize={settings.documentSize}
              scale={scale}
              enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
            >
              <ResumePDF
                resume={resume}
                settings={settings}
                isPDF={DEBUG_RESUME_PDF_FLAG}
              />
            </ResumeIframeCSR>

            {isLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-[2px] transition-opacity duration-200">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
                  <span className="text-sm font-medium text-zinc-600">
                    Compiling PDF...
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-50/90 backdrop-blur-[2px]">
                <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-xl">
                  <p className="mb-2 font-semibold text-red-600">
                    PDF Compilation Error
                  </p>
                  <p className="text-sm text-zinc-500">{error.message}</p>
                </div>
              </div>
            )}
          </section>
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            document={document}
            fileName={resume.profile.name + " - Resume"}
            onLoadingStateChange={(loading, err) => {
              setIsLoading(loading);
              setError(err);
            }}
          />
        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};
