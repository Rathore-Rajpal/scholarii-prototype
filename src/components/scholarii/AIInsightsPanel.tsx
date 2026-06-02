import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  Zap,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert, Recommendation, RiskMetrics } from "@/lib/scholarii/types";

interface AIInsightsPanelProps {
  alerts: Alert[];
  recommendations: Recommendation[];
  riskMetrics: RiskMetrics;
  onAlertClick?: (alert: Alert) => void;
  onActionClick?: (recommendation: Recommendation) => void;
}

export function AIInsightsPanel({
  alerts,
  recommendations,
  riskMetrics,
  onAlertClick,
  onActionClick,
}: AIInsightsPanelProps) {
  // Group alerts by severity
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warningAlerts = alerts.filter((a) => a.severity === "warning");
  const infoAlerts = alerts.filter((a) => a.severity === "info");

  const hasAlerts = alerts.length > 0;

  return (
    <ScrollArea className="h-screen w-full">
      <div className="p-4 space-y-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 z-10 -mx-4 px-4 py-2">
          <h2 className="font-semibold text-sm">AI Insights</h2>
          <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900">
            Live
          </Badge>
        </div>

        {/* Risk Metrics Card */}
        <RiskMetricsCard riskMetrics={riskMetrics} />

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <AlertGroup
            title="Critical"
            severity="critical"
            alerts={criticalAlerts}
            onAlertClick={onAlertClick}
          />
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <AlertGroup
            title="Warnings"
            severity="warning"
            alerts={warningAlerts}
            onAlertClick={onAlertClick}
          />
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-wider">
              Recommendations ({recommendations.length})
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec) => (
                <RecommendationItem
                  key={rec.id}
                  recommendation={rec}
                  onActionClick={onActionClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Info Alerts */}
        {infoAlerts.length > 0 && (
          <AlertGroup
            title="Info"
            severity="info"
            alerts={infoAlerts}
            onAlertClick={onAlertClick}
          />
        )}

        {/* Empty State */}
        {!hasAlerts && recommendations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <CheckCircle2 className="size-8 mb-2 text-emerald-500" />
            <p className="text-sm font-medium">All systems operational</p>
            <p className="text-xs opacity-75 mt-1">No alerts or issues detected</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

// ============================================================================
// Risk Metrics Card Component
// ============================================================================

function RiskMetricsCard({ riskMetrics }: { riskMetrics: RiskMetrics }) {
  return (
    <Card className="p-3 border-2 border-amber-200/50 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
      <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-300">Risk Overview</h3>
      <div className="space-y-1.5 text-xs">
        <RiskMetricRow
          icon="🔴"
          label="At-Risk"
          count={riskMetrics.atRiskStudents}
        />
        <RiskMetricRow
          icon="🟡"
          label="Chronic Absent"
          count={riskMetrics.chronicAbsentees}
        />
        <RiskMetricRow
          icon="💰"
          label="Fee Default"
          count={riskMetrics.feeDefaulters}
        />
        <RiskMetricRow
          icon="⚠️"
          label="Overloaded"
          count={riskMetrics.overloadedTeachers}
        />
      </div>
    </Card>
  );
}

function RiskMetricRow({
  icon,
  label,
  count,
}: {
  icon: string;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <span className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-muted-foreground">{label}</span>
      </span>
      <span className="font-semibold">{count}</span>
    </div>
  );
}

// ============================================================================
// Alert Group Component (with collapse/expand)
// ============================================================================

interface AlertGroupProps {
  title: string;
  severity: "critical" | "warning" | "info";
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

function AlertGroup({ title, severity, alerts, onAlertClick }: AlertGroupProps) {
  const [collapsed, setCollapsed] = useState(false);

  const colorsByType = {
    critical: {
      border: "border-l-red-500 dark:border-l-red-500",
      bg: "bg-red-50/40 dark:bg-red-950/20",
      text: "text-red-700 dark:text-red-300",
      labelBg: "bg-red-100/60 dark:bg-red-900/40",
    },
    warning: {
      border: "border-l-amber-500 dark:border-l-amber-500",
      bg: "bg-amber-50/40 dark:bg-amber-950/20",
      text: "text-amber-700 dark:text-amber-300",
      labelBg: "bg-amber-100/60 dark:bg-amber-900/40",
    },
    info: {
      border: "border-l-sky-500 dark:border-l-sky-500",
      bg: "bg-sky-50/40 dark:bg-sky-950/20",
      text: "text-sky-700 dark:text-sky-300",
      labelBg: "bg-sky-100/60 dark:bg-sky-900/40",
    },
  };

  const colors = colorsByType[severity];

  return (
    <div
      className={cn(
        "border-l-4 rounded-r-md p-3 space-y-1.5 text-xs",
        colors.border,
        colors.bg
      )}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "flex items-center justify-between w-full font-semibold",
          colors.text
        )}
      >
        <span className="flex items-center gap-2">
          {title}
          <Badge variant="secondary" className="text-xs">
            {alerts.length}
          </Badge>
        </span>
        <ChevronDown
          className={cn(
            "size-3 transition-transform duration-200",
            collapsed ? "" : "rotate-180"
          )}
        />
      </button>

      {/* Alert Items */}
      {!collapsed && (
        <div className="space-y-2 mt-2">
          {alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              severity={severity}
              onAlertClick={onAlertClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Alert Item Component
// ============================================================================

interface AlertItemProps {
  alert: Alert;
  severity: "critical" | "warning" | "info";
  onAlertClick?: (alert: Alert) => void;
}

function AlertItem({ alert, severity, onAlertClick }: AlertItemProps) {
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      AlertCircle: <AlertCircle className="size-3.5 flex-shrink-0" />,
      AlertTriangle: <AlertTriangle className="size-3.5 flex-shrink-0" />,
      Info: <Info className="size-3.5 flex-shrink-0" />,
      TrendingDown: <TrendingDown className="size-3.5 flex-shrink-0" />,
    };
    return iconMap[iconName] || <AlertCircle className="size-3.5 flex-shrink-0" />;
  };

  return (
    <div className="space-y-1 pl-0.5">
      <div className="flex items-start gap-2">
        {getIconComponent(alert.icon)}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-xs leading-tight">{alert.title}</p>
          <p className="text-xs opacity-80 leading-snug">{alert.description}</p>
        </div>
      </div>
      {alert.action && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs w-full justify-start hover:bg-black/10 dark:hover:bg-white/10"
          onClick={() => onAlertClick?.(alert)}
        >
          {alert.action.label} →
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// Recommendation Item Component
// ============================================================================

interface RecommendationItemProps {
  recommendation: Recommendation;
  onActionClick?: (recommendation: Recommendation) => void;
}

function RecommendationItem({
  recommendation,
  onActionClick,
}: RecommendationItemProps) {
  const priorityColors = {
    1: "border-emerald-200/60 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300",
    2: "border-blue-200/60 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300",
    3: "border-slate-200/60 dark:border-slate-900/60 bg-slate-50/40 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300",
  };

  return (
    <Card
      className={cn(
        "p-3 border-2 space-y-2 text-xs",
        priorityColors[recommendation.priority]
      )}
    >
      <div className="flex items-start gap-2">
        <Zap className="size-3.5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold leading-tight">{recommendation.title}</h4>
          <p className="opacity-90 leading-snug mt-0.5">{recommendation.description}</p>
          <p className="opacity-75 italic mt-1">{recommendation.reason}</p>
        </div>
      </div>
      <Button
        size="sm"
        className="h-7 px-3 w-full text-xs"
        onClick={() => onActionClick?.(recommendation)}
      >
        {recommendation.actionLabel} →
      </Button>
    </Card>
  );
}
