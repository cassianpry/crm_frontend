import { useMutation } from "@tanstack/react-query";
import { cepApi } from "@/api/cep";
import type { PostalCodeResponse } from "@/types/cep";

export const usePostalCodeLookup = () => {
  const mutation = useMutation<PostalCodeResponse | null, unknown, string>({
    mutationFn: (rawCep: string) => cepApi.findByCep(rawCep),
  });

  return {
    fetchPostalCode: mutation.mutateAsync,
    isFetchingPostalCode: mutation.isPending,
    postalCodeError: mutation.error,
    resetPostalCodeLookup: mutation.reset,
  } as const;
};
