import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DeleteDialogState } from "@/types/company";

interface DeleteConfirmDialogProps {
  deleteDialog: DeleteDialogState;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmDialog({
  deleteDialog,
  onOpenChange,
  onConfirmDelete,
  onCancel,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={deleteDialog.open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cliente{" "}
            <span className="font-semibold">
              {deleteDialog.company?.nomeFantasia}
            </span>
            ? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
