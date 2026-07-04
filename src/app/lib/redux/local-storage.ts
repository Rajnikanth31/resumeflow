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

const debouncedSaveState = debounce((state: RootState) => {
  saveStateToLocalStorage(state);
}, 1000);

export const localStorageMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);
    const actionType = (action as any).type;
    if (
      actionType &&
      (actionType.startsWith("resume/") || actionType.startsWith("settings/"))
    ) {
      debouncedSaveState(storeApi.getState() as RootState);
    }
    return result;
  };
