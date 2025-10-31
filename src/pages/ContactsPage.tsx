import { useState } from "react";
import ContactsList from "@/components/contacts/ContactsList";
import ContactForm from "@/components/contacts/ContactForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";

const ContactsPage = () => {
  const [modalState, setModalState] = useState<{
    open: boolean;
    contactId?: number;
    mode: "create" | "edit";
  }>({ open: false, contactId: undefined, mode: "create" });

  const handleCloseModal = () => {
    setModalState({ open: false, contactId: undefined, mode: "create" });
  };

  const handleCreateContact = () => {
    setModalState({ open: true, contactId: undefined, mode: "create" });
  };

  const handleEditContact = (contactId: number) => {
    setModalState({ open: true, contactId, mode: "edit" });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os contatos cadastrados no sistema
          </p>
        </div>
        <Button
          onClick={handleCreateContact}
          className="bg-yellow-500 hover:bg-yellow-400 hover:cursor-pointer text-black font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Contato
        </Button>
      </div>

      <ContactsList onEditContact={handleEditContact} />

      <Dialog
        open={modalState.open}
        onOpenChange={(open) =>
          setModalState((prev) => ({
            open,
            contactId: open ? prev.contactId : undefined,
            mode: open ? prev.mode : "create",
          }))
        }
      >
        <DialogContent
          className="max-w-[988px] w-full"
          style={{ width: "988px", maxWidth: "calc(100vw - 32px)" }}
          showCloseButton={false}
        >
          <DialogClose className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 cursor-pointer hover:cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <X />
          </DialogClose>
          <DialogHeader>
            <DialogTitle>
              {modalState.mode === "edit" ? "Editar Contato" : "Novo Contato"}
            </DialogTitle>
            <DialogDescription>
              {modalState.mode === "edit"
                ? "Atualize as informações do contato selecionado"
                : "Preencha os dados para cadastrar um novo contato"}
            </DialogDescription>
          </DialogHeader>
          <ContactForm
            contactId={modalState.contactId}
            onCancel={handleCloseModal}
            onSuccess={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsPage;
