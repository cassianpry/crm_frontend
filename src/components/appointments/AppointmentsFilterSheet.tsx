import { Calendar, Building2, Funnel } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppointmentStatus } from "@/types/appointment";
import type { Company } from "@/types/company";

export interface AppointmentFiltersState {
  status: AppointmentStatus | "ALL";
  startDate?: string;
  endDate?: string;
  companyId?: string;
}

interface AppointmentsFilterSheetProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  filters: AppointmentFiltersState;
  onFiltersChange: (filters: AppointmentFiltersState) => void;
  onApply: () => void;
  statusOptions: { value: AppointmentStatus; label: string }[];
  companies: Company[];
}

const AppointmentsFilterSheet = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onApply,
  statusOptions,
  companies,
}: AppointmentsFilterSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full space-y-6 sm:max-w-lg [&>button:first-of-type]:hover:cursor-pointer [&>button:first-of-type]:hover:bg-yellow-400 [&>button:first-of-type]:rounded-full [&>button:first-of-type]:p-1">
        <SheetHeader>
          <SheetTitle>Filtros avançados</SheetTitle>
          <SheetDescription>
            Combine filtros para refinar os agendamentos listados.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4">
          <div className="space-y-2">
            <Label className="hover:cursor-pointer hover:bg-yellow-400">
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  status: value as AppointmentFiltersState["status"],
                })
              }
            >
              <SelectTrigger className="hover:cursor-pointer hover:bg-yellow-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:cursor-pointer hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                  value="ALL"
                >
                  Todos os status
                </SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem
                    className="hover:cursor-pointer hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="inline-flex items-center gap-2 hover:cursor-pointer hover:bg-yellow-400"
              >
                <Calendar className="h-4 w-4" /> Início
              </Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate ?? ""}
                className="hover:cursor-pointer hover:bg-yellow-400"
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    startDate: event.target.value || undefined,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="inline-flex items-center gap-2 hover:cursor-pointer hover:bg-yellow-400"
              >
                <Calendar className="h-4 w-4" /> Fim
              </Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate ?? ""}
                className="hover:cursor-pointer hover:bg-yellow-400"
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    endDate: event.target.value || undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="company"
              className="inline-flex items-center gap-2 hover:cursor-pointer hover:bg-yellow-400"
            >
              <Building2 className="h-4 w-4" /> Empresa
            </Label>
            <Select
              value={filters.companyId ?? undefined}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  companyId: value,
                })
              }
            >
              <SelectTrigger className="hover:cursor-pointer hover:bg-yellow-400">
                <SelectValue placeholder="Todas as empresas" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem
                    className="hover:cursor-pointer hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                    key={company.id}
                    value={String(company.id)}
                  >
                    {company.nomeFantasia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="px-4 pb-4">
          <div className="flex w-full justify-end">
            <Button
              type="button"
              onClick={onApply}
              className="hover:cursor-pointer text-black bg-yellow-500 hover:bg-yellow-400"
            >
              <Funnel className="w-4 h-4" />
              Aplicar filtros
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AppointmentsFilterSheet;
