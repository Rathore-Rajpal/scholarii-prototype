import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  BarChart3,
  Users,
  UserCheck,
  UserX,
  ClipboardList,
  AlertCircle,
  FileText,
  Printer,
  CalendarPlus,
  ClipboardCheck,
} from "lucide-react";

export const Route = createFileRoute("/app/schedule")({ component: OperationsSchedulePage });

type PeriodAssignment = {
  className: string;
  subject: string;
  teacher: string;
  room: string;
  status: "present" | "absent";
  substitute?: string;
};

type PeriodSummary = {
  id: number;
  label: string;
  time: string;
  type: "lecture" | "break" | "lunch";
  activeClasses: number;
  teachersAssigned: number;
  teachersAbsent: number;
  substitutesAssigned: number;
  classes: PeriodAssignment[];
};

type ClassScheduleEntry = {
  type: "lecture" | "break" | "lunch";
  period?: number;
  time: string;
  subject?: string;
  teacher?: string;
  room?: string;
  label?: string;
};

const classRooms: Record<string, string> = {
  "Class 6A": "Room 204",
  "Class 7B": "Room 205",
  "Class 8A": "Room 208",
  "Class 8C": "Room 207",
  "Class 9A": "Room 206",
  "Class 9B": "Room 210",
  "Class 10A": "Room 301",
  "Class 10B": "Room 302",
};

const subjectRooms: Record<string, string> = {
  Computer: "Computer Lab",
  Science: "Science Lab",
  Biology: "Biology Lab",
  Physics: "Physics Lab",
  Chemistry: "Chemistry Lab",
  PE: "Sports Ground",
  Art: "Art Studio",
  Library: "Library",
};

const resolveRoom = (className: string, subject: string) => {
  return subjectRooms[subject] ?? classRooms[className] ?? "Room";
};

const periodSummaries: PeriodSummary[] = [
  {
    id: 1,
    label: "Period 1",
    time: "08:30 AM - 09:10 AM",
    type: "lecture",
    activeClasses: 44,
    teachersAssigned: 44,
    teachersAbsent: 1,
    substitutesAssigned: 1,
    classes: [
      { className: "Class 6A", subject: "Mathematics", teacher: "Mrs Sharma", room: resolveRoom("Class 6A", "Mathematics"), status: "present" },
      { className: "Class 7B", subject: "Science", teacher: "Mr Verma", room: resolveRoom("Class 7B", "Science"), status: "present" },
      { className: "Class 10A", subject: "English", teacher: "Mrs Patel", room: resolveRoom("Class 10A", "English"), status: "present" },
    ],
  },
  {
    id: 2,
    label: "Period 2",
    time: "09:15 AM - 09:55 AM",
    type: "lecture",
    activeClasses: 46,
    teachersAssigned: 46,
    teachersAbsent: 2,
    substitutesAssigned: 1,
    classes: [
      { className: "Class 6A", subject: "English", teacher: "Mrs Sharma", room: resolveRoom("Class 6A", "English"), status: "present" },
      { className: "Class 7B", subject: "Mathematics", teacher: "Mr Verma", room: resolveRoom("Class 7B", "Mathematics"), status: "present" },
      {
        className: "Class 9B",
        subject: "Social Studies",
        teacher: "Mrs Iyer",
        room: resolveRoom("Class 9B", "Social Studies"),
        status: "absent",
        substitute: "Mr Rajesh Kumar",
      },
    ],
  },
  {
    id: 3,
    label: "Period 3",
    time: "10:00 AM - 10:40 AM",
    type: "lecture",
    activeClasses: 45,
    teachersAssigned: 45,
    teachersAbsent: 2,
    substitutesAssigned: 1,
    classes: [
      { className: "Class 6A", subject: "Science", teacher: "Mrs Sharma", room: resolveRoom("Class 6A", "Science"), status: "present" },
      { className: "Class 8C", subject: "Computer", teacher: "Mr Khan", room: resolveRoom("Class 8C", "Computer"), status: "present" },
      {
        className: "Class 10B",
        subject: "Hindi",
        teacher: "Mr Patel",
        room: resolveRoom("Class 10B", "Hindi"),
        status: "absent",
      },
    ],
  },
  {
    id: 4,
    label: "Short Break",
    time: "10:40 AM - 10:55 AM",
    type: "break",
    activeClasses: 0,
    teachersAssigned: 0,
    teachersAbsent: 0,
    substitutesAssigned: 0,
    classes: [],
  },
  {
    id: 5,
    label: "Period 4",
    time: "10:55 AM - 11:35 AM",
    type: "lecture",
    activeClasses: 42,
    teachersAssigned: 42,
    teachersAbsent: 2,
    substitutesAssigned: 1,
    classes: [
      { className: "Class 6A", subject: "History", teacher: "Mrs Sharma", room: resolveRoom("Class 6A", "History"), status: "present" },
      { className: "Class 7B", subject: "Science", teacher: "Mr Verma", room: resolveRoom("Class 7B", "Science"), status: "present" },
      {
        className: "Class 8A",
        subject: "Mathematics",
        teacher: "Mrs Singh",
        room: resolveRoom("Class 8A", "Mathematics"),
        status: "absent",
        substitute: "Mr Khan",
      },
    ],
  },
  {
    id: 6,
    label: "Period 5",
    time: "11:40 AM - 12:20 PM",
    type: "lecture",
    activeClasses: 44,
    teachersAssigned: 44,
    teachersAbsent: 1,
    substitutesAssigned: 0,
    classes: [
      { className: "Class 6A", subject: "Computer", teacher: "Mrs Sharma", room: resolveRoom("Class 6A", "Computer"), status: "present" },
      { className: "Class 9B", subject: "English", teacher: "Mrs Iyer", room: resolveRoom("Class 9B", "English"), status: "present" },
      {
        className: "Class 10A",
        subject: "Mathematics",
        teacher: "Mr Patel",
        room: resolveRoom("Class 10A", "Mathematics"),
        status: "absent",
      },
    ],
  },
  {
    id: 7,
    label: "Period 6",
    time: "12:25 PM - 01:05 PM",
    type: "lecture",
    activeClasses: 43,
    teachersAssigned: 43,
    teachersAbsent: 1,
    substitutesAssigned: 1,
    classes: [
      { className: "Class 6A", subject: "PE", teacher: "Mr Roy", room: resolveRoom("Class 6A", "PE"), status: "present" },
      { className: "Class 8C", subject: "English", teacher: "Mrs Patel", room: resolveRoom("Class 8C", "English"), status: "present" },
      {
        className: "Class 9A",
        subject: "Science",
        teacher: "Mr Sharma",
        room: resolveRoom("Class 9A", "Science"),
        status: "absent",
        substitute: "Mrs Joseph",
      },
    ],
  },
  {
    id: 8,
    label: "Lunch Break",
    time: "01:05 PM - 01:40 PM",
    type: "lunch",
    activeClasses: 0,
    teachersAssigned: 0,
    teachersAbsent: 0,
    substitutesAssigned: 0,
    classes: [],
  },
  {
    id: 9,
    label: "Period 7",
    time: "01:40 PM - 02:20 PM",
    type: "lecture",
    activeClasses: 40,
    teachersAssigned: 40,
    teachersAbsent: 0,
    substitutesAssigned: 0,
    classes: [
      { className: "Class 6A", subject: "Art", teacher: "Mrs Dutta", room: resolveRoom("Class 6A", "Art"), status: "present" },
      { className: "Class 7B", subject: "Math", teacher: "Mr Verma", room: resolveRoom("Class 7B", "Math"), status: "present" },
      { className: "Class 10B", subject: "Biology", teacher: "Mrs Singh", room: resolveRoom("Class 10B", "Biology"), status: "present" },
    ],
  },
  {
    id: 10,
    label: "Period 8",
    time: "02:25 PM - 03:05 PM",
    type: "lecture",
    activeClasses: 38,
    teachersAssigned: 38,
    teachersAbsent: 1,
    substitutesAssigned: 0,
    classes: [
      { className: "Class 6A", subject: "Library", teacher: "Mrs Rao", room: resolveRoom("Class 6A", "Library"), status: "present" },
      { className: "Class 8A", subject: "Science", teacher: "Mr Roy", room: resolveRoom("Class 8A", "Science"), status: "present" },
      { className: "Class 9B", subject: "PE", teacher: "Mrs Khan", room: resolveRoom("Class 9B", "PE"), status: "absent" },
    ],
  },
];

const teacherAvailability = [
  {
    name: "Mrs Sharma",
    department: "Mathematics",
    assigned: [1, 2, 4, 6],
    free: [3, 5, 7, 8],
    status: "Teaching Class 8A",
  },
  {
    name: "Mr Khan",
    department: "Science",
    assigned: [2, 3, 5],
    free: [1, 4, 6, 7, 8],
    status: "Available",
  },
  {
    name: "Mrs Patel",
    department: "English",
    assigned: [1, 4, 6, 8],
    free: [2, 3, 5, 7],
    status: "Teaching Class 10A",
  },
  {
    name: "Mr Verma",
    department: "Science",
    assigned: [1, 2, 4, 7],
    free: [3, 5, 6, 8],
    status: "Teaching Class 7B",
  },
  {
    name: "Mrs Singh",
    department: "Biology",
    assigned: [3, 4, 7],
    free: [1, 2, 5, 6, 8],
    status: "Substituting Class 8A",
  },
];

const teacherStats: Record<string, { day: string; proxiesServed: number; freePeriods: number }[]> = {
  "Mrs Sharma": [
    { day: "Mon", proxiesServed: 2, freePeriods: 4 },
    { day: "Tue", proxiesServed: 1, freePeriods: 4 },
    { day: "Wed", proxiesServed: 3, freePeriods: 3 },
    { day: "Thu", proxiesServed: 2, freePeriods: 4 },
    { day: "Fri", proxiesServed: 4, freePeriods: 2 },
    { day: "Sat", proxiesServed: 0, freePeriods: 4 },
    { day: "Sun", proxiesServed: 1, freePeriods: 4 },
  ],
  "Mr Khan": [
    { day: "Mon", proxiesServed: 1, freePeriods: 5 },
    { day: "Tue", proxiesServed: 2, freePeriods: 5 },
    { day: "Wed", proxiesServed: 1, freePeriods: 5 },
    { day: "Thu", proxiesServed: 3, freePeriods: 4 },
    { day: "Fri", proxiesServed: 2, freePeriods: 5 },
    { day: "Sat", proxiesServed: 0, freePeriods: 5 },
    { day: "Sun", proxiesServed: 0, freePeriods: 5 },
  ],
  "Mrs Patel": [
    { day: "Mon", proxiesServed: 3, freePeriods: 4 },
    { day: "Tue", proxiesServed: 2, freePeriods: 4 },
    { day: "Wed", proxiesServed: 2, freePeriods: 4 },
    { day: "Thu", proxiesServed: 1, freePeriods: 4 },
    { day: "Fri", proxiesServed: 3, freePeriods: 4 },
    { day: "Sat", proxiesServed: 0, freePeriods: 4 },
    { day: "Sun", proxiesServed: 1, freePeriods: 4 },
  ],
  "Mr Verma": [
    { day: "Mon", proxiesServed: 2, freePeriods: 4 },
    { day: "Tue", proxiesServed: 3, freePeriods: 3 },
    { day: "Wed", proxiesServed: 1, freePeriods: 4 },
    { day: "Thu", proxiesServed: 2, freePeriods: 4 },
    { day: "Fri", proxiesServed: 4, freePeriods: 2 },
    { day: "Sat", proxiesServed: 0, freePeriods: 4 },
    { day: "Sun", proxiesServed: 2, freePeriods: 4 },
  ],
  "Mrs Singh": [
    { day: "Mon", proxiesServed: 4, freePeriods: 5 },
    { day: "Tue", proxiesServed: 3, freePeriods: 5 },
    { day: "Wed", proxiesServed: 5, freePeriods: 4 },
    { day: "Thu", proxiesServed: 2, freePeriods: 5 },
    { day: "Fri", proxiesServed: 3, freePeriods: 5 },
    { day: "Sat", proxiesServed: 1, freePeriods: 5 },
    { day: "Sun", proxiesServed: 2, freePeriods: 5 },
  ],
};

const substituteAssignments = [
  {
    teacher: "Mrs Sharma",
    reason: "Sick Leave",
    substitute: "Mr Khan",
    period: "Period 4",
    className: "Class 8A",
    status: "assigned",
  },
  {
    teacher: "Mr Patel",
    reason: "Training",
    substitute: "",
    period: "Period 5",
    className: "Class 9B",
    status: "pending",
  },
];

const classSchedules = [
  {
    className: "Class 8A",
    current: "Mathematics",
    teacher: "Mrs Singh",
    room: resolveRoom("Class 8A", "Mathematics"),
    next: "English",
    schedule: [
      { type: "lecture", period: 1, time: "08:30 AM - 09:10 AM", subject: "Science", teacher: "Mrs Dutta", room: resolveRoom("Class 8A", "Science") },
      { type: "lecture", period: 2, time: "09:15 AM - 09:55 AM", subject: "English", teacher: "Mrs Patel", room: resolveRoom("Class 8A", "English") },
      { type: "lecture", period: 3, time: "10:00 AM - 10:40 AM", subject: "History", teacher: "Mr Sharma", room: resolveRoom("Class 8A", "History") },
      { type: "break", time: "10:40 AM - 10:55 AM", label: "Short Break" },
      { type: "lecture", period: 4, time: "10:55 AM - 11:35 AM", subject: "Mathematics", teacher: "Mr Khan (Substitute)", room: resolveRoom("Class 8A", "Mathematics") },
      { type: "lecture", period: 5, time: "11:40 AM - 12:20 PM", subject: "Computer", teacher: "Mrs Rao", room: resolveRoom("Class 8A", "Computer") },
      { type: "lecture", period: 6, time: "12:25 PM - 01:05 PM", subject: "PE", teacher: "Mr Roy", room: resolveRoom("Class 8A", "PE") },
      { type: "lunch", time: "01:05 PM - 01:40 PM", label: "Lunch Break" },
      { type: "lecture", period: 7, time: "01:40 PM - 02:20 PM", subject: "Art", teacher: "Mrs Dutta", room: resolveRoom("Class 8A", "Art") },
      { type: "lecture", period: 8, time: "02:25 PM - 03:05 PM", subject: "Library", teacher: "Mrs Iyer", room: resolveRoom("Class 8A", "Library") },
    ],
  },
  {
    className: "Class 9B",
    current: "Social Studies",
    teacher: "Mr Rajesh Kumar",
    room: resolveRoom("Class 9B", "Social Studies"),
    next: "Mathematics",
    schedule: [
      { type: "lecture", period: 1, time: "08:30 AM - 09:10 AM", subject: "English", teacher: "Mrs Patel", room: resolveRoom("Class 9B", "English") },
      { type: "lecture", period: 2, time: "09:15 AM - 09:55 AM", subject: "Social Studies", teacher: "Mr Rajesh Kumar", room: resolveRoom("Class 9B", "Social Studies") },
      { type: "lecture", period: 3, time: "10:00 AM - 10:40 AM", subject: "Mathematics", teacher: "Mr Verma", room: resolveRoom("Class 9B", "Mathematics") },
      { type: "break", time: "10:40 AM - 10:55 AM", label: "Short Break" },
      { type: "lecture", period: 4, time: "10:55 AM - 11:35 AM", subject: "Science", teacher: "Mrs Singh", room: resolveRoom("Class 9B", "Science") },
      { type: "lecture", period: 5, time: "11:40 AM - 12:20 PM", subject: "English", teacher: "Mrs Iyer", room: resolveRoom("Class 9B", "English") },
      { type: "lecture", period: 6, time: "12:25 PM - 01:05 PM", subject: "Computer", teacher: "Mr Khan", room: resolveRoom("Class 9B", "Computer") },
      { type: "lunch", time: "01:05 PM - 01:40 PM", label: "Lunch Break" },
      { type: "lecture", period: 7, time: "01:40 PM - 02:20 PM", subject: "PE", teacher: "Mr Roy", room: resolveRoom("Class 9B", "PE") },
      { type: "lecture", period: 8, time: "02:25 PM - 03:05 PM", subject: "Library", teacher: "Mrs Rao", room: resolveRoom("Class 9B", "Library") },
    ],
  },
  {
    className: "Class 10A",
    current: "English",
    teacher: "Mrs Patel",
    room: resolveRoom("Class 10A", "English"),
    next: "Mathematics",
    schedule: [
      { type: "lecture", period: 1, time: "08:30 AM - 09:10 AM", subject: "Mathematics", teacher: "Mr Verma", room: resolveRoom("Class 10A", "Mathematics") },
      { type: "lecture", period: 2, time: "09:15 AM - 09:55 AM", subject: "Science", teacher: "Mrs Singh", room: resolveRoom("Class 10A", "Science") },
      { type: "lecture", period: 3, time: "10:00 AM - 10:40 AM", subject: "History", teacher: "Mr Sharma", room: resolveRoom("Class 10A", "History") },
      { type: "break", time: "10:40 AM - 10:55 AM", label: "Short Break" },
      { type: "lecture", period: 4, time: "10:55 AM - 11:35 AM", subject: "English", teacher: "Mrs Patel", room: resolveRoom("Class 10A", "English") },
      { type: "lecture", period: 5, time: "11:40 AM - 12:20 PM", subject: "Computer", teacher: "Mr Khan", room: resolveRoom("Class 10A", "Computer") },
      { type: "lecture", period: 6, time: "12:25 PM - 01:05 PM", subject: "PE", teacher: "Mr Roy", room: resolveRoom("Class 10A", "PE") },
      { type: "lunch", time: "01:05 PM - 01:40 PM", label: "Lunch Break" },
      { type: "lecture", period: 7, time: "01:40 PM - 02:20 PM", subject: "Art", teacher: "Mrs Dutta", room: resolveRoom("Class 10A", "Art") },
      { type: "lecture", period: 8, time: "02:25 PM - 03:05 PM", subject: "Library", teacher: "Mrs Rao", room: resolveRoom("Class 10A", "Library") },
    ],
  },
];

const eventsToday = [
  { title: "Morning Assembly", time: "08:15 AM", location: "Main Ground", owner: "Mrs Joseph", status: "completed" },
  { title: "Science Exhibition", time: "12:30 PM", location: "Auditorium", owner: "Mr Roy", status: "running" },
  { title: "PTM", time: "02:00 PM", location: "Hall B", owner: "Mrs Patel", status: "pending" },
];

const examsToday = [
  { subject: "Mathematics", className: "Class 10", time: "10:00 AM - 1:00 PM", invigilator: "Mr Khan", room: "Hall A" },
  { subject: "Physics", className: "Class 12", time: "10:00 AM - 1:00 PM", invigilator: "Mrs Singh", room: "Hall B" },
  { subject: "Chemistry", className: "Class 11", time: "1:30 PM - 4:00 PM", invigilator: "Mr Verma", room: "Lab 3" },
];

const dayStatus = {
  label: "Examination Day",
  tone: "warning",
  description: "Exams running today with staggered rooms and invigilation coverage.",
  examSummary: "3 exams across Classes 10-12",
};

function OperationsSchedulePage() {
  const now = useMemo(() => new Date(), []);
  const currentPeriodIndex = 4;
  const currentPeriod = periodSummaries[currentPeriodIndex];
  const [selectedClassName, setSelectedClassName] = useState<string>(classSchedules[0]?.className ?? "");
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<"Class Timetable" | "Teacher Schedule & Availability" | "School Events Today" | "Exam Operations">("Class Timetable");

  const availableTeachers = teacherAvailability.filter((teacher) => teacher.free.includes(currentPeriod.id));
  const selectedClass = classSchedules.find((cls) => cls.className === selectedClassName) || null;
  const selectedTeacher = teacherAvailability[selectedTeacherIndex];
  const totalTeachers = 18;
  const teachersAbsent = 2;
  const teachersPresent = totalTeachers - teachersAbsent;

  const handlePreviousTeacher = () => {
    setSelectedTeacherIndex((prev) => (prev === 0 ? teacherAvailability.length - 1 : prev - 1));
  };

  const handleNextTeacher = () => {
    setSelectedTeacherIndex((prev) => (prev === teacherAvailability.length - 1 ? 0 : prev + 1));
  };

  const sectionNav = [
    { label: "Class Timetable", description: "View the live class schedule.", icon: ClipboardList },
    { label: "Teacher Schedule & Availability", description: "See free slots and proxy coverage.", icon: Users },
    { label: "School Events Today", description: "Track todayâ€™s events and timings.", icon: CalendarClock },
    { label: "Exam Operations", description: "Check exam-day operations quickly.", icon: ClipboardCheck },
  ] as const;

  return (
    <div>
      <PageHeader
        title="School Operations Schedule"
        subtitle="Live operational visibility for today"
        action={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-brand-gradient text-white border-0"><ClipboardCheck className="size-4 mr-1" />Assign Substitute</Button>
            <Button size="sm" variant="outline"><CalendarClock className="size-4 mr-1" />View Full Timetable</Button>
            <Button size="sm" variant="outline"><UserX className="size-4 mr-1" />Mark Teacher Leave</Button>
            <Button size="sm" variant="outline"><CalendarPlus className="size-4 mr-1" />Schedule Event</Button>
            <Button size="sm" variant="outline"><FileText className="size-4 mr-1" />Daily Schedule Report</Button>
            <Button size="sm" variant="outline"><Printer className="size-4 mr-1" />Print Timetable</Button>
          </div>
        }
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Today</p>
                <h2 className="text-xl font-semibold">{now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h2>
                <p className="text-sm text-muted-foreground">Current time: {now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Current Period</p>
                <p className="text-lg font-semibold">{currentPeriod.label}</p>
                <p className="text-xs text-muted-foreground">{currentPeriod.time}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Today's School Status</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`size-2.5 rounded-full ${dayStatus.tone === "warning" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <p className="font-semibold">{dayStatus.label}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{dayStatus.description}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Exam coverage</span>
                <span className="font-medium text-foreground">{dayStatus.examSummary}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rooms allocated</span>
                <span className="font-medium text-foreground">Hall A, Hall B, Lab 3</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-3">
          {[
            { label: "Classes Running", value: "48", icon: ClipboardList },
            { label: "Teachers Present", value: String(teachersPresent), icon: UserCheck },
            { label: "Teachers Absent", value: String(teachersAbsent), icon: UserX },
            { label: "Substitutes Assigned", value: "3", icon: UserCheck },
            { label: "Events Today", value: "2", icon: CalendarClock },
            { label: "Exams Today", value: "6", icon: ClipboardCheck },
            { label: "Pending Replacements", value: "1", icon: AlertCircle },
          ].map((item) => (
            <Card key={item.label} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <item.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">{item.value}</div>
            </Card>
          ))}
        </div>

        <Card className="p-3 border-border/60 bg-white/70 backdrop-blur-xl shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {sectionNav.map((section) => {
              const isActive = activeSection === section.label;
              return (
                <button
                  key={section.label}
                  type="button"
                  onClick={() => setActiveSection(section.label)}
                  className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 backdrop-blur-md ${
                    isActive
                      ? "border-emerald-500/70 bg-gradient-to-b from-emerald-50/90 to-white/80 text-foreground shadow-[0_10px_30px_rgba(16,185,129,0.18)] ring-1 ring-emerald-200/60"
                      : "border-border/70 bg-white/50 text-muted-foreground hover:border-brand/25 hover:bg-white/80 hover:text-foreground hover:shadow-sm"
                  }`}
                >
                  <section.icon className={`size-4 transition-colors ${isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4 min-w-0">
            <div
              className={`overflow-hidden rounded-2xl transition-all duration-300 ease-out ${
                activeSection === "Class Timetable" ? "max-h-[2600px] opacity-100 translate-y-0" : "pointer-events-none max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <Card className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Class Timetable</h3>
                    <p className="text-sm text-muted-foreground">3 lectures • short break • 3 lectures • lunch • 2 lectures</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Select class</span>
                    <select
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                      value={selectedClassName}
                      onChange={(event) => setSelectedClassName(event.target.value)}
                    >
                      {classSchedules.map((cls) => (
                        <option key={cls.className} value={cls.className}>
                          {cls.className}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedClass ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    {selectedClass.schedule.map((slot, index) => (
                      <Card key={`${slot.time}-${index}`} className={slot.type === "lecture" ? "p-4" : "p-4 bg-muted/50"}>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">
                            {slot.type === "lecture" ? `Period ${slot.period}` : slot.label}
                          </p>
                          {slot.room && <Badge variant="outline">{slot.room}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{slot.time}</p>
                        {slot.subject && <p className="text-xs text-muted-foreground">{slot.subject}</p>}
                        {slot.teacher && <p className="text-xs text-muted-foreground">{slot.teacher}</p>}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No class selected.</div>
                )}
              </Card>
            </div>

            <div
              className={`overflow-hidden rounded-2xl transition-all duration-300 ease-out ${
                activeSection === "Teacher Schedule & Availability" ? "max-h-[2600px] opacity-100 translate-y-0" : "pointer-events-none max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Card className="p-5 xl:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Teacher Schedule & Availability</h3>
                      <p className="text-sm text-muted-foreground">Live status by period and free slots.</p>
                    </div>
                    <Badge variant="secondary">Current period {currentPeriod.label}</Badge>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Select teacher</span>
                      <select
                        className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                        value={selectedTeacherIndex}
                        onChange={(event) => setSelectedTeacherIndex(Number(event.target.value))}
                      >
                        {teacherAvailability.map((teacher, index) => (
                          <option key={teacher.name} value={index}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handlePreviousTeacher}
                      >
                        ? Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleNextTeacher}
                      >
                        Next ?
                      </Button>
                    </div>
                  </div>

                  {selectedTeacher && (
                    <>
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-semibold">{selectedTeacher.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{selectedTeacher.department}</p>
                          </div>
                          <Badge variant={selectedTeacher.status === "Available" ? "secondary" : "outline"}>{selectedTeacher.status}</Badge>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
                            <span
                              key={period}
                              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${selectedTeacher.assigned.includes(period) ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                            >
                              P{period} {selectedTeacher.assigned.includes(period) ? "✓" : "FREE"}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                          Free periods: <span className="text-foreground">{selectedTeacher.free.join(", ")}</span>
                        </div>
                      </Card>

                      <Card className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                          <div>
                            <h4 className="font-semibold text-lg">Performance - Last 7 Days</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Proxy coverage and free time for the selected teacher over the last week.
                            </p>
                          </div>
                          <Badge variant="outline">Weekly view</Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                          <div className="rounded-xl border border-border bg-muted/30 p-3">
                            <p className="text-xs text-muted-foreground">Avg. proxies</p>
                            <p className="mt-1 text-2xl font-semibold">
                              {Math.round(
                                teacherStats[selectedTeacher.name].reduce((sum, stat) => sum + stat.proxiesServed, 0) /
                                  teacherStats[selectedTeacher.name].length
                              )}
                            </p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/30 p-3">
                            <p className="text-xs text-muted-foreground">Busiest day</p>
                            <p className="mt-1 text-2xl font-semibold">
                              {
                                teacherStats[selectedTeacher.name].reduce((best, stat) =>
                                  stat.proxiesServed > best.proxiesServed ? stat : best
                                ).day
                              }
                            </p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/30 p-3">
                            <p className="text-xs text-muted-foreground">Most free periods</p>
                            <p className="mt-1 text-2xl font-semibold">
                              {
                                teacherStats[selectedTeacher.name].reduce((best, stat) =>
                                  stat.freePeriods > best.freePeriods ? stat : best
                                ).day
                              }
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-medium">Proxies Served</p>
                              <p className="text-xs text-muted-foreground">by day</p>
                            </div>
                            <div className="grid grid-cols-7 gap-2 items-end h-32">
                              {teacherStats[selectedTeacher.name]?.map((stat) => {
                                const maxProxies = Math.max(...teacherStats[selectedTeacher.name].map((s) => s.proxiesServed)) || 1;
                                const heightPercent = Math.max(8, (stat.proxiesServed / maxProxies) * 100);
                                return (
                                  <div key={stat.day} className="flex h-full flex-col items-center justify-end gap-2">
                                    <div className="flex h-full w-full items-end">
                                      <div
                                        className="w-full rounded-t-md bg-blue-300 transition-all duration-300 hover:bg-blue-400"
                                        style={{ height: `${heightPercent}%`, minHeight: "8px" }}
                                        title={`${stat.proxiesServed} proxies`}
                                      />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs font-medium text-muted-foreground">{stat.day}</p>
                                      <p className="text-[10px] font-semibold text-blue-600">{stat.proxiesServed}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-medium">Free Periods</p>
                              <p className="text-xs text-muted-foreground">by day</p>
                            </div>
                            <div className="grid grid-cols-7 gap-2 items-end h-32">
                              {teacherStats[selectedTeacher.name]?.map((stat) => {
                                const maxFree = Math.max(...teacherStats[selectedTeacher.name].map((s) => s.freePeriods)) || 1;
                                const heightPercent = Math.max(8, (stat.freePeriods / maxFree) * 100);
                                return (
                                  <div key={stat.day} className="flex h-full flex-col items-center justify-end gap-2">
                                    <div className="flex h-full w-full items-end">
                                      <div
                                        className="w-full rounded-t-md bg-emerald-300 transition-all duration-300 hover:bg-emerald-400"
                                        style={{ height: `${heightPercent}%`, minHeight: "8px" }}
                                        title={`${stat.freePeriods} free periods`}
                                      />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs font-medium text-muted-foreground">{stat.day}</p>
                                      <p className="text-[10px] font-semibold text-emerald-600">{stat.freePeriods}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </>
                  )}
                </Card>

                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Available Now</h4>
                      <Badge variant="secondary">{currentPeriod.label}</Badge>
                    </div>
                    <div className="mt-3 space-y-2">
                      {availableTeachers.map((teacher) => (
                        <div key={teacher.name} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-xs text-muted-foreground">{teacher.department}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">Next: P{teacher.assigned.find((period) => period > currentPeriod.id) || "-"}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold">Today’s Proxy Assignments</h4>
                    <div className="mt-3 space-y-3">
                      {substituteAssignments.map((assignment) => (
                        <div key={assignment.teacher} className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold">{assignment.teacher}</p>
                              <p className="text-xs text-muted-foreground">{assignment.reason}</p>
                            </div>
                            <Badge variant={assignment.status === "pending" ? "destructive" : "secondary"}>
                              {assignment.status === "pending" ? "Action Required" : "Assigned"}
                            </Badge>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Substitute: <span className="text-foreground">{assignment.substitute || "No replacement assigned"}</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{assignment.period} • {assignment.className}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <div
              className={`overflow-hidden rounded-2xl transition-all duration-300 ease-out ${
                activeSection === "School Events Today" ? "max-h-[2600px] opacity-100 translate-y-0" : "pointer-events-none max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <Card className="p-4">
                <h4 className="font-semibold mb-3">School Events Today</h4>
                <div className="space-y-2">
                  {eventsToday.map((event) => (
                    <div key={event.title} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{event.location} • {event.owner}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{event.time}</Badge>
                          <Badge variant={event.status === "completed" ? "secondary" : event.status === "running" ? "default" : event.status === "cancelled" ? "destructive" : "outline"}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div
              className={`overflow-hidden rounded-2xl transition-all duration-300 ease-out ${
                activeSection === "Exam Operations" ? "max-h-[2600px] opacity-100 translate-y-0" : "pointer-events-none max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Exam Operations</h3>
                  <Badge variant="secondary">Visible on Exam Days</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {examsToday.map((exam) => (
                    <Card key={exam.subject} className="p-4">
                      <p className="font-semibold">{exam.subject}</p>
                      <p className="text-xs text-muted-foreground">{exam.className}</p>
                      <p className="text-xs text-muted-foreground mt-2">{exam.time}</p>
                      <p className="text-xs text-muted-foreground">Invigilator: {exam.invigilator}</p>
                      <p className="text-xs text-muted-foreground">Room: {exam.room}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
        </div>
      </div>

    </div>
  );
}
