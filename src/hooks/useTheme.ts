import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window === "undefined") return "system";
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    return savedTheme || "system";
  });

  // Apply theme to document and handle system preference
  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      root.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    // Listen for system theme changes if theme is 'system'
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
      // Legacy browsers
      else {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  return { theme, setTheme };
}
