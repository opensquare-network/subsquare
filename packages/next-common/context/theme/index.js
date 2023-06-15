import { chainThemeColors } from "next-common/utils/consts/chainThemeColors";
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
import { useChainSettings } from "../chain";

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
  const isDark = useIsDark();
  const theme = useThemeSetting();
  const variables = Object.keys(theme)
    .map((k) => `--${k}: ${theme[k]}`)
    .join(";");

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalThemeVariables variables={variables} />
      {children}
    </ThemeProvider>
  );
}

export function useIsDark() {
  const themeSetting = useThemeSetting();
  return themeSetting.isDark;
}

export function useThemeMode() {
  const { themeMode } = useContext(ThemeModeContext);
  return themeMode || "system";
}

export function useThemeSetting() {
  const chainSettings = useChainSettings();
  const themeMode = useThemeMode();
  const preferredColorScheme = usePreferredColorScheme();
  const mode = themeMode === "system" ? preferredColorScheme : themeMode;
  const chainThemeColor = chainThemeColors[chainSettings.value];

  const mergedLight = { ...light, ...chainThemeColor.light };
  const mergedDark = { ...dark, ...chainThemeColor.dark };

  return mode === "dark" ? mergedDark : mergedLight;
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
