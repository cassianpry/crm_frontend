import type { CreateContactDto, UpdateContactDto } from "@/types/contact";
import apiClient from "./client";
import type { Contact } from "@/types/company";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedContacts {
  data: Contact[];
  meta: PaginationMeta;
}

export const contactsApi = {
  getAll: async (
    page?: number,
    pageSize?: number,
    search?: string,
    companyId?: number
  ): Promise<PaginatedContacts> => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (pageSize !== undefined) params.append("pageSize", String(pageSize));
    if (search) params.append("search", search);
    if (companyId !== undefined) params.append("companyId", String(companyId));

    const queryString = params.toString();
    const { data } = await apiClient.get<PaginatedContacts>(
      `/contact${queryString ? `?${queryString}` : ""}`
    );
    return data;
  },

  getById: async (id: number): Promise<Contact> => {
    const { data } = await apiClient.get<Contact>(`/contact/${id}`);
    return data;
  },

  create: async (contactData: CreateContactDto): Promise<Contact> => {
    const { data } = await apiClient.post<Contact>("/contact", contactData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/contact/${id}`);
  },

  update: async (
    id: number,
    contactData: UpdateContactDto
  ): Promise<Contact> => {
    const { data } = await apiClient.patch<Contact>(
      `/contact/${id}`,
      contactData
    );
    return data;
  },
};
