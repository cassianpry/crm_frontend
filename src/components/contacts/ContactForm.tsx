import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Building2, Mail, Phone, User, Save, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanies } from "@/hooks/queries/useCompanies";
import {
  useContact,
  useCreateContact,
  useUpdateContact,
} from "@/hooks/queries/useContacts";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";

interface ContactFormProps {
  contactId?: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const ContactForm = ({ contactId, onCancel, onSuccess }: ContactFormProps) => {
  const isEditMode = contactId !== undefined;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyId: 0,
      isActive: true,
    },
  });

  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies({
    pageSize: 100,
  });
  const companyOptions = companiesData?.data ?? [];
  const {
    data: existingContact,
    isLoading: isLoadingContact,
    isFetching: isFetchingContact,
  } = useContact(contactId);

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();

  useEffect(() => {
    if (isEditMode && existingContact) {
      reset({
        name: existingContact.name ?? "",
        email: existingContact.email ?? "",
        phone: existingContact.phone ? String(existingContact.phone) : "",
        companyId:
          existingContact.companyId ?? existingContact.company?.id ?? 0,
        isActive: existingContact.isActive ?? true,
      });
    }
  }, [isEditMode, existingContact, reset]);

  const isLoadingInitialData =
    isEditMode && (isLoadingContact || isFetchingContact);
  const isSubmitting = createContact.isPending || updateContact.isPending;

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const parsedData = contactSchema.parse(values);
      if (isEditMode) {
        await updateContact.mutateAsync({
          id: contactId!,
          data: parsedData,
        });
        toast.success("Contato atualizado com sucesso!", {
          description: `${values.name} foi atualizado(a).`,
        });
      } else {
        await createContact.mutateAsync(parsedData);
        toast.success("Contato cadastrado com sucesso!", {
          description: `${values.name} foi adicionado(a) ao sistema.`,
        });
      }
      onSuccess();
    } catch (error) {
      const action = isEditMode ? "atualizar" : "cadastrar";
      console.error(`Erro ao ${action} contato:`, error);
      toast.error(`Erro ao ${action} contato`, {
        description: "Não foi possível concluir a operação. Tente novamente.",
      });
    }
  };

  if (isLoadingInitialData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Nome completo"
                className="pl-10"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com"
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                className="pl-10"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId">Empresa *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Controller
                control={control}
                name="companyId"
                render={({ field }) => {
                  const hasOptions = companyOptions.length > 0;
                  const selectValue = field.value ? String(field.value) : "";

                  return (
                    <Select
                      value={selectValue}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={isLoadingCompanies || !hasOptions}
                    >
                      <SelectTrigger className="w-full justify-between pl-10 hover:cursor-pointer hover:bg-yellow-400">
                        <SelectValue placeholder={hasOptions ? "Selecione uma empresa" : "Nenhuma empresa disponível"} />
                      </SelectTrigger>
                      <SelectContent>
                        {companyOptions.map((company) => (
                          <SelectItem
                            key={company.id}
                            value={String(company.id)}
                            className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                          >
                            {company.nomeFantasia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
            {errors.companyId && (
              <p className="text-sm text-red-500">{errors.companyId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Status *</Label>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(value) => field.onChange(value === "true")}
                >
                  <SelectTrigger className="w-full justify-between hover:cursor-pointer hover:bg-yellow-400">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="true"
                      className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                    >
                      Ativo
                    </SelectItem>
                    <SelectItem
                      value="false"
                      className="hover:bg-yellow-100! data-[state=checked]:bg-yellow-400"
                    >
                      Inativo
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.isActive && (
              <p className="text-sm text-red-500">{errors.isActive.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <Button
            type="button"
            className="bg-red-500 text-white hover:bg-red-400 hover:cursor-pointer"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 hover:cursor-pointer text-black"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? "Atualizar Contato" : "Salvar Contato"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ContactForm;
