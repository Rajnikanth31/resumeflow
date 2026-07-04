import React from "react";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../settingsSlice";
import resumeReducer from "../resumeSlice";
import { useResumeSettings } from "../hooks";

const createTestStore = () =>
  configureStore({
    reducer: {
      settings: settingsReducer,
      resume: resumeReducer,
    },
  });

describe("useResumeSettings Hook", () => {
  it("should return default configurations", () => {
    const store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useResumeSettings(), { wrapper });

    expect(result.current.template).toBe("classic");
    expect(result.current.themeColor).toBe("#38bdf8");
    expect(result.current.fontFamily).toBe("Roboto");
    expect(result.current.fontSize).toBe("11");
    expect(result.current.documentSize).toBe("Letter");
  });
});
