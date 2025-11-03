import { useCallback, useMemo } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { maskPhone } from "@/lib/formatters";

// Hooks

// Sections

// Components
import { ContactDialog } from "./ClientsForm/ContactDialog";
import { FormActions } from "./ClientsForm/FormActions";
import { CompanyInfoSection } from "./ClientsForm/sections/CompanyInfoSection";
import { AddressSection } from "./ClientsForm/sections/AddressSection";
import { ContactSection } from "./ClientsForm/sections/ContactSection";
import { ContactsListSection } from "./ClientsForm/sections/ContactsListSection";
import { useClientForm } from "@/hooks/Clients/useClientForm";
import { useCepLookup } from "@/hooks/Clients/useCepLookup";
import { useContactsManager } from "@/hooks/Clients/useContactsManager";

interface ClientsFormProps {
  clientId?: number;
}

const ClientsForm = ({ clientId }: ClientsFormProps) => {
  const navigate = useNavigate();
  const {
    form,
    existingClient,
    isLoadingClient,
    isEditMode,
    isSubmitting,
    onSubmit,
  } = useClientForm(clientId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
  } = form;

  const cepValue = watch("cep");

  const { handleCepInputChange, isFetchingPostalCode, isNumeroEditable } =
    useCepLookup({
      setValue,
      clearErrors,
      setError,
      cepValue,
      isEditMode,
      existingCep: existingClient?.cep,
    });

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

  const {
    editingContact,
    isAddingContact,
    contactSearchTerm,
    setContactSearchTerm,
    contactFormData,
    setContactFormData,
    handleEditContact,
    handleCloseModal,
    handleAddNewContact,
    handleSaveContact,
    handleDeleteContact,
    createContact,
    updateContact,
    deleteContactMutation,
  } = useContactsManager(clientId);

  // Filtra os contatos com base no termo de pesquisa
  const filteredContacts = useMemo(() => {
    if (!existingClient?.contacts) return [];
    const search = contactSearchTerm.toLowerCase();
    return existingClient.contacts.filter((contact) => {
      return (
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        (contact.phone && String(contact.phone).toLowerCase().includes(search))
      );
    });
  }, [existingClient?.contacts, contactSearchTerm]);

  if (isEditMode && isLoadingClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CompanyInfoSection
        register={register}
        errors={errors}
        isEditMode={isEditMode}
      />

      <AddressSection
        register={register}
        errors={errors}
        cepField={cepField}
        isFetchingPostalCode={isFetchingPostalCode}
        isNumeroEditable={isNumeroEditable}
      />

      {!isEditMode && (
        <ContactSection
          register={register}
          errors={errors}
          contactPhoneField={contactPhoneField}
        />
      )}

      {isEditMode && existingClient && (
        <ContactsListSection
          contacts={existingClient.contacts}
          filteredContacts={filteredContacts}
          searchTerm={contactSearchTerm}
          onSearchChange={setContactSearchTerm}
          onAddContact={handleAddNewContact}
          onEditContact={handleEditContact}
          onDeleteContact={handleDeleteContact}
          isDeleting={deleteContactMutation.isPending}
        />
      )}

      <ContactDialog
        open={!!editingContact || isAddingContact}
        isAdding={isAddingContact}
        contactFormData={contactFormData}
        onClose={handleCloseModal}
        onSave={handleSaveContact}
        onFormDataChange={setContactFormData}
        isSaving={createContact.isPending || updateContact.isPending}
      />

      <FormActions
        isEditMode={isEditMode}
        isSubmitting={isSubmitting}
        onCancel={() => navigate("/clientes")}
        onReset={() => reset()}
      />
    </form>
  );
};

export default ClientsForm;
