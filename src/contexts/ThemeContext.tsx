import type { ReactNode } from "react";
import { useTheme } from "@/hooks/use-theme";
import { ThemeContext } from "./theme-context";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeState = useTheme();

  return (
    <ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>
  );
}

export { ThemeContext } from "./theme-context";
