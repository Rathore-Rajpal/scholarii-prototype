import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Megaphone, Calendar, Clock, GraduationCap, PartyPopper, Sun,
  AlertTriangle, FileText, ChevronRight, Search, Bell, CalendarDays,
  BookOpen, Award, Timer, CheckCircle2, Filter,
} from "lucide-react";

export const Route = createFileRoute("/app/updates")({ component: UpdatesPage });

type NoticeCategory = "all" | "announcement" | "event" | "holiday" | "exam" | "ptm" | "deadline";

interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  category: NoticeCategory;
  priority: "normal" | "important" | "urgent";
  icon: typeof Megaphone;
  color: string;
  bgColor: string;
}

const NOTICES: Notice[] = [
  {
    id: "n1",
    title: "Parent-Teacher Meeting Scheduled",
    description: "PTM for all classes will be held on June 25, 2026. Parents are requested to attend between 9:00 AM and 1:00 PM.",
    date: "2026-06-25",
    category: "ptm",
    priority: "important",
    icon: BookOpen,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "n2",
    title: "Mid-Semester Results Published",
    description: "Mid-semester examination results for all classes have been published. Check the Performance section for detailed report cards.",
    date: "2026-06-15",
    category: "announcement",
    priority: "important",
    icon: Award,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "n3",
    title: "Mathematics Unit Test - June 20",
    description: "Mathematics Unit Test is scheduled for June 20, 2026. Students should revise chapters 1-5.",
    date: "2026-06-20",
    category: "exam",
    priority: "normal",
    icon: GraduationCap,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "n4",
    title: "School Holiday - June 28",
    description: "School will remain closed on June 28, 2026 on account of Eid-ul-Adha.",
    date: "2026-06-28",
    category: "holiday",
    priority: "normal",
    icon: Sun,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "n5",
    title: "Annual Day Celebration",
    description: "Annual Day celebration will be held on July 5, 2026. All parents are cordially invited to attend.",
    date: "2026-07-05",
    category: "event",
    priority: "normal",
    icon: PartyPopper,
    color: "text-pink-600",
    bgColor: "bg-pink-500/10",
  },
  {
    id: "n6",
    title: "Term 2 Fee Payment Deadline",
    description: "Last date for Term 2 fee payment is June 30, 2026. Late payments will attract a penalty of ₹500.",
    date: "2026-06-30",
    category: "deadline",
    priority: "urgent",
    icon: Timer,
    color: "text-red-600",
    bgColor: "bg-red-500/10",
  },
  {
    id: "n7",
    title: "Science Project Submission",
    description: "Science project for Class 8 is due on June 18, 2026. Topics were shared on June 1.",
    date: "2026-06-18",
    category: "deadline",
    priority: "important",
    icon: FileText,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "n8",
    title: "Sports Day Practice",
    description: "Sports Day practice sessions will begin from July 10. Interested students should contact the PE department.",
    date: "2026-07-10",
    category: "event",
    priority: "normal",
    icon: PartyPopper,
    color: "text-pink-600",
    bgColor: "bg-pink-500/10",
  },
  {
    id: "n9",
    title: "School Closure Notice",
    description: "School will remain closed from July 15 to July 20 for summer vacation.",
    date: "2026-07-15",
    category: "holiday",
    priority: "important",
    icon: Sun,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "n10",
    title: "Science Practical - Class 8",
    description: "Science practical examination for Class 8 will be held on June 23, 2026.",
    date: "2026-06-23",
    category: "exam",
    priority: "normal",
    icon: GraduationCap,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
];

const CATEGORY_FILTERS: { key: NoticeCategory; label: string; icon: typeof Megaphone }[] = [
  { key: "all", label: "All Updates", icon: Bell },
  { key: "announcement", label: "Announcements", icon: Megaphone },
  { key: "event", label: "Events", icon: PartyPopper },
  { key: "holiday", label: "Holidays", icon: Sun },
  { key: "exam", label: "Exams", icon: GraduationCap },
  { key: "ptm", label: "PTM", icon: BookOpen },
  { key: "deadline", label: "Deadlines", icon: Timer },
];

function UpdatesPage() {
  const [activeFilter, setActiveFilter] = useState<NoticeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotices = useMemo(() => {
    let notices = NOTICES;
    if (activeFilter !== "all") {
      notices = notices.filter((n) => n.category === activeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      notices = notices.filter(
        (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      );
    }
    return notices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeFilter, searchQuery]);

  return (
    <div className="space-y-6 p-6 pb-20 md:p-8">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Updates & Notices</h1>
            <p className="text-sm text-muted-foreground">School announcements, events, exams, and important deadlines.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Announcements", value: NOTICES.filter((n) => n.category === "announcement").length, icon: Megaphone, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
          { label: "Upcoming Events", value: NOTICES.filter((n) => n.category === "event").length, icon: PartyPopper, color: "from-pink-500 to-pink-600", shadow: "shadow-pink-500/20" },
          { label: "Exams", value: NOTICES.filter((n) => n.category === "exam").length, icon: GraduationCap, color: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20" },
          { label: "Deadlines", value: NOTICES.filter((n) => n.category === "deadline").length, icon: Timer, color: "from-red-500 to-red-600", shadow: "shadow-red-500/20" },
        ].map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_FILTERS.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeFilter === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 border ${
                isActive
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
              }`}
            >
              <Icon className="size-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search updates and notices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
                <Bell className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground">No updates found</p>
              <p className="text-xs text-muted-foreground/70">Try adjusting your filter or search</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotices.map((notice) => {
            const Icon = notice.icon;
            return (
              <Card
                key={notice.id}
                className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:shadow-lg"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${notice.bgColor}`}>
                      <Icon className={`h-5 w-5 ${notice.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold">{notice.title}</h3>
                        {notice.priority === "urgent" && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            <AlertTriangle className="mr-1 h-2.5 w-2.5" />
                            Urgent
                          </Badge>
                        )}
                        {notice.priority === "important" && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-600 border-blue-500/20">
                            Important
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{notice.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(notice.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {notice.category}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground/60 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
