import {
  Building2,
  Briefcase,
  FileText,
  Factory,
  MapPin,
  User,
  Settings,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SortField } from "./types";

interface ClientsTableHeaderProps {
  onSort: (field: SortField) => void;
  getSortState: (field: SortField) => "asc" | "desc" | "none";
}

export function ClientsTableHeader({
  onSort,
  getSortState,
}: ClientsTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    const state = getSortState(field);
    if (state === "asc") {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (state === "desc") {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <button
            onClick={() => onSort("nomeFantasia")}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Building2 className="h-4 w-4" />
            Nome Fantasia
            {getSortIcon("nomeFantasia")}
          </button>
        </TableHead>
        <TableHead className="hidden sm:table-cell">
          <button
            onClick={() => onSort("razaoSocial")}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            Razão Social
            {getSortIcon("razaoSocial")}
          </button>
        </TableHead>
        <TableHead className="hidden md:table-cell">
          <button
            onClick={() => onSort("cnpj")}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            CNPJ
            {getSortIcon("cnpj")}
          </button>
        </TableHead>
        <TableHead className="hidden lg:table-cell">
          <button
            onClick={() => onSort("industria")}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Factory className="h-4 w-4" />
            Indústria
            {getSortIcon("industria")}
          </button>
        </TableHead>
        <TableHead className="hidden lg:table-cell">
          <button
            onClick={() => onSort("cidade")}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <MapPin className="h-4 w-4" />
            Cidade/Estado
            {getSortIcon("cidade")}
          </button>
        </TableHead>
        <TableHead className="hidden xl:table-cell">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Contato
          </div>
        </TableHead>
        <TableHead className="text-right sticky right-0 bg-background dark:bg-neutral-900 z-20 shadow-[0_0_0_1px_var(--border)]">
          <div className="flex items-center justify-end gap-2">
            <Settings className="h-4 w-4" />
            Ações
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
