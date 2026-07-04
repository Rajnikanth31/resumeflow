import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider, useTheme } from "../ThemeProvider";
import { ThemeToggle } from "../ThemeToggle";
import { AppShell } from "../AppShell";

// Mock next/navigation hooks
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

// Mock window.matchMedia for JSDOM environment
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("ThemeProvider & useTheme", () => {
  it("renders children successfully", () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    );
    expect(getByText("Test Child")).toBeInTheDocument();
  });

  it("throws error when useTheme is called outside ThemeProvider", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    const BuggyComponent = () => {
      useTheme();
      return null;
    };
    
    expect(() => render(<BuggyComponent />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
    
    consoleSpy.mockRestore();
  });
});

describe("ThemeToggle", () => {
  it("mounts and renders the theme toggle button", () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(container.querySelector("button")).toBeInTheDocument();
    expect(container.querySelector("button")).toHaveClass("ml-2");
  });
});

describe("AppShell", () => {
  it("renders sidebar navigation links and collapsible triggers", () => {
    render(
      <ThemeProvider>
        <AppShell>
          <div>Main Content</div>
        </AppShell>
      </ThemeProvider>
    );
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Builder")).toBeInTheDocument();
    expect(screen.getByText("Parser")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });
});
