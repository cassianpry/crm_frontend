import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "@/api/appointments";
import type {
  AppointmentStatus,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from "@/types/appointment";

const APPOINTMENTS_QUERY_KEY = ["appointments"] as const;

export type UseAppointmentsParams = {
  page?: number;
  pageSize?: number;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  companyId?: number;
};

export const useAppointments = ({
  page = 1,
  pageSize = 10,
  status,
  startDate,
  endDate,
  search,
  companyId,
}: UseAppointmentsParams = {}) => {
  const trimmedSearch = search?.trim();
  return useQuery({
    queryKey: [
      ...APPOINTMENTS_QUERY_KEY,
      page,
      pageSize,
      status ?? "",
      startDate ?? "",
      endDate ?? "",
      trimmedSearch ?? "",
      companyId ?? "",
    ],
    queryFn: () =>
      appointmentsApi.getAll(
        page,
        pageSize,
        status,
        startDate,
        endDate,
        trimmedSearch || undefined,
        companyId
      ),
  });
};

export const useAppointment = (id: number | undefined) => {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, id],
    queryFn: () => appointmentsApi.getById(id!),
    enabled: typeof id === "number" && id > 0,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentDto) =>
      appointmentsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentDto }) =>
      appointmentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...APPOINTMENTS_QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => appointmentsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...APPOINTMENTS_QUERY_KEY, id] });
    },
  });
};
