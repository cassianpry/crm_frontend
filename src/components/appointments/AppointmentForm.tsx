import type { FormEvent } from "react";
import {
  Building2,
  User,
  Calendar,
  Clock,
  FileText,
  Loader2,
  Save,
  XCircle,
  ClipboardList,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { AppointmentStatus } from "@/types/appointment";
import type { Company, Contact } from "@/types/company";

export type AppointmentFormTypeOption = "Reunião" | "Ligação" | "Visita" | "Apresentação";

export interface AppointmentFormState {
  title: string;
  companyId: string;
  contactId: string;
  date: string;
  time: string;
  type: AppointmentFormTypeOption;
  duration: string;
  notes: string;
  status: AppointmentStatus;
  notify: boolean;
}

export type AppointmentFormChangeHandler = <Key extends keyof AppointmentFormState>(
  key: Key,
  value: AppointmentFormState[Key],
) => void;

interface AppointmentFormProps {
  formState: AppointmentFormState;
  companies: Company[];
  availableContacts: Contact[];
  isCompanyLoading: boolean;
  isContactsLoading: boolean;
  isSubmitting: boolean;
  selectedCompanyId?: number;
  statusOptions: { value: AppointmentStatus; label: string }[];
  typeOptions: readonly AppointmentFormTypeOption[];
  onFieldChange: AppointmentFormChangeHandler;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const AppointmentForm = ({
  formState,
  companies,
  availableContacts,
  isCompanyLoading,
  isContactsLoading,
  isSubmitting,
  selectedCompanyId,
  statusOptions,
  typeOptions,
  onFieldChange,
  onSubmit,
  onCancel,
}: AppointmentFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formState.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            placeholder="Ex.: Reunião de alinhamento"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Empresa *</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select
              value={formState.companyId ?? ""}
              onValueChange={(value) => {
                onFieldChange("companyId", value);
                onFieldChange("contactId", "");
              }}
              required
            >
              <SelectTrigger className="w-full justify-between pl-10 hover:cursor-pointer hover:bg-yellow-400">
                <SelectValue
                  placeholder={
                    isCompanyLoading ? "Carregando empresas..." : "Selecione uma empresa"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem
                    key={company.id}
                    value={String(company.id)}
                    className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                  >
                    {company.nomeFantasia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contato</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select
              value={formState.contactId ?? ""}
              onValueChange={(value) => onFieldChange("contactId", value)}
              disabled={!selectedCompanyId || isContactsLoading}
            >
              <SelectTrigger className="w-full justify-between pl-10 hover:cursor-pointer hover:bg-yellow-400">
                <SelectValue
                  placeholder={
                    selectedCompanyId
                      ? availableContacts.length > 0
                        ? "Selecione um contato"
                        : "Nenhum contato encontrado"
                      : "Selecione uma empresa primeiro"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableContacts.map((contact) => (
                  <SelectItem
                    key={contact.id}
                    value={String(contact.id)}
                    className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                  >
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">
            <Calendar className="mr-1 inline h-4 w-4" />
            Data *
          </Label>
          <Input
            id="date"
            type="date"
            value={formState.date}
            onChange={(event) => onFieldChange("date", event.target.value)}
            required
            className="hover:cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">
            <Clock className="mr-1 inline h-4 w-4" />
            Horário *
          </Label>
          <Input
            id="time"
            type="time"
            value={formState.time}
            onChange={(event) => onFieldChange("time", event.target.value)}
            required
            className="hover:cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <div className="relative">
            <ClipboardList className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select
              value={formState.type}
              onValueChange={(value) => onFieldChange("type", value as AppointmentFormTypeOption)}
            >
              <SelectTrigger className="w-full justify-between pl-10 hover:cursor-pointer hover:bg-yellow-400">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <div className="relative">
            <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select
              value={formState.status}
              onValueChange={(value) => onFieldChange("status", value as AppointmentStatus)}
            >
              <SelectTrigger className="w-full justify-between pl-10 hover:cursor-pointer hover:bg-yellow-400">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duração (minutos)</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            value={formState.duration}
            onChange={(event) => onFieldChange("duration", event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">
            <FileText className="mr-1 inline h-4 w-4" />
            Observações
          </Label>
          <Textarea
            id="notes"
            rows={4}
            value={formState.notes}
            onChange={(event) => onFieldChange("notes", event.target.value)}
            placeholder="Adicione detalhes importantes do compromisso"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <Checkbox
            id="notify"
            checked={formState.notify}
            onCheckedChange={(checked) => onFieldChange("notify", checked === true)}
          />
          <Label htmlFor="notify" className="cursor-pointer text-sm font-normal">
            Notificar o contato por e-mail
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="bg-red-500 text-white hover:bg-red-400 hover:cursor-pointer"
          onClick={onCancel}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-yellow-500 text-black hover:bg-yellow-400 hover:cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Salvar Agendamento
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
