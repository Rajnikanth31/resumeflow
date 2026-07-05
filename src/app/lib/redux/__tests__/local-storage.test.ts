import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "../resumeSlice";
import settingsReducer from "../settingsSlice";
import { localStorageMiddleware } from "../local-storage";

describe("localStorageMiddleware", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as any;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
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

    expect(localStorage.getItem("open-resume-state")).toBeNull();

    jest.advanceTimersByTime(1000);

    const savedState = localStorage.getItem("open-resume-state");
    expect(savedState).not.toBeNull();
    const parsed = JSON.parse(savedState!);
    expect(parsed.resume.profile.name).toBe("Test Name 2");
  });

  it("should sync to database if resumeId is set", async () => {
    const testStore = configureStore({
      reducer: {
        resume: resumeReducer,
        settings: settingsReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    });

    testStore.dispatch({
      type: "settings/setResumeId",
      payload: "resume-uuid",
    });

    testStore.dispatch({
      type: "resume/changeProfile",
      payload: { field: "name", value: "John Doe" },
    });

    jest.advanceTimersByTime(1000);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/resumes/resume-uuid",
      expect.objectContaining({
        method: "PUT",
        body: expect.stringContaining("John Doe"),
      })
    );
  });
});
