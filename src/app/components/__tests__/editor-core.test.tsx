import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "lib/redux/resumeSlice";
import settingsReducer, { changeSettings } from "lib/redux/settingsSlice";
import { ResumeForm } from "../ResumeForm";

const createTestStore = () =>
  configureStore({
    reducer: {
      resume: resumeReducer,
      settings: settingsReducer,
    },
  });

describe("Editor Core - ResumeForm", () => {
  it("should render Personal Details collapsible form and show validation errors", async () => {
    const store = createTestStore();

    await act(async () => {
      render(
        <Provider store={store}>
          <ResumeForm />
        </Provider>
      );
    });

    // Personal Details is expanded by default. Let's find the Email field.
    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toBeInTheDocument();

    // Type an invalid email format and check if error alert appears
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    });

    // The central validation summary or field validation should flag this!
    const errorTexts = await screen.findAllByText(/Invalid email format/i);
    expect(errorTexts.length).toBeGreaterThan(0);
  });

  it("should respond to theme settings changes", () => {
    const store = createTestStore();

    // Verify default theme color
    expect(store.getState().settings.themeColor).toBe("#38bdf8");

    // Dispatch a theme color change
    store.dispatch(changeSettings({ field: "themeColor", value: "#ff0000" }));
    expect(store.getState().settings.themeColor).toBe("#ff0000");
  });
});
