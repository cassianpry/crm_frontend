import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactsApi } from "@/api/contacts";
import type { UpdateContactDto, CreateContactDto } from "@/types/contact";

const CONTACTS_QUERY_KEY = ["contacts"] as const;

type UseContactsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  companyId?: number;
  enabled?: boolean;
};

export const useContacts = ({
  page = 1,
  pageSize = 10,
  search,
  companyId,
  enabled = true,
}: UseContactsParams = {}) => {
  const trimmedSearch = search?.trim();
  return useQuery({
    queryKey: [
      ...CONTACTS_QUERY_KEY,
      page,
      pageSize,
      trimmedSearch ?? "",
      companyId ?? null,
    ],
    queryFn: () =>
      contactsApi.getAll(
        page,
        pageSize,
        trimmedSearch || undefined,
        companyId,
      ),
    enabled,
  });
};

export const useContact = (id: number | undefined) => {
  return useQuery({
    queryKey: [...CONTACTS_QUERY_KEY, id],
    queryFn: () => contactsApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactDto) => contactsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContactDto }) =>
      contactsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contactsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
    },
  });
};
