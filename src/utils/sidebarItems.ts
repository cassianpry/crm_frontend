import { Building2, CalendarDays, Contact, SplinePointer } from "lucide-react";

export type SidebarNavigationItem = {
  title: string;
  url: string;
  icon: typeof Building2;
};

export const sidebarNavigationItems: SidebarNavigationItem[] = [
  {
    title: "Clientes",
    url: "/clientes",
    icon: Building2,
  },
  {
    title: "Contatos",
    url: "/contatos",
    icon: Contact,
  },
  {
    title: "Agendamento",
    url: "/agendamentos",
    icon: CalendarDays,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: SplinePointer,
  },
];
