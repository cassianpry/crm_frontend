import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCNPJ } from "@/lib/formatters";
import type { Company } from "@/types/company";

interface ClientsTableRowProps {
  company: Company;
  onDeleteClick: (id: number, nomeFantasia: string) => void;
  isDeleting: boolean;
}

export function ClientsTableRow({ company, onDeleteClick, isDeleting }: ClientsTableRowProps) {
  const navigate = useNavigate();

  return (
    <TableRow key={company.id} className="group hover:bg-yellow-100">
      <TableCell className="transition-colors group-hover:text-black dark:group-hover:text-black">
        {company.nomeFantasia}
      </TableCell>
      <TableCell className="hidden sm:table-cell transition-colors group-hover:text-black dark:group-hover:text-black">
        {company.razaoSocial}
      </TableCell>
      <TableCell className="hidden md:table-cell font-medium transition-colors group-hover:text-black dark:group-hover:text-black">
        {formatCNPJ(company.cnpj)}
      </TableCell>
      <TableCell className="hidden lg:table-cell transition-colors group-hover:text-black dark:group-hover:text-black">
        {company.industria}
      </TableCell>
      <TableCell className="hidden lg:table-cell transition-colors group-hover:text-black dark:group-hover:text-black">
        {company.cidade}/{company.estado}
      </TableCell>
      <TableCell className="hidden xl:table-cell transition-colors">
        <div className="text-sm transition-colors group-hover:text-black dark:group-hover:text-black">
          <div className="font-medium transition-colors group-hover:text-black dark:group-hover:text-black">
            {company.contacts[0]?.name || "-"}
          </div>
          {company.contacts[0]?.phone && (
            <div className="text-muted-foreground transition-colors group-hover:text-black dark:group-hover:text-black">
              {company.contacts[0].phone}
            </div>
          )}
          <div className="text-muted-foreground text-xs transition-colors group-hover:text-black dark:group-hover:text-black">
            {company.contacts[0]?.email || "-"}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right sticky right-0 bg-background dark:bg-neutral-900! z-10 shadow-[0_0_0_1px_var(--border)] transition-colors">
        <div className="flex justify-end gap-2">
          <Button
            className="hover:cursor-pointer hover:bg-yellow-400!"
            variant="ghost"
            size="icon"
            title="Editar"
            onClick={() => navigate(`/clientes/${company.id}/editar`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            className="hover:cursor-pointer hover:bg-red-300!"
            variant="ghost"
            size="icon"
            title="Excluir"
            onClick={() => onDeleteClick(company.id, company.nomeFantasia)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
