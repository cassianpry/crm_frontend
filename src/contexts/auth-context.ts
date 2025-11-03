import { createContext } from "react";

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextValue {
  user: AuthenticatedUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
