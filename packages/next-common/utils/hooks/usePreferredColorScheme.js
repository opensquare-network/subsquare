import { useMediaQuery } from "usehooks-ts";

export function usePreferredColorScheme() {
  const isLight = useMediaQuery("(prefers-color-scheme: light)");
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  if (isDark) return "dark";
  else if (isLight) return "light";
  else return "no-preference";
}
