"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { useAppDispatch } from "lib/redux/hooks";
import { setResumeId } from "lib/redux/settingsSlice";
import { setResume } from "lib/redux/resumeSlice";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { ResumeBuilderLayout } from "components/ResumeBuilder/ResumeBuilderLayout";

function ResumeLoader({ children }: { children: (props: { isLoading: boolean }) => React.ReactNode }) {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(!!resumeId);

  useEffect(() => {
    if (!resumeId) {
      dispatch(setResumeId(null));
      return;
    }

    async function loadResume() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/resumes/${resumeId}`);
        if (!res.ok) {
          throw new Error("Failed to load resume");
        }
        const data = await res.json();
        const dbResume = data.resume;

        const mappedResume = {
          profile: {
            name: dbResume.profile?.name || "",
            role: "",
            email: dbResume.profile?.email || "",
            phone: dbResume.profile?.phone || "",
            url: dbResume.profile?.url || "",
            summary: dbResume.profile?.summary || "",
            location: dbResume.profile?.location || "",
          },
          workExperiences: (dbResume.workHistory || []).map((exp: any) => ({
            company: exp.company || "",
            jobTitle: exp.position || "",
            date: exp.startDate || "",
            descriptions: exp.descriptions || [],
          })),
          educations: (dbResume.education || []).map((edu: any) => ({
            school: edu.school || "",
            degree: edu.degree || "",
            gpa: edu.gpa || "",
            date: edu.startDate || "",
            descriptions: edu.descriptions || [],
          })),
          projects: (dbResume.projects || []).map((proj: any) => ({
            project: proj.name || "",
            date: proj.startDate || "",
            descriptions: proj.descriptions || [],
          })),
          skills: {
            featuredSkills: (dbResume.skills || []).map((sk: any) => ({
              skill: sk.name || "",
              rating: sk.level || 4,
            })),
            descriptions: [],
          },
          custom: {
            descriptions: dbResume.customs?.[0]?.descriptions || [],
          },
        };

        dispatch(setResume(mappedResume));
        dispatch(setResumeId(resumeId));
      } catch (err) {
        console.error("Error loading resume from DB:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadResume();
  }, [resumeId, dispatch]);

  return <>{children({ isLoading })}</>;
}

export default function Create() {
  return (
    <Provider store={store}>
      <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-zinc-50 text-sm text-gray-500">Loading ResumeFlow Editor...</div>}>
        <ResumeLoader>
          {({ isLoading }) => (
            <ResumeBuilderLayout
              editorChildren={<ResumeForm />}
              previewChildren={<Resume />}
              renderType="pdf"
              isLoading={isLoading}
            />
          )}
        </ResumeLoader>
      </Suspense>
    </Provider>
  );
}
