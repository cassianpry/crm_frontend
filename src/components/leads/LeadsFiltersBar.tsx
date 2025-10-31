import { Funnel, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { LeadFilters } from "@/types/lead";
import {
  LEAD_ORIGINS,
  LEAD_ORIGIN_LABELS,
  LEAD_STAGES,
  LEAD_STAGE_LABELS,
} from "@/types/lead";
import { cn } from "@/lib/utils";

const ALL_STAGE_VALUE = "__ALL_STAGE__";
const ALL_ORIGIN_VALUE = "__ALL_ORIGIN__";
const SELECT_ITEM_CLASS =
  "hover:bg-yellow-100! data-[state=checked]:bg-yellow-400";
const SORT_LABELS: Record<NonNullable<LeadFilters["sortBy"]>, string> = {
  updatedAt: "Atualização",
  createdAt: "Criação",
  name: "Nome",
  stage: "Estágio",
};

export interface LeadsFiltersBarProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  onResetFilters: () => void;
}

const LeadsFiltersBar = ({
  filters,
  onFiltersChange,
  onResetFilters,
}: LeadsFiltersBarProps) => {
  const withResetPage = (updated: LeadFilters): LeadFilters => ({
    ...updated,
    page: 1,
  });

  const handleInputChange =
    <K extends keyof LeadFilters>(key: K) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFiltersChange(
        withResetPage({
          ...filters,
          [key]: event.target.value as LeadFilters[K],
        })
      );
    };

  const handleSelectChange =
    <K extends keyof LeadFilters>(key: K) =>
    (value: string) => {
      onFiltersChange(
        withResetPage({
          ...filters,
          [key]: value === "" ? undefined : (value as LeadFilters[K]),
        })
      );
    };

  const handleDateInputChange =
    (key: "startDate" | "endDate") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onFiltersChange(
        withResetPage({
          ...filters,
          [key]: value ? value : undefined,
        })
      );
    };

  const hasActiveFilters = Boolean(
    (filters.search && filters.search.trim().length > 0) ||
      filters.stage ||
      filters.origin ||
      filters.startDate ||
      filters.endDate ||
      filters.companyId ||
      (filters.sortBy && filters.sortBy !== "updatedAt") ||
      (filters.sortOrder && filters.sortOrder !== "desc") ||
      (filters.pageSize && filters.pageSize !== 20)
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-2 space-y-2">
          <Label
            htmlFor="lead-search"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Funnel className="h-4 w-4" />
            Buscar lead
          </Label>
          <Input
            id="lead-search"
            placeholder="Nome, email, empresa..."
            value={filters.search ?? ""}
            onChange={handleInputChange("search")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Estágio</Label>
          <Select
            value={filters.stage ?? ALL_STAGE_VALUE}
            onValueChange={(value) => {
              const nextStage =
                value === ALL_STAGE_VALUE
                  ? undefined
                  : (value as LeadFilters["stage"]);
              onFiltersChange(
                withResetPage({
                  ...filters,
                  stage: nextStage,
                })
              );
            }}
          >
            <SelectTrigger className="justify-between hover:cursor-pointer hover:bg-yellow-400">
              <SelectValue placeholder="Todos os estágios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STAGE_VALUE} className={SELECT_ITEM_CLASS}>
                Todos
              </SelectItem>
              {LEAD_STAGES.map((stage) => (
                <SelectItem
                  key={stage}
                  value={stage}
                  className={SELECT_ITEM_CLASS}
                >
                  {LEAD_STAGE_LABELS[stage]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Origem</Label>
          <Select
            value={filters.origin ?? ALL_ORIGIN_VALUE}
            onValueChange={(value) => {
              const nextOrigin =
                value === ALL_ORIGIN_VALUE
                  ? undefined
                  : (value as LeadFilters["origin"]);
              onFiltersChange(
                withResetPage({
                  ...filters,
                  origin: nextOrigin,
                })
              );
            }}
          >
            <SelectTrigger className="justify-between hover:cursor-pointer hover:bg-yellow-400">
              <SelectValue placeholder="Todas as origens" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value={ALL_ORIGIN_VALUE}
                className={SELECT_ITEM_CLASS}
              >
                Todas
              </SelectItem>
              {LEAD_ORIGINS.map((origin) => (
                <SelectItem
                  key={origin}
                  value={origin}
                  className={SELECT_ITEM_CLASS}
                >
                  {LEAD_ORIGIN_LABELS[origin]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Data inicial</Label>
          <Input
            type="date"
            value={filters.startDate ?? ""}
            onChange={handleDateInputChange("startDate")}
            className="text-sm hover:cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Data final</Label>
          <Input
            type="date"
            value={filters.endDate ?? ""}
            onChange={handleDateInputChange("endDate")}
            className="text-sm hover:cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-dashed border-slate-200 pt-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filters.pageSize ?? 20} por página</span>
          <span>•</span>
          <span>
            Ordenado por {SORT_LABELS[filters.sortBy ?? "updatedAt"]}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.sortBy ?? "updatedAt"}
            onValueChange={handleSelectChange("sortBy")}
          >
            <SelectTrigger className="w-[140px] justify-between hover:cursor-pointer hover:bg-yellow-400">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt" className={SELECT_ITEM_CLASS}>
                Atualização
              </SelectItem>
              <SelectItem value="createdAt" className={SELECT_ITEM_CLASS}>
                Criação
              </SelectItem>
              <SelectItem value="name" className={SELECT_ITEM_CLASS}>
                Nome
              </SelectItem>
              <SelectItem value="stage" className={SELECT_ITEM_CLASS}>
                Estágio
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.sortOrder ?? "desc"}
            onValueChange={handleSelectChange("sortOrder")}
          >
            <SelectTrigger className="w-[120px] justify-between hover:cursor-pointer hover:bg-yellow-400">
              <SelectValue placeholder="Ordem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc" className={SELECT_ITEM_CLASS}>
                Desc
              </SelectItem>
              <SelectItem value="asc" className={SELECT_ITEM_CLASS}>
                Asc
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            className={cn(
              "gap-2 text-sm text-muted-foreground",
              hasActiveFilters
                ? "hover:bg-yellow-100 hover:text-foreground hover:cursor-pointer"
                : "cursor-not-allowed opacity-60"
            )}
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
          >
            <RefreshCcw className="h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadsFiltersBar;
