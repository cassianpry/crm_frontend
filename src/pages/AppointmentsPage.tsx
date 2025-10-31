import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Calendar,
  Clock,
  Building2,
  FileText,
  Plus,
  Search,
  Filter,
  Loader2,
  Pencil,
  XCircle,
  User,
  Mail,
  Phone,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Appointment, CreateAppointmentDto } from "@/types/appointment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppointmentForm, {
  type AppointmentFormState,
} from "@/components/appointments/AppointmentForm";
import AppointmentsFilterSheet, {
  type AppointmentFiltersState,
} from "@/components/appointments/AppointmentsFilterSheet";
import PaginationFooter from "@/components/Layout/PaginationFooter";
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
} from "@/hooks/queries/useAppointments";
import { useCompanies } from "@/hooks/queries/useCompanies";
import { useContacts } from "@/hooks/queries/useContacts";
import type { AppointmentStatus } from "@/types/appointment";
import type { Contact } from "@/types/company";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: "Agendado",
  DONE: "Realizado",
  CANCELLED: "Cancelado",
};

const STATUS_BADGE_CLASS: Record<AppointmentStatus, string> = {
  SCHEDULED: "border-blue-200 bg-blue-100 text-blue-800",
  DONE: "border-emerald-200 bg-emerald-100 text-emerald-800",
  CANCELLED: "border-red-200 bg-red-100 text-red-800",
};

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: "SCHEDULED", label: "Agendado" },
  { value: "DONE", label: "Realizado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const ALL_STATUS_VALUE = "ALL" as const;

const TYPE_OPTIONS = ["Reunião", "Ligação", "Visita", "Apresentação"] as const;

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });
const TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" });

const createInitialFiltersState = (): AppointmentFiltersState => ({
  status: ALL_STATUS_VALUE,
});

const INITIAL_FORM_STATE: AppointmentFormState = {
  title: "",
  companyId: "",
  contactId: "",
  date: "",
  time: "",
  type: TYPE_OPTIONS[0],
  duration: "60",
  notes: "",
  status: "SCHEDULED",
  notify: false,
};

const chipClass =
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold";

const formatPhoneNumber = (rawPhone?: string | null) => {
  if (!rawPhone) {
    return undefined;
  }

  const digits = rawPhone.replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return rawPhone;
};

const buildCompanyAddressLines = (company: Appointment["company"]) => {
  if (!company) {
    return [] as string[];
  }

  const firstLineParts = [company.endereco, company.numero].filter(Boolean);
  const firstLine = firstLineParts.join(", ");
  const firstLineWithComplement = company.complemento
    ? `${firstLine} - ${company.complemento}`
    : firstLine;

  const secondLineParts = [company.bairro];
  if (company.cidade || company.estado) {
    secondLineParts.push(
      [company.cidade, company.estado].filter(Boolean).join("/")
    );
  }
  const secondLine = secondLineParts.filter(Boolean).join(" • ");

  const lines = [firstLineWithComplement, secondLine].filter(
    (line) => line.trim().length > 0
  );

  if (company.cep) {
    lines.push(`CEP ${company.cep}`);
  }

  return lines;
};

const formatDateInputValue = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTimeInputValue = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const extractNotesFromDescription = (description?: string | null) => {
  if (!description) {
    return "";
  }

  return description
    .split("\n")
    .filter((line) => !line.trim().toLowerCase().startsWith("contato:"))
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
};

const AppointmentsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] =
    useState<AppointmentFormState>(INITIAL_FORM_STATE);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    number | null
  >(null);
  const [appointmentBeingCancelled, setAppointmentBeingCancelled] = useState<
    number | null
  >(null);
  const [filters, setFilters] = useState<AppointmentFiltersState>(() =>
    createInitialFiltersState()
  );
  const [draftFilters, setDraftFilters] = useState<AppointmentFiltersState>(
    () => createInitialFiltersState()
  );
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (!isFilterSheetOpen) {
      setDraftFilters(filters);
    }
  }, [isFilterSheetOpen, filters]);

  const appointmentsQuery = useAppointments({
    page,
    pageSize,
    status: filters.status === ALL_STATUS_VALUE ? undefined : filters.status,
    startDate: filters.startDate,
    endDate: filters.endDate,
    companyId: filters.companyId ? Number(filters.companyId) : undefined,
    search: debouncedSearch || undefined,
  });
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const companiesQuery = useCompanies({ page: 1, pageSize: 100 });
  const contactsQuery = useContacts({ page: 1, pageSize: 200 });

  const companies = useMemo(
    () => companiesQuery.data?.data ?? [],
    [companiesQuery.data]
  );
  const contacts = useMemo(
    () => contactsQuery.data?.data ?? [],
    [contactsQuery.data]
  );

  const selectedCompanyId = formState.companyId
    ? Number(formState.companyId)
    : undefined;

  const availableContacts: Contact[] = useMemo(() => {
    if (!selectedCompanyId) {
      return [];
    }
    return contacts.filter(
      (contact) => contact.company?.id === selectedCompanyId
    );
  }, [contacts, selectedCompanyId]);

  const appointments = useMemo(
    () => appointmentsQuery.data?.data ?? [],
    [appointmentsQuery.data]
  );
  const meta = appointmentsQuery.data?.meta;

  const handleFormStateChange = <Key extends keyof AppointmentFormState>(
    key: Key,
    value: AppointmentFormState[Key]
  ) => {
    setFormState((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setFormState(INITIAL_FORM_STATE);
    setEditingAppointmentId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const companyIdNumber = formState.companyId
      ? Number(formState.companyId)
      : undefined;
    if (!companyIdNumber) {
      toast.error("Selecione uma empresa para continuar.");
      return;
    }

    if (!formState.title.trim()) {
      toast.error("Informe um título para o agendamento.");
      return;
    }

    if (!formState.date || !formState.time) {
      toast.error("Informe data e horário válidos.");
      return;
    }

    const dateTime = new Date(`${formState.date}T${formState.time}`);
    if (Number.isNaN(dateTime.getTime())) {
      toast.error("Não foi possível interpretar a data informada.");
      return;
    }

    const contactIdNumber = formState.contactId
      ? Number(formState.contactId)
      : undefined;
    const selectedContactEntity = contactIdNumber
      ? contacts.find((contact) => contact.id === contactIdNumber)
      : undefined;

    if (!contactIdNumber || !selectedContactEntity) {
      toast.error("Selecione um contato válido para continuar.");
      return;
    }

    const durationNumber = formState.duration
      ? Number(formState.duration)
      : undefined;

    const sanitizedNotes = formState.notes
      .split("\n")
      .filter((line) => !line.trim().toLowerCase().startsWith("contato:"))
      .map((line) => line.trimEnd())
      .join("\n")
      .trim();
    const notesSegments: string[] = [];

    if (sanitizedNotes.length > 0) {
      notesSegments.push(sanitizedNotes);
    }

    const durationForCreate =
      typeof durationNumber === "number" && !Number.isNaN(durationNumber)
        ? durationNumber
        : undefined;
    const durationForUpdate =
      typeof durationNumber === "number" && !Number.isNaN(durationNumber)
        ? durationNumber
        : null;

    const basePayload = {
      title: formState.title.trim(),
      date: dateTime.toISOString(),
      companyId: companyIdNumber,
      status: formState.status,
    } as const;

    try {
      if (editingAppointmentId !== null) {
        await updateAppointment.mutateAsync({
          id: editingAppointmentId,
          data: {
            title: basePayload.title,
            date: basePayload.date,
            companyId: basePayload.companyId,
            contactId: contactIdNumber,
            status: formState.status,
            durationMinutes: durationForUpdate,
            description:
              notesSegments.length > 0 ? notesSegments.join("\n") : null,
          },
        });
        toast.success("Agendamento atualizado com sucesso.");
      } else {
        const createPayload: CreateAppointmentDto = {
          title: basePayload.title,
          date: basePayload.date,
          companyId: basePayload.companyId,
          status: formState.status,
        };

        if (durationForCreate !== undefined) {
          createPayload.durationMinutes = durationForCreate;
        }

        if (notesSegments.length > 0) {
          createPayload.description = notesSegments.join("\n");
        }

        createPayload.contactId = contactIdNumber;

        await createAppointment.mutateAsync(createPayload);
        toast.success("Agendamento salvo com sucesso.");
      }
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar agendamento", error);
      toast.error("Erro ao salvar o agendamento. Tente novamente.");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleCreateNewAppointment = () => {
    resetForm();
    setShowForm((previous) => !previous);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    const appointmentDate = appointment.date;
    const currentContactId = appointment.contact?.id ?? null;
    const nextFormState: AppointmentFormState = {
      title: appointment.title,
      companyId: String(appointment.companyId),
      contactId: currentContactId ? String(currentContactId) : "",
      date: formatDateInputValue(appointmentDate),
      time: formatTimeInputValue(appointmentDate),
      type: formState.type,
      duration: appointment.durationMinutes
        ? String(appointment.durationMinutes)
        : "",
      notes: extractNotesFromDescription(appointment.description),
      status: appointment.status,
      notify: formState.notify,
    };

    setFormState(nextFormState);
    setEditingAppointmentId(appointment.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusFilterChange = (value: string) => {
    const nextStatus = value as AppointmentFiltersState["status"];
    setFilters((previous) => ({
      ...previous,
      status: nextStatus,
    }));
    setDraftFilters((previous) => ({
      ...previous,
      status: nextStatus,
    }));
    setPage(1);
  };

  const handleOpenFilters = () => {
    setDraftFilters(filters);
    setFilterSheetOpen(true);
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setFilterSheetOpen(false);
    setPage(1);
  };

  const handleClearFilters = () => {
    const cleared = createInitialFiltersState();
    setFilters(cleared);
    setDraftFilters(cleared);
    setFilterSheetOpen(false);
    setPage(1);
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    const appointmentToCancel = appointments.find(
      (item) => item.id === appointmentId
    );

    if (!appointmentToCancel) {
      toast.error("Não foi possível localizar o agendamento selecionado.");
      return;
    }

    if (appointmentToCancel.status === "CANCELLED") {
      toast.info("Este agendamento já foi cancelado anteriormente.");
      return;
    }

    const userConfirmed = window.confirm(
      `Deseja realmente cancelar o agendamento "${appointmentToCancel.title}"?`
    );

    if (!userConfirmed) {
      return;
    }

    setAppointmentBeingCancelled(appointmentId);

    try {
      await updateAppointment.mutateAsync({
        id: appointmentId,
        data: { status: "CANCELLED" },
      });
      toast.success("Agendamento cancelado com sucesso.");
    } catch (error) {
      console.error("Erro ao cancelar agendamento", error);
      toast.error("Não foi possível cancelar o agendamento. Tente novamente.");
    } finally {
      setAppointmentBeingCancelled(null);
    }
  };

  const activeAdvancedFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.startDate) count += 1;
    if (filters.endDate) count += 1;
    if (filters.companyId) count += 1;
    return count;
  }, [filters.startDate, filters.endDate, filters.companyId]);

  const hasAdvancedFilters = activeAdvancedFiltersCount > 0;
  const hasStatusFilter = filters.status !== ALL_STATUS_VALUE;
  const canClearFilters = hasStatusFilter || hasAdvancedFilters;

  const formattedAppointments = useMemo(
    () =>
      appointments.map((appointment) => {
        const date = new Date(appointment.date);
        const dateLabel = Number.isNaN(date.getTime())
          ? "-"
          : DATE_FORMATTER.format(date);
        const timeLabel = Number.isNaN(date.getTime())
          ? "-"
          : TIME_FORMATTER.format(date);

        const companyAddressLines = buildCompanyAddressLines(
          appointment.company ?? null
        );

        const effectiveContact =
          appointment.contact ?? appointment.company?.primaryContact ?? null;
        const formattedPhone = formatPhoneNumber(
          effectiveContact?.phone ?? undefined
        );

        return {
          ...appointment,
          dateLabel,
          timeLabel,
          companyAddressLines,
          contactName: effectiveContact?.name,
          contactEmail: effectiveContact?.email,
          contactPhone: formattedPhone,
        };
      }),
    [appointments]
  );

  const isLoadingList = appointmentsQuery.isLoading;
  const isFetchingList = appointmentsQuery.isFetching;

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold sm:text-3xl">Agendamentos</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Gerencie todos os compromissos cadastrados com seus clientes
          </p>
        </div>
        <Button
          className="w-full justify-center md:w-auto bg-yellow-500 hover:bg-yellow-400 hover:cursor-pointer text-black"
          onClick={handleCreateNewAppointment}
        >
          <Plus className="mr-2 h-4 w-4" />
          {editingAppointmentId !== null && showForm
            ? "Cancelar edição"
            : "Novo Agendamento"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAppointmentId !== null
                ? "Editar Agendamento"
                : "Novo Agendamento"}
            </CardTitle>
            <CardDescription>
              {editingAppointmentId !== null
                ? "Atualize as informações do compromisso selecionado"
                : "Preencha os dados para registrar um compromisso"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentForm
              formState={formState}
              companies={companies}
              availableContacts={availableContacts}
              isCompanyLoading={companiesQuery.isLoading}
              isContactsLoading={contactsQuery.isLoading}
              isSubmitting={
                editingAppointmentId !== null
                  ? updateAppointment.isPending
                  : createAppointment.isPending
              }
              selectedCompanyId={selectedCompanyId}
              statusOptions={STATUS_OPTIONS}
              typeOptions={TYPE_OPTIONS}
              onFieldChange={handleFormStateChange}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
            <div className="justify-between flex w-full flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-3">
              <div className="flex items-center gap-2">
                <Button
                  className={cn(
                    "hover:cursor-pointer",
                    activeTab === "list"
                      ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                      : "hover:bg-yellow-100"
                  )}
                  type="button"
                  variant={activeTab === "list" ? "default" : "outline"}
                  onClick={() => setActiveTab("list")}
                >
                  <List className="mr-2 h-4 w-4" />
                  Lista
                </Button>
                <Button
                  className={cn(
                    "hover:cursor-pointer",
                    activeTab === "calendar"
                      ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                      : "hover:bg-yellow-100"
                  )}
                  type="button"
                  variant={activeTab === "calendar" ? "default" : "outline"}
                  onClick={() => setActiveTab("calendar")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendário
                </Button>
                <div className="relative w-full min-w-60 md:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título ou empresa..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto sm:flex-none">
                <Select
                  value={filters.status}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-full justify-between sm:w-48 hover:cursor-pointer hover:bg-yellow-400">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={ALL_STATUS_VALUE}
                      className="data-[state=checked]:bg-yellow-400"
                    >
                      Todos os status
                    </SelectItem>
                    {STATUS_OPTIONS.map((statusOption) => (
                      <SelectItem
                        className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                        key={statusOption.value}
                        value={statusOption.value}
                      >
                        {statusOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasAdvancedFilters && (
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    +{activeAdvancedFiltersCount}
                  </Badge>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto sm:flex-none hover:cursor-pointer hover:bg-yellow-400"
                  onClick={handleOpenFilters}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                  {hasAdvancedFilters && (
                    <Badge variant="secondary" className="ml-2 sm:hidden">
                      +{activeAdvancedFiltersCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto sm:flex-none hover:cursor-pointer hover:bg-yellow-400"
                  onClick={handleClearFilters}
                  disabled={!canClearFilters}
                >
                  Limpar filtros
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {activeTab === "calendar" ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
              <span>Visualização de calendário em desenvolvimento</span>
            </div>
          ) : isLoadingList ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : formattedAppointments.length === 0 && !isFetchingList ? (
            <div className="py-12 text-center text-muted-foreground">
              Nenhum agendamento encontrado.
            </div>
          ) : (
            <div className="divide-y">
              {formattedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {appointment.title}
                        </h3>
                        <span
                          className={cn(
                            chipClass,
                            STATUS_BADGE_CLASS[appointment.status]
                          )}
                        >
                          {STATUS_LABELS[appointment.status]}
                        </span>
                      </div>
                      <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                        <div className="flex items-start gap-2">
                          <Building2 className="mt-1 h-4 w-4" />
                          <div className="space-y-1">
                            <span className="font-medium text-foreground">
                              {appointment.company?.nomeFantasia ??
                                "Empresa não informada"}
                            </span>
                            {appointment.companyAddressLines?.map(
                              (line, index) => (
                                <span
                                  key={`${appointment.id}-address-line-${index}`}
                                  className="block text-xs text-muted-foreground"
                                >
                                  {line}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.dateLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.timeLabel}</span>
                        </div>
                        {(appointment.contactName ||
                          appointment.contactEmail ||
                          appointment.contactPhone) && (
                          <div className="flex flex-wrap items-center gap-3 md:col-span-3">
                            {appointment.contactName && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{appointment.contactName}</span>
                              </div>
                            )}
                            {appointment.contactEmail && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{appointment.contactEmail}</span>
                              </div>
                            )}
                            {appointment.contactPhone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{appointment.contactPhone}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {appointment.description && (
                        <p className="text-sm text-muted-foreground">
                          <FileText className="mr-1 inline h-3 w-3" />
                          {appointment.description}
                        </p>
                      )}
                    </div>
                    <TooltipProvider
                      delayDuration={200}
                      skipDelayDuration={100}
                    >
                      <div className="flex gap-2 md:ml-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:cursor-pointer hover:bg-yellow-400 disabled:opacity-60"
                              aria-label="Editar agendamento"
                              disabled={updateAppointment.isPending}
                              onClick={() => handleEditAppointment(appointment)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Editar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:cursor-pointer hover:bg-red-300 disabled:opacity-60"
                              aria-label="Cancelar agendamento"
                              disabled={
                                appointment.status === "CANCELLED" ||
                                (appointmentBeingCancelled !== null &&
                                  appointmentBeingCancelled ===
                                    appointment.id &&
                                  updateAppointment.isPending)
                              }
                              onClick={() =>
                                handleCancelAppointment(appointment.id)
                              }
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {appointment.status === "CANCELLED"
                              ? "Agendamento já cancelado"
                              : "Cancelar"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {activeTab === "list" && meta && (
        <PaginationFooter
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
          pageSize={meta.pageSize}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value);
            setPage(1);
          }}
          isLoading={appointmentsQuery.isFetching}
        />
      )}

      <AppointmentsFilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={draftFilters}
        onFiltersChange={setDraftFilters}
        onApply={handleApplyFilters}
        statusOptions={STATUS_OPTIONS}
        companies={companies}
      />
    </div>
  );
};

export default AppointmentsPage;
