import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from "@/hooks/queries/useContacts";
import { formatPhone, sanitizePhone } from "@/lib/formatters";
import type { Contact, ContactFormData } from "@/types/company";

export function useContactsManager(clientId?: number) {
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
  });

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContactMutation = useDeleteContact();

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

  const handleSaveContact = async () => {
    if (isAddingContact) {
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

  const handleDeleteContact = async (
    contactId: number,
    contactName: string
  ) => {
    try {
      await deleteContactMutation.mutateAsync(contactId);
      toast.success("Contato removido", {
        description: `${contactName} foi excluído.`,
      });
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      toast.error("Erro ao remover contato", {
        description: "Tente novamente em instantes.",
      });
    }
  };

  return {
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
  };
}
