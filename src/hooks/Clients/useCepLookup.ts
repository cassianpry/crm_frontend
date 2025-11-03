import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { toast } from "sonner";
import type { UseFormSetValue, UseFormClearErrors, UseFormSetError } from "react-hook-form";
import { usePostalCodeLookup } from "@/hooks/usePostalCodeLookup";
import { formatCEP, maskCep, sanitizeCep } from "@/lib/formatters";
import type { CompanyFormData } from "@/lib/validations/company";

interface UseCepLookupProps {
  setValue: UseFormSetValue<CompanyFormData>;
  clearErrors: UseFormClearErrors<CompanyFormData>;
  setError: UseFormSetError<CompanyFormData>;
  cepValue?: string;
  isEditMode: boolean;
  existingCep?: string;
}

export function useCepLookup({
  setValue,
  clearErrors,
  setError,
  cepValue,
  isEditMode,
  existingCep,
}: UseCepLookupProps) {
  const { fetchPostalCode, isFetchingPostalCode, resetPostalCodeLookup } =
    usePostalCodeLookup();

  const [hasFetchedAddress, setHasFetchedAddress] = useState(false);
  const [isNumeroEditable, setIsNumeroEditable] = useState(false);
  const lastFetchedCepRef = useRef<string | null>(null);

  const handleCepInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const maskedCep = maskCep(event.target.value);
      event.target.value = maskedCep;
      clearErrors("cep");
    },
    [clearErrors]
  );

  const resetAddressFields = useCallback(() => {
    setValue("endereco", "");
    setValue("bairro", "");
    setValue("cidade", "");
    setValue("estado", "");
    setValue("complemento", "");
    setValue("numero", "");
    setHasFetchedAddress(false);
    setIsNumeroEditable(false);
  }, [setValue]);

  const handleCepLookup = useCallback(
    async (sanitizedCep: string) => {
      try {
        const postalCode = await fetchPostalCode(sanitizedCep);
        if (lastFetchedCepRef.current !== sanitizedCep) {
          return;
        }

        if (!postalCode) {
          resetAddressFields();
          setError("cep", {
            type: "manual",
            message: "CEP não encontrado",
          });
          toast.error("CEP não encontrado", {
            description: "Não localizamos o endereço para este CEP.",
          });
          lastFetchedCepRef.current = null;
          return;
        }

        clearErrors("cep");

        setValue("cep", formatCEP(sanitizedCep), {
          shouldDirty: true,
        });
        setValue("endereco", postalCode.street ?? "", {
          shouldDirty: true,
        });
        setValue("bairro", postalCode.neighborhood ?? "", {
          shouldDirty: true,
        });
        setValue("cidade", postalCode.city?.name ?? "", {
          shouldDirty: true,
        });
        setValue("estado", postalCode.state.acronym ?? "", {
          shouldDirty: true,
        });
        setValue("complemento", postalCode.complement ?? "", {
          shouldDirty: true,
        });

        const isSameAsExistingCep =
          isEditMode &&
          existingCep &&
          sanitizeCep(existingCep) === sanitizedCep;

        setValue("numero", isSameAsExistingCep ? existingCep : "", {
          shouldDirty: !isSameAsExistingCep,
        });

        setHasFetchedAddress(true);
        setIsNumeroEditable(true);
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        if (lastFetchedCepRef.current !== sanitizedCep) {
          return;
        }

        resetAddressFields();
        setError("cep", {
          type: "manual",
          message: "Não foi possível buscar o CEP",
        });
        toast.error("Erro ao consultar CEP", {
          description: "Verifique a conexão e tente novamente.",
        });
        lastFetchedCepRef.current = null;
      }
    },
    [
      clearErrors,
      existingCep,
      fetchPostalCode,
      isEditMode,
      resetAddressFields,
      setError,
      setValue,
    ]
  );

  useEffect(() => {
    const sanitizedCep = sanitizeCep(cepValue ?? "");

    if (sanitizedCep.length !== 8) {
      if (hasFetchedAddress) {
        resetAddressFields();
      }
      resetPostalCodeLookup();
      clearErrors("cep");
      lastFetchedCepRef.current = null;
      return;
    }

    if (sanitizedCep === lastFetchedCepRef.current && hasFetchedAddress) {
      return;
    }

    lastFetchedCepRef.current = sanitizedCep;
    void handleCepLookup(sanitizedCep);
  }, [
    cepValue,
    clearErrors,
    handleCepLookup,
    hasFetchedAddress,
    resetAddressFields,
    resetPostalCodeLookup,
  ]);

  // Inicializa estado quando em modo de edição
  useEffect(() => {
    if (isEditMode && existingCep) {
      const sanitizedExistingCep = sanitizeCep(existingCep);
      if (sanitizedExistingCep.length === 8) {
        setHasFetchedAddress(true);
        setIsNumeroEditable(true);
        lastFetchedCepRef.current = sanitizedExistingCep;
      }
    }
  }, [isEditMode, existingCep]);

  return {
    handleCepInputChange,
    isFetchingPostalCode,
    isNumeroEditable,
  };
}
