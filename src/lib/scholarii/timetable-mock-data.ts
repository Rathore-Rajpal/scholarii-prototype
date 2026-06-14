import { loadData } from "./mock";

export interface Period {
  time: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface DaySchedule {
  day: string;
  shortDay: string;
  periods: Period[];
}

export interface Substitution {
  originalSubject: string;
  replacementSubject: string;
  teacher: string;
  period: number;
  time: string;
  reason: string;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  room: string;
  daysLeft: number;
  type: "unit" | "midterm" | "final" | "practical";
}

export type EventCategory = "exam" | "holiday" | "event" | "ptm" | "result" | "competition" | "deadline";

export interface AcademicEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: EventCategory;
  description: string;
  time?: string;
  location?: string;
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: AcademicEvent[];
}

const SUBJECTS = [
  { name: "Mathematics", color: "hsl(262, 83%, 58%)" },
  { name: "English", color: "hsl(199, 89%, 48%)" },
  { name: "Science", color: "hsl(142, 76%, 36%)" },
  { name: "Social Studies", color: "hsl(38, 92%, 50%)" },
  { name: "Hindi", color: "hsl(346, 77%, 50%)" },
  { name: "Computer Science", color: "hsl(221, 83%, 53%)" },
];

const TEACHERS = [
  "Mr. Kumar",
  "Ms. Iyer",
  "Ms. Priya",
  "Mr. Rao",
  "Mrs. Verma",
  "Mr. Sen",
  "Mr. Sharma",
  "Mrs. Gupta",
];

const ROOMS = ["101", "105", "201", "203", "302", "Lab 1", "Lab 2", "Lab 3"];

function generateWeeklyTimetable(): DaySchedule[] {
  const days = [
    { day: "Monday", shortDay: "Mon" },
    { day: "Tuesday", shortDay: "Tue" },
    { day: "Wednesday", shortDay: "Wed" },
    { day: "Thursday", shortDay: "Thu" },
    { day: "Friday", shortDay: "Fri" },
    { day: "Saturday", shortDay: "Sat" },
  ];

  const periodTimes = [
    { time: "08:00", endTime: "08:45" },
    { time: "08:50", endTime: "09:35" },
    { time: "09:45", endTime: "10:30" },
    { time: "10:45", endTime: "11:30" },
    { time: "11:40", endTime: "12:25" },
    { time: "12:35", endTime: "13:20" },
  ];

  const subjectDistribution: Record<string, number> = {};
  SUBJECTS.forEach((s) => (subjectDistribution[s.name] = 0));

  const weeklySchedule: DaySchedule[] = days.map((d) => {
    const periods: Period[] = periodTimes.map((pt, i) => {
      const subjIdx = (days.indexOf(d) + i) % SUBJECTS.length;
      const subject = SUBJECTS[subjIdx];
      subjectDistribution[subject.name]++;
      return {
        ...pt,
        subject: subject.name,
        teacher: TEACHERS[(days.indexOf(d) * 3 + i) % TEACHERS.length],
        room: ROOMS[(days.indexOf(d) * 2 + i) % ROOMS.length],
      };
    });
    return { ...d, periods };
  });

  return weeklySchedule;
}

function generateTodaySchedule(): Period[] {
  return [
    { time: "08:00", endTime: "08:45", subject: "Mathematics", teacher: "Mr. Kumar", room: "201" },
    { time: "08:50", endTime: "09:35", subject: "Science", teacher: "Ms. Priya", room: "Lab 2" },
    { time: "09:45", endTime: "10:30", subject: "English", teacher: "Ms. Iyer", room: "105" },
    { time: "10:45", endTime: "11:30", subject: "Social Studies", teacher: "Mr. Rao", room: "302" },
    { time: "11:40", endTime: "12:25", subject: "Hindi", teacher: "Mrs. Verma", room: "108" },
    { time: "12:35", endTime: "13:20", subject: "Computer Science", teacher: "Mr. Sen", room: "Lab 3" },
  ];
}

function generateSubstitutions(): Substitution[] {
  return [
    {
      originalSubject: "Science",
      replacementSubject: "Computer Science",
      teacher: "Mrs. Gupta",
      period: 5,
      time: "11:40",
      reason: "Ms. Priya is on leave",
    },
  ];
}

function generateExams(): Exam[] {
  return [
    { id: "EX1", name: "Unit Test 2", subject: "Mathematics", date: "2026-06-19", time: "10:00 AM", room: "201", daysLeft: 5, type: "unit" },
    { id: "EX2", name: "Unit Test 2", subject: "Science", date: "2026-06-21", time: "10:00 AM", room: "Lab 2", daysLeft: 7, type: "unit" },
    { id: "EX3", name: "Unit Test 2", subject: "English", date: "2026-06-23", time: "10:00 AM", room: "105", daysLeft: 9, type: "unit" },
    { id: "EX4", name: "Unit Test 2", subject: "Social Studies", date: "2026-06-25", time: "10:00 AM", room: "302", daysLeft: 11, type: "unit" },
    { id: "EX5", name: "Unit Test 2", subject: "Hindi", date: "2026-06-27", time: "10:00 AM", room: "108", daysLeft: 13, type: "unit" },
    { id: "EX6", name: "Mid-Term Examination", subject: "All Subjects", date: "2026-07-10", time: "09:00 AM", room: "Various", daysLeft: 26, type: "midterm" },
    { id: "EX7", name: "Practical Exam", subject: "Computer Science", date: "2026-07-12", time: "10:00 AM", room: "Lab 3", daysLeft: 28, type: "practical" },
    { id: "EX8", name: "Final Examination", subject: "All Subjects", date: "2026-09-15", time: "09:00 AM", room: "Various", daysLeft: 93, type: "final" },
  ];
}

function generateAcademicEvents(): AcademicEvent[] {
  return [
    { id: "AE1", title: "Academic Year Begins", date: "2026-04-01", type: "event", description: "First day of the academic year 2026-27", time: "08:00 AM", location: "Main Hall" },
    { id: "AE2", title: "Orientation Program", date: "2026-04-02", type: "event", description: "Welcome orientation for new and returning students", time: "09:00 AM", location: "Auditorium" },
    { id: "AE3", title: "Unit Test 1 — Mathematics", date: "2026-04-15", type: "exam", description: "Unit Test 1 for Mathematics", time: "10:00 AM", location: "Room 201" },
    { id: "AE4", title: "Unit Test 1 — Science", date: "2026-04-17", type: "exam", description: "Unit Test 1 for Science", time: "10:00 AM", location: "Lab 2" },
    { id: "AE5", title: "Unit Test 1 — English", date: "2026-04-19", type: "exam", description: "Unit Test 1 for English", time: "10:00 AM", location: "Room 105" },
    { id: "AE6", title: "Parent-Teacher Meeting", date: "2026-04-25", type: "ptm", description: "Discuss student progress with parents", time: "02:00 PM", location: "Classrooms" },
    { id: "AE7", title: "Summer Vacation Begins", date: "2026-05-01", endDate: "2026-06-14", type: "holiday", description: "Summer break — school reopens June 15" },
    { id: "AE8", title: "Inter-School Science Competition", date: "2026-06-10", type: "competition", description: "Annual inter-school science competition", time: "09:00 AM", location: "Science Lab" },
    { id: "AE9", title: "School Reopens", date: "2026-06-15", type: "event", description: "First day after summer vacation", time: "08:00 AM" },
    { id: "AE10", title: "Unit Test 2 — Mathematics", date: "2026-06-19", type: "exam", description: "Unit Test 2 for Mathematics", time: "10:00 AM", location: "Room 201" },
    { id: "AE11", title: "Unit Test 2 — Science", date: "2026-06-21", type: "exam", description: "Unit Test 2 for Science", time: "10:00 AM", location: "Lab 2" },
    { id: "AE12", title: "Unit Test 2 — English", date: "2026-06-23", type: "exam", description: "Unit Test 2 for English", time: "10:00 AM", location: "Room 105" },
    { id: "AE13", title: "Unit Test 2 — Social Studies", date: "2026-06-25", type: "exam", description: "Unit Test 2 for Social Studies", time: "10:00 AM", location: "Room 302" },
    { id: "AE14", title: "Unit Test 2 — Hindi", date: "2026-06-27", type: "exam", description: "Unit Test 2 for Hindi", time: "10:00 AM", location: "Room 108" },
    { id: "AE15", title: "Parent-Teacher Meeting", date: "2026-06-28", type: "ptm", description: "Mid-year parent-teacher meeting", time: "02:00 PM", location: "Classrooms" },
    { id: "AE16", title: "Science Exhibition", date: "2026-07-05", type: "event", description: "Annual science project exhibition", time: "10:00 AM", location: "Exhibition Hall" },
    { id: "AE17", title: "Mid-Term Examination", date: "2026-07-10", endDate: "2026-07-12", type: "exam", description: "Mid-term examinations for all subjects", time: "09:00 AM", location: "Exam Halls" },
    { id: "AE18", title: "Mid-Term Break", date: "2026-07-14", endDate: "2026-07-16", type: "holiday", description: "Short break after mid-terms" },
    { id: "AE19", title: "Sports Day", date: "2026-07-20", endDate: "2026-07-21", type: "competition", description: "Annual sports day competition", time: "07:00 AM", location: "Sports Ground" },
    { id: "AE20", title: "Independence Day Celebration", date: "2026-08-15", type: "event", description: "Flag hoisting and cultural program", time: "08:00 AM", location: "Main Ground" },
    { id: "AE21", title: "Project Submission Deadline", date: "2026-08-25", type: "deadline", description: "Last date for science project submissions", time: "05:00 PM" },
    { id: "AE22", title: "Teachers' Day", date: "2026-09-05", type: "event", description: "Special assembly and celebrations for Teachers' Day", time: "09:00 AM", location: "Auditorium" },
    { id: "AE23", title: "Final Examination", date: "2026-09-15", endDate: "2026-09-25", type: "exam", description: "Final examinations for all subjects", time: "09:00 AM", location: "Exam Halls" },
    { id: "AE24", title: "Term 1 Result Declaration", date: "2026-09-28", type: "result", description: "Results for Term 1 examinations", time: "12:00 PM", location: "Online Portal" },
    { id: "AE25", title: "Diwali Vacation", date: "2026-10-18", endDate: "2026-10-26", type: "holiday", description: "Festival break for Diwali" },
    { id: "AE26", title: "Annual Day", date: "2026-11-15", type: "event", description: "Annual day celebrations and prize distribution", time: "06:00 PM", location: "Auditorium" },
    { id: "AE27", title: "Winter Vacation", date: "2026-12-22", endDate: "2027-01-02", type: "holiday", description: "Winter break — school reopens January 3" },
    { id: "AE28", title: "Republic Day Celebration", date: "2027-01-26", type: "event", description: "Republic Day flag hoisting ceremony", time: "08:00 AM", location: "Main Ground" },
    { id: "AE29", title: "Annual Sports Competition", date: "2027-02-10", endDate: "2027-02-11", type: "competition", description: "Inter-class sports competition", time: "07:00 AM", location: "Sports Ground" },
    { id: "AE30", title: "Final Term Examination", date: "2027-03-01", endDate: "2027-03-12", type: "exam", description: "Final term examinations for all subjects", time: "09:00 AM", location: "Exam Halls" },
    { id: "AE31", title: "Term 2 Result Declaration", date: "2027-03-20", type: "result", description: "Results for Term 2 examinations", time: "12:00 PM", location: "Online Portal" },
    { id: "AE32", title: "Report Card Distribution", date: "2027-03-25", type: "event", description: "Final report card distribution ceremony", time: "10:00 AM", location: "Classrooms" },
    { id: "AE33", title: "Art Competition", date: "2027-02-20", type: "competition", description: "Inter-school art competition", time: "10:00 AM", location: "Art Room" },
    { id: "AE34", title: "Science Fair", date: "2027-02-28", type: "competition", description: "Regional science fair participation", time: "09:00 AM", location: "Exhibition Hall" },
    { id: "AE35", title: "PTM — Final Term", date: "2027-03-22", type: "ptm", description: "Final term parent-teacher meeting", time: "02:00 PM", location: "Classrooms" },
  ];
}

function getSubjectColor(subject: string): string {
  return SUBJECTS.find((s) => s.name === subject)?.color ?? "hsl(221, 83%, 53%)";
}

function getTodayStatus(period: Period, index: number): "completed" | "ongoing" | "upcoming" {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const [startH, startM] = period.time.split(":").map(Number);
  const [endH, endM] = period.endTime.split(":").map(Number);
  const startTime = startH * 60 + startM;
  const endTime = endH * 60 + endM;

  if (currentTime >= endTime) return "completed";
  if (currentTime >= startTime && currentTime < endTime) return "ongoing";
  return "upcoming";
}

function getSubjectDistribution(weeklyTimetable: DaySchedule[]): { subject: string; periods: number; color: string }[] {
  const dist: Record<string, number> = {};
  SUBJECTS.forEach((s) => (dist[s.name] = 0));
  weeklyTimetable.forEach((day) => {
    day.periods.forEach((p) => {
      dist[p.subject] = (dist[p.subject] || 0) + 1;
    });
  });
  return SUBJECTS.map((s) => ({
    subject: s.name,
    periods: dist[s.name] || 0,
    color: s.color,
  }));
}

export function getTimetableData() {
  const weeklyTimetable = generateWeeklyTimetable();
  const todaySchedule = generateTodaySchedule();
  const substitutions = generateSubstitutions();
  const exams = generateExams();
  const academicEvents = generateAcademicEvents();
  const subjectDist = getSubjectDistribution(weeklyTimetable);

  const todayStatuses = todaySchedule.map((p, i) => ({
    ...p,
    status: getTodayStatus(p, i),
  }));

  const completedCount = todayStatuses.filter((p) => p.status === "completed").length;
  const remainingCount = todayStatuses.filter((p) => p.status === "upcoming" || p.status === "ongoing").length;
  const freePeriods = 1;
  const totalHours = Math.round((todaySchedule.length * 45) / 60 * 10) / 10;

  const upcomingExams = exams.filter((e) => e.daysLeft > 0);
  const examsThisMonth = exams.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const nextExamDays = exams[0]?.daysLeft ?? 0;

  const totalWeeklyClasses = weeklyTimetable.reduce((a, d) => a + d.periods.length, 0);
  const totalAcademicHours = Math.round((totalWeeklyClasses * 45) / 60 * 10) / 10;

  const upcomingHoliday = academicEvents
    .filter((e) => e.type === "holiday" && new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const nextExam = exams[0];
  const currentTerm = "Term 2 (April 2026 - September 2026)";

  const allEvents = academicEvents;
  const totalHolidays = allEvents.filter((e) => e.type === "holiday").length;
  const totalExams = allEvents.filter((e) => e.type === "exam").length;
  const totalEvents = allEvents.filter((e) => e.type === "event" || e.type === "competition").length;
  const totalPTMs = allEvents.filter((e) => e.type === "ptm").length;
  const totalResults = allEvents.filter((e) => e.type === "result").length;
  const totalCompetitions = allEvents.filter((e) => e.type === "competition").length;
  const totalDeadlines = allEvents.filter((e) => e.type === "deadline").length;

  const termEndDate = new Date("2026-09-30");
  const today = new Date();
  const daysRemainingInTerm = Math.max(0, Math.ceil((termEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const upcomingEvents = allEvents
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return {
    weeklyTimetable,
    todaySchedule: todayStatuses,
    substitutions,
    exams,
    academicEvents,
    subjectDist,
    completedCount,
    remainingCount,
    freePeriods,
    totalHours,
    upcomingExams,
    examsThisMonth,
    nextExamDays,
    totalWeeklyClasses,
    totalAcademicHours,
    upcomingHoliday,
    nextExam,
    currentTerm,
    totalHolidays,
    totalExams,
    totalEvents,
    totalPTMs,
    totalResults,
    totalCompetitions,
    totalDeadlines,
    daysRemainingInTerm,
    upcomingEvents,
    SUBJECTS,
    getSubjectColor,
  };
}

export type TimetableData = ReturnType<typeof getTimetableData>;
