import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Building2, Wrench, Clock3, CalendarDays, BookOpen, Search,
  LayoutGrid, Calendar, Library, Lightbulb, BarChart3, Users,
  Sparkles, AlertTriangle, CheckCircle2, Info, TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/app/facilities")({ component: FacilitiesPage });

type FacilityStatus = "Available" | "Occupied" | "Scheduled";

type Facility = {
  id: number;
  name: string;
  status: FacilityStatus;
  currentClass: string;
  currentTeacher: string;
  timeSlot: string;
  responsibleStaff: string;
  capacity: string;
  nextBookings: string[];
  category: string;
};

type ScheduleEntry = {
  facility: string;
  time: string;
  className: string;
  teacher: string;
  status: FacilityStatus;
};

const FACILITIES: Facility[] = [
  { id: 1, name: "Computer Lab 1", status: "Occupied", currentClass: "Class 8A", currentTeacher: "Mrs Sharma", timeSlot: "10:00 AM - 11:00 AM", responsibleStaff: "IT Coordinator", capacity: "40 Students", nextBookings: ["11:00 AM - Class 7A", "12:00 PM - Class 9B"], category: "Lab" },
  { id: 2, name: "Science Lab", status: "Scheduled", currentClass: "Class 9B", currentTeacher: "Mr Verma", timeSlot: "11:00 AM - 12:00 PM", responsibleStaff: "Science Lab Assistant", capacity: "36 Students", nextBookings: ["12:00 PM - Class 10A", "2:00 PM - Class 8C"], category: "Lab" },
  { id: 3, name: "Physics Lab", status: "Scheduled", currentClass: "Class 10A", currentTeacher: "Mr Roy", timeSlot: "1:00 PM - 2:00 PM", responsibleStaff: "Lab Supervisor", capacity: "32 Students", nextBookings: ["2:00 PM - Class 9A"], category: "Lab" },
  { id: 4, name: "Chemistry Lab", status: "Available", currentClass: "—", currentTeacher: "—", timeSlot: "Open Now", responsibleStaff: "Chemistry Lab Assistant", capacity: "30 Students", nextBookings: ["Tomorrow 9:00 AM - Class 10B"], category: "Lab" },
  { id: 5, name: "Biology Lab", status: "Available", currentClass: "—", currentTeacher: "—", timeSlot: "Open Now", responsibleStaff: "Biology Lab Assistant", capacity: "30 Students", nextBookings: ["Tomorrow 10:00 AM - Class 9C"], category: "Lab" },
  { id: 6, name: "Library", status: "Occupied", currentClass: "Reading Group 6C", currentTeacher: "Ms Iyer", timeSlot: "9:00 AM - 10:00 AM", responsibleStaff: "Librarian", capacity: "120 Students", nextBookings: ["10:30 AM - Class 7B", "1:00 PM - Class 8A"], category: "Common" },
  { id: 7, name: "Auditorium", status: "Available", currentClass: "—", currentTeacher: "—", timeSlot: "Open Now", responsibleStaff: "Event Coordinator", capacity: "300 Students", nextBookings: ["Thursday 11:00 AM - Assembly"], category: "Common" },
  { id: 8, name: "Sports Ground", status: "Occupied", currentClass: "Class 10B", currentTeacher: "Coach Ravi", timeSlot: "8:00 AM - 9:00 AM", responsibleStaff: "Sports Coordinator", capacity: "200 Students", nextBookings: ["10:00 AM - Class 8A", "3:00 PM - House Practice"], category: "Sports" },
  { id: 9, name: "Basketball Court", status: "Scheduled", currentClass: "Class 9A", currentTeacher: "Coach Ananya", timeSlot: "12:30 PM - 1:30 PM", responsibleStaff: "Sports Coordinator", capacity: "60 Students", nextBookings: ["3:00 PM - Class 7C"], category: "Sports" },
  { id: 10, name: "Music Room", status: "Available", currentClass: "—", currentTeacher: "—", timeSlot: "Open Now", responsibleStaff: "Music Teacher", capacity: "24 Students", nextBookings: ["Friday 11:00 AM - Choir Practice"], category: "Activity" },
  { id: 11, name: "Art Room", status: "Occupied", currentClass: "Class 7C", currentTeacher: "Ms Khan", timeSlot: "1:00 PM - 2:00 PM", responsibleStaff: "Art Teacher", capacity: "28 Students", nextBookings: ["2:30 PM - Class 6B"], category: "Activity" },
  { id: 12, name: "Activity Hall", status: "Scheduled", currentClass: "Class 8C", currentTeacher: "Mr Thomas", timeSlot: "2:00 PM - 3:00 PM", responsibleStaff: "Activity Coordinator", capacity: "80 Students", nextBookings: ["4:00 PM - Club Meeting"], category: "Common" },
];

const TODAY_SCHEDULE: ScheduleEntry[] = [
  { facility: "Computer Lab 1", time: "10:00 AM - 11:00 AM", className: "Class 8A", teacher: "Mrs Sharma", status: "Occupied" },
  { facility: "Science Lab", time: "11:00 AM - 12:00 PM", className: "Class 9B", teacher: "Mr Verma", status: "Scheduled" },
  { facility: "Physics Lab", time: "1:00 PM - 2:00 PM", className: "Class 10A", teacher: "Mr Roy", status: "Scheduled" },
  { facility: "Library", time: "9:00 AM - 10:00 AM", className: "Reading Group 6C", teacher: "Ms Iyer", status: "Occupied" },
  { facility: "Sports Ground", time: "8:00 AM - 9:00 AM", className: "Class 10B", teacher: "Coach Ravi", status: "Occupied" },
  { facility: "Basketball Court", time: "12:30 PM - 1:30 PM", className: "Class 9A", teacher: "Coach Ananya", status: "Scheduled" },
  { facility: "Art Room", time: "1:00 PM - 2:00 PM", className: "Class 7C", teacher: "Ms Khan", status: "Occupied" },
  { facility: "Activity Hall", time: "2:00 PM - 3:00 PM", className: "Class 8C", teacher: "Mr Thomas", status: "Scheduled" },
];

const LIBRARY_STATS = [
  { label: "Total Books", value: "8,420" },
  { label: "Books Issued", value: "420" },
  { label: "Books Available", value: "8,000" },
  { label: "Overdue Books", value: "28" },
  { label: "New Books This Month", value: "12" },
];

const AI_INSIGHTS = [
  { id: "ai1", text: "Computer Lab 1 has the highest utilization this week at 92%.", type: "info" as const, icon: "info" },
  { id: "ai2", text: "Science Lab is booked for 85% of available slots — consider extending hours.", type: "warning" as const, icon: "alert-triangle" },
  { id: "ai3", text: "Library book issuance increased by 12% this month — positive trend.", type: "success" as const, icon: "trending-up" },
  { id: "ai4", text: "Auditorium remains available for most afternoon slots — underutilized.", type: "info" as const, icon: "info" },
  { id: "ai5", text: "Sports Ground has 4 scheduled sessions today — peak usage.", type: "info" as const, icon: "info" },
];

const INSIGHT_ACTIONS = [
  { id: "ia1", text: "Extend Computer Lab hours to meet demand.", priority: "medium" as const },
  { id: "ia2", text: "Schedule maintenance for Chemistry Lab during low-usage window.", priority: "low" as const },
  { id: "ia3", text: "Promote Auditorium availability for parent workshops.", priority: "low" as const },
  { id: "ia4", text: "Review Sports Ground booking conflicts for next week.", priority: "medium" as const },
];

const STATUS_META: Record<FacilityStatus, { bg: string; text: string; dot: string }> = {
  Available: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  Occupied: { bg: "bg-sky-500/10", text: "text-sky-600", dot: "bg-sky-500" },
  Scheduled: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
};

const INSIGHT_STYLES: Record<string, { bg: string; border: string; iconColor: string }> = {
  warning: { bg: "bg-amber-500/5", border: "border-amber-200/50", iconColor: "text-amber-500" },
  success: { bg: "bg-emerald-500/5", border: "border-emerald-200/50", iconColor: "text-emerald-500" },
  info: { bg: "bg-sky-500/5", border: "border-sky-200/50", iconColor: "text-sky-500" },
  danger: { bg: "bg-red-500/5", border: "border-red-200/50", iconColor: "text-red-500" },
};

function FacilitiesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FacilityStatus | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeTab, setActiveTab] = useState("facilities");

  const filteredFacilities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FACILITIES.filter((f) => {
      const matchesStatus = !statusFilter || f.status === statusFilter;
      const matchesSearch = !q || f.name.toLowerCase().includes(q) || f.currentClass.toLowerCase().includes(q) || f.currentTeacher.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const filteredSchedule = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TODAY_SCHEDULE.filter((e) => {
      const matchesStatus = !statusFilter || e.status === statusFilter;
      const matchesSearch = !q || e.facility.toLowerCase().includes(q) || e.className.toLowerCase().includes(q) || e.teacher.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const occupiedCount = FACILITIES.filter((f) => f.status === "Occupied").length;
  const availableCount = FACILITIES.filter((f) => f.status === "Available").length;
  const scheduledCount = FACILITIES.filter((f) => f.status === "Scheduled").length;

  return (
    <div>
      <PageHeader
        title="Facilities & Resources"
        subtitle="See what is occupied, what is free, and how school spaces are being used today."
        action={
          <div className="flex items-center gap-2">
            <Badge className="border-0 bg-emerald-500/10 text-emerald-600">
              <Building2 className="mr-1 size-3" />
              {occupiedCount} occupied
            </Badge>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-violet-600 hover:bg-violet-700">
              <CalendarDays className="size-3" /> Book Facility
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <KpiCard icon={Building2} label="Total Facilities" value={String(FACILITIES.length)} tone="violet" />
        <KpiCard icon={Wrench} label="Currently Occupied" value={String(occupiedCount)} tone="sky" />
        <KpiCard icon={Clock3} label="Available Now" value={String(availableCount)} tone="emerald" />
        <KpiCard icon={CalendarDays} label="Scheduled" value={String(scheduledCount)} tone="amber" />
        <KpiCard icon={BookOpen} label="Library Books" value="8,420" tone="violet" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="p-4 mb-8">
          <TabsList className="h-11">
            <TabsTrigger value="facilities" className="text-sm gap-2 px-5"><LayoutGrid className="size-4" /> Facilities</TabsTrigger>
            <TabsTrigger value="schedule" className="text-sm gap-2 px-5"><Calendar className="size-4" /> Schedule</TabsTrigger>
            <TabsTrigger value="library" className="text-sm gap-2 px-5"><Library className="size-4" /> Library</TabsTrigger>
            <TabsTrigger value="insights" className="text-sm gap-2 px-5"><Lightbulb className="size-4" /> Insights</TabsTrigger>
          </TabsList>
        </Card>

        {/* ═══ FACILITIES TAB ═══ */}
        <TabsContent value="facilities">
          <div className="space-y-4">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search facility, class, or teacher..."
                    className="h-8 pl-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={statusFilter ?? "all"} onValueChange={(v) => setStatusFilter(v === "all" ? null : v as FacilityStatus)}>
                    <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Occupied">Occupied</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Facility Cards */}
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredFacilities.map((facility) => {
                const meta = STATUS_META[facility.status];
                return (
                  <button
                    key={facility.id}
                    onClick={() => setSelectedFacility(facility)}
                    className="rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={cn("size-9 rounded-lg grid place-items-center", meta.bg)}>
                          <Building2 className={cn("size-4", meta.text)} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{facility.name}</div>
                          <div className="text-[10px] text-muted-foreground">{facility.category}</div>
                        </div>
                      </div>
                      <Badge className={cn("border-0 text-[8px]", meta.bg, meta.text)}>
                        <span className={cn("size-1.5 rounded-full mr-1", meta.dot)} />
                        {facility.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Row label="Current" value={facility.currentClass} />
                      <Row label="Teacher" value={facility.currentTeacher} />
                      <Row label="Time Slot" value={facility.timeSlot} />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{facility.capacity}</span>
                      <span>{facility.responsibleStaff}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ═══ SCHEDULE TAB ═══ */}
        <TabsContent value="schedule">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Today's Schedule</h3>
              <Badge variant="outline" className="text-[9px]">{filteredSchedule.length} sessions</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Facility</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Time</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Class</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Teacher</th>
                    <th className="text-center p-2 text-[10px] font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.map((entry) => {
                    const meta = STATUS_META[entry.status];
                    return (
                      <tr key={`${entry.facility}-${entry.time}`} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className={cn("size-7 rounded-lg grid place-items-center", meta.bg)}>
                              <Building2 className={cn("size-3.5", meta.text)} />
                            </div>
                            <span className="font-medium">{entry.facility}</span>
                          </div>
                        </td>
                        <td className="p-2 text-muted-foreground">{entry.time}</td>
                        <td className="p-2 text-muted-foreground">{entry.className}</td>
                        <td className="p-2 text-muted-foreground">{entry.teacher}</td>
                        <td className="p-2 text-center">
                          <Badge className={cn("border-0 text-[8px]", meta.bg, meta.text)}>{entry.status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ═══ LIBRARY TAB ═══ */}
        <TabsContent value="library">
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
              {LIBRARY_STATS.map((stat) => (
                <Card key={stat.label} className="p-4">
                  <div className="text-[10px] text-muted-foreground mb-1">{stat.label}</div>
                  <div className="text-lg font-semibold">{stat.value}</div>
                </Card>
              ))}
            </div>
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4">Library Overview</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="size-8 rounded-lg bg-violet-500/10 grid place-items-center"><BookOpen className="size-4 text-violet-500" /></div>
                    <span className="text-xs font-semibold">Book Collection</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Total Books</span><span className="font-semibold">8,420</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Fiction</span><span className="font-semibold">3,200</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Non-Fiction</span><span className="font-semibold">4,100</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Reference</span><span className="font-semibold">1,120</span></div>
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="size-8 rounded-lg bg-sky-500/10 grid place-items-center"><TrendingUp className="size-4 text-sky-500" /></div>
                    <span className="text-xs font-semibold">Issuance Trends</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">This Week</span><span className="font-semibold">98 issues</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Last Week</span><span className="font-semibold">87 issues</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Growth</span><span className="font-semibold text-emerald-600">+12%</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Most Popular</span><span className="font-semibold">Science</span></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ═══ INSIGHTS TAB ═══ */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Sparkles className="size-3.5 text-violet-500" /> Facility Insights
              </h4>
              <div className="space-y-2">
                {AI_INSIGHTS.map((insight) => {
                  const styles = INSIGHT_STYLES[insight.type];
                  const iconMap: Record<string, typeof AlertTriangle> = { "alert-triangle": AlertTriangle, info: Info, "trending-up": TrendingUp };
                  const Icon = iconMap[insight.icon] || Info;
                  return (
                    <div key={insight.id} className={cn("flex items-start gap-3 rounded-xl border p-3", styles.bg, styles.border)}>
                      <Icon className={cn("size-3.5 shrink-0 mt-0.5", styles.iconColor)} />
                      <span className="text-xs">{insight.text}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                {INSIGHT_ACTIONS.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5">
                    <div className={cn(
                      "size-6 rounded-lg grid place-items-center shrink-0",
                      action.priority === "medium" ? "bg-amber-500/10" : "bg-sky-500/10"
                    )}>
                      <span className={cn(
                        "text-[10px] font-bold",
                        action.priority === "medium" ? "text-amber-600" : "text-sky-600"
                      )}>
                        {action.priority === "medium" ? "!" : "i"}
                      </span>
                    </div>
                    <p className="text-xs flex-1">{action.text}</p>
                    <Badge variant="outline" className="text-[9px] capitalize">{action.priority}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Sheet */}
      <Sheet open={Boolean(selectedFacility)} onOpenChange={(open) => !open && setSelectedFacility(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-sm">Facility Details</SheetTitle>
            <SheetDescription className="text-xs">Quick view of the selected facility.</SheetDescription>
          </SheetHeader>
          {selectedFacility && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("size-10 rounded-lg grid place-items-center", STATUS_META[selectedFacility.status].bg)}>
                  <Building2 className={cn("size-5", STATUS_META[selectedFacility.status].text)} />
                </div>
                <div>
                  <div className="text-sm font-semibold">{selectedFacility.name}</div>
                  <Badge className={cn("border-0 text-[8px] mt-1", STATUS_META[selectedFacility.status].bg, STATUS_META[selectedFacility.status].text)}>
                    {selectedFacility.status}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <DetailBlock label="Current Booking" value={selectedFacility.currentClass} />
                <DetailBlock label="Teacher" value={selectedFacility.currentTeacher} />
                <DetailBlock label="Capacity" value={selectedFacility.capacity} />
                <DetailBlock label="Responsible Staff" value={selectedFacility.responsibleStaff} />
                <DetailBlock label="Time Slot" value={selectedFacility.timeSlot} />
                <DetailBlock label="Category" value={selectedFacility.category} />
              </div>

              <div className="rounded-xl border border-border/60 p-4">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Upcoming Bookings</div>
                <div className="space-y-1.5">
                  {selectedFacility.nextBookings.map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-xs">
                      <span>{item}</span>
                      <Clock3 className="size-3 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full h-9 text-xs" onClick={() => toast.success("Booking initiated (demo)")}>
                <CalendarDays className="mr-1.5 size-3" /> Book This Facility
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, tone }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "violet" | "sky" | "emerald" | "amber" | "red";
}) {
  const tones = {
    violet: "bg-violet-500/10 text-violet-500",
    sky: "bg-sky-500/10 text-sky-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    red: "bg-red-500/10 text-red-500",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", tones[tone])}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] text-muted-foreground truncate">{label}</div>
          <div className="text-lg font-semibold truncate">{value}</div>
        </div>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 p-3">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="mt-1 text-xs font-medium">{value}</div>
    </div>
  );
}
