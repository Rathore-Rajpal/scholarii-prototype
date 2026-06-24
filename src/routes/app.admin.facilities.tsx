import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { BarChart3, BookOpen, Building2, Calendar, CalendarDays, Clock3, Eye, LayoutGrid, Library, Lightbulb, Sparkles, X } from "lucide-react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin/facilities")({ component: AdminFacilitiesPage });

type FacilityStatus = "Available" | "Occupied" | "Scheduled";
type Facility = { name: string; status: FacilityStatus; currentClass: string; teacher: string; time: string; category: string; capacity: string };
type Booking = { facility: string; time: string; className: string; teacher: string; status: FacilityStatus };

const facilities: Facility[] = [
  { name: "Computer Lab 1", status: "Occupied", currentClass: "Class 8A", teacher: "Mrs Sharma", time: "10:00-11:00 AM", category: "Lab", capacity: "40 Students" },
  { name: "Science Lab", status: "Scheduled", currentClass: "Class 9B", teacher: "Mr Verma", time: "11:00-12:00 PM", category: "Lab", capacity: "36 Students" },
  { name: "Physics Lab", status: "Scheduled", currentClass: "Class 10A", teacher: "Mr Roy", time: "1:00-2:00 PM", category: "Lab", capacity: "32 Students" },
  { name: "Chemistry Lab", status: "Available", currentClass: "-", teacher: "-", time: "Open Now", category: "Lab", capacity: "30 Students" },
  { name: "Biology Lab", status: "Available", currentClass: "-", teacher: "-", time: "Open Now", category: "Lab", capacity: "30 Students" },
  { name: "Library", status: "Occupied", currentClass: "Reading Group 6C", teacher: "Ms Iyer", time: "9:00-10:00 AM", category: "Common", capacity: "120 Students" },
  { name: "Auditorium", status: "Available", currentClass: "-", teacher: "-", time: "Open Now", category: "Common", capacity: "300 Students" },
  { name: "Sports Ground", status: "Occupied", currentClass: "Class 10B", teacher: "Coach Ravi", time: "8:00-9:00 AM", category: "Sports", capacity: "200 Students" },
  { name: "Basketball Court", status: "Scheduled", currentClass: "Class 9A", teacher: "Coach Ananya", time: "12:30-1:30 PM", category: "Sports", capacity: "60 Students" },
  { name: "Music Room", status: "Available", currentClass: "-", teacher: "-", time: "Open Now", category: "Activity", capacity: "24 Students" },
  { name: "Art Room", status: "Occupied", currentClass: "Class 7C", teacher: "Ms Khan", time: "1:00-2:00 PM", category: "Activity", capacity: "28 Students" },
  { name: "Activity Hall", status: "Scheduled", currentClass: "Class 8C", teacher: "Mr Thomas", time: "2:00-3:00 PM", category: "Common", capacity: "80 Students" },
];

const bookings: Booking[] = [
  { facility: "Computer Lab 1", time: "10:00-11:00 AM", className: "Class 8A", teacher: "Mrs Sharma", status: "Occupied" },
  { facility: "Science Lab", time: "11:00-12:00 PM", className: "Class 9B", teacher: "Mr Verma", status: "Scheduled" },
  { facility: "Physics Lab", time: "1:00-2:00 PM", className: "Class 10A", teacher: "Mr Roy", status: "Scheduled" },
  { facility: "Library", time: "9:00-10:00 AM", className: "Reading Group 6C", teacher: "Ms Iyer", status: "Occupied" },
  { facility: "Sports Ground", time: "8:00-9:00 AM", className: "Class 10B", teacher: "Coach Ravi", status: "Occupied" },
  { facility: "Basketball Court", time: "12:30-1:30 PM", className: "Class 9A", teacher: "Coach Ananya", status: "Scheduled" },
  { facility: "Art Room", time: "1:00-2:00 PM", className: "Class 7C", teacher: "Ms Khan", status: "Occupied" },
  { facility: "Activity Hall", time: "2:00-3:00 PM", className: "Class 8C", teacher: "Mr Thomas", status: "Scheduled" },
];

const libraryStats = [
  ["Total Books", "8,420"],
  ["Books Issued", "420"],
  ["Books Available", "8,000"],
  ["Overdue", "28"],
  ["New This Month", "12"],
];

const insights = [
  "Computer Lab 1 has the highest utilization this week at 92%.",
  "Science Lab is booked for 85% of available slots; consider extending practical periods.",
  "Library book issuance increased by 12% this month.",
  "Auditorium remains open for most afternoon slots.",
  "Sports Ground has peak utilization between 8 AM and 10 AM.",
];

const statusMeta: Record<FacilityStatus, { bg: string; text: string; dot: string }> = {
  Available: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  Occupied: { bg: "bg-sky-500/10", text: "text-sky-600", dot: "bg-sky-500" },
  Scheduled: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
};

function AdminFacilitiesPage() {
  const [activeTab, setActiveTab] = useState("facilities");
  const [bookingOpen, setBookingOpen] = useState(false);
  const occupied = facilities.filter((facility) => facility.status === "Occupied").length;
  const available = facilities.filter((facility) => facility.status === "Available").length;
  const scheduled = facilities.filter((facility) => facility.status === "Scheduled").length;

  return (
    <div>
      <PageHeader
        title="Facilities & Room Management"
        subtitle="Room availability, bookings, and facility status"
        action={<Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-700" onClick={() => setBookingOpen(true)}><CalendarDays className="size-4" /> Book Facility</Button>}
      />

      <div className="mb-8 kpi-mobile-scroll grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <KpiCard icon={Building2} label="Total Facilities" value={String(facilities.length)} tone="violet" />
        <KpiCard icon={Clock3} label="Currently Occupied" value={String(occupied)} tone="sky" />
        <KpiCard icon={CalendarDays} label="Available Now" value={String(available)} tone="emerald" />
        <KpiCard icon={Calendar} label="Upcoming Bookings" value={String(scheduled)} tone="amber" />
        <KpiCard icon={BookOpen} label="Library Books" value="8,420" tone="violet" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="mb-8 p-4">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="facilities" className="gap-2 px-5"><LayoutGrid className="size-4" /> Facilities</TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2 px-5"><Calendar className="size-4" /> Schedule</TabsTrigger>
            <TabsTrigger value="library" className="gap-2 px-5"><Library className="size-4" /> Library</TabsTrigger>
            <TabsTrigger value="insights" className="gap-2 px-5"><Lightbulb className="size-4" /> Insights</TabsTrigger>
          </TabsList>
        </Card>

        <TabsContent value="facilities">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {facilities.map((facility) => {
              const meta = statusMeta[facility.status];
              return (
                <Card key={facility.name} className="p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("grid size-9 place-items-center rounded-lg", meta.bg)}>
                        <Building2 className={cn("size-4", meta.text)} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{facility.name}</div>
                        <div className="text-[10px] text-muted-foreground">{facility.category}</div>
                      </div>
                    </div>
                    <Badge className={cn("border-0 text-[10px]", meta.bg, meta.text)}>
                      <span className={cn("mr-1 size-1.5 rounded-full", meta.dot)} />
                      {facility.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Row label="Current" value={facility.currentClass} />
                    <Row label="Teacher" value={facility.teacher} />
                    <Row label="Time" value={facility.time} />
                  </div>
                  <div className="mt-3 text-[10px] text-muted-foreground">{facility.capacity}</div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Today's Bookings</h3>
              <Badge variant="outline">{bookings.length} rows</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    {["Facility", "Time", "Class", "Teacher", "Status"].map((head) => <th key={head} className="p-2 text-left text-[10px] font-medium text-muted-foreground">{head}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const meta = statusMeta[booking.status];
                    return (
                      <tr key={`${booking.facility}-${booking.time}`} className="border-b border-border/30">
                        <td className="p-2 font-medium">{booking.facility}</td>
                        <td className="p-2 text-muted-foreground">{booking.time}</td>
                        <td className="p-2 text-muted-foreground">{booking.className}</td>
                        <td className="p-2 text-muted-foreground">{booking.teacher}</td>
                        <td className="p-2"><Badge className={cn("border-0 text-[10px]", meta.bg, meta.text)}>{booking.status}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {libraryStats.map(([label, value]) => <Card key={label} className="p-4"><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></Card>)}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-violet-500" /> Utilization Signals</h3>
            <div className="space-y-2">
              {insights.map((insight) => (
                <div key={insight} className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-violet-500" />
                  <p className="text-xs text-muted-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 p-4">
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700" onClick={() => setBookingOpen(true)}><CalendarDays className="size-4" /> Book Facility</Button>
          <Button variant="ghost" className="gap-2"><Eye className="size-4" /> View Full Schedule</Button>
          <Button variant="ghost" className="gap-2"><BarChart3 className="size-4" /> Generate Report</Button>
        </div>
      </Card>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-background p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Book Facility</h2>
            <p className="text-sm text-muted-foreground">Reserve a room or campus space for a class or group.</p>
          </div>
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" onClick={onClose}><X className="size-5" /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-medium">Facility *</span><Select><SelectTrigger><SelectValue placeholder="Select facility" /></SelectTrigger><SelectContent>{facilities.map((facility) => <SelectItem key={facility.name} value={facility.name}>{facility.name}</SelectItem>)}</SelectContent></Select></label>
          <label className="space-y-1.5"><span className="text-xs font-medium">Date *</span><Input type="date" /></label>
          <label className="space-y-1.5"><span className="text-xs font-medium">Class/Group *</span><Input placeholder="Class 8A" /></label>
          <label className="space-y-1.5"><span className="text-xs font-medium">Time From *</span><Input type="time" /></label>
          <label className="space-y-1.5"><span className="text-xs font-medium">Time To *</span><Input type="time" /></label>
          <label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-medium">Teacher/Coordinator *</span><Input placeholder="Teacher name" /></label>
          <label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-medium">Purpose</span><Textarea placeholder="Purpose of booking" /></label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => { toast.success("Facility booking confirmed"); onClose(); }}>Confirm Booking</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function KpiCard({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: "violet" | "sky" | "emerald" | "amber" }) {
  const tones = {
    violet: "bg-violet-500/10 text-violet-500",
    sky: "bg-sky-500/10 text-sky-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
  };
  return <Card className="p-4"><div className="flex items-center gap-3"><div className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone])}><Icon className="size-5" /></div><div><p className="text-[11px] text-muted-foreground">{label}</p><p className="text-lg font-semibold">{value}</p></div></div></Card>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3 text-xs"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
