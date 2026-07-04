"use client";
import React, { useState, useMemo } from "react";
import { useAppSelector, useSetInitialStore } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { ShowForm, selectFormsOrder } from "lib/redux/settingsSlice";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "components/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "components/ResumeForm/EducationsForm";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { ExpanderWithHeightTransition } from "components/ExpanderWithHeightTransition";
import { cx } from "lib/cx";
import {
  UserIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

const CollapsiblePanel = ({
  title,
  icon: Icon,
  defaultExpanded = false,
  children,
}: {
  title: string;
  icon: React.ComponentType<any>;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section className="flex flex-col gap-3 rounded-md bg-white p-6 pt-4 shadow transition-all duration-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between rounded-md p-1 text-left text-lg font-semibold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-expanded={expanded}
        aria-label={`${expanded ? "Collapse" : "Expand"} ${title}`}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <span className="tracking-wide">{title}</span>
        </div>
        <div>
          {expanded ? (
            <ChevronUpIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </div>
      </button>

      <ExpanderWithHeightTransition expanded={expanded}>
        <div className="mt-2 border-t border-gray-100 pt-3">{children}</div>
      </ExpanderWithHeightTransition>
    </section>
  );
};

export const ResumeForm = () => {
  useSetInitialStore();

  const resume = useAppSelector(selectResume);
  const formsOrder = useAppSelector(selectFormsOrder);
  const [isHover, setIsHover] = useState(false);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    const { profile, workExperiences, educations, projects } = resume;

    // 1. Profile Errors
    if (profile.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email)) {
        errors.push("Personal Details: Invalid email format");
      }
    }
    if (profile.url) {
      const urlRegex =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (!urlRegex.test(profile.url)) {
        errors.push("Personal Details: Invalid URL format");
      }
    }

    // 2. Experience Errors
    workExperiences.forEach((exp, idx) => {
      const num = idx + 1;
      if (!exp.company.trim()) {
        errors.push(`Work Experience #${num}: Company name is required`);
      }
      if (!exp.jobTitle.trim()) {
        errors.push(`Work Experience #${num}: Job title is required`);
      }
    });

    // 3. Education Errors
    educations.forEach((edu, idx) => {
      const num = idx + 1;
      if (!edu.school.trim()) {
        errors.push(`Education #${num}: School name is required`);
      }
      if (!edu.degree.trim()) {
        errors.push(`Education #${num}: Degree is required`);
      }
      if (edu.gpa.trim()) {
        const gpaNum = parseFloat(edu.gpa);
        if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
          errors.push(`Education #${num}: GPA must be between 0.0 and 4.0`);
        }
      }
    });

    // 4. Project Errors
    projects.forEach((proj, idx) => {
      const num = idx + 1;
      if (!proj.project.trim()) {
        errors.push(`Project #${num}: Project name is required`);
      }
    });

    return errors;
  }, [resume]);

  return (
    <div
      className={cx(
        "flex justify-center scrollbar-thin scrollbar-track-gray-100 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end md:overflow-y-scroll",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section className="flex w-full max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
        <div aria-live="polite" className="sr-only">
          {validationErrors.length > 0
            ? `The resume form has ${
                validationErrors.length
              } validation errors: ${validationErrors.join(", ")}`
            : "The resume form has no validation errors."}
        </div>

        {validationErrors.length > 0 && (
          <div
            className="rounded-md border border-amber-200 bg-amber-50 p-4"
            role="alert"
          >
            <div className="flex gap-2">
              <span className="font-semibold text-amber-800">
                Form Warning: {validationErrors.length} item
                {validationErrors.length > 1 ? "s" : ""} need attention.
              </span>
            </div>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-700">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <CollapsiblePanel
          title="Personal Details"
          icon={UserIcon}
          defaultExpanded={true}
        >
          <ProfileForm />
        </CollapsiblePanel>

        {formsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return <Component key={form} />;
        })}

        <CollapsiblePanel title="Resume Setting" icon={Cog6ToothIcon}>
          <ThemeForm />
        </CollapsiblePanel>
        <br />
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};
