import { usePreferredColorScheme } from "next-common/utils/hooks/usePreferredColorScheme";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";
import light from "../../styles/light";
import dark from "../../styles/dark";
import { CACHE_KEY } from "../../utils/constants";
import { setCookie } from "../../utils/viewfuncs/cookies";
import { useChainSettings } from "../chain";

const ThemeModeContext = createContext({});

export default function ThemeModeProvider({ children, defaultThemeMode }) {
  const [themeMode, setThemeMode] = useState(defaultThemeMode || "light");

  const preferredColorScheme = usePreferredColorScheme();
  const mode = themeMode === "system" ? preferredColorScheme : themeMode;

  return (
    <ThemeModeContext.Provider value={{ themeMode, setThemeMode, mode }}>
      <ThemeValueProvider>{children}</ThemeValueProvider>
    </ThemeModeContext.Provider>
  );
}

/**
 * @typedef {'light' | 'dark'} Mode
 * @typedef {Mode | 'system'} ThemeMode
 * @typedef {(value: ThemeMode) => void} SetThemeMode
 *
 * @returns {[Mode, SetThemeMode, ThemeMode]} mode is only `light` or `dark`, themeMode can be `light`, `dark` or `system`
 */
export function useThemeMode() {
  const { themeMode, setThemeMode, mode } = useContext(ThemeModeContext);

  /**
   * @type {SetThemeMode}
   */
  function set(value) {
    setThemeMode(value);
    setCookie(CACHE_KEY.themeMode, value);
  }

  return [mode, set, themeMode];
}

function ThemeValueProvider({ children }) {
  const isDark = useIsDark();
  const theme = useThemeSetting();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export function useIsDark() {
  const [mode] = useThemeMode();
  return mode === "dark";
}

export function useThemeSetting() {
  const chainSettings = useChainSettings();
  const [mode] = useThemeMode();

  /**
   * @type {typeof light & typeof chainSettings.cssVarsLight}
   */
  const mergedLight = { ...light, ...chainSettings.cssVarsLight };
  /**
   * @type {typeof dark & typeof chainSettings.cssVarsDark}
   */
  const mergedDark = { ...dark, ...chainSettings.cssVarsDark };

  return mode === "dark" ? mergedDark : mergedLight;
}

export function useToggleThemeMode() {
  const { themeMode, setThemeMode } = useContext(ThemeModeContext);

  const themeModeSetter = useCallback(() => {
    const target = themeMode !== "dark" ? "dark" : "light";
    setThemeMode(target);
    setCookie(CACHE_KEY.themeMode, target);
  }, [themeMode, setThemeMode]);

  return themeModeSetter;
}
