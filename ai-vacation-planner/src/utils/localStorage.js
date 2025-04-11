export const getLocalStorageItem = (key) => {
  if (typeof window === "undefined") return null; // handles SSR
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return null;
  }
};

export const setLocalStorageItem = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const removeLocalStorageItem = (key) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};
