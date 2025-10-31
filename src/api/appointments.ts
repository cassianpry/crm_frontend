import apiClient from "./client";
import type {
  Appointment,
  CreateAppointmentDto,
  PaginatedAppointments,
  UpdateAppointmentDto,
} from "@/types/appointment";

export const appointmentsApi = {
  getAll: async (
    page?: number,
    pageSize?: number,
    status?: string,
    startDate?: string,
    endDate?: string,
    search?: string,
    companyId?: number
  ): Promise<PaginatedAppointments> => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (pageSize !== undefined) params.append("pageSize", String(pageSize));
    if (status) params.append("status", status);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (search) params.append("search", search);
    if (companyId) params.append("companyId", String(companyId));

    const queryString = params.toString();
    const { data } = await apiClient.get<PaginatedAppointments>(
      `/appointment${queryString ? `?${queryString}` : ""}`
    );
    return data;
  },

  getById: async (id: number): Promise<Appointment> => {
    const { data } = await apiClient.get<Appointment>(`/appointment/${id}`);
    return data;
  },

  create: async (payload: CreateAppointmentDto): Promise<Appointment> => {
    const { data } = await apiClient.post<Appointment>(
      `/appointment`,
      payload
    );
    return data;
  },

  update: async (
    id: number,
    payload: UpdateAppointmentDto
  ): Promise<Appointment> => {
    const { data } = await apiClient.patch<Appointment>(
      `/appointment/${id}`,
      payload
    );
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/appointment/${id}`);
  },
};
