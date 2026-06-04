import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  Clock3,
  Search,
  Users,
  Wrench,
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
};

type ScheduleEntry = {
  facility: string;
  time: string;
  className: string;
  teacher: string;
  status: FacilityStatus;
};

const facilities: Facility[] = [
  {
    id: 1,
    name: "Computer Lab 1",
    status: "Occupied",
    currentClass: "Class 8A",
    currentTeacher: "Mrs Sharma",
    timeSlot: "10:00 AM - 11:00 AM",
    responsibleStaff: "IT Coordinator",
    capacity: "40 Students",
    nextBookings: ["11:00 AM - Class 7A", "12:00 PM - Class 9B"],
  },
  {
    id: 2,
    name: "Science Lab",
    status: "Scheduled",
    currentClass: "Class 9B",
    currentTeacher: "Mr Verma",
    timeSlot: "11:00 AM - 12:00 PM",
    responsibleStaff: "Science Lab Assistant",
    capacity: "36 Students",
    nextBookings: ["12:00 PM - Class 10A", "2:00 PM - Class 8C"],
  },
  {
    id: 3,
    name: "Physics Lab",
    status: "Scheduled",
    currentClass: "Class 10A",
    currentTeacher: "Mr Roy",
    timeSlot: "1:00 PM - 2:00 PM",
    responsibleStaff: "Lab Supervisor",
    capacity: "32 Students",
    nextBookings: ["2:00 PM - Class 9A"],
  },
  {
    id: 4,
    name: "Chemistry Lab",
    status: "Available",
    currentClass: "No Current Booking",
    currentTeacher: "No Current Booking",
    timeSlot: "Open Now",
    responsibleStaff: "Chemistry Lab Assistant",
    capacity: "30 Students",
    nextBookings: ["Tomorrow 9:00 AM - Class 10B"],
  },
  {
    id: 5,
    name: "Biology Lab",
    status: "Available",
    currentClass: "No Current Booking",
    currentTeacher: "No Current Booking",
    timeSlot: "Open Now",
    responsibleStaff: "Biology Lab Assistant",
    capacity: "30 Students",
    nextBookings: ["Tomorrow 10:00 AM - Class 9C"],
  },
  {
    id: 6,
    name: "Library",
    status: "Occupied",
    currentClass: "Reading Group 6C",
    currentTeacher: "Ms Iyer",
    timeSlot: "9:00 AM - 10:00 AM",
    responsibleStaff: "Librarian",
    capacity: "120 Students",
    nextBookings: ["10:30 AM - Class 7B", "1:00 PM - Class 8A"],
  },
  {
    id: 7,
    name: "Auditorium",
    status: "Available",
    currentClass: "No Current Booking",
    currentTeacher: "No Current Booking",
    timeSlot: "Open Now",
    responsibleStaff: "Event Coordinator",
    capacity: "300 Students",
    nextBookings: ["Thursday 11:00 AM - Assembly"],
  },
  {
    id: 8,
    name: "Sports Ground",
    status: "Occupied",
    currentClass: "Class 10B",
    currentTeacher: "Coach Ravi",
    timeSlot: "8:00 AM - 9:00 AM",
    responsibleStaff: "Sports Coordinator",
    capacity: "200 Students",
    nextBookings: ["10:00 AM - Class 8A", "3:00 PM - House Practice"],
  },
  {
    id: 9,
    name: "Basketball Court",
    status: "Scheduled",
    currentClass: "Class 9A",
    currentTeacher: "Coach Ananya",
    timeSlot: "12:30 PM - 1:30 PM",
    responsibleStaff: "Sports Coordinator",
    capacity: "60 Students",
    nextBookings: ["3:00 PM - Class 7C"],
  },
  {
    id: 10,
    name: "Music Room",
    status: "Available",
    currentClass: "No Current Booking",
    currentTeacher: "No Current Booking",
    timeSlot: "Open Now",
    responsibleStaff: "Music Teacher",
    capacity: "24 Students",
    nextBookings: ["Friday 11:00 AM - Choir Practice"],
  },
  {
    id: 11,
    name: "Art Room",
    status: "Occupied",
    currentClass: "Class 7C",
    currentTeacher: "Ms Khan",
    timeSlot: "1:00 PM - 2:00 PM",
    responsibleStaff: "Art Teacher",
    capacity: "28 Students",
    nextBookings: ["2:30 PM - Class 6B"],
  },
  {
    id: 12,
    name: "Activity Hall",
    status: "Scheduled",
    currentClass: "Class 8C",
    currentTeacher: "Mr Thomas",
    timeSlot: "2:00 PM - 3:00 PM",
    responsibleStaff: "Activity Coordinator",
    capacity: "80 Students",
    nextBookings: ["4:00 PM - Club Meeting"],
  },
];

const todaySchedule: ScheduleEntry[] = [
  { facility: "Computer Lab 1", time: "10:00 AM - 11:00 AM", className: "Class 8A", teacher: "Mrs Sharma", status: "Occupied" },
  { facility: "Science Lab", time: "11:00 AM - 12:00 PM", className: "Class 9B", teacher: "Mr Verma", status: "Scheduled" },
  { facility: "Physics Lab", time: "1:00 PM - 2:00 PM", className: "Class 10A", teacher: "Mr Roy", status: "Scheduled" },
  { facility: "Library", time: "9:00 AM - 10:00 AM", className: "Reading Group 6C", teacher: "Ms Iyer", status: "Occupied" },
  { facility: "Sports Ground", time: "8:00 AM - 9:00 AM", className: "Class 10B", teacher: "Coach Ravi", status: "Occupied" },
  { facility: "Basketball Court", time: "12:30 PM - 1:30 PM", className: "Class 9A", teacher: "Coach Ananya", status: "Scheduled" },
  { facility: "Art Room", time: "1:00 PM - 2:00 PM", className: "Class 7C", teacher: "Ms Khan", status: "Occupied" },
  { facility: "Activity Hall", time: "2:00 PM - 3:00 PM", className: "Class 8C", teacher: "Mr Thomas", status: "Scheduled" },
];

const insights = [
  "Computer Lab 1 has the highest utilization this week.",
  "Science Lab is booked for 85% of available slots.",
  "Library book issuance increased by 12% this month.",
  "Auditorium remains available for most afternoon slots.",
  "Sports Ground has 4 scheduled sessions today.",
];

const libraryStats = [
  { label: "Total Books", value: "8,420" },
  { label: "Books Issued", value: "420" },
  { label: "Books Available", value: "8,000" },
  { label: "Overdue Books", value: "28" },
  { label: "New Books Added", value: "12 This Month" },
];

const overviewStats = [
  { label: "Total Facilities", value: "12 Facilities", icon: Building2 },
  { label: "Currently Occupied", value: "6", icon: Wrench },
  { label: "Available Now", value: "4", icon: Clock3 },
  { label: "Upcoming Bookings", value: "18 Today", icon: CalendarDays },
  { label: "Library Books", value: "8,420 Books", icon: BookOpen },
];

function FacilitiesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FacilityStatus | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const scheduleSectionRef = useRef<HTMLDivElement | null>(null);

  const filteredFacilities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return facilities.filter((facility) => {
      const matchesStatus = !statusFilter || facility.status === statusFilter;
      const matchesSearch =
        !q ||
        facility.name.toLowerCase().includes(q) ||
        facility.currentClass.toLowerCase().includes(q) ||
        facility.currentTeacher.toLowerCase().includes(q) ||
        facility.responsibleStaff.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const filteredSchedule = useMemo(() => {
    const q = search.trim().toLowerCase();
    return todaySchedule.filter((entry) => {
      const matchesStatus = !statusFilter || entry.status === statusFilter;
      const matchesSearch =
        !q ||
        entry.facility.toLowerCase().includes(q) ||
        entry.className.toLowerCase().includes(q) ||
        entry.teacher.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const occupiedCount = facilities.filter((facility) => facility.status === "Occupied").length;
  const availableCount = facilities.filter((facility) => facility.status === "Available").length;
  const upcomingCount = todaySchedule.filter((entry) => entry.status === "Scheduled").length;

  const openFacility = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  const handleQuickAction = (label: string) => {
    if (label === "View Full Schedule") {
      scheduleSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    toast(`"${label}" is a demo action in this prototype.`);
  };

  const statusClass = (status: FacilityStatus) =>
    cn(
      status === "Available" && "border-emerald-200 bg-emerald-50 text-emerald-700",
      status === "Occupied" && "border-sky-200 bg-sky-50 text-sky-700",
      status === "Scheduled" && "border-amber-200 bg-amber-50 text-amber-700"
    );

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_35%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_35%),linear-gradient(to_bottom,rgba(248,250,252,0.9),transparent)]" />

      <PageHeader
        title="Facilities & Resources"
        subtitle="See what is occupied, what is free, and how school spaces are being used today."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              <Building2 className="mr-1 size-3.5" />
              Operational overview
            </Badge>
            <Badge variant="outline">{occupiedCount} occupied</Badge>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {overviewStats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border-border/60 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div>
                </div>
                <div className="grid size-10 place-items-center rounded-2xl bg-slate-50 text-slate-700">
                  <Icon className="size-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/60 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Search & Filters</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">Find a facility, class, or teacher</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              Available
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Occupied
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Scheduled
            </Badge>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search facility name, class, or teacher..."
              className="h-11 rounded-2xl border-border pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["Available", "Occupied", "Scheduled"] as FacilityStatus[]).map((item) => (
              <Button
                key={item}
                type="button"
                variant={statusFilter === item ? "default" : "outline"}
                className={cn("h-11 rounded-2xl px-4", statusFilter === item && "bg-brand-gradient text-white border-0")}
                onClick={() => setStatusFilter((current) => (current === item ? null : item))}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="border-border/60 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Facility Status</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">Major school facilities</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
              Green Available
            </Badge>
            <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
              Blue Occupied
            </Badge>
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
              Yellow Scheduled
            </Badge>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredFacilities.map((facility) => (
            <button
              key={facility.id}
              type="button"
              onClick={() => openFacility(facility)}
              className="rounded-3xl border border-border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold">{facility.name}</div>
                  <Badge variant="outline" className={cn("mt-2", statusClass(facility.status))}>
                    {facility.status}
                  </Badge>
                </div>
                <Building2 className="size-5 text-muted-foreground" />
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <Row label="Current Class" value={facility.currentClass} />
                <Row label="Current Teacher" value={facility.currentTeacher} />
                <Row label="Time Slot" value={facility.timeSlot} />
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div ref={scheduleSectionRef}>
        <Card className="border-border/60 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Today&apos;s Schedule</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">Bookings for today</h3>
            </div>
            <Badge variant="outline">{filteredSchedule.length} sessions</Badge>
          </div>

          <div className="mt-4 space-y-2">
            {filteredSchedule.map((entry) => (
              <button
                key={`${entry.facility}-${entry.time}`}
                type="button"
                onClick={() => openFacility(facilities.find((facility) => facility.name === entry.facility) ?? facilities[0])}
                className="grid w-full gap-3 rounded-2xl border border-border bg-white px-4 py-4 text-left transition-colors hover:bg-slate-50 lg:grid-cols-[1.3fr_1fr_1fr_1fr_0.7fr]"
              >
                <div>
                  <div className="font-semibold">{entry.facility}</div>
                  <div className="text-sm text-muted-foreground lg:hidden">{entry.time}</div>
                </div>
                <div className="text-sm text-muted-foreground">{entry.time}</div>
                <div className="text-sm text-muted-foreground">{entry.className}</div>
                <div className="text-sm text-muted-foreground">{entry.teacher}</div>
                <div>
                  <Badge variant="outline" className={cn("rounded-full", statusClass(entry.status))}>
                    {entry.status}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="border-border/60 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Library Overview</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">Library usage at a glance</h3>
            </div>
            <Badge variant="outline">Books</Badge>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {libraryStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-slate-50/70 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Resource Insights</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">Simple utilization signals</h3>
            </div>
            <Badge variant="outline">Concise</Badge>
          </div>

          <div className="mt-4 space-y-3">
            {insights.map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start gap-3">
                  <BarChart3 className="mt-0.5 size-4 text-cyan-600" />
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Book Facility", "View Full Schedule", "Generate Utilization Report"].map((label) => (
          <Button
            key={label}
            type="button"
            className={cn(
              "h-11 justify-start rounded-2xl",
              label === "Book Facility" ? "bg-brand-gradient text-white border-0" : "border-border bg-background text-foreground"
            )}
            variant={label === "Book Facility" ? "default" : "outline"}
            onClick={() => handleQuickAction(label)}
          >
            {label === "Book Facility" ? (
              <CalendarDays className="mr-2 size-4" />
            ) : label === "View Full Schedule" ? (
              <Clock3 className="mr-2 size-4" />
            ) : (
              <BarChart3 className="mr-2 size-4" />
            )}
            {label}
          </Button>
        ))}
      </div>

      <Sheet open={Boolean(selectedFacility)} onOpenChange={(open) => !open && setSelectedFacility(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Facility Details</SheetTitle>
            <SheetDescription>Quick view of the selected facility without leaving the page.</SheetDescription>
          </SheetHeader>

          {selectedFacility && (
            <div className="mt-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Facility Name</div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight">{selectedFacility.name}</div>
                </div>
                <Badge variant="outline" className={cn("rounded-full", statusClass(selectedFacility.status))}>
                  {selectedFacility.status}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailBlock label="Current Booking" value={selectedFacility.currentClass} />
                <DetailBlock label="Teacher" value={selectedFacility.currentTeacher} />
                <DetailBlock label="Capacity" value={selectedFacility.capacity} />
                <DetailBlock label="Responsible Staff" value={selectedFacility.responsibleStaff} />
                <DetailBlock label="Time Slot" value={selectedFacility.timeSlot} />
                <DetailBlock label="Status" value={selectedFacility.status} />
              </div>

              <div className="rounded-2xl border border-border bg-slate-50/70 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming Bookings</div>
                <div className="mt-3 space-y-2">
                  {selectedFacility.nextBookings.map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-xl bg-white px-3 py-3 text-sm">
                      <span>{item}</span>
                      <Clock3 className="size-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-slate-50/60 p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
