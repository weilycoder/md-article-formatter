import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem("md-formatter-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("md-formatter-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return { theme, isDark, toggleTheme };
}
