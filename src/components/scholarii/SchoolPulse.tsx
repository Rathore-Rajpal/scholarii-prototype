import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { SchoolPulseSector, OperationalSummary } from "@/lib/scholarii/types";

const STATUS_LABELS = {
  healthy: "Healthy",
  moderate: "Moderate",
  attention: "Attention Needed",
} as const;

interface SchoolPulseDetail {
  metric: string;
  currentValue: string;
  target?: string;
  status: string;
  reason: string;
  calculation: string;
  recommendation?: string;
}

interface SchoolPulseProps {
  sectors: SchoolPulseSector[];
  summary: OperationalSummary;
  details?: Record<string, SchoolPulseDetail>;
}

function StatusBadge({ status }: { status: "healthy" | "moderate" | "attention" }) {
  const styles = {
    healthy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900",
    moderate: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900",
    attention: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900",
  };

  const icons = {
    healthy: <CheckCircle2 className="size-4" />,
    moderate: <AlertTriangle className="size-4" />,
    attention: <AlertCircle className="size-4" />,
  };

  const labels = {
    healthy: STATUS_LABELS.healthy,
    moderate: STATUS_LABELS.moderate,
    attention: STATUS_LABELS.attention,
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", styles[status])}>
      {icons[status]}
      <span>{labels[status]}</span>
    </div>
  );
}

export function SchoolPulse({ sectors, summary, details }: SchoolPulseProps) {
  return (
    <Card className="p-6 border border-border">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-lg font-semibold tracking-tight">School Pulse</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time operational health snapshot</p>
        </div>

        {/* Operational Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {sectors.map((sector) => {
            const detail = details?.[sector.name];

            return (
              <Popover key={sector.name}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "rounded-lg p-3 border-2 transition-all text-left hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      sector.status === "healthy"
                        ? "border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-900"
                        : sector.status === "moderate"
                        ? "border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900"
                        : "border-red-200 bg-red-50/40 dark:bg-red-950/20 dark:border-red-900"
                    )}
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">{sector.name}</h3>
                      <StatusBadge status={sector.status} />
                      {sector.value && <p className="text-xs font-semibold text-foreground">{sector.value}</p>}
                      {sector.description && <p className="text-xs text-muted-foreground">{sector.description}</p>}
                      <p className="text-[11px] text-muted-foreground">View details</p>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-80">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold">{sector.name}</h4>
                      {detail?.metric && (
                        <p className="text-xs text-muted-foreground">{detail.metric}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        Current value
                      </p>
                      <p className="text-sm font-semibold">
                        {detail?.currentValue || sector.value || "Not available"}
                      </p>
                      {detail?.target && (
                        <p className="text-xs text-muted-foreground">Target: {detail.target}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        Reason
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {detail?.reason || "Status based on current readings."}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        Status
                      </p>
                      <p className="text-xs font-medium">
                        {detail?.status || STATUS_LABELS[sector.status]}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        How status is calculated
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {detail?.calculation || "Threshold-based evaluation."}
                      </p>
                    </div>

                    {detail?.recommendation && (
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                          Recommended action
                        </p>
                        <p className="text-xs text-muted-foreground">{detail.recommendation}</p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>

        {/* AI-Generated Operational Summary */}
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-medium mb-2">Operational Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary.text}</p>

          {/* Key Issues List (if any) */}
          {summary.keyIssues.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Key Issues:</p>
              <ul className="space-y-1">
                {summary.keyIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="size-3 mt-0.5 flex-shrink-0 text-amber-500" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
