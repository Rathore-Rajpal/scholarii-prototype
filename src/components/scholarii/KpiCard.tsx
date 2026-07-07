import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Tone = "success" | "warning" | "info" | "default";

const toneStyles: Record<Tone, string> = {
  success: "from-emerald-500/10 to-emerald-600/5",
  warning: "from-amber-500/10 to-amber-600/5",
  info: "from-violet-500/10 to-violet-600/5",
  default: "from-slate-500/10 to-slate-600/5",
};

const iconBg: Record<Tone, string> = {
  success: "bg-emerald-500/10",
  warning: "bg-amber-500/10",
  info: "bg-violet-500/10",
  default: "bg-slate-500/10",
};

interface KpiCardProps {
  icon?: LucideIcon;
  iconNode?: ReactNode;
  label: string;
  value: string;
  tone?: Tone;
  accent?: string;
  trend?: "up" | "down" | "stable";
  trendLabel?: string;
  change?: string;
  positive?: boolean;
}

export function KpiCard({
  icon: Icon,
  iconNode,
  label,
  value,
  tone = "default",
  accent,
  trend,
  trendLabel,
  change,
  positive,
}: KpiCardProps) {
  const gradientBg = accent
    ? `bg-gradient-to-br ${accent}`
    : `bg-gradient-to-br ${iconBg[tone]}`;

  return (
    <Card className="relative overflow-hidden p-4 min-h-[130px] sm:min-h-[140px] h-full flex flex-col justify-between">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent || toneStyles[tone]} opacity-50`} />
      <div className="relative">
        <div className={`${gradientBg} rounded-xl p-2 w-fit shadow-md`}>
          {Icon && <Icon className="size-5 text-white" />}
          {iconNode}
        </div>
      </div>
      <div className="relative">
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-2 min-h-[2rem]">
          {label}
        </p>
        <p className="text-lg sm:text-xl font-bold tracking-tight">{value}</p>
        {(trend && trendLabel) && (
          <div className="flex items-start gap-1 mt-0.5 min-h-[2rem]">
            {trend === "up" && <TrendingUp className="size-3 text-emerald-500 mt-0.5 shrink-0" />}
            {trend === "down" && <AlertTriangle className="size-3 text-red-500 mt-0.5 shrink-0" />}
            <span
              className={`text-[10px] sm:text-[11px] font-medium line-clamp-2 min-w-0 ${
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-red-500"
                    : "text-muted-foreground"
              }`}
            >
              {trendLabel}
            </span>
          </div>
        )}
        {change && (
          <p className={`flex items-start gap-1 text-[10px] sm:text-[11px] font-medium mt-0.5 min-h-[2rem] ${positive ? "text-emerald-500" : "text-red-500"}`}>
            {positive ? <TrendingUp className="h-3 w-3 mt-0.5 shrink-0" /> : <TrendingDown className="h-3 w-3 mt-0.5 shrink-0" />}
            <span className="line-clamp-2 min-w-0">{change}</span>
          </p>
        )}
      </div>
    </Card>
  );
}
