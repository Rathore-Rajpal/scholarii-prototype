import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowRight,
  CalendarClock,
  FileText,
  Megaphone,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  BellRing,
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Heart,
  Radio,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/communication")({ component: CommunicationPage });

type CommunicationType = "Announcement" | "Circular" | "PTM Reminder" | "Fee Reminder" | "Exam Notice" | "Holiday Notice";
type CommunicationStatus = "Sent" | "Scheduled" | "Delivered" | "Pending Read";

type HealthMetric = {
  id: string;
  label: string;
  value: string;
  note: string;
  meaning: string;
  why: string;
  badge: "Healthy" | "Warning" | "Stable";
};

type CommunicationCard = {
  id: number;
  title: string;
  type: CommunicationType;
  status: CommunicationStatus;
  sentLabel: string;
  readRate: number;
  keyword: string;
  audience: string;
  channels: string[];
  issuedBy: string;
  body: string;
  actionLabel: string;
};

type ChannelStat = {
  channel: string;
  sent: string;
  delivered: string;
  usage: string;
  badge: "Highest" | "Primary" | "Growing" | "Supporting";
};

const communicationHealthMetrics: HealthMetric[] = [
  {
    id: "parent-reach",
    label: "Parent Reach",
    value: "91%",
    note: "Families reached this month",
    meaning: "How many parent contacts received at least one school communication in the current cycle.",
    why: "High delivery coverage across WhatsApp, email, and app notifications kept the reach above target.",
    badge: "Healthy",
  },
  {
    id: "message-delivery",
    label: "Message Delivery",
    value: "98%",
    note: "Delivery success rate",
    meaning: "The share of outgoing communication that successfully reached a parent or guardian inbox or device.",
    why: "Delivery stayed strong because most notices used the primary WhatsApp channel and fallback SMS.",
    badge: "Healthy",
  },
  {
    id: "engagement-rate",
    label: "Engagement Rate",
    value: "78%",
    note: "Parents actively engaging",
    meaning: "How often parents open, read, react to, or respond to the school's communications.",
    why: "PTM and fee reminders generated strong responses while some older circulars were read later.",
    badge: "Healthy",
  },
  {
    id: "circular-read-rate",
    label: "Circular Read Rate",
    value: "84%",
    note: "Latest circular performance",
    meaning: "The percentage of parents who opened the most recent circulars published by the school.",
    why: "Read rates remain above benchmark because circulars are concise and timely.",
    badge: "Healthy",
  },
  {
    id: "effectiveness",
    label: "Communication Effectiveness",
    value: "86 / 100",
    note: "Overall communication health",
    meaning: "A blended score combining delivery, reach, engagement, and circular read performance.",
    why: "High delivery and strong read rates outweigh a small unread pool of important notices.",
    badge: "Healthy",
  },
];

const recentCommunications: CommunicationCard[] = [
  {
    id: 1,
    title: "School Holiday Notice",
    type: "Holiday Notice",
    status: "Delivered",
    sentLabel: "Sent Yesterday",
    readRate: 92,
    keyword: "holiday notice vacation closure school",
    audience: "All parents and guardians",
    channels: ["WhatsApp", "Email", "App Notifications"],
    issuedBy: "Principal Office",
    body:
      "The school will remain closed tomorrow due to the scheduled holiday. Classes will resume on the next working day. Parents are requested to keep students at home and review the academic calendar for the updated timetable.",
    actionLabel: "Open circular",
  },
  {
    id: 2,
    title: "PTM Reminder",
    type: "PTM Reminder",
    status: "Sent",
    sentLabel: "Sent Today",
    readRate: 81,
    keyword: "ptm reminder parent meeting consent",
    audience: "Parents of Grades 6-10",
    channels: ["WhatsApp", "SMS"],
    issuedBy: "Academic Coordination Team",
    body:
      "This is a reminder for the upcoming PTM. Parents are requested to confirm their preferred time slot and arrive 10 minutes early so the meeting schedule can remain on track.",
    actionLabel: "Open details",
  },
  {
    id: 3,
    title: "Exam Schedule Notification",
    type: "Exam Notice",
    status: "Delivered",
    sentLabel: "Sent 2 Days Ago",
    readRate: 89,
    keyword: "exam schedule timetable assessment",
    audience: "Parents of Grades 6-10",
    channels: ["Email", "App Notifications"],
    issuedBy: "Examination Cell",
    body:
      "The final exam timetable has been published. Parents should review the subject-wise schedule, exam entry timing, and reporting guidelines shared in the attached notice.",
    actionLabel: "Open circular",
  },
  {
    id: 4,
    title: "Fee Reminder - Grade 8",
    type: "Fee Reminder",
    status: "Pending Read",
    sentLabel: "Sent 3 Days Ago",
    readRate: 74,
    keyword: "fee reminder dues payment grade 8",
    audience: "Grade 8 parents",
    channels: ["WhatsApp", "SMS"],
    issuedBy: "Accounts Office",
    body:
      "A gentle reminder that the next fee installment for Grade 8 is due soon. Parents are encouraged to complete the payment at the earliest to avoid late charges.",
    actionLabel: "Open notice",
  },
  {
    id: 5,
    title: "Annual Circular on Uniform Policy",
    type: "Circular",
    status: "Scheduled",
    sentLabel: "Scheduled Tomorrow",
    readRate: 0,
    keyword: "uniform policy circular annual",
    audience: "All parents and students",
    channels: ["Email", "App Notifications"],
    issuedBy: "Student Affairs Office",
    body:
      "The annual uniform policy circular covers approved uniform combinations, footwear guidelines, and accessories. Please review the complete policy before the new term begins.",
    actionLabel: "Open circular",
  },
];

const channelStats: ChannelStat[] = [
  { channel: "WhatsApp", sent: "9,240 Sent", delivered: "98% Delivered", usage: "Primary channel for parent alerts", badge: "Highest" },
  { channel: "Email", sent: "2,840 Sent", delivered: "94% Delivered", usage: "Used for detailed notices and circulars", badge: "Primary" },
  { channel: "App Notifications", sent: "1,830 Sent", delivered: "99% Delivered", usage: "Useful for quick reminders", badge: "Growing" },
  { channel: "SMS", sent: "640 Sent", delivered: "96% Delivered", usage: "Fallback for urgent messages", badge: "Supporting" },
];

const upcomingCommunications = [
  { title: "PTM Reminder", when: "Tomorrow", detail: "Parent meeting reminders for Grades 6-10." },
  { title: "Exam Reminder", when: "15 July", detail: "Final exam schedule reminder and venue details." },
  { title: "Fee Reminder", when: "17 July", detail: "Automated reminder for pending fee payments." },
];

function CommunicationPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric>(communicationHealthMetrics[0]);
  const [metricPanelOpen, setMetricPanelOpen] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<CommunicationCard | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const kpis = [
    { label: "Announcements Sent", value: "128", hint: "This Month", icon: Megaphone, tone: "sky" as const },
    { label: "Circular Read Rate", value: "84%", hint: "", icon: FileText, tone: "emerald" as const },
    { label: "Parent Engagement", value: "78%", hint: "Healthy", icon: Users, tone: "violet" as const },
    { label: "Messages Delivered", value: "12,458", hint: "", icon: Send, tone: "sky" as const },
    { label: "Upcoming Communications", value: "8", hint: "Scheduled", icon: CalendarClock, tone: "amber" as const },
    { label: "Unread Important Notices", value: "42", hint: "Parents", icon: BellRing, tone: "amber" as const },
  ];

  const filteredCommunications = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recentCommunications.filter((item) => {
      if (q && !(item.title.toLowerCase().includes(q) || item.keyword.includes(q))) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      return true;
    });
  }, [query, typeFilter, statusFilter]);

  const clearFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const openMetricPanel = (metric: HealthMetric) => {
    setSelectedMetric(metric);
    setMetricPanelOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Communication Center"
        subtitle="Communication Command Center for the principal - high-level oversight, reach, engagement, and attention signals."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-violet-600 hover:bg-violet-700">
              <Megaphone className="size-3" /> Create Announcement
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <FileText className="size-3" /> Publish Circular
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <CalendarClock className="size-3" /> Schedule
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpis.map((item) => {
          const Icon = item.icon;
          const tones = { sky: "bg-sky-500/10 text-sky-500", emerald: "bg-emerald-500/10 text-emerald-500", violet: "bg-violet-500/10 text-violet-500", amber: "bg-amber-500/10 text-amber-500" };
          return (
            <Card key={item.label} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", tones[item.tone])}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  <div className="text-lg font-semibold">{item.value}</div>
                </div>
              </div>
              {item.hint && <p className="text-[11px] text-muted-foreground">{item.hint}</p>}
            </Card>
          );
        })}
      </div>

      {/* Communication Health Summary */}
      <Card className="p-5 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center shrink-0">
                <Sparkles className="size-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-semibold">Communication Health</p>
                <div className="text-2xl font-semibold">86 / 100</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-5">
              Healthy communication performance with strong delivery, high circular read rates, and solid parent engagement.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">Healthy</Badge>
              <Badge variant="outline" className="text-[10px]">Principal View</Badge>
              <Badge variant="outline" className="text-[10px]">Executive Oversight</Badge>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {communicationHealthMetrics.map((metric) => (
            <button
              key={metric.id}
              type="button"
              onClick={() => openMetricPanel(metric)}
              className="text-left"
            >
              <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground">{metric.label}</p>
                    <div className="text-lg font-semibold mt-1">{metric.value}</div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{metric.note}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{metric.badge}</Badge>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="p-4 mb-8">
          <TabsList className="h-11">
            <TabsTrigger value="overview" className="text-sm gap-2 px-5"><LayoutDashboard className="size-4" /> Overview</TabsTrigger>
            <TabsTrigger value="recent" className="text-sm gap-2 px-5"><MessageSquare className="size-4" /> Recent</TabsTrigger>
            <TabsTrigger value="circulars" className="text-sm gap-2 px-5"><BookOpen className="size-4" /> Circulars</TabsTrigger>
            <TabsTrigger value="engagement" className="text-sm gap-2 px-5"><Heart className="size-4" /> Engagement</TabsTrigger>
            <TabsTrigger value="channels" className="text-sm gap-2 px-5"><Radio className="size-4" /> Channels</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-sm gap-2 px-5"><Calendar className="size-4" /> Upcoming</TabsTrigger>
          </TabsList>
        </Card>

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold">Communication Overview</h3>
                <p className="text-xs text-muted-foreground">Summary of all communication activities and their performance.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Summary</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {recentCommunications.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.sentLabel}</p>
                    </div>
                    <Badge variant={item.status === "Pending Read" ? "destructive" : "outline"} className="text-[10px]">{item.status}</Badge>
                  </div>
                  <div className="mt-2 text-[11px] text-muted-foreground">Read rate: {item.readRate}%</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ═══ RECENT COMMUNICATIONS ═══ */}
        {activeTab === "recent" && (
          <div>
            <Card className="p-4 mb-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="h-8 text-xs pl-8 w-[260px]"
                      placeholder="Search announcement, circular, keyword..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="Announcement">Announcement</SelectItem>
                      <SelectItem value="Circular">Circular</SelectItem>
                      <SelectItem value="PTM Reminder">PTM Reminder</SelectItem>
                      <SelectItem value="Fee Reminder">Fee Reminder</SelectItem>
                      <SelectItem value="Exam Notice">Exam Notice</SelectItem>
                      <SelectItem value="Holiday Notice">Holiday Notice</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All status</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Pending Read">Pending Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearFilters}>Clear Filters</Button>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-semibold">Recent Communications</h3>
                  <p className="text-xs text-muted-foreground">Only the latest school communications are shown here.</p>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  View All <ArrowRight className="size-3" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filteredCommunications.slice(0, 3).map((item) => (
                  <button key={item.id} type="button" onClick={() => setSelectedCommunication(item)} className="text-left">
                    <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold">{item.title}</p>
                          </div>
                          <Badge variant={item.status === "Scheduled" ? "outline" : "secondary"} className="text-[10px] mt-1">{item.type}</Badge>
                          <p className="text-[11px] text-muted-foreground mt-1">{item.sentLabel}</p>
                        </div>
                        <Badge variant={item.status === "Pending Read" ? "destructive" : "outline"} className="text-[10px] shrink-0">{item.status}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[11px] text-muted-foreground">Read rate</span>
                          <div className="font-semibold mt-0.5">{item.readRate ? `${item.readRate}%` : "Pending"}</div>
                        </div>
                        <div>
                          <span className="text-[11px] text-muted-foreground">Action</span>
                          <div className="font-semibold mt-0.5">{item.actionLabel}</div>
                        </div>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ═══ CIRCULARS ═══ */}
        {activeTab === "circulars" && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Circulars Overview</h3>
                <p className="text-xs text-muted-foreground">A compact view of circular circulation.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">84 Circulars Sent</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <p className="text-[11px] text-muted-foreground">Read</p>
                <div className="text-lg font-semibold mt-1">71</div>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] text-muted-foreground">Unread</p>
                <div className="text-lg font-semibold mt-1 text-amber-600">13</div>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] text-muted-foreground">Pending</p>
                <div className="text-lg font-semibold mt-1 text-sky-600">6</div>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] text-muted-foreground">Total</p>
                <div className="text-lg font-semibold mt-1">84</div>
              </Card>
            </div>
          </Card>
        )}

        {/* ═══ ENGAGEMENT ═══ */}
        {activeTab === "engagement" && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Parent Engagement Overview</h3>
                <p className="text-xs text-muted-foreground">High-level view of parent response and read behavior.</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">Healthy</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <p className="text-[11px] text-muted-foreground">Active Parents</p>
                <div className="text-lg font-semibold mt-1">92%</div>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] text-muted-foreground">PTM Responses</p>
                <div className="text-lg font-semibold mt-1">76%</div>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] text-muted-foreground">Circular Reads</p>
                <div className="text-lg font-semibold mt-1">84%</div>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] text-muted-foreground">Announcement Engagement</p>
                <div className="text-lg font-semibold mt-1">78%</div>
              </Card>
            </div>
          </Card>
        )}

        {/* ═══ CHANNELS ═══ */}
        {activeTab === "channels" && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Communication Channel Overview</h3>
                <p className="text-xs text-muted-foreground">High-level usage across school communication channels.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Multi-channel</Badge>
            </div>
            <div className="space-y-3">
              {channelStats.map((channel) => (
                <div key={channel.channel} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold">{channel.channel}</p>
                        <Badge variant="secondary" className="text-[10px]">{channel.badge}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{channel.usage}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold">{channel.sent}</div>
                      <div className="text-[11px] text-muted-foreground">{channel.delivered}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ═══ UPCOMING ═══ */}
        {activeTab === "upcoming" && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Upcoming Communications</h3>
                <p className="text-xs text-muted-foreground">Scheduled items that need principal visibility.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">8 Scheduled</Badge>
            </div>
            <div className="space-y-3">
              {upcomingCommunications.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.detail}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">{item.when}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-4 mt-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold">Quick Actions</p>
            <p className="text-[11px] text-muted-foreground">Minimal actions for communication oversight.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">Create Announcement</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">Publish Circular</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">Schedule Communication</Button>
          </div>
        </div>
      </Card>

      {/* Metric Detail Dialog */}
      <Dialog open={metricPanelOpen} onOpenChange={setMetricPanelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Communication Metric</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{selectedMetric.label}</p>
                <div className="text-2xl font-semibold mt-1">{selectedMetric.value}</div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">{selectedMetric.badge}</Badge>
            </div>
            <Card className="p-4">
              <p className="text-[11px] text-muted-foreground mb-1">What it means</p>
              <p className="text-xs text-muted-foreground leading-5">{selectedMetric.meaning}</p>
            </Card>
            <Card className="p-4">
              <p className="text-[11px] text-muted-foreground mb-1">Why this score</p>
              <p className="text-xs text-muted-foreground leading-5">{selectedMetric.why}</p>
            </Card>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              <span>Designed for quick principal-level oversight, not operational messaging.</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Communication Detail Dialog */}
      <Dialog
        open={Boolean(selectedCommunication)}
        onOpenChange={(open) => {
          if (!open) setSelectedCommunication(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCommunication?.type === "Circular" ? "Circular Preview" : "Communication Details"}
            </DialogTitle>
          </DialogHeader>

          {selectedCommunication && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-slate-900 text-white hover:bg-slate-900 text-[10px]">{selectedCommunication.type}</Badge>
                <Badge variant="outline" className="text-[10px]">{selectedCommunication.status}</Badge>
                <span className="text-xs text-muted-foreground">{selectedCommunication.sentLabel}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-4">
                  <p className="text-[11px] text-muted-foreground">Read Rate</p>
                  <div className="text-lg font-semibold mt-1">{selectedCommunication.readRate}%</div>
                </Card>
                <Card className="p-4">
                  <p className="text-[11px] text-muted-foreground">Audience</p>
                  <div className="text-xs font-medium leading-5 mt-1">{selectedCommunication.audience}</div>
                </Card>
                <Card className="p-4">
                  <p className="text-[11px] text-muted-foreground">Issued By</p>
                  <div className="text-xs font-medium leading-5 mt-1">{selectedCommunication.issuedBy}</div>
                </Card>
              </div>

              <Card className="p-4">
                <p className="text-[11px] text-muted-foreground mb-2">Full Circular</p>
                <p className="text-xs text-muted-foreground leading-5">{selectedCommunication.body}</p>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card className="p-4">
                  <p className="text-[11px] text-muted-foreground">Delivery Channels</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedCommunication.channels.map((channel) => (
                      <Badge key={channel} variant="secondary" className="text-[10px]">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </Card>
                <Card className="p-4">
                  <p className="text-[11px] text-muted-foreground">Action Needed</p>
                  <div className="text-xs font-medium leading-5 mt-1">{selectedCommunication.actionLabel}</div>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
