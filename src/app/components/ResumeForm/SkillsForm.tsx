import { Form } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectSkills, changeSkills } from "lib/redux/resumeSlice";
import { selectThemeColor } from "lib/redux/settingsSlice";
import { XMarkIcon } from "@heroicons/react/20/solid";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const { featuredSkills, descriptions } = skills;
  const form = "skills";
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";

  const handleSkillsChange = (field: "descriptions", value: string[]) => {
    dispatch(changeSkills({ field, value }));
  };
  const handleFeaturedSkillsChange = (
    idx: number,
    skill: string,
    rating: number
  ) => {
    dispatch(changeSkills({ field: "featuredSkills", idx, skill, rating }));
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="col-span-full">
          <InputGroupWrapper label="Skills List" className="col-span-full">
            <div className="mt-2 flex flex-wrap gap-2 rounded-md border border-gray-300 bg-white p-2 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
              {descriptions.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = descriptions.filter((_, i) => i !== idx);
                      handleSkillsChange("descriptions", newTags);
                    }}
                    className="rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    aria-label={`Delete ${tag}`}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add skill (separate with commas)..."
                className="min-w-[150px] flex-1 border-none bg-transparent py-1 text-base text-gray-900 placeholder-gray-400 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "," || e.key === "Enter") {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !descriptions.includes(val)) {
                      handleSkillsChange("descriptions", [
                        ...descriptions,
                        val,
                      ]);
                    }
                    e.currentTarget.value = "";
                  }
                }}
                onBlur={(e) => {
                  const val = e.currentTarget.value.trim();
                  if (val && !descriptions.includes(val)) {
                    handleSkillsChange("descriptions", [...descriptions, val]);
                  }
                  e.currentTarget.value = "";
                }}
              />
            </div>
          </InputGroupWrapper>
        </div>
        <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
        <InputGroupWrapper
          label="Featured Skills (Optional)"
          className="col-span-full"
        >
          <p className="mt-2 text-sm font-normal text-gray-600">
            Featured skills is optional to highlight top skills, with more
            circles mean higher proficiency.
          </p>
        </InputGroupWrapper>

        {featuredSkills.map(({ skill, rating }, idx) => (
          <FeaturedSkillInput
            key={idx}
            className="col-span-3"
            skill={skill}
            rating={rating}
            setSkillRating={(newSkill, newRating) => {
              handleFeaturedSkillsChange(idx, newSkill, newRating);
            }}
            placeholder={`Featured Skill ${idx + 1}`}
            circleColor={themeColor}
          />
        ))}
      </div>
    </Form>
  );
};
