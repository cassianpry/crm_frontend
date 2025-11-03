import { Menu, Sun, Moon, User, LogOut } from "lucide-react";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

type HeaderProps = {
  onToggleMobileSidebar?: () => void;
};

const Header = ({ onToggleMobileSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-white/-80 dark:bg-slate-900/-80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
      <div className="flex w-full items-center gap-1">
        {/* Left Section */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={onToggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Alternar navegação</span>
        </Button>
        <SidebarTrigger className="hidden md:inline-flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:cursor-pointer transition-colors" />
        <Separator
          orientation="vertical"
          className="hidden md:block data-[orientation=vertical]:h-4"
        />
        <div className="hidden lg:block">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            Dashboard
          </h1>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center space-x-3">
          {/* Toggle */}
          <Button
            className="rounded-full bg-white text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            size="icon"
            onClick={toggleTheme}
            title={
              theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"
            }
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-6"
          />
          {user ? (
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-800/70 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
            </div>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            className="rounded-full hover:cursor-pointer bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
