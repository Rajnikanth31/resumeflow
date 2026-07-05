import type { RootState } from "lib/redux/store";
import type { Middleware } from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = "open-resume-state";

export const loadStateFromLocalStorage = () => {
  try {
    const stringifiedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stringifiedState) return undefined;
    return JSON.parse(stringifiedState);
  } catch (e) {
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    const stringifiedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState);
  } catch (e) {
    // Ignore
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());

// Debounce helper
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

const mapReduxStateToDb = (state: RootState) => {
  const { resume, settings } = state;

  return {
    title: resume.profile.name ? `${resume.profile.name}'s Resume` : "My Resume",
    themeColor: settings.themeColor,
    fontFamily: settings.fontFamily,
    fontSize: parseFloat(settings.fontSize) || 11,
    documentSize: settings.documentSize,
    profile: {
      name: resume.profile.name,
      email: resume.profile.email,
      phone: resume.profile.phone,
      location: resume.profile.location,
      url: resume.profile.url,
      summary: resume.profile.summary,
    },
    workHistory: resume.workExperiences.map((exp, idx) => ({
      company: exp.company,
      position: exp.jobTitle,
      location: "",
      startDate: exp.date,
      endDate: "",
      current: false,
      descriptions: exp.descriptions,
      orderIndex: idx,
    })),
    education: resume.educations.map((edu, idx) => ({
      school: edu.school,
      degree: edu.degree,
      fieldOfStudy: "",
      location: "",
      startDate: edu.date,
      endDate: "",
      gpa: edu.gpa,
      descriptions: edu.descriptions,
      orderIndex: idx,
    })),
    projects: resume.projects.map((proj, idx) => ({
      name: proj.project,
      role: "",
      url: "",
      startDate: proj.date,
      endDate: "",
      descriptions: proj.descriptions,
      orderIndex: idx,
    })),
    skills: resume.skills.featuredSkills.map((sk, idx) => ({
      name: sk.skill,
      level: sk.rating,
      category: "",
      orderIndex: idx,
    })),
    customs: resume.custom.descriptions.length > 0 ? [
      {
        heading: settings.formToHeading.custom,
        descriptions: resume.custom.descriptions,
        orderIndex: 0,
      }
    ] : [],
  };
};

const debouncedSaveState = debounce((state: RootState) => {
  saveStateToLocalStorage(state);
}, 1000);

const debouncedSyncToDatabase = debounce(async (state: RootState) => {
  const resumeId = state.settings.resumeId;
  if (!resumeId) return;

  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("resume-saving"));
    }

    const payload = mapReduxStateToDb(state);
    const res = await fetch(`/api/resumes/${resumeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to save to database");
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("resume-saved"));
    }
  } catch (err) {
    console.error("Autosave database sync error:", err);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("resume-save-error"));
    }
  }
}, 1000);

export const localStorageMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);
    const actionType = (action as any).type;
    if (
      actionType &&
      (actionType.startsWith("resume/") || actionType.startsWith("settings/"))
    ) {
      const state = storeApi.getState() as RootState;
      debouncedSaveState(state);
      if (state.settings.resumeId) {
        debouncedSyncToDatabase(state);
      }
    }
    return result;
  };
