import React, { createContext, useCallback, useContext, useState } from "react";
import dark from "../../components/styled/theme/dark";
import light from "../../components/styled/theme/light";
import { CACHE_KEY } from "../../utils/constants";
import { getCookie, setCookie } from "../../utils/viewfuncs/cookies";

const ThemeModeContext = createContext(null);

export default function ThemeModeProvider({ children, defaultThemeMode }) {
  const [themeMode, setThemeMode] = useState(defaultThemeMode);

  return (
    <ThemeModeContext.Provider value={{ themeMode, setThemeMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const { themeMode } = useContext(ThemeModeContext);
  return themeMode;
}

export function useTheme() {
  const themeMode = useThemeMode();
  return themeMode === "dark" ? dark : light;
}

export function useSetThemeMode() {
  const { setThemeMode } = useContext(ThemeModeContext);

  const themeModeSetter = useCallback((mode) => {
    setThemeMode(mode);
    if (getCookie(CACHE_KEY.themeMode) !== mode) {
      setCookie(CACHE_KEY.themeMode, mode);
    }
  }, []);

  return themeModeSetter;
}

export function useToggleThemeMode() {
  const { themeMode, setThemeMode } = useContext(ThemeModeContext);

  const themeModeSetter = useCallback(() => {
    const target = themeMode !== "dark" ? "dark" : "light";
    setThemeMode(target);
    setCookie(CACHE_KEY.themeMode, target);
  }, [themeMode]);

  return themeModeSetter;
}
