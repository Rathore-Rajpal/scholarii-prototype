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
} from "lucide-react";

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

  const kpis = [
    { label: "Announcements Sent", value: "128", suffix: "This Month", icon: Megaphone, tone: "bg-sky-50 text-sky-700 border-sky-200" },
    { label: "Circular Read Rate", value: "84%", suffix: "", icon: FileText, tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Parent Engagement", value: "78%", suffix: "Healthy", icon: Users, tone: "bg-violet-50 text-violet-700 border-violet-200" },
    { label: "Messages Delivered", value: "12,458", suffix: "", icon: Send, tone: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    { label: "Upcoming Communications", value: "8", suffix: "Scheduled", icon: CalendarClock, tone: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Unread Important Notices", value: "42", suffix: "Parents", icon: BellRing, tone: "bg-red-50 text-red-700 border-red-200", badge: "Warning" },
  ] as const;

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
        title="Communication"
        subtitle="Communication Command Center for the principal - high-level oversight, reach, engagement, and attention signals."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="bg-brand-gradient text-white border-0">
              <Megaphone className="mr-2 size-4" />
              Create Announcement
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="mr-2 size-4" />
              Publish Circular
            </Button>
            <Button size="sm" variant="outline">
              <CalendarClock className="mr-2 size-4" />
              Schedule Communication
            </Button>
            <Button size="sm" variant="outline">
              <ShieldCheck className="mr-2 size-4" />
              Generate Communication Report
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
          {kpis.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className={`p-4 border ${item.tone}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div>
                    {item.suffix ? <p className="text-xs text-muted-foreground mt-1">{item.suffix}</p> : null}
                    {"badge" in item ? (
                      <Badge variant="destructive" className="mt-2">
                        {item.badge}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="rounded-full border border-current/15 p-2">
                    <Icon className="size-4" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="p-6 border-border/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <Sparkles className="size-3.5" />
                  Communication Health
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">86 / 100</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Healthy communication performance with strong delivery, high circular read rates, and solid parent engagement.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Healthy</Badge>
                  <Badge variant="outline">Principal View</Badge>
                  <Badge variant="outline">Executive Oversight</Badge>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Why it matters</div>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  This score blends reach, delivery, engagement, and read rates so the principal can see communication health at a glance.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {communicationHealthMetrics.map((metric) => (
                <button
                  key={metric.id}
                  type="button"
                  onClick={() => openMetricPanel(metric)}
                  className="text-left"
                >
                  <Card className="h-full p-4 border-border/60 transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <div className="mt-2 text-xl font-semibold tracking-tight">{metric.value}</div>
                        <p className="mt-1 text-xs text-muted-foreground">{metric.note}</p>
                      </div>
                      <Badge variant="outline">{metric.badge}</Badge>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="w-full pl-9 lg:w-[280px]"
                  placeholder="Search announcement title, circular title, keyword"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Communication type" />
                </SelectTrigger>
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
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Pending Read">Pending Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        <Card className="p-5 border-border/60">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Recent Communications</h3>
              <p className="text-sm text-muted-foreground">Only the latest school communications are shown here.</p>
            </div>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredCommunications.slice(0, 3).map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedCommunication(item)} className="text-left">
                <Card className="h-full p-4 border-border/60 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.title}</p>
                        <Badge variant={item.status === "Scheduled" ? "outline" : "secondary"}>{item.type}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{item.sentLabel}</p>
                    </div>
                    <Badge variant={item.status === "Pending Read" ? "destructive" : "outline"}>{item.status}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Read rate</span>
                      <div className="mt-1 font-semibold">{item.readRate ? `${item.readRate}%` : "Pending"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Action</span>
                      <div className="mt-1 font-semibold">{item.actionLabel}</div>
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="p-5 border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Circulars Overview</h3>
                <p className="text-sm text-muted-foreground">A compact view of circular circulation.</p>
              </div>
              <Badge variant="outline">84 Circulars Sent</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Card className="p-4 bg-slate-50/60 border-border/60">
                <p className="text-xs text-muted-foreground">Read</p>
                <div className="mt-2 text-2xl font-semibold">71</div>
              </Card>
              <Card className="p-4 bg-slate-50/60 border-border/60">
                <p className="text-xs text-muted-foreground">Unread</p>
                <div className="mt-2 text-2xl font-semibold text-amber-700">13</div>
              </Card>
              <Card className="p-4 bg-slate-50/60 border-border/60">
                <p className="text-xs text-muted-foreground">Pending</p>
                <div className="mt-2 text-2xl font-semibold text-sky-700">6</div>
              </Card>
              <Card className="p-4 bg-slate-50/60 border-border/60">
                <p className="text-xs text-muted-foreground">Total</p>
                <div className="mt-2 text-2xl font-semibold">84</div>
              </Card>
            </div>
          </Card>

          <Card className="p-5 border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Parent Engagement Overview</h3>
                <p className="text-sm text-muted-foreground">High-level view of parent response and read behavior.</p>
              </div>
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Healthy</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Card className="p-4 border-border/60">
                <p className="text-xs text-muted-foreground">Active Parents</p>
                <div className="mt-2 text-2xl font-semibold">92%</div>
              </Card>
              <Card className="p-4 border-border/60">
                <p className="text-xs text-muted-foreground">PTM Responses</p>
                <div className="mt-2 text-2xl font-semibold">76%</div>
              </Card>
              <Card className="p-4 border-border/60">
                <p className="text-xs text-muted-foreground">Circular Reads</p>
                <div className="mt-2 text-2xl font-semibold">84%</div>
              </Card>
              <Card className="p-4 border-border/60">
                <p className="text-xs text-muted-foreground">Announcement Engagement</p>
                <div className="mt-2 text-2xl font-semibold">78%</div>
              </Card>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="p-5 border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Upcoming Communications</h3>
                <p className="text-sm text-muted-foreground">Scheduled items that need principal visibility.</p>
              </div>
              <Badge variant="outline">8 Scheduled</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {upcomingCommunications.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  <Badge variant="outline">{item.when}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Communication Channel Overview</h3>
                <p className="text-sm text-muted-foreground">High-level usage across school communication channels.</p>
              </div>
              <Badge variant="outline">Multi-channel</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {channelStats.map((channel) => (
                <div key={channel.channel} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{channel.channel}</p>
                        <Badge variant="secondary">{channel.badge}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{channel.usage}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{channel.sent}</div>
                      <div className="text-sm text-muted-foreground">{channel.delivered}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5 border-border/60 bg-slate-50/40">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">Minimal actions for communication oversight.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline">
                Create Announcement
              </Button>
              <Button size="sm" variant="outline">
                Publish Circular
              </Button>
              <Button size="sm" variant="outline">
                Schedule Communication
              </Button>
              <Button size="sm" variant="outline">
                Generate Communication Report
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={metricPanelOpen} onOpenChange={setMetricPanelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Communication Metric</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{selectedMetric.label}</p>
                <div className="mt-1 text-3xl font-semibold tracking-tight">{selectedMetric.value}</div>
              </div>
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">{selectedMetric.badge}</Badge>
            </div>
            <Card className="p-4 border-border/60">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">What it means</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedMetric.meaning}</p>
            </Card>
            <Card className="p-4 border-border/60">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Why this score</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedMetric.why}</p>
            </Card>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4" />
              <span>Designed for quick principal-level oversight, not operational messaging.</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                <Badge className="bg-slate-900 text-white hover:bg-slate-900">{selectedCommunication.type}</Badge>
                <Badge variant="outline">{selectedCommunication.status}</Badge>
                <span className="text-sm text-muted-foreground">{selectedCommunication.sentLabel}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-4 border-border/60">
                  <p className="text-xs text-muted-foreground">Read Rate</p>
                  <div className="mt-2 text-2xl font-semibold">{selectedCommunication.readRate}%</div>
                </Card>
                <Card className="p-4 border-border/60">
                  <p className="text-xs text-muted-foreground">Audience</p>
                  <div className="mt-2 text-sm font-medium leading-5">{selectedCommunication.audience}</div>
                </Card>
                <Card className="p-4 border-border/60">
                  <p className="text-xs text-muted-foreground">Issued By</p>
                  <div className="mt-2 text-sm font-medium leading-5">{selectedCommunication.issuedBy}</div>
                </Card>
              </div>

              <Card className="p-4 border-border/60">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Full Circular</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedCommunication.body}</p>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card className="p-4 border-border/60">
                  <p className="text-xs text-muted-foreground">Delivery Channels</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCommunication.channels.map((channel) => (
                      <Badge key={channel} variant="secondary">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </Card>
                <Card className="p-4 border-border/60">
                  <p className="text-xs text-muted-foreground">Action Needed</p>
                  <div className="mt-2 text-sm font-medium leading-5">{selectedCommunication.actionLabel}</div>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
