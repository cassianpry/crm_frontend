import {
  // Bell,
  // Settings,
  Menu,
  Sun,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
// import UserProfile from "./UserProfile";
// import { Building2 } from "lucide-react";

//Profile Items
// const items = [
//   {
//     title: "Menu 1",
//     url: "#",
//     icon: Building2,
//   },
//   {
//     title: "Menu 2",
//     url: "#",
//     icon: Building2,
//   },
//   {
//     title: "Menu 3",
//     url: "#",
//     icon: Building2,
//   },
//   {
//     title: "Menu 4",
//     url: "#",
//     icon: Building2,
//   },
// ];

type HeaderProps = {
  onToggleMobileSidebar?: () => void;
};

const Header = ({ onToggleMobileSidebar }: HeaderProps) => {
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
          >
            <Sun className="w-5 h-5" />
          </Button>
          {/* Notifications */}
          {/* <Button
            className="relative p-2.5 rounded-full bg-white text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            size="icon-lg"
          >
            <Bell className="w-1 h-1" />
            <span className="flex items-center justify-center absolute top-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full">
              9+
            </span>
          </Button> */}
          {/* Settings */}
          {/* <Button
            className="rounded-full bg-white text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            size="icon"
          >
            <Settings className="w-5 h-5" />
          </Button> */}
          {/* User Profile */}
          {/* <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          /> */}
          {/* <UserProfile items={items} /> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
