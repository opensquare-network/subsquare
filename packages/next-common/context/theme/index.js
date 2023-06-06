import { usePreferredColorScheme } from "next-common/utils/hooks/usePreferredColorScheme";
import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import dark from "../../components/styled/theme/dark";
import light from "../../components/styled/theme/light";
import { CACHE_KEY } from "../../utils/constants";
import { getCookie, setCookie } from "../../utils/viewfuncs/cookies";

const ThemeModeContext = createContext(null);

export default function ThemeModeProvider({ children, defaultThemeMode }) {
  const [themeMode, setThemeMode] = useState(defaultThemeMode);

  return (
    <ThemeModeContext.Provider value={{ themeMode, setThemeMode }}>
      <ThemeValueProvider>{children}</ThemeValueProvider>
    </ThemeModeContext.Provider>
  );
}

const GlobalThemeVariables = createGlobalStyle`
  :root {${(p) => p.variables}}
`;
function ThemeValueProvider({ children }) {
  const themeMode = useThemeMode();
  const theme = useThemeSetting();
  const variables = Object.keys(theme)
    .map((k) => `--${k}: ${theme[k]}`)
    .join(";");

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalThemeVariables variables={variables} />
      {children}
    </ThemeProvider>
  );
}

export function useThemeMode() {
  const { themeMode } = useContext(ThemeModeContext);
  return themeMode || "system";
}

export function useThemeSetting() {
  const themeMode = useThemeMode();
  const preferredColorScheme = usePreferredColorScheme();
  const mode = themeMode === "system" ? preferredColorScheme : themeMode;

  return mode === "dark" ? dark : light;
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
