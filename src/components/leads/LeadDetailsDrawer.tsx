import { Building2, Mail, Phone, NotebookPen, Activity, Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Lead, LeadStage } from "@/types/lead";
import { LEAD_ORIGIN_LABELS, LEAD_STAGE_LABELS } from "@/types/lead";
import { formatPhone } from "@/lib/formatters";

const STAGE_BADGE_STYLES: Record<LeadStage, string> = {
  NEW: "bg-emerald-100 text-emerald-900",
  QUALIFICATION: "bg-blue-100 text-blue-800",
  PROPOSAL: "bg-purple-100 text-purple-800",
  FOLLOW_UP: "bg-amber-100 text-amber-800",
  WON: "bg-emerald-100 text-emerald-900",
  LOST: "bg-rose-100 text-rose-900",
};

interface LeadDetailsDrawerProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (leadId: number) => void;
  onDelete?: (lead: Lead) => void;
}

const formatDateTime = (value: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LeadDetailsDrawer = ({ lead, open, onOpenChange, onEdit, onDelete }: LeadDetailsDrawerProps) => {
  const handleEdit = () => {
    if (lead && onEdit) onEdit(lead.id);
  };

  const handleDelete = () => {
    if (lead && onDelete) onDelete(lead);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-6 overflow-y-auto pb-6 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3 pr-10">
            <span>{lead?.name ?? "Lead"}</span>
            {lead && (
              <Badge className={STAGE_BADGE_STYLES[lead.stage]}>{LEAD_STAGE_LABELS[lead.stage]}</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Visualize informações detalhadas, histórico e próximos passos do lead.
          </DialogDescription>
        </DialogHeader>

        {!lead ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-sm text-muted-foreground dark:border-slate-800">
            Nenhum lead selecionado.
          </div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{lead.email ?? "E-mail não informado"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{lead.phone ? formatPhone(lead.phone) : "Telefone não informado"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  <span>
                    Origem: {lead.origin ? LEAD_ORIGIN_LABELS[lead.origin] : "Não informada"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <NotebookPen className="h-4 w-4" />
                  <span>Próximo passo: {lead.nextStep ? lead.nextStep : "—"}</span>
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Associação
              </h3>
              <div className="grid gap-4 text-sm">
                <div className="flex items-start gap-2 rounded-md border border-slate-200 p-3 dark:border-slate-800">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Empresa</p>
                    {lead.company ? (
                      <div className="text-muted-foreground">
                        <p>{lead.company.nomeFantasia}</p>
                        <p className="text-xs">{lead.company.razaoSocial}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Lead ainda não está associado a uma empresa.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 p-3 text-muted-foreground dark:border-slate-800">
                  <p className="font-medium">Contato</p>
                  {lead.contact ? (
                    <div className="mt-1 space-y-1 text-sm">
                      <p>{lead.contact.name}</p>
                      {lead.contact.email && <p className="text-xs">{lead.contact.email}</p>}
                      {lead.contact.phone && (
                        <p className="text-xs">{formatPhone(lead.contact.phone)}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">Nenhum contato vinculado.</p>
                  )}
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Histórico
              </h3>
              <div className="grid gap-3 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Criado em:</span> {formatDateTime(lead.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Atualizado em:</span> {formatDateTime(lead.updatedAt)}
                </div>
                <div>
                  <span className="font-medium">Última interação:</span> {formatDateTime(lead.lastInteractionAt)}
                </div>
                <div>
                  <span className="font-medium">Próxima interação:</span> {formatDateTime(lead.nextStepAt)}
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Observações
              </h3>
              <p className="rounded-md border border-dashed border-slate-200 p-3 text-sm text-muted-foreground dark:border-slate-800">
                {lead.notes ? lead.notes : "Sem observações registradas."}
              </p>
            </section>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:justify-end">
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              className="gap-2 bg-yellow-500 text-black hover:bg-yellow-400 hover:cursor-pointer border-none"
              onClick={handleEdit}
              disabled={!lead}
            >
              <Pencil className="h-4 w-4" />
              Editar lead
            </Button>
          )}
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              className="gap-2 hover:cursor-pointer"
              onClick={handleDelete}
              disabled={!lead}
            >
              <Trash2 className="h-4 w-4" />
              Arquivar lead
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDrawer;
