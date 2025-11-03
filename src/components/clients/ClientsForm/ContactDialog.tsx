import { Loader2, Plus, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ContactFormData } from "@/types/company";

interface ContactDialogProps {
  open: boolean;
  isAdding: boolean;
  contactFormData: ContactFormData;
  onClose: () => void;
  onSave: () => void;
  onFormDataChange: (data: ContactFormData) => void;
  isSaving: boolean;
}

export function ContactDialog({
  open,
  isAdding,
  contactFormData,
  onClose,
  onSave,
  onFormDataChange,
  isSaving,
}: ContactDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isAdding ? "Adicionar Contato" : "Editar Contato"}
          </DialogTitle>
          <DialogDescription>
            {isAdding
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
                onFormDataChange({
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
                onFormDataChange({
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
                onFormDataChange({
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
            onClick={onClose}
            disabled={isSaving}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            className="bg-yellow-500 text-black hover:cursor-pointer hover:bg-yellow-400"
            type="button"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAdding ? (
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
  );
}
