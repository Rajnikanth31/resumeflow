import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "../resumeSlice";
import settingsReducer from "../settingsSlice";
import { localStorageMiddleware } from "../local-storage";

describe("localStorageMiddleware", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should debounce saving state to localStorage", () => {
    const testStore = configureStore({
      reducer: {
        resume: resumeReducer,
        settings: settingsReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    });

    testStore.dispatch({
      type: "resume/changeProfile",
      payload: { field: "name", value: "Test Name" },
    });
    testStore.dispatch({
      type: "resume/changeProfile",
      payload: { field: "name", value: "Test Name 2" },
    });

    // Instantly check localStorage - should be empty because of debounce
    expect(localStorage.getItem("open-resume-state")).toBeNull();

    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);

    // Now it should be saved
    const savedState = localStorage.getItem("open-resume-state");
    expect(savedState).not.toBeNull();
    const parsed = JSON.parse(savedState!);
    expect(parsed.resume.profile.name).toBe("Test Name 2");
  });
});
