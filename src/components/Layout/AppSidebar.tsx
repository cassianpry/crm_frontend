import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarNavigationItems } from "../../utils/sidebarItems";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation();
  const { state } = useSidebar();

  const activeItem = useMemo(() => {
    const matchedItem = sidebarNavigationItems.find(
      (item) => item.url !== "#" && location.pathname.startsWith(item.url)
    );
    return matchedItem?.url ?? location.pathname;
  }, [location.pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <div className="flex items-center justify-center h-20">
                <a href="#" className="flex items-center justify-center">
                  <img
                    src={
                      state === "collapsed" ? "/favicon.png" : "/logo-img.png"
                    }
                    alt="logo"
                    className={
                      state === "collapsed" ? "w-5 h-5" : "w-44 h-auto"
                    }
                  />
                </a>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`hover:bg-yellow-100 ${
                      activeItem === item.url
                        ? "bg-yellow-500 hover:bg-yellow-500"
                        : ""
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
