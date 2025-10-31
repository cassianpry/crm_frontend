import apiClient from "./client";
import type {
  CreateLeadDto,
  Lead,
  LeadFilters,
  LeadMetrics,
  PaginatedLeads,
  UpdateLeadDto,
} from "@/types/lead";

const buildQueryString = (filters: LeadFilters = {}): string => {
  const params = new URLSearchParams();

  if (filters.stage) params.append("stage", filters.stage);
  if (filters.origin) params.append("origin", filters.origin);
  if (filters.search) params.append("search", filters.search.trim());
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.companyId !== undefined)
    params.append("companyId", String(filters.companyId));
  if (filters.page !== undefined) params.append("page", String(filters.page));
  if (filters.pageSize !== undefined)
    params.append("pageSize", String(filters.pageSize));
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

export const leadsApi = {
  list: async (filters?: LeadFilters): Promise<PaginatedLeads> => {
    const { data } = await apiClient.get<PaginatedLeads>(
      `/lead${buildQueryString(filters)}`,
    );
    return data;
  },

  getById: async (id: number): Promise<Lead> => {
    const { data } = await apiClient.get<Lead>(`/lead/${id}`);
    return data;
  },

  getMetrics: async (): Promise<LeadMetrics> => {
    const { data } = await apiClient.get<LeadMetrics>("/lead/metrics");
    return data;
  },

  create: async (payload: CreateLeadDto): Promise<Lead> => {
    const { data } = await apiClient.post<Lead>("/lead", payload);
    return data;
  },

  update: async (id: number, payload: UpdateLeadDto): Promise<Lead> => {
    const { data } = await apiClient.patch<Lead>(`/lead/${id}`, payload);
    return data;
  },

  moveStage: async (
    id: number,
    stage: LeadFilters["stage"],
  ): Promise<Lead> => {
    const { data } = await apiClient.patch<Lead>(`/lead/${id}/stage`, { stage });
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/lead/${id}`);
  },
};
