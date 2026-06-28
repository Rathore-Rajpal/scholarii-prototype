import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { KPICard } from "@/lib/scholarii/types";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface KPICardProps {
  kpi: KPICard;
  onClick: (kpiId: string) => void;
}

function KPICardComponent({ kpi, onClick }: KPICardProps) {
  const statusColors = {
    healthy: "border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-900",
    moderate: "border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900",
    attention: "border-red-200 bg-red-50/40 dark:bg-red-950/20 dark:border-red-900",
  };

  const statusIndicatorColors = {
    healthy: "bg-emerald-500",
    moderate: "bg-amber-500",
    attention: "bg-red-500",
  };

  const trendColor = kpi.trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";

  const sparklineDataForChart = kpi.sparklineData.map((point, i) => ({
    x: i,
    y: point.y,
  }));

  return (
    <Card
      onClick={() => onClick(kpi.id)}
      className={cn(
        "min-w-0 lg:min-w-80 p-3 lg:p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2",
        statusColors[kpi.status]
      )}
    >
      <div className="space-y-3 lg:space-y-4">
        {/* Header: Title + Status */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xs lg:text-sm font-medium text-muted-foreground">{kpi.title}</h3>
          </div>
          <div className={cn("size-2.5 rounded-full", statusIndicatorColors[kpi.status])} />
        </div>

        {/* Main Value + Percentage */}
        <div className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
          <div className="text-xs lg:text-sm text-muted-foreground">{kpi.percentageLabel}</div>
        </div>

        {/* Trend Indicator */}
        <div className={cn("flex items-center gap-1.5 text-xs lg:text-sm font-medium", trendColor)}>
          {kpi.trend.direction === "up" ? (
            <TrendingUp className="size-4" />
          ) : kpi.trend.direction === "down" ? (
            <TrendingDown className="size-4" />
          ) : (
            <div className="size-4" />
          )}
          <span>
            {kpi.trend.direction === "up" ? "↑" : kpi.trend.direction === "down" ? "↓" : "→"} {kpi.trend.percentage}%{" "}
            {kpi.trend.direction === "up" ? "vs yesterday" : "vs yesterday"}
          </span>
        </div>

        {/* Mini Sparkline */}
        {sparklineDataForChart.length > 0 && (
          <div className="hidden h-12 -mx-2 lg:block">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineDataForChart}>
                <defs>
                  <linearGradient id={`gradient-${kpi.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--brand-from)" />
                    <stop offset="100%" stopColor="var(--brand-to)" />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="y" stroke={`url(#gradient-${kpi.id})`} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}

interface KPICarouselProps {
  kpis: KPICard[];
  onKPIClick: (kpiId: string) => void;
}

export function KPICarousel({ kpis, onKPIClick }: KPICarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 400;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 500);
    }
  };

  return (
    <div className="relative group">
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {kpis.map((kpi) => (
          <KPICardComponent key={kpi.id} kpi={kpi} onClick={onKPIClick} />
        ))}
      </div>

      {/* Carousel Container with scrollbar hidden */}
      <div
        ref={containerRef}
        className="hidden lg:flex gap-4 overflow-x-auto scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
        onScroll={checkScroll}
      >
        {kpis.map((kpi) => (
          <KPICardComponent key={kpi.id} kpi={kpi} onClick={onKPIClick} />
        ))}
      </div>
      
      {/* CSS to hide webkit scrollbar */}
      <style>{`
        [style*="scrollbarWidth: none"] {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        [style*="scrollbarWidth: none"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Left Scroll Button */}
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden rounded-full shadow-lg bg-background lg:inline-flex"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}

      {/* Right Scroll Button */}
      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden rounded-full shadow-lg bg-background lg:inline-flex"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
