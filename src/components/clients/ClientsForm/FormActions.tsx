import { Loader2, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onReset?: () => void;
}

export function FormActions({
  isEditMode,
  isSubmitting,
  onCancel,
  onReset,
}: FormActionsProps) {
  return (
    <div className="flex justify-between gap-4">
      <Button
        className="bg-red-500 text-white hover:bg-red-400 hover:cursor-pointer"
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <XCircle className="mr-2 h-4 w-4" />
        Cancelar
      </Button>
      <div className="flex gap-4">
        {!isEditMode && onReset && (
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
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
  );
}
