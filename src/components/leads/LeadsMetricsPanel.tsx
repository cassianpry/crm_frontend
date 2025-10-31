import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { LeadMetrics, LeadOrigin } from "@/types/lead";
import {
  LEAD_ORIGINS,
  LEAD_ORIGIN_LABELS,
  LEAD_STAGES,
  LEAD_STAGE_LABELS,
} from "@/types/lead";

interface LeadsMetricsPanelProps {
  metrics?: LeadMetrics;
  isLoading?: boolean;
}

const numberFormatter = new Intl.NumberFormat("pt-BR");

const ORIGIN_KEYS: ReadonlyArray<LeadOrigin | "UNSPECIFIED"> = [
  "UNSPECIFIED",
  ...LEAD_ORIGINS,
];

const LeadsMetricsPanel = ({ metrics, isLoading = false }: LeadsMetricsPanelProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Métricas de Leads</CardTitle>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  const { total, perStage, perOrigin } = metrics;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Métricas de Leads</CardTitle>
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-dashed border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-medium text-muted-foreground">
                Total de leads ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{numberFormatter.format(total)}</p>
            </CardContent>
          </Card>

          <Card className="border-dashed border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-medium text-muted-foreground">
                Estágios
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {LEAD_STAGES.map((stage) => (
                <div key={stage} className="flex items-center justify-between text-sm">
                  <span>{LEAD_STAGE_LABELS[stage]}</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-900">
                    {numberFormatter.format(perStage[stage] ?? 0)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-dashed border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-medium text-muted-foreground">
                Origens
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {ORIGIN_KEYS.map((origin) => (
                <div key={origin} className="flex items-center justify-between text-sm">
                  <span>
                    {origin === "UNSPECIFIED" ? "Não informada" : LEAD_ORIGIN_LABELS[origin]}
                  </span>
                  <Badge variant="outline" className="border-yellow-200 text-yellow-900">
                    {numberFormatter.format(perOrigin[origin] ?? 0)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsMetricsPanel;
