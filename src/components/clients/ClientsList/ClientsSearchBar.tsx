import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ClientsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ClientsSearchBar({ searchTerm, onSearchChange }: ClientsSearchBarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
      <div className="relative w-full md:w-80 md:ml-auto">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Pesquisar por nome, CNPJ ou razão social..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9"
        />
      </div>
    </div>
  );
}
