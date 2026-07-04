"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a structural placeholder on the server to prevent React hydration mismatch warnings
  if (!mounted) {
    return <div className="ml-2 h-9 w-9" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="ml-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        // Moon Icon
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        // Sun Icon
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )}
    </button>
  );
};
