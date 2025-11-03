import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { AuthContext, type AuthenticatedUser } from "./auth-context";

interface AuthResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) satisfies AuthenticatedUser;
        setAccessToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message =
        typeof errorBody.message === "string"
          ? errorBody.message
          : "Credenciais inválidas";
      toast.error("Erro no login", {
        description: message,
      });
      throw new Error(message);
    }

    const data = (await response.json()) as AuthResponse;

    setAccessToken(data.accessToken);
    setUser(data.user);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.success("Login realizado", {
      description: "Bem-vindo de volta!",
    });
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(accessToken),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
