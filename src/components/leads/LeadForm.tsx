import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  User,
  Mail,
  Phone,
  Coins,
  Flag,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateLeadDto, LeadOrigin, LeadStage } from "@/types/lead";
import {
  LEAD_ORIGINS,
  LEAD_ORIGIN_LABELS,
  LEAD_STAGES,
  LEAD_STAGE_LABELS,
} from "@/types/lead";

const toIsoStringOrNull = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

const NO_ORIGIN_VALUE = "__NO_ORIGIN__";

export interface LeadFormValues {
  name: string;
  email: string | null;
  phone: string | null;
  companyId: number | null;
  contactId: number | null;
  origin: LeadOrigin | null;
  stage: LeadStage;
  estimatedValue: number | null;
  lastInteractionAt: string | null;
  nextStep: string | null;
  nextStepAt: string | null;
  notes: string | null;
}

interface LeadFormProps {
  mode: "create" | "edit";
  initialValues: LeadFormValues;
  companies: Array<{ id: number; nomeFantasia: string }>;
  contacts: Array<{ id: number; name: string }>;
  isCompanyLoading?: boolean;
  isContactsLoading?: boolean;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateLeadDto) => void;
  onClose?: () => void;
  onSelectCompany?: (companyId: number | null) => void;
}

const LeadForm = ({
  mode,
  initialValues,
  companies,
  contacts,
  isCompanyLoading = false,
  isContactsLoading = false,
  isSubmitting = false,
  onSubmit,
  onClose,
  onSelectCompany,
}: LeadFormProps) => {
  const [formValues, setFormValues] = useState<LeadFormValues>(() => ({
    ...initialValues,
  }));
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [showContactSuggestions, setShowContactSuggestions] = useState(false);

  useEffect(() => {
    setFormValues({ ...initialValues });
  }, [initialValues]);

  useEffect(() => {
    if (initialValues.companyId) {
      const existingCompany = companies.find(
        (company) => company.id === initialValues.companyId
      );
      if (existingCompany) {
        setCompanySearchTerm(existingCompany.nomeFantasia);
      }
    } else {
      setCompanySearchTerm("");
    }
  }, [initialValues.companyId, companies]);

  useEffect(() => {
    if (formValues.companyId) {
      const selectedCompany = companies.find(
        (company) => company.id === formValues.companyId
      );
      if (
        selectedCompany &&
        selectedCompany.nomeFantasia !== companySearchTerm
      ) {
        setCompanySearchTerm(selectedCompany.nomeFantasia);
      }
    }
  }, [formValues.companyId, companies, companySearchTerm]);

  useEffect(() => {
    if (!formValues.companyId) {
      setContactSearchTerm("");
      handleFieldChange("contactId", null);
      return;
    }

    if (initialValues.contactId) {
      const existingContact = contacts.find(
        (contact) => contact.id === initialValues.contactId
      );
      if (existingContact) {
        setContactSearchTerm(existingContact.name);
      }
    } else {
      setContactSearchTerm("");
    }
  }, [initialValues.contactId, contacts, formValues.companyId]);

  useEffect(() => {
    if (!formValues.companyId) {
      return;
    }

    if (formValues.contactId) {
      const selectedContact = contacts.find(
        (contact) => contact.id === formValues.contactId
      );
      if (selectedContact && selectedContact.name !== contactSearchTerm) {
        setContactSearchTerm(selectedContact.name);
      }
    }
  }, [formValues.contactId, contacts, formValues.companyId, contactSearchTerm]);

  const handleFieldChange = <K extends keyof LeadFormValues>(
    key: K,
    value: LeadFormValues[K]
  ) => {
    setFormValues((previous: LeadFormValues) => ({
      ...previous,
      [key]: value,
    }));
  };

  const filteredCompanies = useMemo(() => {
    const normalizedTerm = companySearchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return companies.slice(0, 8);
    }

    return companies
      .filter((company) =>
        company.nomeFantasia.toLowerCase().includes(normalizedTerm)
      )
      .slice(0, 8);
  }, [companySearchTerm, companies]);

  const filteredContactsByTerm = useMemo(() => {
    const normalizedTerm = contactSearchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return contacts.slice(0, 8);
    }

    return contacts
      .filter((contact) => contact.name.toLowerCase().includes(normalizedTerm))
      .slice(0, 8);
  }, [contactSearchTerm, contacts]);

  const handleCompanySelection = (
    company: { id: number; nomeFantasia: string } | null
  ) => {
    if (!company) {
      setCompanySearchTerm("");
      handleFieldChange("companyId", null);
      handleFieldChange("contactId", null);
      onSelectCompany?.(null);
      setContactSearchTerm("");
      setShowCompanySuggestions(false);
      return;
    }

    setCompanySearchTerm(company.nomeFantasia);
    handleFieldChange("companyId", company.id);
    handleFieldChange("contactId", null);
    onSelectCompany?.(company.id);
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
      (company) => company.nomeFantasia.toLowerCase() === normalizedValue
    );
    if (matchedCompany) {
      handleCompanySelection(matchedCompany);
    } else {
      handleFieldChange("companyId", null);
      handleFieldChange("contactId", null);
      onSelectCompany?.(null);
      setContactSearchTerm("");
    }
  };

  const handleCompanyInputBlur = () => {
    window.setTimeout(() => setShowCompanySuggestions(false), 150);
  };

  const handleContactSelection = (
    contact: { id: number; name: string } | null
  ) => {
    if (!contact) {
      setContactSearchTerm("");
      handleFieldChange("contactId", null);
      setShowContactSuggestions(false);
      return;
    }

    setContactSearchTerm(contact.name);
    handleFieldChange("contactId", contact.id);
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

    const matchedContact = contacts.find(
      (contact) => contact.name.toLowerCase() === normalizedValue
    );
    if (matchedContact) {
      handleContactSelection(matchedContact);
    } else {
      handleFieldChange("contactId", null);
    }
  };

  const handleContactInputBlur = () => {
    window.setTimeout(() => setShowContactSuggestions(false), 150);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      name: formValues.name?.trim() ?? "",
      email: formValues.email?.trim() || null,
      phone: formValues.phone?.trim() || null,
      companyId: formValues.companyId ?? null,
      contactId: formValues.contactId ?? null,
      origin: formValues.origin ?? null,
      stage: formValues.stage,
      estimatedValue: formValues.estimatedValue ?? null,
      lastInteractionAt: toIsoStringOrNull(formValues.lastInteractionAt),
      nextStep: formValues.nextStep?.trim() || null,
      nextStepAt: toIsoStringOrNull(formValues.nextStepAt),
      notes: formValues.notes?.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="lead-name">Nome *</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="lead-name"
              value={formValues.name}
              onChange={(event) =>
                handleFieldChange("name", event.target.value)
              }
              placeholder="Nome do lead"
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-email">E-mail</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="lead-email"
              type="email"
              value={formValues.email ?? ""}
              onChange={(event) =>
                handleFieldChange("email", event.target.value)
              }
              placeholder="lead@empresa.com"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-phone">Telefone</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="lead-phone"
              value={formValues.phone ?? ""}
              onChange={(event) =>
                handleFieldChange("phone", event.target.value)
              }
              placeholder="5511999999999"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-stage">Estágio</Label>
          <div className="relative">
            <Flag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select
              value={formValues.stage}
              onValueChange={(value) =>
                handleFieldChange("stage", value as LeadStage)
              }
            >
              <SelectTrigger
                id="lead-stage"
                className="justify-between pl-10 hover:cursor-pointer hover:bg-yellow-400"
              >
                <SelectValue placeholder="Selecione o estágio" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STAGES.map((stage) => (
                  <SelectItem
                    key={stage}
                    value={stage}
                    className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                  >
                    {LEAD_STAGE_LABELS[stage]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-origin">Origem</Label>
          <div className="relative">
            <Compass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select
              value={formValues.origin ?? NO_ORIGIN_VALUE}
              onValueChange={(value) =>
                handleFieldChange(
                  "origin",
                  value === NO_ORIGIN_VALUE ? null : (value as LeadOrigin)
                )
              }
            >
              <SelectTrigger
                id="lead-origin"
                className="justify-between pl-10 hover:cursor-pointer hover:bg-yellow-400"
              >
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={NO_ORIGIN_VALUE}
                  className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                >
                  Indefinido
                </SelectItem>
                {LEAD_ORIGINS.map((origin) => (
                  <SelectItem
                    key={origin}
                    value={origin}
                    className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                  >
                    {LEAD_ORIGIN_LABELS[origin]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="lead-company">Empresa</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="lead-company"
              value={companySearchTerm}
              placeholder={
                isCompanyLoading
                  ? "Carregando empresas..."
                  : "Digite para buscar ou criar"
              }
              onChange={(event) => handleCompanyInputChange(event.target.value)}
              onFocus={() =>
                !isCompanyLoading && setShowCompanySuggestions(true)
              }
              onBlur={handleCompanyInputBlur}
              disabled={isCompanyLoading}
              autoComplete="off"
              className="pl-10"
            />
            {showCompanySuggestions && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <ul className="max-h-56 overflow-auto py-1 text-sm">
                  {isCompanyLoading ? (
                    <li className="px-3 py-2 text-muted-foreground">
                      Carregando...
                    </li>
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
                          <span className="text-sm text-foreground">
                            {company.nomeFantasia}
                          </span>
                        </button>
                      </li>
                    ))
                  ) : companySearchTerm.trim().length > 0 ? (
                    <li className="px-3 py-2 text-muted-foreground">
                      Nenhuma empresa encontrada
                    </li>
                  ) : (
                    <li className="px-3 py-2 text-muted-foreground">
                      Digite para buscar empresas
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="lead-contact">Contato</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="lead-contact"
              value={contactSearchTerm}
              placeholder={
                !formValues.companyId
                  ? "Digite para incluir"
                  : isContactsLoading
                  ? "Carregando contatos..."
                  : contacts.length === 0
                  ? "Nenhum contato cadastrado"
                  : "Digite para buscar ou criar"
              }
              onChange={(event) => handleContactInputChange(event.target.value)}
              onFocus={() =>
                !isContactsLoading &&
                formValues.companyId &&
                setShowContactSuggestions(true)
              }
              onBlur={handleContactInputBlur}
              //disabled={isContactsLoading || !formValues.companyId}
              autoComplete="off"
              className="pl-10"
            />
            {showContactSuggestions && formValues.companyId && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <ul className="max-h-56 overflow-auto py-1 text-sm">
                  {isContactsLoading ? (
                    <li className="px-3 py-2 text-muted-foreground">
                      Carregando...
                    </li>
                  ) : filteredContactsByTerm.length > 0 ? (
                    filteredContactsByTerm.map((contact) => (
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
                          <span className="text-sm text-foreground">
                            {contact.name}
                          </span>
                        </button>
                      </li>
                    ))
                  ) : contactSearchTerm.trim().length > 0 ? (
                    <li className="px-3 py-2 text-muted-foreground">
                      Nenhum contato encontrado
                    </li>
                  ) : (
                    <li className="px-3 py-2 text-muted-foreground">
                      Digite para buscar contatos
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-estimatedValue">Valor estimado</Label>
          <div className="relative">
            <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="lead-estimatedValue"
              type="number"
              min="0"
              value={formValues.estimatedValue ?? ""}
              onChange={(event) =>
                handleFieldChange(
                  "estimatedValue",
                  event.target.value ? Number(event.target.value) : null
                )
              }
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-lastInteractionAt">Última interação</Label>
          <Input
            id="lead-lastInteractionAt"
            type="datetime-local"
            value={formValues.lastInteractionAt ?? ""}
            onChange={(event) =>
              handleFieldChange("lastInteractionAt", event.target.value || null)
            }
            className="hover:cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-nextStep">Próximo passo</Label>
          <Textarea
            id="lead-nextStep"
            value={formValues.nextStep ?? ""}
            onChange={(event) =>
              handleFieldChange("nextStep", event.target.value)
            }
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-nextStepAt">Data próxima interação</Label>
          <Input
            id="lead-nextStepAt"
            type="datetime-local"
            value={formValues.nextStepAt ?? ""}
            onChange={(event) =>
              handleFieldChange("nextStepAt", event.target.value || null)
            }
            className="hover:cursor-pointer"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="lead-notes">Observações</Label>
          <Textarea
            id="lead-notes"
            value={formValues.notes ?? ""}
            onChange={(event) => handleFieldChange("notes", event.target.value)}
            rows={4}
            placeholder="Adicione observações relevantes sobre o lead"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-red-500 text-white hover:bg-red-400 hover:cursor-pointer"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-yellow-500 text-black hover:bg-yellow-400 hover:cursor-pointer"
        >
          {mode === "create" ? "Criar lead" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
