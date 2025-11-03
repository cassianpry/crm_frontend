import { useContext } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext deve ser utilizado dentro de ThemeProvider");
  }

  return context;
}
