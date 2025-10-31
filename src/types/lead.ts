export const LEAD_STAGES = [
  "NEW",
  "QUALIFICATION",
  "PROPOSAL",
  "FOLLOW_UP",
  "WON",
  "LOST",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export const LEAD_ORIGINS = [
  "WEBSITE",
  "CAMPAIGN",
  "REFERRAL",
  "OUTBOUND",
  "OTHER",
] as const;

export type LeadOrigin = (typeof LEAD_ORIGINS)[number];

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  NEW: "Novo",
  QUALIFICATION: "Qualificação",
  PROPOSAL: "Proposta",
  FOLLOW_UP: "Acompanhamento",
  WON: "Ganho",
  LOST: "Perdido",
};

export const LEAD_ORIGIN_LABELS: Record<LeadOrigin, string> = {
  WEBSITE: "Website",
  CAMPAIGN: "Campanha",
  REFERRAL: "Indicação",
  OUTBOUND: "Prospecção ativa",
  OTHER: "Outra origem",
};

export interface LeadCompanySummary {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
}

export interface LeadContactSummary {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface Lead {
  id: number;
  name: string;
  companyId: number | null;
  contactId: number | null;
  email: string | null;
  phone: string | null;
  origin: LeadOrigin | null;
  stage: LeadStage;
  estimatedValue: number | null;
  lastInteractionAt: string | null;
  nextStep: string | null;
  nextStepAt: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company: LeadCompanySummary | null;
  contact: LeadContactSummary | null;
}

export interface LeadFilters {
  stage?: LeadStage | "";
  origin?: LeadOrigin | "";
  search?: string;
  startDate?: string;
  endDate?: string;
  companyId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name" | "stage";
  sortOrder?: "asc" | "desc";
}

export interface LeadPaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedLeads {
  data: Lead[];
  pagination: LeadPaginationMeta;
}

export interface LeadMetrics {
  total: number;
  perStage: Record<LeadStage, number>;
  perOrigin: Record<LeadOrigin | "UNSPECIFIED", number>;
}

export interface CreateLeadDto {
  name: string;
  email?: string | null;
  phone?: string | null;
  companyId?: number | null;
  contactId?: number | null;
  origin?: LeadOrigin | null;
  stage?: LeadStage;
  estimatedValue?: number | null;
  lastInteractionAt?: string | null;
  nextStep?: string | null;
  nextStepAt?: string | null;
  notes?: string | null;
}

export interface UpdateLeadDto {
  name?: string;
  email?: string | null;
  phone?: string | null;
  companyId?: number | null;
  contactId?: number | null;
  origin?: LeadOrigin | null;
  stage?: LeadStage;
  estimatedValue?: number | null;
  lastInteractionAt?: string | null;
  nextStep?: string | null;
  nextStepAt?: string | null;
  notes?: string | null;
}
