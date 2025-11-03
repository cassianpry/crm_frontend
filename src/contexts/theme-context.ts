import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Theme } from "@/hooks/use-theme";

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);
