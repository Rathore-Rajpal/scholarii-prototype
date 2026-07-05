import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TeacherPageLayoutProps {
  title: string;
  subtitle: string;
  kpiCards: ReactNode;
  tabs: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
}

export function TeacherPageLayout({
  title,
  subtitle,
  kpiCards,
  tabs,
  toolbar,
  children,
}: TeacherPageLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden">
      {/* Page Header — fixed, does not scroll */}
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
      </div>

      {/* KPI + Toolbar + Tabs — fixed, does not scroll */}
      <div className="shrink-0 border-b border-border/60 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">{kpiCards}</div>
        {toolbar && <div className="mb-3">{toolbar}</div>}
        <div className="flex gap-1 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">{tabs}</div>
      </div>

      {/* Scrollable content area — only this section scrolls */}
      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 pb-4">{children}</div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0",
        active
          ? "bg-brand-gradient text-white shadow-glow"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function KpiCard({ label, value, icon: Icon, color }: KpiCardProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn("size-8 rounded-lg grid place-items-center shrink-0", color)}>
        <Icon className="size-3.5" />
      </div>
      <div>
        <div className="text-base font-bold leading-tight">{value}</div>
        <div className="text-[10px] text-muted-foreground leading-tight">{label}</div>
      </div>
    </div>
  );
}
