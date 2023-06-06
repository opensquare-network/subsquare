import isNil from "lodash.isnil";
import { usePreferredColorScheme } from "next-common/utils/hooks/usePreferredColorScheme";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  const preferred = usePreferredColorScheme();

  useEffect(() => {
    if (!isNil(defaultThemeMode)) {
      return;
    }
    setThemeMode(preferred);
  }, [preferred]);

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
  const theme = useThemeSetting();
  const variables = Object.keys(theme)
    .map((k) => `--${k}: ${theme[k]}`)
    .join(";");

  return (
    <ThemeProvider theme={theme}>
      <GlobalThemeVariables variables={variables} />
      {children}
    </ThemeProvider>
  );
}

export function useThemeMode() {
  const { themeMode } = useContext(ThemeModeContext);
  return themeMode || "light";
}

export function useThemeSetting() {
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
