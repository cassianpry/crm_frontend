import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem("crm:theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return null;
}

function getPreferredTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) return stored;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("crm:theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme, setTheme };
}
