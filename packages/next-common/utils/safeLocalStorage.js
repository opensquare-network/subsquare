import { isNil } from "lodash-es";

function isLocalStorageSupported() {
  if (isNil(localStorage)) {
    return false;
  }

  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const safeLocalStorage = {
  getItem(key) {
    if (!isLocalStorageSupported() || typeof key !== "string") {
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error(`localStorage.getItem failed for key "${key}":`, e);
      return null;
    }
  },

  setItem(key, value) {
    if (!isLocalStorageSupported() || typeof key !== "string") {
      return false;
    }

    try {
      const stringValue = typeof value === "string" ? value : String(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (e) {
      console.error(`localStorage.setItem failed for key "${key}":`, e);
      return false;
    }
  },

  removeItem(key) {
    if (!isLocalStorageSupported() || typeof key !== "string") {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`localStorage.removeItem failed for key "${key}":`, e);
      return false;
    }
  },

  clear() {
    if (!isLocalStorageSupported()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error("localStorage.clear failed:", e);
      return false;
    }
  },
};

export default safeLocalStorage;
