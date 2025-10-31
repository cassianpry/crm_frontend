import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarNavigationItems } from "../../utils/sidebarItems";

type AppMobileSidebarProps = {
  isOpen?: boolean;
  onNavigate?: () => void;
};

const AppMobileSidebar = ({
  isOpen = true,
  onNavigate,
}: AppMobileSidebarProps) => {
  const location = useLocation();

  const activeUrl = useMemo(() => {
    const matchedItem = sidebarNavigationItems.find(
      (item) => item.url !== "#" && location.pathname.startsWith(item.url)
    );
    return matchedItem?.url ?? location.pathname;
  }, [location.pathname]);

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-16 justify-start",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!isOpen}
      >
        <nav
          className={cn(
            "flex h-full w-full flex-col items-center gap-6 border-r border-slate-200/50 bg-white/80 p-4 text-slate-600 backdrop-blur-xl transition-transform duration-300 ease-in-out will-change-transform dark:border-slate-700/50 dark:bg-slate-900/80 dark:text-slate-300",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-white shadow-sm transition-colors hover:bg-yellow-500 hover:text-white dark:bg-slate-800"
            aria-label="Ir para Home"
            onClick={onNavigate}
          >
            <img src="/favicon.png" alt="LightSun CRM" className="h-6 w-6" />
          </Link>
          <div className="flex flex-1 flex-col items-center gap-4">
            {sidebarNavigationItems.map((item) => {
              const isActive = activeUrl === item.url;
              return (
                <Tooltip key={item.title}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                        isActive
                          ? "bg-yellow-500 text-white shadow-lg"
                          : "bg-white hover:bg-yellow-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                      )}
                      aria-label={item.title}
                      onClick={onNavigate}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="px-2 py-1 text-xs">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
};

export default AppMobileSidebar;
