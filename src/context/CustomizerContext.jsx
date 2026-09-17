import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultSettings, STORAGE_KEY } from "./CustomizerDefaults";

const readSettings = () => {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error("Error reading customizer settings:", error);
  }
  // Check system preference for dark mode
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return { ...defaultSettings, mode: prefersDark ? "dark" : "light" };
};

const CustomizerContext = createContext({
  settings: defaultSettings,
  updateSetting: () => {},
  resetSettings: () => {},
});

export const CustomizerProvider = ({ children }) => {
  const [settings, setSettings] = useState(readSettings);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    // Update document direction
    document.documentElement.setAttribute("dir", settings.direction);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value = useMemo(
    () => ({
      settings,
      updateSetting,
      resetSettings,
    }),
    [settings]
  );

  return (
    <CustomizerContext.Provider value={value}>
      {children}
    </CustomizerContext.Provider>
  );
};

export const useCustomizer = () => useContext(CustomizerContext);

