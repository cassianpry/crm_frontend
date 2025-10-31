import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LeadsFiltersBar from "@/components/leads/LeadsFiltersBar";
import LeadsMetricsPanel from "@/components/leads/LeadsMetricsPanel";
import LeadsTable from "@/components/leads/LeadsTable";
import LeadDetailsDrawer from "@/components/leads/LeadDetailsDrawer";
import LeadsEmptyState from "@/components/leads/LeadsEmptyState";
import LeadForm, { type LeadFormValues } from "@/components/leads/LeadForm";
import {
  useCreateLead,
  useDeleteLead,
  useLeadMetrics,
  useLeads,
  useUpdateLead,
} from "@/hooks/queries/useLeads";
import { useCompanies } from "@/hooks/queries/useCompanies";
import { useContacts } from "@/hooks/queries/useContacts";
import type {
  CreateLeadDto,
  Lead,
  LeadFilters,
  UpdateLeadDto,
} from "@/types/lead";

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  pageSize: 20,
  sortBy: "updatedAt",
  sortOrder: "desc",
};

const toLocalDateTimeInput = (isoValue: string | null): string | null => {
  if (!isoValue) return null;
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return null;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const LeadsPage = () => {
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [leadBeingEdited, setLeadBeingEdited] = useState<Lead | null>(null);
  const [leadPendingDeletion, setLeadPendingDeletion] = useState<Lead | null>(
    null
  );
  const [createFormCompanyId, setCreateFormCompanyId] = useState<number | null>(
    null
  );
  const [editFormCompanyId, setEditFormCompanyId] = useState<number | null>(
    null
  );

  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    isFetching: isFetchingLeads,
    error: leadsError,
    refetch: refetchLeads,
  } = useLeads(filters);

  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    isError: isMetricsError,
    refetch: refetchMetrics,
  } = useLeadMetrics();

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies({
    page: 1,
    pageSize: 100,
  });

  const effectiveCreateCompanyId = createFormCompanyId;
  const createContactsQuery = useContacts({
    page: 1,
    pageSize: 200,
    companyId: effectiveCreateCompanyId ?? undefined,
    enabled: isCreateOpen && effectiveCreateCompanyId !== null,
  });

  const effectiveEditCompanyId =
    editFormCompanyId ?? leadBeingEdited?.companyId ?? null;
  const editContactsQuery = useContacts({
    page: 1,
    pageSize: 200,
    companyId: effectiveEditCompanyId ?? undefined,
    enabled: isEditOpen && effectiveEditCompanyId !== null,
  });

  const pagination = useMemo(() => {
    if (leadsData?.pagination) {
      return leadsData.pagination;
    }
    return {
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 20,
      total: 0,
      totalPages: 0,
    };
  }, [leadsData?.pagination, filters.page, filters.pageSize]);

  const handleFiltersChange = (updated: LeadFilters) => {
    setFilters(updated);
  };

  const handleResetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const companiesOptions = useMemo(
    () =>
      (companiesData?.data ?? []).map((company) => ({
        id: company.id,
        nomeFantasia: company.nomeFantasia,
      })),
    [companiesData?.data]
  );

  const createContactsOptions = useMemo(() => {
    const contacts = createContactsQuery.data?.data ?? [];
    return contacts
      .filter(
        (contact): contact is typeof contact & { id: number } =>
          typeof contact.id === "number"
      )
      .map((contact) => ({ id: contact.id, name: contact.name }));
  }, [createContactsQuery.data?.data]);

  const editContactsOptions = useMemo(() => {
    const contacts = editContactsQuery.data?.data ?? [];
    return contacts
      .filter(
        (contact): contact is typeof contact & { id: number } =>
          typeof contact.id === "number"
      )
      .map((contact) => ({ id: contact.id, name: contact.name }));
  }, [editContactsQuery.data?.data]);

  const baseFormValues = useMemo<LeadFormValues>(
    () => ({
      name: "",
      email: null,
      phone: null,
      companyId: null,
      contactId: null,
      origin: null,
      stage: "NEW",
      estimatedValue: null,
      lastInteractionAt: null,
      nextStep: null,
      nextStepAt: null,
      notes: null,
    }),
    []
  );

  const buildInitialValuesFromLead = (lead: Lead): LeadFormValues => ({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    companyId: lead.companyId,
    contactId: lead.contactId,
    origin: lead.origin,
    stage: lead.stage,
    estimatedValue: lead.estimatedValue,
    lastInteractionAt: toLocalDateTimeInput(lead.lastInteractionAt),
    nextStep: lead.nextStep,
    nextStepAt: toLocalDateTimeInput(lead.nextStepAt),
    notes: lead.notes,
  });

  const handleOpenCreate = () => {
    setCreateFormCompanyId(null);
    setIsCreateOpen(true);
  };

  const handleSubmitCreate = async (payload: CreateLeadDto) => {
    const sanitizedPayload: CreateLeadDto = {
      ...payload,
      stage: payload.stage ?? "NEW",
      origin: payload.origin ?? null,
    };

    try {
      await createLead.mutateAsync(sanitizedPayload);
      toast.success("Lead criado com sucesso", {
        description: `${payload.name} foi adicionado ao funil.`,
      });
      setIsCreateOpen(false);
      setCreateFormCompanyId(null);
    } catch (error) {
      console.error("Erro ao criar lead", error);
      toast.error("Não foi possível criar o lead", {
        description: "Verifique os dados e tente novamente.",
      });
    }
  };

  const handleEditLead = (leadId: number) => {
    const lead =
      leadsData?.data.find((item) => item.id === leadId) ??
      (selectedLead && selectedLead.id === leadId ? selectedLead : null);

    if (!lead) return;

    setLeadBeingEdited(lead);
    setEditFormCompanyId(lead.companyId);
    setIsEditOpen(true);
  };

  const handleSubmitEdit = async (payload: CreateLeadDto) => {
    if (!leadBeingEdited) return;

    const updatePayload: UpdateLeadDto = {
      name: payload.name,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      companyId: payload.companyId ?? null,
      contactId: payload.contactId ?? null,
      origin: payload.origin ?? null,
      stage: payload.stage ?? leadBeingEdited.stage,
      estimatedValue: payload.estimatedValue ?? null,
      lastInteractionAt: payload.lastInteractionAt ?? null,
      nextStep: payload.nextStep ?? null,
      nextStepAt: payload.nextStepAt ?? null,
      notes: payload.notes ?? null,
    };

    try {
      await updateLead.mutateAsync({
        id: leadBeingEdited.id,
        data: updatePayload,
      });
      toast.success("Lead atualizado", {
        description: `${payload.name} teve seus dados salvos.`,
      });
      setIsEditOpen(false);
      setLeadBeingEdited(null);
      setEditFormCompanyId(null);
      if (selectedLead?.id === leadBeingEdited.id) {
        setSelectedLead({
          ...selectedLead,
          ...updatePayload,
          stage: updatePayload.stage ?? selectedLead.stage,
          companyId: updatePayload.companyId ?? selectedLead.companyId,
          contactId: updatePayload.contactId ?? selectedLead.contactId,
        });
      }
      refetchLeads();
    } catch (error) {
      console.error("Erro ao atualizar lead", error);
      toast.error("Não foi possível atualizar o lead", {
        description: "Tente novamente em instantes.",
      });
    }
  };

  const handleDeleteLead = async () => {
    if (!leadPendingDeletion) return;

    try {
      await deleteLead.mutateAsync(leadPendingDeletion.id);
      toast.success("Lead removido", {
        description: `${leadPendingDeletion.name} foi arquivado do funil.`,
      });
      if (selectedLead?.id === leadPendingDeletion.id) {
        setSelectedLead(null);
        setIsDetailsOpen(false);
      }
      setLeadPendingDeletion(null);
    } catch (error) {
      console.error("Erro ao remover lead", error);
      toast.error("Não foi possível remover o lead", {
        description: "Revise e tente novamente.",
      });
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Acompanhe os leads ativos, atualize estágios e monitore métricas de
            conversão.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-yellow-500 text-black hover:bg-yellow-400 hover:cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Lead
        </Button>
      </div>
      <LeadsMetricsPanel metrics={metrics} isLoading={isLoadingMetrics} />

      <LeadsFiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
      />

      {isMetricsError && (
        <Card className="border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30">
          <CardContent className="flex flex-col gap-3 p-6">
            <p className="text-sm">
              Não foi possível carregar as métricas de leads. Recarregue a
              página ou tente novamente.
            </p>
            <Button
              variant="outline"
              className="bg-yellow-500 text-black hover:bg-yellow-400 hover:cursor-pointer border-none"
              onClick={() => refetchMetrics()}
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {leadsData?.data?.length === 0 && !isLoadingLeads && !leadsError ? (
        <LeadsEmptyState onCreateLead={handleOpenCreate} />
      ) : (
        <LeadsTable
          leads={leadsData?.data ?? []}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          pagination={pagination}
          isLoading={isLoadingLeads}
          isFetching={isFetchingLeads}
          isError={Boolean(leadsError)}
          onRetry={() => refetchLeads()}
          onEditLead={handleEditLead}
          onDeleteLead={(lead) => setLeadPendingDeletion(lead)}
          onSelectLead={handleSelectLead}
        />
      )}

      <LeadDetailsDrawer
        lead={selectedLead}
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedLead(null);
          }
        }}
        onEdit={(leadId) => {
          handleEditLead(leadId);
          setIsDetailsOpen(false);
        }}
        onDelete={(lead) => {
          setLeadPendingDeletion(lead);
          setIsDetailsOpen(false);
        }}
      />

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setCreateFormCompanyId(null);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Novo lead</DialogTitle>
            <DialogDescription>
              Cadastre um novo lead preenchendo os dados principais e associando
              empresa/contato.
            </DialogDescription>
          </DialogHeader>
          <div className="pb-4">
            <LeadForm
              mode="create"
              initialValues={baseFormValues}
              companies={companiesOptions}
              contacts={createContactsOptions}
              isCompanyLoading={isLoadingCompanies}
              isContactsLoading={
                createContactsQuery.isFetching || createContactsQuery.isLoading
              }
              isSubmitting={createLead.isPending}
              onSelectCompany={(companyId) => setCreateFormCompanyId(companyId)}
              onSubmit={handleSubmitCreate}
              onClose={() => setIsCreateOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setLeadBeingEdited(null);
            setEditFormCompanyId(null);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar lead</DialogTitle>
            <DialogDescription>
              Atualize informações, estágio e próximos passos do lead.
            </DialogDescription>
          </DialogHeader>
          <div className="pb-4">
            {leadBeingEdited && (
              <LeadForm
                mode="edit"
                initialValues={buildInitialValuesFromLead(leadBeingEdited)}
                companies={companiesOptions}
                contacts={editContactsOptions}
                isCompanyLoading={isLoadingCompanies}
                isContactsLoading={
                  editContactsQuery.isFetching || editContactsQuery.isLoading
                }
                isSubmitting={updateLead.isPending}
                onSelectCompany={(companyId) => setEditFormCompanyId(companyId)}
                onSubmit={handleSubmitEdit}
                onClose={() => setIsEditOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(leadPendingDeletion)}
        onOpenChange={(open) => {
          if (!open) {
            setLeadPendingDeletion(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover lead</AlertDialogTitle>
            <AlertDialogDescription>
              {`Tem certeza que deseja remover ${
                leadPendingDeletion?.name ?? "este lead"
              }? Essa ação não pode ser desfeita.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-yellow-500 hover:text-black hover:cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-yellow-500 text-black hover:bg-yellow-400 hover:cursor-pointer"
              onClick={handleDeleteLead}
              disabled={deleteLead.isPending}
            >
              {deleteLead.isPending ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadsPage;
