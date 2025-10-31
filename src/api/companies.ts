import apiClient from "./client";
import type {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
  PaginatedCompanies,
} from "@/types/company";

export const companiesApi = {
  getAll: async (
    page?: number,
    pageSize?: number,
    search?: string,
  ): Promise<PaginatedCompanies> => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (pageSize !== undefined) params.append("pageSize", String(pageSize));
    if (search) params.append("search", search);

    const queryString = params.toString();
    const { data } = await apiClient.get<PaginatedCompanies>(
      `/company${queryString ? `?${queryString}` : ""}`,
    );
    return data;
  },

  getById: async (id: number): Promise<Company> => {
    const { data } = await apiClient.get<Company>(`/company/${id}`);
    return data;
  },

  create: async (companyData: CreateCompanyDto): Promise<Company> => {
    const { data } = await apiClient.post<Company>("/company", companyData);
    return data;
  },

  update: async (id: number, companyData: UpdateCompanyDto): Promise<Company> => {
    const { data } = await apiClient.patch<Company>(`/company/${id}`, companyData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/company/${id}`);
  },
};
