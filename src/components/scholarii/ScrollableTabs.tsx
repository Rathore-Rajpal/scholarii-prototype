"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ScrollableTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: "default" | "pills";
}

export function ScrollableTabs({ tabs, activeTab, onTabChange, className, variant = "default" }: ScrollableTabsProps) {
  const isMobile = useIsMobile();
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const updateScrollIndicators = React.useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    updateScrollIndicators();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", updateScrollIndicators);
      return () => element.removeEventListener("scroll", updateScrollIndicators);
    }
  }, [updateScrollIndicators, tabs]);

  const scrollLeft = React.useCallback(() => {
    scrollRef.current?.scrollBy({ left: -160, behavior: "smooth" });
  }, []);

  const scrollRight = React.useCallback(() => {
    scrollRef.current?.scrollBy({ left: 160, behavior: "smooth" });
  }, []);

  const baseTabClass = cn(
    "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all whitespace-nowrap",
    variant === "default"
      ? "text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-600 data-[state=active]:shadow-sm"
      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
  );

  if (!isMobile) {
    return (
      <div className={cn("flex gap-1", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(baseTabClass, activeTab === tab.id && "data-[state=active]")}
            data-state={activeTab === tab.id ? "active" : "inactive"}
          >
            {tab.icon && <span className="size-4">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {showLeftArrow && (
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute left-0 top-0 z-10 h-full w-10 flex items-center justify-center bg-gradient-to-r from-background to-transparent text-muted-foreground hover:text-foreground rounded-l-xl p-1 transition-colors"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide pb-1 px-1"
        onScroll={updateScrollIndicators}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(baseTabClass, activeTab === tab.id && "data-[state=active]")}
            data-state={activeTab === tab.id ? "active" : "inactive"}
          >
            {tab.icon && <span className="size-4">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {showRightArrow && (
        <button
          type="button"
          onClick={scrollRight}
          className="absolute right-0 top-0 z-10 h-full w-10 flex items-center justify-center bg-gradient-to-l from-background to-transparent text-muted-foreground hover:text-foreground rounded-r-xl p-1 transition-colors"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}