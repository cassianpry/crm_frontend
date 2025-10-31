import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "@/api/companies";
import type {
  CreateCompanyDto,
  UpdateCompanyDto,
} from "@/types/company";

const QUERY_KEY = ["companies"];

type UseCompaniesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export const useCompanies = ({ page = 1, pageSize = 10, search }: UseCompaniesParams = {}) => {
  const trimmedSearch = search?.trim();
  return useQuery({
    queryKey: [...QUERY_KEY, page, pageSize, trimmedSearch ?? ""],
    queryFn: () => companiesApi.getAll(page, pageSize, trimmedSearch || undefined),
  });
};

export const useCompany = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => companiesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyDto) => companiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyDto }) =>
      companiesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => companiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
