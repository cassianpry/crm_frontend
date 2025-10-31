import { useMemo } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import PaginationFooter from "@/components/Layout/PaginationFooter";
import type { Lead, LeadFilters, LeadOrigin, LeadStage } from "@/types/lead";
import {
  LEAD_ORIGIN_LABELS,
  LEAD_STAGE_LABELS,
  LEAD_STAGES,
} from "@/types/lead";
import { formatPhone } from "@/lib/formatters";

const STAGE_BADGE_STYLES: Record<LeadStage, string> = {
  NEW: "bg-emerald-100 text-emerald-900",
  QUALIFICATION: "bg-blue-100 text-blue-800",
  PROPOSAL: "bg-purple-100 text-purple-800",
  FOLLOW_UP: "bg-amber-100 text-amber-800",
  WON: "bg-emerald-100 text-emerald-900",
  LOST: "bg-rose-100 text-rose-900",
};

const ORIGIN_BADGE_STYLES: Record<LeadOrigin | "UNSPECIFIED", string> = {
  UNSPECIFIED: "bg-slate-200 text-slate-900",
  WEBSITE: "bg-sky-100 text-sky-800",
  CAMPAIGN: "bg-indigo-100 text-indigo-800",
  REFERRAL: "bg-teal-100 text-teal-800",
  OUTBOUND: "bg-orange-100 text-orange-800",
  OTHER: "bg-slate-100 text-slate-800",
};

const STAGE_WEIGHTS = LEAD_STAGES.reduce<Record<LeadStage, number>>(
  (accumulator, stage, index) => ({
    ...accumulator,
    [stage]: index,
  }),
  {} as Record<LeadStage, number>,
);

interface LeadsTableProps {
  leads: Lead[];
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  pagination: { page: number; totalPages: number; total: number; pageSize: number };
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onEditLead?: (leadId: number) => void;
  onDeleteLead?: (lead: Lead) => void;
  onSelectLead?: (lead: Lead) => void;
}

const LeadsTable = ({
  leads,
  filters,
  onFiltersChange,
  pagination,
  isLoading = false,
  isFetching = false,
  isError = false,
  onRetry,
  onEditLead,
  onDeleteLead,
  onSelectLead,
}: LeadsTableProps) => {
  const sortedLeads = useMemo(() => {
    if (!filters.sortBy) return leads;

    const orderMultiplier = filters.sortOrder === "asc" ? 1 : -1;

    return [...leads].sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name) * orderMultiplier;
        case "stage":
          return (
            (STAGE_WEIGHTS[a.stage] ?? 0) - (STAGE_WEIGHTS[b.stage] ?? 0)
          ) * orderMultiplier;
        case "createdAt":
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * orderMultiplier;
        case "updatedAt":
        default:
          return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * orderMultiplier;
      }
    });
  }, [leads, filters.sortBy, filters.sortOrder]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Leads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Não foi possível carregar os leads</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm">
            Ocorreu um erro ao buscar a lista de leads. Verifique sua conexão e tente novamente.
          </p>
          {onRetry && (
            <Button
              variant="outline"
              className="self-start gap-2 border-red-300 text-red-800 hover:bg-red-100"
              onClick={onRetry}
            >
              Tentar novamente
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Leads</CardTitle>
          <p className="text-sm text-muted-foreground">Lista paginada com filtros por estágio, origem e empresa.</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Estágio</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead className="sticky right-0 z-20 bg-background text-right shadow-[0_0_0_1px_var(--border)]">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    {filters.search || filters.stage || filters.origin
                      ? "Nenhum lead encontrado com os filtros atuais."
                      : "Nenhum lead cadastrado."}
                  </TableCell>
                </TableRow>
              ) : (
                sortedLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className={"cursor-pointer hover:bg-yellow-50"}
                    onClick={() => onSelectLead?.(lead)}
                  >
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">{lead.name}</span>
                        {lead.email && (
                          <span className="text-sm text-muted-foreground">{lead.email}</span>
                        )}
                        {lead.phone && (
                          <span className="text-xs text-muted-foreground">
                            {formatPhone(lead.phone)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.contact ? (
                        <div className="flex flex-col gap-1 text-sm">
                          <span>{lead.contact.name}</span>
                          {lead.contact.email && (
                            <span className="text-xs text-muted-foreground">{lead.contact.email}</span>
                          )}
                          {lead.contact.phone && (
                            <span className="text-xs text-muted-foreground">
                              {formatPhone(lead.contact.phone)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={ORIGIN_BADGE_STYLES[lead.origin ?? "UNSPECIFIED"]}>
                        {lead.origin ? LEAD_ORIGIN_LABELS[lead.origin] : "Não informada"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={STAGE_BADGE_STYLES[lead.stage]}>
                        {LEAD_STAGE_LABELS[lead.stage]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.company ? (
                        <div className="flex flex-col text-sm">
                          <span>{lead.company.nomeFantasia}</span>
                          <span className="text-xs text-muted-foreground">
                            {lead.company.razaoSocial}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sem empresa</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(lead.updatedAt).toLocaleDateString("pt-BR")}
                      </span>
                    </TableCell>
                    <TableCell className="sticky right-0 z-10 bg-background text-right shadow-[0_0_0_1px_var(--border)]">
                      <div className="flex items-center justify-end gap-2">
                        {onEditLead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:cursor-pointer hover:bg-yellow-400"
                            onClick={(event) => {
                              event.stopPropagation();
                              onEditLead(lead.id);
                            }}
                            title="Editar lead"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteLead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:cursor-pointer hover:bg-red-300"
                            onClick={(event) => {
                              event.stopPropagation();
                              onDeleteLead(lead);
                            }}
                            title="Excluir lead"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {isFetching && (
            <div className="flex items-center justify-center border-t py-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <PaginationFooter
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={pagination.pageSize}
          onPageChange={(page) => onFiltersChange({ ...filters, page })}
          onPageSizeChange={(pageSize) => onFiltersChange({ ...filters, pageSize, page: 1 })}
          isLoading={isFetching}
        />
      </CardContent>
    </Card>
  );
};

export default LeadsTable;
