import { useMediaQuery } from "usehooks-ts";

export function usePreferredColorScheme() {
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  if (isDark) return "dark";
  else return "light";
}
