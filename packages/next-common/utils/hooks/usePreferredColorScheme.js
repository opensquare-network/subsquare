import { useMedia } from "react-use";

export function usePreferredColorScheme() {
  const isDark = useMedia("(prefers-color-scheme: dark)");

  if (isDark) return "dark";
  else return "light";
}
