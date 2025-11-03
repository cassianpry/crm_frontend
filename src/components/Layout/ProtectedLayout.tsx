import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import AppMobileSidebar from "./AppMobileSidebar";
import Header from "./Header";
import { cn } from "@/lib/utils";

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarStyle = useMemo(
    () =>
      ({
        "--sidebar-width": "calc(var(--spacing) * 52)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as CSSProperties),
    []
  );

  useEffect(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(true);
    } else {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  const handleToggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((previous) => !previous);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-neutral-900">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando sessão...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 transition-all duration-500">
      <div className="flex h-screen overflow-hidden">
        <SidebarProvider
          className="transition duration-300 ease-in-out bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50"
          style={sidebarStyle}
        >
          {isMobile ? (
            <AppMobileSidebar
              isOpen={isMobileSidebarOpen}
              onNavigate={handleCloseMobileSidebar}
            />
          ) : (
            <AppSidebar />
          )}

          <div
            className={cn(
              "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
              isMobile && isMobileSidebarOpen ? "pl-16" : "pl-0"
            )}
          >
            <Header onToggleMobileSidebar={handleToggleMobileSidebar} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
