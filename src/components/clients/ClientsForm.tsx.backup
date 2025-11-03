import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Phone,
  User,
  Plus,
  Search,
  Save,
  Pencil,
  XCircle,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateCompany,
  useUpdateCompany,
  useCompany,
} from "@/hooks/queries/useCompanies";
import {
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from "@/hooks/queries/useContacts";
import { usePostalCodeLookup } from "@/hooks/usePostalCodeLookup";
import { companySchema, type CompanyFormData } from "@/lib/validations/company";
import {
  formatCEP,
  formatPhone,
  maskCep,
  maskPhone,
  sanitizeCep,
  sanitizePhone,
} from "@/lib/formatters";
import type { CreateCompanyDto } from "@/types/company";
import type { Contact } from "@/types/company";

interface ClientsFormProps {
  clientId?: number;
}

const ClientsForm = ({ clientId }: ClientsFormProps) => {
  const navigate = useNavigate();
  const isEditMode = !!clientId;
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContactMutation = useDeleteContact();
  const { data: existingClient, isLoading: isLoadingClient } = useCompany(
    clientId!
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const { fetchPostalCode, isFetchingPostalCode, resetPostalCodeLookup } =
    usePostalCodeLookup();

  const [hasFetchedAddress, setHasFetchedAddress] = useState(false);
  const [isNumeroEditable, setIsNumeroEditable] = useState(false);
  const lastFetchedCepRef = useRef<string | null>(null);

  const cepValue = watch("cep");

  const handleCepInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const maskedCep = maskCep(event.target.value);
      event.target.value = maskedCep;
      clearErrors("cep");
    },
    [clearErrors]
  );

  const cepField = register("cep", { onChange: handleCepInputChange });

  const handlePhoneInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const maskedPhone = maskPhone(event.target.value);
      event.target.value = maskedPhone;
    },
    []
  );

  const contactPhoneField = register("contact.phone", {
    onChange: handlePhoneInputChange,
  });

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
          existingClient &&
          sanitizeCep(existingClient.cep ?? "") === sanitizedCep;

        setValue("numero", isSameAsExistingCep ? existingClient.numero : "", {
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
      existingClient,
      fetchPostalCode,
      isEditMode,
      resetAddressFields,
      setError,
      setValue,
    ]
  );

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
      setHasFetchedAddress(true);
      setIsNumeroEditable(true);
      lastFetchedCepRef.current =
        sanitizedExistingCep.length === 8 ? sanitizedExistingCep : null;
    }
  }, [isEditMode, existingClient, reset]);

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

  const buildCompanyPayload = (formData: CompanyFormData): CreateCompanyDto => {
    return {
      ...formData,
      contact: {
        ...formData.contact,
        phone: formData.contact.phone
          ? Number(sanitizePhone(formData.contact.phone))
          : undefined,
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

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setContactFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone ? formatPhone(String(contact.phone)) : "",
    });
  };

  const handleCloseModal = () => {
    setEditingContact(null);
    setIsAddingContact(false);
    setContactFormData({ name: "", email: "", phone: "" });
  };

  const handleAddNewContact = () => {
    setIsAddingContact(true);
    setContactFormData({ name: "", email: "", phone: "" });
  };

  // Filtra os contatos com base no termo de pesquisa
  const filteredContacts =
    existingClient?.contacts.filter((contact) => {
      const search = contactSearchTerm.toLowerCase();
      return (
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        (contact.phone && String(contact.phone).toLowerCase().includes(search))
      );
    }) || [];

  const handleSaveContact = async () => {
    if (isAddingContact) {
      // Criar novo contato
      try {
        await createContact.mutateAsync({
          name: contactFormData.name,
          email: contactFormData.email,
          phone: contactFormData.phone
            ? Number(sanitizePhone(contactFormData.phone))
            : undefined,
          companyId: clientId!,
        });
        toast.success("Contato adicionado com sucesso!", {
          description: `${contactFormData.name} foi adicionado.`,
        });
        handleCloseModal();
      } catch (error) {
        console.error("Erro ao adicionar contato:", error);
        toast.error("Erro ao adicionar contato", {
          description: "Não foi possível adicionar o contato. Tente novamente.",
        });
      }
    } else if (editingContact) {
      // Atualizar contato existente
      try {
        await updateContact.mutateAsync({
          id: editingContact.id!,
          data: {
            ...contactFormData,
            phone: contactFormData.phone
              ? Number(sanitizePhone(contactFormData.phone))
              : undefined,
          },
        });
        toast.success("Contato atualizado com sucesso!", {
          description: `${contactFormData.name} foi atualizado.`,
        });
        handleCloseModal();
      } catch (error) {
        console.error("Erro ao atualizar contato:", error);
        toast.error("Erro ao atualizar contato", {
          description: "Não foi possível atualizar o contato. Tente novamente.",
        });
      }
    }
  };

  if (isEditMode && isLoadingClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Editar" : "Cadastrar"} Cliente</CardTitle>
          <CardDescription>
            {isEditMode
              ? "Atualize as informações do cliente"
              : "Informações básicas da empresa"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                {...register("cnpj")}
              />
              {errors.cnpj && (
                <p className="text-sm text-red-500">{errors.cnpj.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="razaoSocial">Razão Social *</Label>
              <Input
                id="razaoSocial"
                placeholder="Razão Social"
                {...register("razaoSocial")}
              />
              {errors.razaoSocial && (
                <p className="text-sm text-red-500">
                  {errors.razaoSocial.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
              <Input
                id="nomeFantasia"
                placeholder="Nome Fantasia"
                {...register("nomeFantasia")}
              />
              {errors.nomeFantasia && (
                <p className="text-sm text-red-500">
                  {errors.nomeFantasia.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industria">Indústria *</Label>
              <Input
                id="industria"
                placeholder="Ex: Tecnologia, Varejo, etc."
                {...register("industria")}
              />
              {errors.industria && (
                <p className="text-sm text-red-500">
                  {errors.industria.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
          <CardDescription>Localização da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço *</Label>
              <Input
                id="endereco"
                placeholder="Rua, Avenida, etc."
                disabled
                {...register("endereco")}
              />
              {errors.endereco && (
                <p className="text-sm text-red-500">
                  {errors.endereco.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                placeholder="123"
                disabled={!isNumeroEditable}
                {...register("numero")}
              />
              {errors.numero && (
                <p className="text-sm text-red-500">{errors.numero.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                placeholder="Apto, Sala, etc."
                //disabled
                {...register("complemento")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input
                id="bairro"
                placeholder="Bairro"
                disabled
                {...register("bairro")}
              />
              {errors.bairro && (
                <p className="text-sm text-red-500">{errors.bairro.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <div className="relative">
                <Input
                  id="cep"
                  placeholder="00000-000"
                  maxLength={9}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  {...cepField}
                />
                {isFetchingPostalCode && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
                )}
              </div>
              {errors.cep && (
                <p className="text-sm text-red-500">{errors.cep.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                placeholder="Cidade"
                disabled
                {...register("cidade")}
              />
              {errors.cidade && (
                <p className="text-sm text-red-500">{errors.cidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Input
                id="estado"
                placeholder="SP"
                maxLength={2}
                disabled
                {...register("estado")}
              />
              {errors.estado && (
                <p className="text-sm text-red-500">{errors.estado.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {!isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
            <CardDescription>Informações de contato principal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact.name">Nome do Contato *</Label>
                <Input
                  id="contact.name"
                  placeholder="Nome completo"
                  {...register("contact.name")}
                />
                {errors.contact?.name && (
                  <p className="text-sm text-red-500">
                    {errors.contact.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact.email">Email *</Label>
                <Input
                  id="contact.email"
                  type="email"
                  placeholder="contato@empresa.com"
                  {...register("contact.email")}
                />
                {errors.contact?.email && (
                  <p className="text-sm text-red-500">
                    {errors.contact.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact.phone">Telefone</Label>
                <Input
                  id="contact.phone"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  inputMode="tel"
                  autoComplete="tel"
                  {...contactPhoneField}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isEditMode && existingClient && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Contatos Cadastrados</CardTitle>
                <CardDescription>
                  Lista de todos os contatos vinculados a este cliente
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                {existingClient.contacts.length > 0 && (
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Pesquisar por nome, email ou telefone..."
                      value={contactSearchTerm}
                      onChange={(e) => setContactSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  onClick={handleAddNewContact}
                  className="bg-yellow-500 hover:bg-yellow-400 hover:cursor-pointer whitespace-nowrap text-black"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Contato
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {existingClient.contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum contato cadastrado ainda.</p>
                <p className="text-sm mt-2">
                  Clique em "Adicionar Contato" para incluir o primeiro contato.
                </p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum contato encontrado com os critérios de pesquisa.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nome
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Telefone
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow
                        key={contact.id}
                        className="hover:bg-yellow-100"
                      >
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>
                          {contact.phone ? String(contact.phone) : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              contact.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {contact.isActive ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              className="hover:cursor-pointer hover:bg-yellow-400!"
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditContact(contact)}
                              title="Editar contato"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              className="hover:bg-red-300! text-red-500! hover:cursor-pointer"
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={deleteContactMutation.isPending}
                              onClick={() =>
                                void deleteContactMutation.mutateAsync(
                                  contact.id!,
                                  {
                                    onSuccess: () => {
                                      toast.success("Contato removido", {
                                        description: `${contact.name} foi excluído.`,
                                      });
                                    },
                                    onError: (error) => {
                                      console.error(
                                        "Erro ao excluir contato:",
                                        error
                                      );
                                      toast.error("Erro ao remover contato", {
                                        description:
                                          "Tente novamente em instantes.",
                                      });
                                    },
                                  }
                                )
                              }
                              title="Excluir contato"
                            >
                              {deleteContactMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog
        open={!!editingContact || isAddingContact}
        onOpenChange={handleCloseModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddingContact ? "Adicionar Contato" : "Editar Contato"}
            </DialogTitle>
            <DialogDescription>
              {isAddingContact
                ? "Preencha as informações do novo contato"
                : "Atualize as informações do contato"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome *</Label>
              <Input
                id="edit-name"
                value={contactFormData.name}
                onChange={(e) =>
                  setContactFormData({
                    ...contactFormData,
                    name: e.target.value,
                  })
                }
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={contactFormData.email}
                onChange={(e) =>
                  setContactFormData({
                    ...contactFormData,
                    email: e.target.value,
                  })
                }
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={contactFormData.phone}
                onChange={(e) =>
                  setContactFormData({
                    ...contactFormData,
                    phone: e.target.value,
                  })
                }
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-red-500 hover:bg-red-400 hover:cursor-pointer text-white!"
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={createContact.isPending || updateContact.isPending}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              className="bg-yellow-500 text-black hover:cursor-pointer hover:bg-yellow-400"
              type="button"
              onClick={handleSaveContact}
              disabled={createContact.isPending || updateContact.isPending}
            >
              {(createContact.isPending || updateContact.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isAddingContact ? (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between gap-4">
        <Button
          className="bg-red-500 text-white hover:bg-red-400 hover:cursor-pointer"
          type="button"
          variant="outline"
          onClick={() => navigate("/clientes")}
          disabled={isSubmitting}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <div className="flex gap-4">
          {!isEditMode && (
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Limpar
            </Button>
          )}
          <Button
            className="bg-yellow-500 hover:bg-yellow-400 hover:cursor-pointer text-black"
            type="submit"
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Atualizar" : "Salvar"} Cliente
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ClientsForm;
