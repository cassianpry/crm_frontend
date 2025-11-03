import { useState } from "react";
import { toast } from "sonner";
import { useDeleteCompany } from "@/hooks/queries/useCompanies";
import type { DeleteDialogState } from "../../components/clients/ClientsList/types";

export function useDeleteDialog() {
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    company: null,
  });
  const deleteCompany = useDeleteCompany();

  const handleDeleteClick = (id: number, nomeFantasia: string) => {
    setDeleteDialog({ open: true, company: { id, nomeFantasia } });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.company) return;

    try {
      await deleteCompany.mutateAsync(deleteDialog.company.id);
      setDeleteDialog({ open: false, company: null });
      toast.success("Cliente excluído com sucesso!", {
        description: `${deleteDialog.company.nomeFantasia} foi removido do sistema.`,
      });
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error("Erro ao excluir cliente", {
        description: "Não foi possível excluir o cliente. Tente novamente.",
      });
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, company: null });
  };

  return {
    deleteDialog,
    setDeleteDialog,
    handleDeleteClick,
    handleConfirmDelete,
    closeDeleteDialog,
    isDeleting: deleteCompany.isPending,
  };
}
