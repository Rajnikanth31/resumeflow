// Polyfill structuredClone for Jest JSDOM environment if missing
if (typeof global.structuredClone !== "function") {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

import reducer, {
  changeProfile,
  changeWorkExperiences,
  addSectionInForm,
  deleteSectionInFormByIdx,
  moveSectionInForm,
  setResume,
  initialResumeState,
} from "../resumeSlice";
import type { Resume } from "../types";

describe("resumeSlice Reducers", () => {
  it("should return the initial state by default", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialResumeState);
  });

  it("should handle changeProfile", () => {
    const nextState = reducer(
      initialResumeState,
      changeProfile({ field: "name", value: "John Doe" })
    );
    expect(nextState.profile.name).toBe("John Doe");
  });

  it("should handle changeWorkExperiences", () => {
    const nextState = reducer(
      initialResumeState,
      changeWorkExperiences({
        idx: 0,
        field: "company",
        value: "Google",
      })
    );
    expect(nextState.workExperiences[0].company).toBe("Google");
  });

  it("should handle addSectionInForm", () => {
    const nextState = reducer(
      initialResumeState,
      addSectionInForm({ form: "workExperiences" })
    );
    expect(nextState.workExperiences.length).toBe(2);
    expect(nextState.workExperiences[1].company).toBe("");
  });

  it("should handle deleteSectionInFormByIdx", () => {
    const stateWithMultiple: Resume = {
      ...initialResumeState,
      workExperiences: [
        { company: "A", jobTitle: "", date: "", descriptions: [] },
        { company: "B", jobTitle: "", date: "", descriptions: [] },
      ],
    };
    const nextState = reducer(
      stateWithMultiple,
      deleteSectionInFormByIdx({ form: "workExperiences", idx: 0 })
    );
    expect(nextState.workExperiences.length).toBe(1);
    expect(nextState.workExperiences[0].company).toBe("B");
  });

  it("should handle moveSectionInForm", () => {
    const stateWithMultiple: Resume = {
      ...initialResumeState,
      workExperiences: [
        { company: "A", jobTitle: "", date: "", descriptions: [] },
        { company: "B", jobTitle: "", date: "", descriptions: [] },
      ],
    };
    const nextState = reducer(
      stateWithMultiple,
      moveSectionInForm({ form: "workExperiences", idx: 1, direction: "up" })
    );
    expect(nextState.workExperiences[0].company).toBe("B");
    expect(nextState.workExperiences[1].company).toBe("A");
  });

  it("should handle setResume", () => {
    const customResume: Resume = {
      ...initialResumeState,
      profile: {
        name: "Alice",
        summary: "Lead Developer",
        email: "alice@test.com",
        phone: "123",
        location: "NYC",
        url: "alice.dev",
      },
    };
    const nextState = reducer(initialResumeState, setResume(customResume));
    expect(nextState.profile.name).toBe("Alice");
  });
});
