import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users, BookOpen, GraduationCap, ClipboardList,
  TrendingUp, Clock, AlertTriangle, CheckCircle2,
  FileText, Target, Sparkles, BarChart3,
  Calendar, Zap, FilePlus, ClipboardCheck, BookMarked,
  ChevronRight, MapPin, User, Award, AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/classes")({ component: ClassesPage });

const CLASSES = [
  {
    id: "c1", name: "Class 8-A", isClassTeacher: true,
    students: 42, subjects: ["Mathematics"], nextLecture: "10:00 AM",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "c2", name: "Class 7-B", isClassTeacher: false,
    students: 28, subjects: ["Mathematics"], nextLecture: "11:00 AM",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "c3", name: "Class 9-A", isClassTeacher: false,
    students: 30, subjects: ["Mathematics", "Computer Science"], nextLecture: "12:00 PM",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "c4", name: "Class 10-A", isClassTeacher: false,
    students: 26, subjects: ["Mathematics", "Computer Science"], nextLecture: "02:00 PM",
    color: "from-sky-500 to-indigo-500",
  },
];

const CLASS_SUBJECTS: Record<string, { name: string; syllabus: number; currentChapter: string; nextChapter: string; avgMarks: number; nextExam: string; pendingReviews: number }[]> = {
  c1: [{ name: "Mathematics", syllabus: 78, currentChapter: "Quadratic Equations", nextChapter: "Polynomials", avgMarks: 82, nextExam: "Friday", pendingReviews: 4 }],
  c2: [{ name: "Mathematics", syllabus: 65, currentChapter: "Data Handling", nextChapter: "Simple Equations", avgMarks: 79, nextExam: "Wednesday", pendingReviews: 2 }],
  c3: [
    { name: "Mathematics", syllabus: 72, currentChapter: "Polynomials", nextChapter: "Coordinate Geometry", avgMarks: 84, nextExam: "Next Week", pendingReviews: 0 },
    { name: "Computer Science", syllabus: 58, currentChapter: "Python Basics", nextChapter: "Control Flow", avgMarks: 86, nextExam: "Thursday", pendingReviews: 0 },
  ],
  c4: [
    { name: "Mathematics", syllabus: 85, currentChapter: "Trigonometry", nextChapter: "Statistics", avgMarks: 87, nextExam: "Monday", pendingReviews: 4 },
    { name: "Computer Science", syllabus: 70, currentChapter: "Data Structures", nextChapter: "Algorithms", avgMarks: 89, nextExam: "Friday", pendingReviews: 2 },
  ],
};

type TimetableEntry = {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  topic: string;
  isMyLecture: boolean;
  status: "completed" | "current" | "upcoming";
};

const CLASS_TIMETABLE_DAILY: Record<string, TimetableEntry[]> = {
  c1: [
    { period: 1, time: "08:00 - 08:45", subject: "English", teacher: "Mrs. Wilson", room: "Room 201", topic: "The Sound of Music", isMyLecture: false, status: "completed" },
    { period: 2, time: "09:00 - 09:45", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", topic: "Force & Motion", isMyLecture: false, status: "completed" },
    { period: 3, time: "10:00 - 10:45", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 203", topic: "Quadratic Equations", isMyLecture: true, status: "current" },
    { period: 4, time: "11:00 - 11:45", subject: "Social Science", teacher: "Mrs. Patel", room: "Room 205", topic: "Indian Freedom Movement", isMyLecture: false, status: "upcoming" },
    { period: 5, time: "12:00 - 12:45", subject: "Hindi", teacher: "Mr. Verma", room: "Room 102", topic: "Kabir Ke Dohe", isMyLecture: false, status: "upcoming" },
    { period: 6, time: "02:00 - 02:45", subject: "Computer Science", teacher: "Mr. Mehta", room: "Lab 1", topic: "Python Basics", isMyLecture: false, status: "upcoming" },
    { period: 7, time: "03:00 - 03:45", subject: "Physical Education", teacher: "Mr. Singh", room: "Ground", topic: "Yoga", isMyLecture: false, status: "upcoming" },
  ],
  c2: [
    { period: 1, time: "08:00 - 08:45", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 105", topic: "Data Handling", isMyLecture: true, status: "completed" },
    { period: 2, time: "09:00 - 09:45", subject: "English", teacher: "Mrs. Wilson", room: "Room 105", topic: "Poetry", isMyLecture: false, status: "completed" },
    { period: 3, time: "10:00 - 10:45", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 3", topic: "Cells", isMyLecture: false, status: "current" },
    { period: 4, time: "11:00 - 11:45", subject: "Social Science", teacher: "Mrs. Patel", room: "Room 105", topic: "Maps", isMyLecture: false, status: "upcoming" },
    { period: 5, time: "12:00 - 12:45", subject: "Hindi", teacher: "Mr. Verma", room: "Room 102", topic: "Veer Tumhare Desh Ka", isMyLecture: false, status: "upcoming" },
    { period: 6, time: "02:00 - 02:45", subject: "Art", teacher: "Mrs. Roy", room: "Art Room", topic: "Drawing", isMyLecture: false, status: "upcoming" },
  ],
  c3: [
    { period: 1, time: "08:00 - 08:45", subject: "English", teacher: "Mrs. Wilson", room: "Room 301", topic: "Prose", isMyLecture: false, status: "completed" },
    { period: 2, time: "09:00 - 09:45", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 301", topic: "Polynomials", isMyLecture: true, status: "completed" },
    { period: 3, time: "10:00 - 10:45", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 1", topic: "Atoms & Molecules", isMyLecture: false, status: "current" },
    { period: 4, time: "11:00 - 11:45", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 1", topic: "Python Variables", isMyLecture: true, status: "upcoming" },
    { period: 5, time: "12:00 - 12:45", subject: "Social Science", teacher: "Mrs. Patel", room: "Room 301", topic: "Democracy", isMyLecture: false, status: "upcoming" },
    { period: 6, time: "02:00 - 02:45", subject: "Hindi", teacher: "Mr. Verma", room: "Room 102", topic: "Premchand Stories", isMyLecture: false, status: "upcoming" },
  ],
  c4: [
    { period: 1, time: "08:00 - 08:45", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", topic: "Light", isMyLecture: false, status: "completed" },
    { period: 2, time: "09:00 - 09:45", subject: "English", teacher: "Mrs. Wilson", room: "Room 203", topic: "Literature", isMyLecture: false, status: "completed" },
    { period: 3, time: "10:00 - 10:45", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "Room 203", topic: "Trigonometry", isMyLecture: true, status: "completed" },
    { period: 4, time: "11:00 - 11:45", subject: "Social Science", teacher: "Mrs. Patel", room: "Room 205", topic: "Globalisation", isMyLecture: false, status: "current" },
    { period: 5, time: "12:00 - 12:45", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 2", topic: "Data Structures", isMyLecture: true, status: "upcoming" },
    { period: 6, time: "02:00 - 02:45", subject: "Hindi", teacher: "Mr. Verma", room: "Room 102", topic: "Essays", isMyLecture: false, status: "upcoming" },
    { period: 7, time: "03:00 - 03:45", subject: "Physical Education", teacher: "Mr. Singh", room: "Ground", topic: "Sports", isMyLecture: false, status: "upcoming" },
  ],
};

type WeeklyDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

const CLASS_TIMETABLE_WEEKLY: Record<string, Record<WeeklyDay, { time: string; subject: string; teacher: string; room: string; isMyLecture: boolean }[]>> = {
  c1: {
    Monday: [
      { time: "08:00", subject: "English", teacher: "Mrs. Wilson", room: "201", isMyLecture: false },
      { time: "09:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
      { time: "10:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "11:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
      { time: "12:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
    ],
    Tuesday: [
      { time: "08:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
      { time: "09:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "10:00", subject: "English", teacher: "Mrs. Wilson", room: "201", isMyLecture: false },
      { time: "11:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
    ],
    Wednesday: [
      { time: "08:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "09:00", subject: "English", teacher: "Mrs. Wilson", room: "201", isMyLecture: false },
      { time: "10:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
      { time: "11:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
    ],
    Thursday: [
      { time: "08:00", subject: "English", teacher: "Mrs. Wilson", room: "201", isMyLecture: false },
      { time: "09:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
      { time: "10:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "11:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
      { time: "12:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
    ],
    Friday: [
      { time: "08:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
      { time: "09:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "10:00", subject: "English", teacher: "Mrs. Wilson", room: "201", isMyLecture: false },
      { time: "11:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
    ],
    Saturday: [
      { time: "08:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "09:00", subject: "English", teacher: "Mrs. Wilson", room: "201", isMyLecture: false },
      { time: "10:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
    ],
  },
  c2: {
    Monday: [
      { time: "08:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "105", isMyLecture: true },
      { time: "09:00", subject: "English", teacher: "Mrs. Wilson", room: "105", isMyLecture: false },
      { time: "10:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 3", isMyLecture: false },
      { time: "11:00", subject: "Social Science", teacher: "Mrs. Patel", room: "105", isMyLecture: false },
      { time: "12:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
    ],
    Tuesday: [
      { time: "08:00", subject: "English", teacher: "Mrs. Wilson", room: "105", isMyLecture: false },
      { time: "09:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "105", isMyLecture: true },
      { time: "10:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 3", isMyLecture: false },
      { time: "11:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "105", isMyLecture: false },
    ],
    Wednesday: [
      { time: "08:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 3", isMyLecture: false },
      { time: "09:00", subject: "English", teacher: "Mrs. Wilson", room: "105", isMyLecture: false },
      { time: "10:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "105", isMyLecture: true },
      { time: "11:00", subject: "Social Science", teacher: "Mrs. Patel", room: "105", isMyLecture: false },
      { time: "12:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
    ],
    Thursday: [
      { time: "08:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "105", isMyLecture: true },
      { time: "09:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 3", isMyLecture: false },
      { time: "10:00", subject: "English", teacher: "Mrs. Wilson", room: "105", isMyLecture: false },
      { time: "11:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "105", isMyLecture: false },
    ],
    Friday: [
      { time: "08:00", subject: "English", teacher: "Mrs. Wilson", room: "105", isMyLecture: false },
      { time: "09:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "105", isMyLecture: true },
      { time: "10:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 3", isMyLecture: false },
      { time: "11:00", subject: "Social Science", teacher: "Mrs. Patel", room: "105", isMyLecture: false },
      { time: "12:00", subject: "Hindi", teacher: "Mr. Verma", room: "102", isMyLecture: false },
    ],
    Saturday: [
      { time: "08:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "105", isMyLecture: true },
      { time: "09:00", subject: "English", teacher: "Mrs. Wilson", room: "105", isMyLecture: false },
    ],
  },
  c3: {
    Monday: [
      { time: "08:00", subject: "English", teacher: "Mrs. Wilson", room: "301", isMyLecture: false },
      { time: "09:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "301", isMyLecture: true },
      { time: "10:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 1", isMyLecture: false },
      { time: "11:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 1", isMyLecture: true },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "301", isMyLecture: false },
    ],
    Tuesday: [
      { time: "08:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "301", isMyLecture: true },
      { time: "09:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 1", isMyLecture: true },
      { time: "10:00", subject: "English", teacher: "Mrs. Wilson", room: "301", isMyLecture: false },
      { time: "11:00", subject: "Social Science", teacher: "Mrs. Patel", room: "301", isMyLecture: false },
      { time: "12:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 1", isMyLecture: false },
    ],
    Wednesday: [
      { time: "08:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 1", isMyLecture: false },
      { time: "09:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "301", isMyLecture: true },
      { time: "10:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 1", isMyLecture: true },
      { time: "11:00", subject: "English", teacher: "Mrs. Wilson", room: "301", isMyLecture: false },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "301", isMyLecture: false },
    ],
    Thursday: [
      { time: "08:00", subject: "English", teacher: "Mrs. Wilson", room: "301", isMyLecture: false },
      { time: "09:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 1", isMyLecture: false },
      { time: "10:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "301", isMyLecture: true },
      { time: "11:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 1", isMyLecture: true },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "301", isMyLecture: false },
    ],
    Friday: [
      { time: "08:00", subject: "Social Science", teacher: "Mrs. Patel", room: "301", isMyLecture: false },
      { time: "09:00", subject: "English", teacher: "Mrs. Wilson", room: "301", isMyLecture: false },
      { time: "10:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "301", isMyLecture: true },
      { time: "11:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 1", isMyLecture: true },
      { time: "12:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 1", isMyLecture: false },
    ],
    Saturday: [
      { time: "08:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "301", isMyLecture: true },
      { time: "09:00", subject: "English", teacher: "Mrs. Wilson", room: "301", isMyLecture: false },
      { time: "10:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 1", isMyLecture: false },
    ],
  },
  c4: {
    Monday: [
      { time: "08:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
      { time: "09:00", subject: "English", teacher: "Mrs. Wilson", room: "203", isMyLecture: false },
      { time: "10:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "11:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
      { time: "12:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 2", isMyLecture: true },
    ],
    Tuesday: [
      { time: "08:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "09:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
      { time: "10:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 2", isMyLecture: true },
      { time: "11:00", subject: "English", teacher: "Mrs. Wilson", room: "203", isMyLecture: false },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
    ],
    Wednesday: [
      { time: "08:00", subject: "English", teacher: "Mrs. Wilson", room: "203", isMyLecture: false },
      { time: "09:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "10:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
      { time: "11:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
      { time: "12:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 2", isMyLecture: true },
    ],
    Thursday: [
      { time: "08:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
      { time: "09:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "10:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 2", isMyLecture: true },
      { time: "11:00", subject: "English", teacher: "Mrs. Wilson", room: "203", isMyLecture: false },
      { time: "12:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
    ],
    Friday: [
      { time: "08:00", subject: "Science", teacher: "Mrs. Gupta", room: "Lab 2", isMyLecture: false },
      { time: "09:00", subject: "English", teacher: "Mrs. Wilson", room: "203", isMyLecture: false },
      { time: "10:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "11:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 2", isMyLecture: true },
      { time: "12:00", subject: "Social Science", teacher: "Mrs. Patel", room: "205", isMyLecture: false },
    ],
    Saturday: [
      { time: "08:00", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", room: "203", isMyLecture: true },
      { time: "09:00", subject: "Computer Science", teacher: "Mr. Rajesh Kumar", room: "Lab 2", isMyLecture: true },
      { time: "10:00", subject: "English", teacher: "Mrs. Wilson", room: "203", isMyLecture: false },
    ],
  },
};

const CLASS_STUDENTS: Record<string, { name: string; roll: number; attendance: number; score: number; status: "normal" | "at-risk" | "top" }[]> = {
  c1: [
    { name: "Aarav Sharma", roll: 1, attendance: 96, score: 92, status: "top" },
    { name: "Priya Patel", roll: 2, attendance: 94, score: 88, status: "normal" },
    { name: "Rohan Gupta", roll: 3, attendance: 78, score: 62, status: "at-risk" },
    { name: "Sneha Reddy", roll: 4, attendance: 92, score: 85, status: "normal" },
    { name: "Vikram Singh", roll: 5, attendance: 88, score: 79, status: "normal" },
  ],
  c2: [
    { name: "Ananya Nair", roll: 1, attendance: 98, score: 94, status: "top" },
    { name: "Karthik Menon", roll: 2, attendance: 85, score: 72, status: "normal" },
    { name: "Divya Joshi", roll: 3, attendance: 76, score: 58, status: "at-risk" },
    { name: "Arjun Das", roll: 4, attendance: 91, score: 81, status: "normal" },
  ],
  c3: [
    { name: "Neha Kapoor", roll: 1, attendance: 97, score: 95, status: "top" },
    { name: "Rahul Verma", roll: 2, attendance: 89, score: 76, status: "normal" },
    { name: "Simran Kaur", roll: 3, attendance: 82, score: 68, status: "at-risk" },
    { name: "Aditya Rao", roll: 4, attendance: 93, score: 88, status: "normal" },
    { name: "Pooja Mehta", roll: 5, attendance: 95, score: 91, status: "top" },
  ],
  c4: [
    { name: "Ravi Kumar", roll: 1, attendance: 99, score: 96, status: "top" },
    { name: "Sonia Mishra", roll: 2, attendance: 87, score: 74, status: "normal" },
    { name: "Amit Tiwari", roll: 3, attendance: 74, score: 55, status: "at-risk" },
    { name: "Deepa Pillai", roll: 4, attendance: 94, score: 89, status: "normal" },
  ],
};

const TEACHING_PLAN: Record<string, { day: string; topic: string }[]> = {
  c1: [
    { day: "Monday", topic: "Quadratic Equations" },
    { day: "Tuesday", topic: "Problem Solving" },
    { day: "Wednesday", topic: "Revision" },
    { day: "Thursday", topic: "Worksheet" },
    { day: "Friday", topic: "Assessment" },
  ],
  c2: [
    { day: "Monday", topic: "Data Handling Intro" },
    { day: "Tuesday", topic: "Bar Graphs" },
    { day: "Wednesday", topic: "Pie Charts" },
    { day: "Thursday", topic: "Practice Set" },
    { day: "Friday", topic: "Quiz" },
  ],
  c3: [
    { day: "Monday", topic: "Polynomials" },
    { day: "Tuesday", topic: "Python Variables" },
    { day: "Wednesday", topic: "Polynomial Operations" },
    { day: "Thursday", topic: "Python Input/Output" },
    { day: "Friday", topic: "Combined Quiz" },
  ],
  c4: [
    { day: "Monday", topic: "Trigonometry Ratios" },
    { day: "Tuesday", topic: "Data Structures Intro" },
    { day: "Wednesday", topic: "Trigonometry Problems" },
    { day: "Thursday", topic: "Arrays & Lists" },
    { day: "Friday", topic: "Assessment" },
  ],
};

const ASSIGNMENTS: Record<string, { name: string; status: "pending" | "submitted" | "verified"; count: number }[]> = {
  c1: [{ name: "Algebra Worksheet", status: "pending", count: 4 }, { name: "Quadratic Problems", status: "submitted", count: 12 }, { name: "Chapter Review", status: "verified", count: 26 }],
  c2: [{ name: "Data Handling Set", status: "pending", count: 2 }, { name: "Bar Graph Activity", status: "submitted", count: 18 }],
  c3: [{ name: "Polynomial Worksheet", status: "verified", count: 30 }, { name: "Python Basics Quiz", status: "submitted", count: 8 }],
  c4: [{ name: "Trig Practice", status: "pending", count: 4 }, { name: "Data Structure Assignment", status: "submitted", count: 10 }, { name: "Project Submission", status: "verified", count: 16 }],
};

const AI_INSIGHTS: Record<string, string[]> = {
  c1: ["Attendance dropped by 3% this week.", "Rohan Gupta needs extra attention in Quadratic Equations.", "Consider revision session on Thursday."],
  c2: ["Divya Joshi is at risk — attendance below 80%.", "Class average improved by 4% after last quiz.", "Data Handling requires more practice sets."],
  c3: ["Strong performance in both subjects.", "Simran Kaur needs support in Mathematics.", "Python practicals showing good engagement."],
  c4: ["Board exam readiness at 82%.", "Amit Tiwari is at risk — focus needed.", "Computer Science average is highest across all classes."],
};

type WorkspaceTab = "subjects" | "timetable" | "students" | "plan" | "assignments" | "performance" | "reports" | "ai";

function TimetableView({ classId }: { classId: string }) {
  const [viewMode, setViewMode] = useState<"today" | "weekly">("today");
  const dailyData = CLASS_TIMETABLE_DAILY[classId] || [];
  const weeklyData = CLASS_TIMETABLE_WEEKLY[classId] || {};
  const myLectures = dailyData.filter((e) => e.isMyLecture);
  const totalPeriods = dailyData.length;
  const freePeriods = totalPeriods - myLectures.length;
  const nextLecture = dailyData.find((e) => e.status === "current" || e.status === "upcoming");
  const days: WeeklyDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Periods</div><div className="text-2xl font-bold mt-1">{totalPeriods}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">My Lectures</div><div className="text-2xl font-bold mt-1 text-emerald-500">{myLectures.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Free Periods</div><div className="text-2xl font-bold mt-1 text-sky-500">{freePeriods}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Next Lecture</div><div className="text-lg font-bold mt-1">{nextLecture?.time?.split(" - ")[0] || "—"}</div></Card>
      </div>

      {/* Next Lecture Card */}
      {nextLecture && nextLecture.isMyLecture && (
        <Card className="p-5 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white grid place-items-center">
              <BookMarked className="size-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{nextLecture.subject}</h3>
                <Badge className="bg-emerald-500 text-white border-0 text-[10px]">My Lecture</Badge>
                <Badge className="bg-brand-gradient text-white border-0 text-[10px]">Current</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="size-3.5" />{nextLecture.time}</span>
                <span className="flex items-center gap-1"><MapPin className="size-3.5" />{nextLecture.room}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Topic: <span className="font-medium text-foreground">{nextLecture.topic}</span></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-brand-gradient text-white border-0 text-xs"><ClipboardCheck className="size-3.5 mr-1" />Attendance</Button>
              <Button size="sm" variant="outline" className="text-xs"><FileText className="size-3.5 mr-1" />Report</Button>
            </div>
          </div>
        </Card>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <Button variant={viewMode === "today" ? "default" : "outline"} size="sm" onClick={() => setViewMode("today")} className="text-xs">
          <Calendar className="size-3.5 mr-1" />Today
        </Button>
        <Button variant={viewMode === "weekly" ? "default" : "outline"} size="sm" onClick={() => setViewMode("weekly")} className="text-xs">
          <Calendar className="size-3.5 mr-1" />Weekly
        </Button>
      </div>

      {/* Today View */}
      {viewMode === "today" && (
        <div className="space-y-3">
          {dailyData.map((entry) => (
            <Card key={entry.period} className={cn(
              "p-5 transition-all",
              entry.isMyLecture ? "bg-emerald-500/5 border-emerald-500/20 hover:shadow-emerald-500/20 hover:shadow-glow" : "hover:shadow-glow",
              entry.status === "current" && "ring-2 ring-brand-from",
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "size-12 rounded-xl grid place-items-center text-white font-bold",
                  entry.isMyLecture ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                  entry.status === "current" ? "bg-brand-gradient" : "bg-muted text-muted-foreground",
                )}>
                  P{entry.period}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold">{entry.subject}</h3>
                    {entry.isMyLecture && <Badge className="bg-emerald-500 text-white border-0 text-[10px]">My Lecture</Badge>}
                    {entry.status === "current" && <Badge className="bg-brand-gradient text-white border-0 text-[10px]">Current</Badge>}
                    {entry.status === "upcoming" && <Badge variant="outline" className="text-[10px]">Upcoming</Badge>}
                    {entry.status === "completed" && <Badge variant="secondary" className="text-[10px]">Completed</Badge>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="size-3.5" />{entry.time}</span>
                    <span className="flex items-center gap-1"><User className="size-3.5" />{entry.teacher}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3.5" />{entry.room}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Topic: {entry.topic}</div>
                </div>
                {entry.isMyLecture && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="text-xs"><ClipboardCheck className="size-3.5 mr-1" />Attendance</Button>
                    <Button size="sm" variant="outline" className="text-xs"><FileText className="size-3.5 mr-1" />Report</Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Weekly View */}
      {viewMode === "weekly" && (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-7 gap-2">
              {["Time", ...days].map((day) => (
                <div key={day} className="text-xs font-semibold text-muted-foreground p-2 text-center">{day}</div>
              ))}
              {Array.from({ length: 7 }).map((_, periodIdx) => (
                <div key={periodIdx} className="contents">
                  <div className="text-xs font-medium text-muted-foreground p-2 text-center">
                    {periodIdx === 0 ? "08:00" : periodIdx === 1 ? "09:00" : periodIdx === 2 ? "10:00" : periodIdx === 3 ? "11:00" : periodIdx === 4 ? "12:00" : periodIdx === 5 ? "02:00" : "03:00"}
                  </div>
                  {days.map((day) => {
                    const dayData = weeklyData[day] || [];
                    const entry = dayData[periodIdx];
                    if (!entry) return <div key={day} className="p-1.5" />;
                    return (
                      <div key={day} className={cn(
                        "p-2 rounded-lg text-center text-xs",
                        entry.isMyLecture ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/50",
                      )}>
                        <div className="font-semibold truncate">{entry.subject}</div>
                        <div className="text-muted-foreground mt-0.5 truncate">{entry.room}</div>
                        {entry.isMyLecture && <div className="text-emerald-600 font-medium mt-0.5">My Lecture</div>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const WORKSPACE_TABS: { id: WorkspaceTab; label: string; icon: typeof BookOpen }[] = [
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "timetable", label: "Timetable", icon: Calendar },
  { id: "students", label: "Students", icon: Users },
  { id: "plan", label: "Teaching Plan", icon: ClipboardList },
  { id: "assignments", label: "Assignments", icon: FileText },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "reports", label: "Daily Reports", icon: FileText },
  { id: "ai", label: "AI Insights", icon: Sparkles },
];

function ClassesPage() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("subjects");

  const totalStudents = CLASSES.reduce((sum, c) => sum + c.students, 0);
  const totalSubjects = new Set(CLASSES.flatMap((c) => c.subjects)).size;
  const totalPending = Object.values(ASSIGNMENTS).flat().filter((a) => a.status === "pending").reduce((sum, a) => sum + a.count, 0);

  const selectedClass = CLASSES.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      <PageHeader title="My Classes" subtitle="Manage all classes and subjects you teach this academic year." />

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Teaching Classes", value: CLASSES.length, icon: BookOpen, color: "from-violet-500 to-fuchsia-500" },
          { label: "Students", value: totalStudents, icon: Users, color: "from-emerald-500 to-teal-500" },
          { label: "Subjects", value: totalSubjects, icon: GraduationCap, color: "from-amber-500 to-orange-500" },
          { label: "Pending Reviews", value: totalPending, icon: ClipboardList, color: "from-sky-500 to-indigo-500" },
        ].map((stat) => (
          <Card key={stat.label} className="p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-3xl font-bold mt-2 tracking-tight">{stat.value}</div>
              </div>
              <div className={cn("size-11 rounded-xl bg-gradient-to-br text-white grid place-items-center", stat.color)}>
                <stat.icon className="size-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Level 1: Class Selector */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CLASSES.map((cls) => (
          <Card
            key={cls.id}
            className={cn(
              "p-5 cursor-pointer transition-all hover:shadow-glow",
              selectedClassId === cls.id ? "ring-2 ring-brand-from" : "hover:-translate-y-0.5"
            )}
            onClick={() => { setSelectedClassId(cls.id); setWorkspaceTab("subjects"); }}
          >
            <div className={`h-2 -m-5 mb-4 rounded-t-xl bg-gradient-to-r ${cls.color}`} />
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{cls.name}</h3>
              {cls.isClassTeacher ? (
                <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 text-[10px]">Class Teacher</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">Teaching Class</Badge>
              )}
            </div>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Users className="size-3.5" />{cls.students} Students</div>
              <div className="flex items-center gap-2"><BookOpen className="size-3.5" />{cls.subjects.length} Subject{cls.subjects.length > 1 ? "s" : ""}</div>
              <div className="flex items-center gap-2"><Clock className="size-3.5" />Next: {cls.nextLecture}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Level 2: Class Workspace */}
      {selectedClass && (
        <div className="space-y-4">
          <Separator />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span>{selectedClass.students} Students</span>
                <span>{selectedClass.subjects.length} Subject{selectedClass.subjects.length > 1 ? "s" : ""}</span>
                {selectedClass.isClassTeacher && <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 text-[10px]">Class Teacher</Badge>}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedClassId(null)}>Close Workspace</Button>
          </div>

          {/* Workspace Tabs */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border -mx-4 lg:-mx-8 px-4 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-3">
              {WORKSPACE_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = workspaceTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setWorkspaceTab(tab.id)} className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                    active ? "bg-brand-gradient text-white shadow-glow" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}>
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {workspaceTab === "subjects" && (
              <div className="space-y-4">
                {(CLASS_SUBJECTS[selectedClass.id] || []).map((subj) => (
                  <Card key={subj.name} className="p-6 hover:shadow-glow transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="size-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white grid place-items-center">
                            <BookMarked className="size-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{subj.name}</h3>
                            {subj.pendingReviews > 0 && <Badge variant="outline" className="text-amber-600 mt-1">{subj.pendingReviews} Pending</Badge>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                          <div className="p-3 rounded-xl bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">Syllabus</div>
                            <div className="flex items-center gap-2">
                              <Progress value={subj.syllabus} className="h-2 flex-1" />
                              <span className="text-sm font-bold">{subj.syllabus}%</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">Current Chapter</div>
                            <div className="text-sm font-semibold truncate">{subj.currentChapter}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">Next Chapter</div>
                            <div className="text-sm font-semibold truncate">{subj.nextChapter}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">Avg Marks</div>
                            <div className="text-sm font-bold">{subj.avgMarks}%</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">Next Exam</div>
                            <div className="text-sm font-semibold">{subj.nextExam}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">Pending Reviews</div>
                            <div className="text-sm font-bold">{subj.pendingReviews}</div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:w-52 shrink-0">
                        <div className="text-xs text-muted-foreground mb-2">Actions</div>
                        <div className="space-y-2">
                          {["Manage Assignment", "Update Syllabus", "Enter Marks", "Review Submissions", "Generate Paper"].map((label) => (
                            <Button key={label} variant="outline" size="sm" className="w-full justify-start text-xs">{label}</Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {workspaceTab === "timetable" && (
              <TimetableView classId={selectedClass.id} />
            )}

            {workspaceTab === "students" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(CLASS_STUDENTS[selectedClass.id] || []).map((student) => (
                  <Card key={student.roll} className="p-5 hover:shadow-glow transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("size-10 rounded-full grid place-items-center text-white font-bold",
                          student.status === "top" ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                          student.status === "at-risk" ? "bg-gradient-to-br from-red-500 to-rose-500" :
                          "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                        )}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-xs text-muted-foreground">Roll #{student.roll}</p>
                        </div>
                      </div>
                      {student.status === "top" && <Badge className="bg-emerald-500 text-white border-0 text-[10px]"><Award className="size-3 mr-1" />Top</Badge>}
                      {student.status === "at-risk" && <Badge className="bg-red-500 text-white border-0 text-[10px]"><AlertCircle className="size-3 mr-1" />At Risk</Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-muted/50 text-center">
                        <div className="text-xs text-muted-foreground">Attendance</div>
                        <div className="font-bold">{student.attendance}%</div>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50 text-center">
                        <div className="text-xs text-muted-foreground">Score</div>
                        <div className="font-bold">{student.score}%</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">View Profile</Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">Enter Marks</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {workspaceTab === "plan" && (
              <div className="space-y-3">
                {(TEACHING_PLAN[selectedClass.id] || []).map((item) => (
                  <Card key={item.day} className="p-5 hover:shadow-glow transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white grid place-items-center font-bold">
                        {item.day.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{item.day}</div>
                        <div className="text-sm text-muted-foreground">{item.topic}</div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                    </div>
                  </Card>
                ))}
                <Button className="w-full bg-brand-gradient text-white border-0"><FilePlus className="size-4 mr-2" />Add Teaching Plan</Button>
              </div>
            )}

            {workspaceTab === "assignments" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {["pending", "submitted", "verified"].map((status) => {
                    const items = (ASSIGNMENTS[selectedClass.id] || []).filter((a) => a.status === status);
                    const total = items.reduce((sum, a) => sum + a.count, 0);
                    return (
                      <Card key={status} className="p-5">
                        <div className="text-sm text-muted-foreground capitalize">{status}</div>
                        <div className="text-2xl font-bold mt-1">{total}</div>
                      </Card>
                    );
                  })}
                </div>
                <div className="space-y-3">
                  {(ASSIGNMENTS[selectedClass.id] || []).map((a, i) => (
                    <Card key={i} className="p-5 hover:shadow-glow transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("size-10 rounded-xl grid place-items-center text-white",
                            a.status === "pending" ? "bg-amber-500" : a.status === "submitted" ? "bg-sky-500" : "bg-emerald-500"
                          )}>
                            <FileText className="size-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{a.name}</h3>
                            <p className="text-xs text-muted-foreground">{a.count} submissions</p>
                          </div>
                        </div>
                        <Badge variant={a.status === "pending" ? "default" : "secondary"} className="capitalize">{a.status}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button className="w-full bg-brand-gradient text-white border-0"><FilePlus className="size-4 mr-2" />Create Assignment</Button>
              </div>
            )}

            {workspaceTab === "performance" && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-5"><div className="text-sm text-muted-foreground">Avg Marks</div><div className="text-2xl font-bold mt-1">82%</div></Card>
                  <Card className="p-5"><div className="text-sm text-muted-foreground">Attendance</div><div className="text-2xl font-bold mt-1">94%</div></Card>
                  <Card className="p-5"><div className="text-sm text-muted-foreground">Top Score</div><div className="text-2xl font-bold mt-1 text-emerald-500">96%</div></Card>
                  <Card className="p-5"><div className="text-sm text-muted-foreground">At Risk</div><div className="text-2xl font-bold mt-1 text-red-500">2</div></Card>
                </div>
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Performance Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { range: "90-100%", count: 8, color: "bg-emerald-500" },
                      { range: "80-89%", count: 15, color: "bg-sky-500" },
                      { range: "70-79%", count: 12, color: "bg-amber-500" },
                      { range: "Below 70%", count: 7, color: "bg-red-500" },
                    ].map((item) => (
                      <div key={item.range} className="flex items-center gap-3">
                        <span className="text-sm w-24">{item.range}</span>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", item.color)} style={{ width: `${(item.count / 42) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {workspaceTab === "reports" && (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Today&apos;s Report</h3>
                    <Badge className="bg-brand-gradient text-white border-0">15 June</Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-muted/50">
                        <div className="text-xs text-muted-foreground">Topic Taught</div>
                        <div className="text-sm font-semibold mt-1">Quadratic Equations</div>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/50">
                        <div className="text-xs text-muted-foreground">Homework Given</div>
                        <div className="text-sm font-semibold mt-1">Exercise 4.2</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-muted/50">
                        <div className="text-xs text-muted-foreground">Students Participated</div>
                        <div className="text-sm font-semibold mt-1">38/42</div>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/50">
                        <div className="text-xs text-muted-foreground">Students Need Help</div>
                        <div className="text-sm font-semibold mt-1 text-amber-600">4</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 mt-4">
                    <div className="text-xs text-muted-foreground">Remarks</div>
                    <div className="text-sm font-semibold mt-1">Need revision tomorrow.</div>
                  </div>
                </Card>
                <Button className="w-full bg-brand-gradient text-white border-0"><FilePlus className="size-4 mr-2" />Create Daily Report</Button>
              </div>
            )}

            {workspaceTab === "ai" && (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white grid place-items-center">
                      <Sparkles className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">AI Class Analysis</h3>
                      <p className="text-sm text-muted-foreground">Insights for {selectedClass.name}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {(AI_INSIGHTS[selectedClass.id] || []).map((insight, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                        <Sparkles className="size-4 text-violet-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">{insight}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Suggestions</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">Schedule revision session on Thursday for struggling students.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                      <AlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">Focus on weak students — consider extra practice worksheets.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-500/5 border border-sky-500/10">
                      <Target className="size-4 text-sky-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">Practice more word problems to improve exam readiness.</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
