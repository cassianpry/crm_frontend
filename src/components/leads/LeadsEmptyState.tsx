import { Inbox, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LeadsEmptyStateProps {
  onCreateLead: () => void;
}

const LeadsEmptyState = ({ onCreateLead }: LeadsEmptyStateProps) => {
  return (
    <Card className="border-dashed border-slate-300 bg-white text-center dark:border-slate-700 dark:bg-slate-900/40">
      <CardHeader className="flex flex-col items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200">
          <Inbox className="h-6 w-6" />
        </span>
        <CardTitle>Nenhum lead por aqui ainda</CardTitle>
        <CardDescription className="max-w-md text-balance">
          Cadastre seu primeiro lead para acompanhar o funil, analisar métricas e avançar oportunidades ao próximo estágio.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        <Button
          onClick={onCreateLead}
          className="gap-2 bg-yellow-500 text-black hover:bg-yellow-400 hover:cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Criar lead agora
        </Button>
        <p className="text-xs text-muted-foreground">
          Dica: você pode importar contatos existentes e vinculá-los ao lead depois.
        </p>
      </CardContent>
    </Card>
  );
};

export default LeadsEmptyState;
