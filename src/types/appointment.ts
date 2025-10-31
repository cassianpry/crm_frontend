export type AppointmentStatus = "SCHEDULED" | "DONE" | "CANCELLED";

export interface AppointmentCompanyContactSummary {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface AppointmentCompanySummary {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  primaryContact: AppointmentCompanyContactSummary | null;
}

export interface Appointment {
  id: number;
  title: string;
  date: string;
  companyId: number;
  contactId?: number | null;
  description?: string | null;
  durationMinutes?: number | null;
  status: AppointmentStatus;
  isActive: boolean;
  company?: AppointmentCompanySummary | null;
  contact?: AppointmentCompanyContactSummary | null;
}

export interface CreateAppointmentDto {
  title: string;
  date: string;
  companyId: number;
  contactId?: number | null;
  description?: string;
  durationMinutes?: number;
  status?: AppointmentStatus;
}

export interface UpdateAppointmentDto {
  title?: string;
  date?: string;
  companyId?: number;
  contactId?: number | null;
  description?: string | null;
  durationMinutes?: number | null;
  status?: AppointmentStatus;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedAppointments {
  data: Appointment[];
  meta: PaginationMeta;
}
