import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  UserPlus,
  ClipboardCheck,
  AlertCircle,
  Megaphone,
  BookOpen,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/lib/scholarii/types";

const iconMap = {
  fee_payment: DollarSign,
  admission: UserPlus,
  attendance: ClipboardCheck,
  leave: AlertCircle,
  announcement: Megaphone,
  homework: BookOpen,
  exam: FileText,
  ptm: Calendar,
};

const severityColors = {
  info: "text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950",
  success: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950",
  warning: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950",
  critical: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950",
};

interface ActivityEventItemProps {
  event: ActivityEvent;
}

function ActivityEventItem({ event }: ActivityEventItemProps) {
  const IconComponent = iconMap[event.type] || AlertCircle;

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0 animate-in-up">
      {/* Icon Circle */}
      <div className={cn("size-9 rounded-lg flex items-center justify-center flex-shrink-0", severityColors[event.severity])}>
        <IconComponent className="size-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-foreground">{event.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{event.description}</p>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">{formatTime(event.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

interface LiveActivityFeedProps {
  events: ActivityEvent[];
  onGenerateEvent?: (event: ActivityEvent) => void;
}

export function LiveActivityFeed({ events: initialEvents, onGenerateEvent }: LiveActivityFeedProps) {
  const [events, setEvents] = useState(initialEvents);

  // Simulate real-time events every 5-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (onGenerateEvent) {
        // Event generation is handled by parent, we just update displayed events
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [onGenerateEvent]);

  // Update events when props change
  useEffect(() => {
    setEvents(initialEvents.slice(0, 6)); // Limit to 6 most recent
  }, [initialEvents]);

  return (
    <Card className="p-5 h-full border border-border">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Live Activity Feed</h3>
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-0">
          {events.length > 0 ? (
            events.map((event) => <ActivityEventItem key={event.id} event={event} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>

        {/* View All Link */}
        {events.length > 0 && (
          <button className="w-full text-sm font-medium text-brand-from hover:text-brand-to transition-colors py-2 border-t border-border pt-3">
            View all activity →
          </button>
        )}
      </div>
    </Card>
  );
}
