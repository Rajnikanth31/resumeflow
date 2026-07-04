"use client";
import React, { useState } from "react";
import { useAppSelector, useSetInitialStore } from "lib/redux/hooks";
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

  const formsOrder = useAppSelector(selectFormsOrder);
  const [isHover, setIsHover] = useState(false);

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
