import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/api/leads";
import type {
  CreateLeadDto,
  LeadFilters,
  LeadMetrics,
  PaginatedLeads,
  UpdateLeadDto,
} from "@/types/lead";

const LEADS_QUERY_KEY = ["leads"] as const;
const LEADS_METRICS_QUERY_KEY = ["leads", "metrics"] as const;

export const useLeads = (filters: LeadFilters = {}) => {
  return useQuery<PaginatedLeads>({
    queryKey: [...LEADS_QUERY_KEY, filters] as const,
    queryFn: () => leadsApi.list(filters),
  });
};

export const useLead = (id: number | null) => {
  return useQuery({
    queryKey: [...LEADS_QUERY_KEY, id],
    queryFn: () => leadsApi.getById(id ?? 0),
    enabled: Boolean(id),
  });
};

export const useLeadMetrics = () => {
  return useQuery<LeadMetrics>({
    queryKey: LEADS_METRICS_QUERY_KEY,
    queryFn: leadsApi.getMetrics,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeadDto) => leadsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEADS_METRICS_QUERY_KEY });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeadDto }) =>
      leadsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...LEADS_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEADS_METRICS_QUERY_KEY });
    },
  });
};

export const useMoveLeadStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage }: { id: number; stage: LeadFilters["stage"] }) =>
      leadsApi.moveStage(id, stage),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...LEADS_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEADS_METRICS_QUERY_KEY });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leadsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEADS_METRICS_QUERY_KEY });
    },
  });
};
