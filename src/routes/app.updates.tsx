import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Megaphone, Calendar, Clock, GraduationCap, PartyPopper, Sun,
  AlertTriangle, FileText, ChevronRight, Search, Bell, CalendarDays,
  BookOpen, Award, Timer, CheckCircle2, Filter, Sparkles,
} from "lucide-react";
import { KpiCard } from "@/components/scholarii/KpiCard";

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

const TABS = [
  { id: "all", label: "All Updates", icon: Bell },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "events", label: "Events", icon: PartyPopper },
  { id: "deadlines", label: "Deadlines", icon: Timer },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CATEGORY_FILTERS: { key: NoticeCategory; label: string; icon: typeof Megaphone }[] = [
  { key: "all", label: "All", icon: Bell },
  { key: "announcement", label: "Announcements", icon: Megaphone },
  { key: "event", label: "Events", icon: PartyPopper },
  { key: "holiday", label: "Holidays", icon: Sun },
  { key: "exam", label: "Exams", icon: GraduationCap },
  { key: "ptm", label: "PTM", icon: BookOpen },
  { key: "deadline", label: "Deadlines", icon: Timer },
];

function getTabNotices(tabId: TabId, searchQuery: string): Notice[] {
  let notices = NOTICES;

  if (tabId === "announcements") {
    notices = notices.filter((n) => n.category === "announcement");
  } else if (tabId === "events") {
    notices = notices.filter((n) => n.category === "event" || n.category === "holiday");
  } else if (tabId === "deadlines") {
    notices = notices.filter((n) => n.category === "deadline" || n.category === "exam" || n.category === "ptm");
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    notices = notices.filter(
      (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
    );
  }

  return notices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function UpdatesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [activeFilter, setActiveFilter] = useState<NoticeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const totalNotices = NOTICES.length;
  const announcementCount = NOTICES.filter((n) => n.category === "announcement").length;
  const eventCount = NOTICES.filter((n) => n.category === "event" || n.category === "holiday").length;
  const urgentCount = NOTICES.filter((n) => n.priority === "urgent" || n.priority === "important").length;

  const tabNotices = useMemo(() => getTabNotices(activeTab, searchQuery), [activeTab, searchQuery]);

  const filteredNotices = useMemo(() => {
    let notices = tabNotices;
    if (activeFilter !== "all") {
      notices = notices.filter((n) => n.category === activeFilter);
    }
    return notices;
  }, [tabNotices, activeFilter]);

  return (
    <div className="space-y-5 sm:space-y-6 pb-20">
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

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 auto-rows-fr">
        <KpiCard
          icon={Bell}
          label="Total Notices"
          value={`${totalNotices}`}
          tone="default"
        />
        <KpiCard
          icon={Megaphone}
          label="Announcements"
          value={`${announcementCount}`}
          tone="info"
        />
        <KpiCard
          icon={PartyPopper}
          label="Upcoming Events"
          value={`${eventCount}`}
          tone="success"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Important & Urgent"
          value={`${urgentCount}`}
          tone="warning"
        />
      </div>

      {/* Tab Bar */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-5 px-4 sm:px-5 pt-1 pb-2 sm:pb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl rounded-2xl" />
          <div className="relative flex gap-1 overflow-x-auto scrollbar-none rounded-2xl border border-border/60 bg-card p-1 sm:p-1.5 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-500/10 text-violet-600 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="size-3.5 sm:size-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
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

      {/* Tab Content */}
      <div className="min-h-[300px] sm:min-h-[400px] space-y-3">
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
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl ${notice.bgColor}`}>
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${notice.color}`} />
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
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">{notice.description}</p>
                      <div className="mt-2.5 sm:mt-3 flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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

      {/* AI Insights Card */}
      <Card className="relative overflow-hidden p-4 sm:p-5 border-violet-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-violet-600/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 p-1.5 sm:p-2">
              <Sparkles className="size-3.5 sm:size-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">AI Notice Insights</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Smart summary of your updates</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
            <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/80 border border-border/50">
              <div className="rounded-lg p-1.5 bg-amber-500/10 shrink-0">
                <Timer className="size-3 sm:size-3.5 text-amber-600" />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">You have 1 urgent deadline (Term 2 Fee Payment) due on June 30 — act soon to avoid penalties.</p>
            </div>
            <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/80 border border-border/50">
              <div className="rounded-lg p-1.5 bg-blue-500/10 shrink-0">
                <CheckCircle2 className="size-3 sm:size-3.5 text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">Mid-semester results are out — check the Performance tab for your child's detailed report.</p>
            </div>
            <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/80 border border-border/50">
              <div className="rounded-lg p-1.5 bg-emerald-500/10 shrink-0">
                <PartyPopper className="size-3 sm:size-3.5 text-emerald-600" />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">Upcoming: Annual Day on July 5 and Sports Day practice from July 10 — mark your calendar!</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 sm:p-5">
        <h3 className="font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <Button variant="outline" className="h-auto py-3 sm:py-4 flex flex-col items-center gap-1.5 sm:gap-2">
            <Bell className="size-4 sm:size-5 text-amber-600" />
            <span className="text-[10px] sm:text-xs font-medium">Mark All Read</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 sm:py-4 flex flex-col items-center gap-1.5 sm:gap-2">
            <CalendarDays className="size-4 sm:size-5 text-blue-600" />
            <span className="text-[10px] sm:text-xs font-medium">View Calendar</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 sm:py-4 flex flex-col items-center gap-1.5 sm:gap-2">
            <FileText className="size-4 sm:size-5 text-violet-600" />
            <span className="text-[10px] sm:text-xs font-medium">Download Notices</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 sm:py-4 flex flex-col items-center gap-1.5 sm:gap-2">
            <Megaphone className="size-4 sm:size-5 text-emerald-600" />
            <span className="text-[10px] sm:text-xs font-medium">Share with Parent</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
