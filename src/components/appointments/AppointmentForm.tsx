import { useEffect, useMemo, useState, type FormEvent } from "react";
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
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [showContactSuggestions, setShowContactSuggestions] = useState(false);

  const resolvedCompanyId = useMemo(() => {
    if (selectedCompanyId) {
      return selectedCompanyId;
    }

    if (formState.companyId) {
      const parsed = Number.parseInt(formState.companyId, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
  }, [formState.companyId, selectedCompanyId]);

  useEffect(() => {
    if (!resolvedCompanyId) {
      setCompanySearchTerm("");
      return;
    }

    const matchedCompany = companies.find((company) => company.id === resolvedCompanyId);
    if (matchedCompany) {
      setCompanySearchTerm(matchedCompany.nomeFantasia);
    }
  }, [companies, resolvedCompanyId]);

  useEffect(() => {
    if (!formState.contactId) {
      setContactSearchTerm("");
      return;
    }

    const matchedContact = availableContacts.find(
      (contact) => String(contact.id) === formState.contactId,
    );
    if (matchedContact) {
      setContactSearchTerm(matchedContact.name);
    }
  }, [availableContacts, formState.contactId]);

  useEffect(() => {
    if (!resolvedCompanyId) {
      setContactSearchTerm("");
    }
  }, [resolvedCompanyId]);

  const filteredCompanies = useMemo(() => {
    const normalizedTerm = companySearchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return companies.slice(0, 8);
    }

    return companies
      .filter((company) => company.nomeFantasia.toLowerCase().includes(normalizedTerm))
      .slice(0, 8);
  }, [companySearchTerm, companies]);

  const filteredContacts = useMemo(() => {
    const normalizedTerm = contactSearchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return availableContacts.slice(0, 8);
    }

    return availableContacts
      .filter((contact) => contact.name.toLowerCase().includes(normalizedTerm))
      .slice(0, 8);
  }, [availableContacts, contactSearchTerm]);

  const handleCompanySelection = (company: Company | null) => {
    if (!company) {
      setCompanySearchTerm("");
      onFieldChange("companyId", "");
      onFieldChange("contactId", "");
      setContactSearchTerm("");
      setShowCompanySuggestions(false);
      return;
    }

    setCompanySearchTerm(company.nomeFantasia);
    onFieldChange("companyId", String(company.id));
    onFieldChange("contactId", "");
    setContactSearchTerm("");
    setShowCompanySuggestions(false);
  };

  const handleCompanyInputChange = (value: string) => {
    setCompanySearchTerm(value);
    setShowCompanySuggestions(true);

    const normalizedValue = value.trim().toLowerCase();
    if (!normalizedValue) {
      handleCompanySelection(null);
      return;
    }

    const matchedCompany = companies.find(
      (company) => company.nomeFantasia.toLowerCase() === normalizedValue,
    );
    if (matchedCompany) {
      handleCompanySelection(matchedCompany);
    } else {
      onFieldChange("companyId", "");
      onFieldChange("contactId", "");
    }
  };

  const handleCompanyInputBlur = () => {
    window.setTimeout(() => setShowCompanySuggestions(false), 150);
  };

  const handleContactSelection = (contact: Contact | null) => {
    if (!contact) {
      setContactSearchTerm("");
      onFieldChange("contactId", "");
      setShowContactSuggestions(false);
      return;
    }

    setContactSearchTerm(contact.name);
    onFieldChange("contactId", String(contact.id));
    setShowContactSuggestions(false);
  };

  const handleContactInputChange = (value: string) => {
    setContactSearchTerm(value);
    setShowContactSuggestions(true);

    const normalizedValue = value.trim().toLowerCase();
    if (!normalizedValue) {
      handleContactSelection(null);
      return;
    }

    const matchedContact = availableContacts.find(
      (contact) => contact.name.toLowerCase() === normalizedValue,
    );
    if (matchedContact) {
      handleContactSelection(matchedContact);
    } else {
      onFieldChange("contactId", "");
    }
  };

  const handleContactInputBlur = () => {
    window.setTimeout(() => setShowContactSuggestions(false), 150);
  };

  const hasSelectedCompany = Boolean(resolvedCompanyId);

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
          <Label htmlFor="appointment-company">Empresa *</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="appointment-company"
              value={companySearchTerm}
              placeholder={
                isCompanyLoading ? "Carregando empresas..." : "Digite para buscar ou selecionar"
              }
              onChange={(event) => handleCompanyInputChange(event.target.value)}
              onFocus={() => !isCompanyLoading && setShowCompanySuggestions(true)}
              onBlur={handleCompanyInputBlur}
              disabled={isCompanyLoading}
              autoComplete="off"
              required
              className="pl-10"
            />
            {showCompanySuggestions && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <ul className="max-h-56 overflow-auto py-1 text-sm">
                  {isCompanyLoading ? (
                    <li className="px-3 py-2 text-muted-foreground">Carregando...</li>
                  ) : filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <li key={company.id} className="px-1">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-yellow-100!"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleCompanySelection(company);
                          }}
                        >
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{company.nomeFantasia}</span>
                        </button>
                      </li>
                    ))
                  ) : companySearchTerm.trim().length > 0 ? (
                    <li className="px-3 py-2 text-muted-foreground">Nenhuma empresa encontrada</li>
                  ) : (
                    <li className="px-3 py-2 text-muted-foreground">Digite para buscar empresas</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment-contact">Contato</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="appointment-contact"
              value={contactSearchTerm}
              placeholder={
                !hasSelectedCompany
                  ? "Selecione uma empresa primeiro"
                  : isContactsLoading
                  ? "Carregando contatos..."
                  : availableContacts.length === 0
                  ? "Nenhum contato cadastrado"
                  : "Digite para buscar ou selecionar"
              }
              onChange={(event) => handleContactInputChange(event.target.value)}
              onFocus={() =>
                !isContactsLoading && hasSelectedCompany && setShowContactSuggestions(true)
              }
              onBlur={handleContactInputBlur}
              disabled={!hasSelectedCompany || isContactsLoading}
              autoComplete="off"
              className="pl-10"
            />
            {showContactSuggestions && hasSelectedCompany && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <ul className="max-h-56 overflow-auto py-1 text-sm">
                  {isContactsLoading ? (
                    <li className="px-3 py-2 text-muted-foreground">Carregando...</li>
                  ) : filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <li key={contact.id} className="px-1">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-yellow-100!"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleContactSelection(contact);
                          }}
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{contact.name}</span>
                        </button>
                      </li>
                    ))
                  ) : contactSearchTerm.trim().length > 0 ? (
                    <li className="px-3 py-2 text-muted-foreground">Nenhum contato encontrado</li>
                  ) : (
                    <li className="px-3 py-2 text-muted-foreground">Digite para buscar contatos</li>
                  )}
                </ul>
              </div>
            )}
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
