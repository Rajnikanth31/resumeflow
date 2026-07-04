import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();

  const showDelete = workExperiences.length > 1;

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          // TS doesn't support passing union type to single call signature
          // https://github.com/microsoft/TypeScript/issues/54027
          // any is used here as a workaround
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete job"
          >
            <div className="col-span-full flex flex-col">
              <Input
                label="Company"
                name="company"
                placeholder="Khan Academy"
                value={company}
                onChange={handleWorkExperienceChange}
              />
              {!company.trim() && (
                <p
                  className="mt-1 text-sm font-normal text-red-500"
                  role="alert"
                >
                  Company name is required.
                </p>
              )}
            </div>
            <div className="col-span-4 flex flex-col">
              <Input
                label="Job Title"
                name="jobTitle"
                placeholder="Software Engineer"
                value={jobTitle}
                onChange={handleWorkExperienceChange}
              />
              {!jobTitle.trim() && (
                <p
                  className="mt-1 text-sm font-normal text-red-500"
                  role="alert"
                >
                  Job title is required.
                </p>
              )}
            </div>
            <div className="col-span-2 flex flex-col">
              <Input
                label="Date"
                name="date"
                placeholder="Jun 2022 - Present"
                value={date}
                onChange={handleWorkExperienceChange}
              />
              <span className="mt-1 text-xs font-normal text-zinc-400">
                e.g., Jun 2022 - Present
              </span>
            </div>
            <BulletListTextarea
              label="Description"
              labelClassName="col-span-full"
              name="descriptions"
              placeholder="Bullet points"
              value={descriptions}
              onChange={handleWorkExperienceChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
