import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateCompany,
  useUpdateCompany,
  useCompany,
} from "@/hooks/queries/useCompanies";
import { companySchema, type CompanyFormData } from "@/lib/validations/company";
import { formatCEP, formatPhone, sanitizeCep } from "@/lib/formatters";
import type { CreateCompanyDto } from "@/types/company";

export function useClientForm(clientId?: number) {
  const navigate = useNavigate();
  const isEditMode = !!clientId;

  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const { data: existingClient, isLoading: isLoadingClient } = useCompany(
    clientId!
  );

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const { reset } = form;

  // Preenche o formulário quando estiver em modo de edição
  useEffect(() => {
    if (isEditMode && existingClient) {
      const primaryContact = existingClient.contacts?.[0];
      const sanitizedExistingCep = sanitizeCep(existingClient.cep ?? "");
      reset({
        cnpj: existingClient.cnpj,
        razaoSocial: existingClient.razaoSocial,
        nomeFantasia: existingClient.nomeFantasia,
        industria: existingClient.industria,
        endereco: existingClient.endereco,
        numero: existingClient.numero,
        complemento: existingClient.complemento || "",
        bairro: existingClient.bairro,
        cep:
          sanitizedExistingCep.length === 8
            ? formatCEP(sanitizedExistingCep)
            : existingClient.cep,
        cidade: existingClient.cidade,
        estado: existingClient.estado,
        contact: {
          name: primaryContact?.name || "",
          email: primaryContact?.email || "",
          phone: primaryContact?.phone
            ? formatPhone(String(primaryContact.phone))
            : "",
        },
      });
    }
  }, [isEditMode, existingClient, reset]);

  const buildCompanyPayload = (formData: CompanyFormData): CreateCompanyDto => {
    const phoneDigits = formData.contact.phone.replace(/\D/g, "");

    return {
      ...formData,
      contact: {
        ...formData.contact,
        phone: phoneDigits ? Number(phoneDigits) : undefined,
      },
    };
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const payload = buildCompanyPayload(data);
      if (isEditMode) {
        await updateCompany.mutateAsync({ id: clientId!, data: payload });
        toast.success("Cliente atualizado com sucesso!", {
          description: `${data.nomeFantasia} foi atualizado.`,
        });
      } else {
        await createCompany.mutateAsync(payload);
        toast.success("Cliente cadastrado com sucesso!", {
          description: `${data.nomeFantasia} foi adicionado ao sistema.`,
        });
      }
      navigate("/clientes");
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? "atualizar" : "cadastrar"} cliente:`,
        error
      );
      toast.error(`Erro ao ${isEditMode ? "atualizar" : "cadastrar"} cliente`, {
        description: `Não foi possível ${
          isEditMode ? "atualizar" : "cadastrar"
        } o cliente. Tente novamente.`,
      });
    }
  };

  const isSubmitting = createCompany.isPending || updateCompany.isPending;

  return {
    form,
    existingClient,
    isLoadingClient,
    isEditMode,
    isSubmitting,
    onSubmit,
  };
}
