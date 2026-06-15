import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/scholarii/auth";
import type { Role } from "@/lib/scholarii/types";
import {
  Home,
  Users,
  Briefcase,
  BookOpen,
  DollarSign,
  BarChart3,
  Settings,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  CalendarClock,
  UserCircle,
  Building2,
  ShieldCheck,
  FileText,
  Calendar,
  Wallet,
  MessageSquare,
  Baby,
  LogOut,
  Bell,
  Moon,
  Sun,
  Search,
  Menu,
  BookMarked,
  User as StudentIcon,
  Users as ParentIcon,
  BrainCircuit,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import scholariiIconUrl from "../../../Icons/apple-touch-icon.png?url";

type NavItem = { to: string; label: string; icon: typeof Home };

type PrincipalNav = (NavItem | NavGroup)[];

const STUDENT_NAV: PrincipalNav = [
  { to: "/app", label: "Dashboard", icon: Home },
  { to: "/app/timetable", label: "Timetable", icon: Calendar },
  {
    label: "Academics",
    icon: BookOpen,
    items: [
      { to: "/app/assignments", label: "Assignments", icon: ClipboardList },
      { to: "/app/exams", label: "Exams & Results", icon: GraduationCap },
      { to: "/app/study-resources", label: "Study Resources", icon: Library },
    ],
  },
  { to: "/app/ai", label: "AI Study Assistant", icon: Sparkles },
  { to: "/app/performance", label: "Performance", icon: Activity },
  { to: "/app/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/app/messages", label: "Messages", icon: MessageCircle },
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/profile", label: "Profile", icon: UserCircle },
];

const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    items: [
      { to: "/app", label: "Dashboard", icon: Home, activePaths: ["/app/admin/dashboard"] },
      { to: "/app/admin/operations", label: "Operations", icon: Settings2 },
    ],
  },
  {
    label: "Academics & Records",
    items: [
      {
        to: "/app/admissions",
        label: "Admissions",
        icon: ClipboardList,
        activePaths: ["/app/admin/admissions"],
      },
      { to: "/app/admin/students", label: "Students", icon: Users },
      { to: "/app/admin/staff", label: "Staff Records", icon: Briefcase },
      { to: "/app/admin/academics", label: "Academics", icon: BookOpen },
    ],
  },
  {
    label: "Finance",
    items: [{ to: "/app/admin/fees", label: "Fee Collection", icon: DollarSign }],
  },
  {
    label: "Insights",
    collapsible: true,
    items: [
      { to: "/app/admin/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/app/admin/ai", label: "Scholarii AI", icon: Sparkles },
      { to: "/app/admin/brain", label: "School Brain", icon: BrainCircuit },
    ],
  },
  {
    label: "Administration",
    collapsible: true,
    items: [
      { to: "/app/admin/documents", label: "Documents", icon: FileText },
      { to: "/app/admin/facilities", label: "Facilities", icon: Building2 },
      { to: "/app/admin/compliance", label: "Compliance", icon: ShieldCheck },
    ],
  },
];

const NAV: Record<Role, NavItem[]> = {
  principal: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/schedule", label: "Operations", icon: CalendarClock },
    { to: "/app/admissions", label: "Admissions", icon: FileText },
    { to: "/app/students", label: "Students", icon: Users },
    { to: "/app/teachers", label: "Teachers", icon: Briefcase },
    { to: "/app/academics", label: "Academics", icon: BookOpen },
    { to: "/app/fees", label: "Finance", icon: DollarSign },
    { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/app/ai", label: "Scholarii AI", icon: BrainCircuit },
    { to: "/app/brain", label: "School Brain", icon: BrainCircuit },
    { to: "/app/documents", label: "Documents", icon: FileText },
    { to: "/app/facilities", label: "Facilities", icon: Building2 },
    { to: "/app/compliance", label: "Compliance", icon: ShieldCheck },
    { to: "/app/communication", label: "Communications", icon: MessageSquare },
    { to: "/app/settings", label: "Settings", icon: Settings },
  ],
  teacher: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/classes", label: "My Classes", icon: BookMarked },
    { to: "/app/attendance", label: "Attendance", icon: ClipboardCheck },
    { to: "/app/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/app/gradebook", label: "Gradebook", icon: GraduationCap },
    { to: "/app/meetings", label: "PTA Meetings", icon: CalendarClock },
    { to: "/app/profile", label: "Profile", icon: UserCircle },
  ],
  student: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/timetable", label: "My Timetable", icon: Calendar },
    { to: "/app/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/app/exams", label: "Exams & Results", icon: GraduationCap },
    { to: "/app/attendance", label: "Attendance", icon: ClipboardCheck },
    { to: "/app/fees", label: "Fees", icon: Wallet },
    { to: "/app/profile", label: "Profile", icon: UserCircle },
  ],
  admin: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/users", label: "User Management", icon: Users },
    { to: "/app/fees", label: "Fee Management", icon: DollarSign },
    { to: "/app/infrastructure", label: "Infrastructure", icon: Building2 },
    { to: "/app/reports", label: "Reports & Export", icon: FileText },
    { to: "/app/settings", label: "System Settings", icon: Settings },
    { to: "/app/logs", label: "Audit Logs", icon: ScrollText },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  principal: "Principal",
  teacher: "Teacher",
  student: "Student",
  admin: "Admin",
};

type RightTab = "chat" | "notifications" | "actions" | "overview";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  category: "school" | "system";
  icon: typeof Home;
};

type QuickAction = {
  label: string;
  icon: typeof Home;
  group: string;
};

// ─── Role-specific Notifications ───
const PRINCIPAL_NOTIFICATIONS: NotificationItem[] = [
  { id: "pn1", title: "New Admission Request", description: "Grade 7 — Aarav Sharma application received.", time: "2 min ago", read: false, category: "school", icon: UserPlus },
  { id: "pn2", title: "Attendance Alert", description: "12 students absent in Grade 8 today.", time: "15 min ago", read: false, category: "school", icon: ClipboardCheck },
  { id: "pn3", title: "Fee Collection Reminder", description: "84 families have pending dues.", time: "1 hour ago", read: false, category: "school", icon: DollarSign },
  { id: "pn4", title: "AI Report Generated", description: "Monthly analytics report is ready.", time: "2 hours ago", read: true, category: "system", icon: BrainCircuit },
  { id: "pn5", title: "Teacher Leave Request", description: "Ms. Priya filed a leave request for Friday.", time: "3 hours ago", read: true, category: "school", icon: Briefcase },
  { id: "pn6", title: "Export Completed", description: "Student directory CSV exported successfully.", time: "5 hours ago", read: true, category: "system", icon: FileText },
  { id: "pn7", title: "Exam Schedule Updated", description: "Mid-term exam schedule published.", time: "1 day ago", read: true, category: "school", icon: CalendarClock },
  { id: "pn8", title: "Workflow Completed", description: "Parent notification batch sent.", time: "1 day ago", read: true, category: "system", icon: CheckCircle2 },
];

const STUDENT_NOTIFICATIONS: NotificationItem[] = [
  { id: "sn1", title: "New Assignment Added", description: "Mr. Sharma added Algebra Worksheet due tomorrow.", time: "10 min ago", read: false, category: "school", icon: ClipboardList },
  { id: "sn2", title: "Science Project Due", description: "Your science project is due in 3 days.", time: "1 hour ago", read: false, category: "school", icon: Clock },
  { id: "sn3", title: "Mid-Sem Results Published", description: "Your mid-semester results are now available.", time: "2 hours ago", read: false, category: "school", icon: Award },
  { id: "sn4", title: "Math Exam Scheduled", description: "Mathematics Unit Test on June 20.", time: "3 hours ago", read: true, category: "school", icon: CalendarClock },
  { id: "sn5", title: "Document Verified", description: "Your Aadhaar Card has been verified by admin.", time: "5 hours ago", read: true, category: "school", icon: CheckCircle2 },
  { id: "sn6", title: "AI Study Guide Ready", description: "New AI study guide for Science Chapter 6 generated.", time: "1 day ago", read: true, category: "system", icon: Sparkles },
];

const PARENT_NOTIFICATIONS: NotificationItem[] = [
  { id: "mn1", title: "Fee Reminder", description: "Term 2 fees due by June 30.", time: "1 hour ago", read: false, category: "school", icon: DollarSign },
  { id: "mn2", title: "Attendance Alert", description: "Aarav was absent today (3 absences this month).", time: "3 hours ago", read: false, category: "school", icon: ClipboardCheck },
  { id: "mn3", title: "Result Published", description: "Mid-semester results for Aarav are available.", time: "5 hours ago", read: false, category: "school", icon: Award },
  { id: "mn4", title: "PTM Scheduled", description: "Parent-Teacher meeting on June 25.", time: "1 day ago", read: true, category: "school", icon: CalendarClock },
  { id: "mn5", title: "Document Verified", description: "Transfer Certificate verified by school.", time: "2 days ago", read: true, category: "school", icon: CheckCircle2 },
];

const TEACHER_NOTIFICATIONS: NotificationItem[] = [
  { id: "tn1", title: "New Assignment Submitted", description: "15 students submitted Algebra Worksheet.", time: "30 min ago", read: false, category: "school", icon: ClipboardList },
  { id: "tn2", title: "Leave Request Approved", description: "Your leave request for Friday approved.", time: "2 hours ago", read: false, category: "system", icon: CheckCircle2 },
  { id: "tn3", title: "Exam Results Pending", description: "Enter marks for Unit Test 1 before deadline.", time: "5 hours ago", read: true, category: "school", icon: AlertTriangle },
  { id: "tn4", title: "PTM Scheduled", description: "Parent-Teacher meeting on June 25.", time: "1 day ago", read: true, category: "school", icon: CalendarClock },
];

const ADMIN_NOTIFICATIONS: NotificationItem[] = [
  { id: "an1", title: "New Admission Request", description: "Grade 7 application received.", time: "5 min ago", read: false, category: "school", icon: UserPlus },
  { id: "an2", title: "Fee Collection Report", description: "Monthly fee collection report ready.", time: "1 hour ago", read: false, category: "system", icon: DollarSign },
  { id: "an3", title: "System Backup Complete", description: "Daily backup completed successfully.", time: "3 hours ago", read: true, category: "system", icon: CheckCircle2 },
  { id: "an4", title: "User Activity Log", description: "3 new teacher accounts created.", time: "1 day ago", read: true, category: "system", icon: Users },
];

// ─── Role-specific Quick Actions ───
const PRINCIPAL_ACTIONS: QuickAction[] = [
  { label: "Add Student", icon: UserPlus, group: "Students" },
  { label: "View Directory", icon: FolderOpen, group: "Students" },
  { label: "New Admission", icon: UserPlus, group: "Admissions" },
  { label: "Review Applications", icon: FileText, group: "Admissions" },
  { label: "Create Assignment", icon: FilePlus, group: "Academics" },
  { label: "Schedule Exam", icon: ExamIcon, group: "Academics" },
  { label: "Fee Report", icon: DollarSign, group: "Finance" },
  { label: "View Defaulters", icon: TrendingDown, group: "Finance" },
  { label: "Send Announcement", icon: Megaphone, group: "Communication" },
  { label: "Message Parents", icon: Mail, group: "Communication" },
  { label: "AI Summary", icon: BrainCircuit, group: "AI" },
  { label: "Run Analysis", icon: BarChart3, group: "AI" },
];

const STUDENT_ACTIONS: QuickAction[] = [
  { label: "View Timetable", icon: Calendar, group: "Academics" },
  { label: "Open Assignments", icon: ClipboardList, group: "Academics" },
  { label: "AI Study Assistant", icon: Sparkles, group: "AI" },
  { label: "Study Resources", icon: Library, group: "Academics" },
  { label: "View Results", icon: Award, group: "Academics" },
  { label: "Upload Document", icon: Upload, group: "Documents" },
  { label: "Message Teacher", icon: MessageCircle, group: "Communication" },
];

const PARENT_ACTIONS: QuickAction[] = [
  { label: "Child Progress", icon: TrendingUp, group: "Overview" },
  { label: "Attendance Report", icon: ClipboardCheck, group: "Overview" },
  { label: "Fee Details", icon: DollarSign, group: "Finance" },
  { label: "Message Teacher", icon: MessageCircle, group: "Communication" },
  { label: "Documents", icon: FolderOpen, group: "Documents" },
  { label: "AI Assistant", icon: Sparkles, group: "AI" },
];

const TEACHER_ACTIONS: QuickAction[] = [
  { label: "My Classes", icon: BookMarked, group: "Academics" },
  { label: "Take Attendance", icon: ClipboardCheck, group: "Academics" },
  { label: "Create Assignment", icon: FilePlus, group: "Academics" },
  { label: "Grade Submissions", icon: GraduationCap, group: "Academics" },
  { label: "Message Students", icon: MessageCircle, group: "Communication" },
  { label: "AI Assistant", icon: Sparkles, group: "AI" },
];

const ADMIN_ACTIONS: QuickAction[] = [
  { label: "User Management", icon: Users, group: "System" },
  { label: "Fee Management", icon: DollarSign, group: "Finance" },
  { label: "Infrastructure", icon: Building2, group: "Facilities" },
  { label: "Reports & Export", icon: FileText, group: "Reports" },
  { label: "System Settings", icon: Settings, group: "System" },
  { label: "Audit Logs", icon: ScrollText, group: "System" },
];

// ─── Role-specific AI Context Prompts ───
const STUDENT_CONTEXT_PROMPTS: Record<string, string[]> = {
  "/app": ["What's my schedule today?", "Check my upcoming deadlines", "How am I performing?"],
  "/app/assignments": ["Show pending assignments", "Which assignment is due soon?", "Help me plan my homework"],
  "/app/exams": ["When is my next exam?", "Analyze my exam results", "Create a study plan"],
  "/app/ai": ["Explain Chapter 6 Science", "Generate flashcards for History", "Quiz me on Mathematics"],
  "/app/performance": ["Which subject needs improvement?", "Compare my scores across exams", "Generate performance report"],
  "/app/study-resources": ["Find resources for Mathematics", "Suggest study materials for Science", "Previous year papers for English"],
  "/app/messages": ["Draft a message to my teacher", "Check unread messages"],
  "/app/documents": ["Check document verification status", "Upload new document"],
  "/app/attendance": ["Show my attendance trend", "How many days absent?"],
};

const PARENT_CONTEXT_PROMPTS: Record<string, string[]> = {
  "/app": ["How is Aarav performing?", "Check attendance summary", "View fee status"],
  "/app/children": ["Compare siblings' performance", "View detailed progress report"],
  "/app/exams": ["Analyze exam results", "Compare with class average"],
  "/app/attendance": ["Show attendance calendar", "Identify attendance patterns"],
  "/app/fees": ["View payment history", "Check upcoming dues"],
  "/app/messages": ["Draft message to teacher", "Check school announcements"],
  "/app/documents": ["Verify document status", "Download report card"],
};

const TEACHER_CONTEXT_PROMPTS: Record<string, string[]> = {
  "/app": ["Today's class schedule", "Pending grading tasks", "Student attendance overview"],
  "/app/classes": ["Class performance summary", "Identify struggling students"],
  "/app/attendance": ["Take attendance", "View attendance trends"],
  "/app/assignments": ["Create new assignment", "Review submissions"],
  "/app/gradebook": ["Enter marks", "Generate class report"],
};

const PRINCIPAL_CONTEXT_PROMPTS: Record<string, string[]> = {
  "/app/students": ["Find at-risk students", "Generate student summary", "Analyze attendance by class"],
  "/app/fees": ["Analyze collections", "Show fee defaulters", "Generate finance report"],
  "/app/analytics": ["School health overview", "Compare grade performance", "Attendance trends"],
  "/app/teachers": ["Teacher workload analysis", "Performance summary", "Leave pattern review"],
  "/app/academics": ["Grade-wise performance", "Subject analysis", "Exam results summary"],
  "/app/attendance": ["Attendance trends", "Absentee analysis", "Class-wise breakdown"],
  "/app/admissions": ["Admission pipeline", "Conversion analysis", "Enrollment forecast"],
  "/app/communication": ["Message engagement", "Circular delivery status", "Parent response rate"],
  "/app/compliance": ["Compliance checklist", "Upcoming deadlines", "Audit readiness"],
  "/app": ["School overview", "Today's highlights", "Action items"],
};

const ADMIN_CONTEXT_PROMPTS: Record<string, string[]> = {
  "/app/users": ["User activity report", "New user registrations", "Role distribution"],
  "/app/fees": ["Revenue analysis", "Collection trends", "Outstanding dues"],
  "/app/infrastructure": ["Room utilization", "Maintenance schedule", "Resource allocation"],
  "/app/logs": ["Recent system events", "Security audit", "Login activity"],
  "/app": ["System health overview", "Recent activity", "Admin tasks"],
};

// ─── Student-specific sidebar data ───
interface DeadlineItem {
  id: string;
  name: string;
  dueDate: string;
  daysRemaining: number;
}

interface ExamItem {
  id: string;
  name: string;
  subject: string;
  date: string;
  daysRemaining: number;
}

interface AcademicSnapshot {
  attendance: number;
  performance: number;
  pendingAssignments: number;
  upcomingExams: number;
}

interface AiSuggestion {
  id: string;
  text: string;
}

const STUDENT_DEADLINES: DeadlineItem[] = [
  { id: "d1", name: "Algebra Worksheet", dueDate: "Tomorrow", daysRemaining: 1 },
  { id: "d2", name: "Science Project", dueDate: "Jun 18", daysRemaining: 3 },
  { id: "d3", name: "English Essay", dueDate: "Jun 20", daysRemaining: 5 },
];

const STUDENT_EXAMS: ExamItem[] = [
  { id: "e1", name: "Mathematics Unit Test", subject: "Mathematics", date: "Jun 20", daysRemaining: 5 },
  { id: "e2", name: "Science Practical", subject: "Science", date: "Jun 23", daysRemaining: 8 },
];

const STUDENT_ACADEMIC_SNAPSHOT: AcademicSnapshot = {
  attendance: 92,
  performance: 84,
  pendingAssignments: 3,
  upcomingExams: 2,
};

const STUDENT_AI_SUGGESTIONS: AiSuggestion[] = [
  { id: "s1", text: "Review Algebra before Unit Test on June 20." },
  { id: "s2", text: "Complete Science Project — deadline in 3 days." },
  { id: "s3", text: "Revise Chapter 6 Biology for upcoming practical." },
  { id: "s4", text: "Practice previous year Mathematics papers." },
];

const PARENT_DEADLINES: DeadlineItem[] = [
  { id: "pd1", name: "Term 2 Fee Payment", dueDate: "Jun 30", daysRemaining: 15 },
  { id: "pd2", name: "PTM Attendance", dueDate: "Jun 25", daysRemaining: 10 },
];

const PARENT_EXAMS: ExamItem[] = [
  { id: "pe1", name: "Mid-Semester Results", subject: "All Subjects", date: "Available", daysRemaining: 0 },
  { id: "pe2", name: "Final Examination", subject: "All Subjects", date: "Nov 15", daysRemaining: 153 },
];

const PARENT_ACADEMIC_SNAPSHOT: AcademicSnapshot = {
  attendance: 92,
  performance: 82,
  pendingAssignments: 3,
  upcomingExams: 2,
};

// ─── Teacher-specific sidebar data ───
interface TeacherClassItem {
  id: string;
  name: string;
  time: string;
  students: number;
}

interface TeacherReviewItem {
  id: string;
  assignment: string;
  class: string;
  pendingCount: number;
}

interface TeacherExamItem {
  id: string;
  name: string;
  subject: string;
  date: string;
  daysRemaining: number;
}

interface TeacherAiSuggestion {
  id: string;
  text: string;
}

const TEACHER_UPCOMING_CLASSES: TeacherClassItem[] = [
  { id: "tc1", name: "Class 10-A Mathematics", time: "11:00 AM", students: 42 },
  { id: "tc2", name: "Class 10-B Mathematics", time: "12:00 PM", students: 40 },
  { id: "tc3", name: "Class 9-A Mathematics", time: "2:00 PM", students: 38 },
];

const TEACHER_PENDING_REVIEWS: TeacherReviewItem[] = [
  { id: "tr1", assignment: "Algebra Worksheet", class: "Class 10-A", pendingCount: 12 },
  { id: "tr2", assignment: "Trigonometry Homework", class: "Class 10-B", pendingCount: 8 },
];

const TEACHER_UPCOMING_EXAMS: TeacherExamItem[] = [
  { id: "te1", name: "Unit Test 1", subject: "Mathematics", date: "Jun 20", daysRemaining: 5 },
  { id: "te2", name: "Mid-Semester", subject: "All Subjects", date: "Jul 15", daysRemaining: 30 },
];

const TEACHER_AI_SUGGESTIONS: TeacherAiSuggestion[] = [
  { id: "ts1", text: "12 submissions pending for Algebra Worksheet — review before Friday." },
  { id: "ts2", text: "Class 10-B performance dropped 8% in last assessment — consider revision." },
  { id: "ts3", text: "Unit Test 1 results deadline is June 25 — enter marks soon." },
  { id: "ts4", text: "PTA Meeting scheduled for June 25 — prepare progress summaries." },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, theme, toggleTheme, parentMode, setParentMode } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;
  const isStudent = user.role === "student";
  const showParent = isStudent && parentMode;
  const items = showParent ? PARENT_NAV : NAV[user.role];
  const portalLabel = showParent ? "Parent" : ROLE_LABEL[user.role];
  const initials = user.name.split(" ").map((s) => s[0]).slice(0, 2).join("");

  const isNavItemActive = (it: NavItem) => {
    const paths = [it.to, ...(it.activePaths ?? [])];
    return paths.some((itemPath) =>
      itemPath === "/app" ? path === "/app" : path.startsWith(itemPath),
    );
  };

  const renderNavItem = (it: NavItem, expanded: boolean) => {
    const active = isNavItemActive(it);
    const Icon = it.icon;
    return (
      <Link
        key={it.to}
        to={it.to}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          active
            ? "bg-violet-600 text-white shadow-sm hover:bg-violet-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
          !expanded && "justify-center",
        )}
        title={!expanded ? it.label : ""}
      >
        <Icon className="size-4 flex-shrink-0" />
        {expanded && <span className="font-medium">{it.label}</span>}
        {!expanded && (
          <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            {it.label}
          </div>
        )}
      </div>
      <nav key={showParent ? "parent" : "self"} className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 animate-in-up">
        {items.map((it) => {
          const active = it.to === "/app" ? path === "/app" : path.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                active
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !sidebarOpen && "justify-center"
              )}
              title={!sidebarOpen ? it.label : ""}
            >
              <Icon className="size-4 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-medium">{it.label}</span>
              )}
              
              {/* Hover tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  {it.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-gray-100 p-2">
        {renderAdminUtilityItem("Communications", MessageSquare, expanded)}
        {renderAdminUtilityItem("Settings", Settings, expanded)}
        <button
          type="button"
          onClick={() => {
            logout();
            nav({ to: "/login" });
          }}
          className={cn(
            "group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700",
            !expanded && "justify-center px-2",
          )}
          title={!expanded ? "Log out" : ""}
        >
          <LogOut className="size-4 flex-shrink-0" />
          {sidebarOpen && "Log out"}
          
          {/* Hover tooltip for collapsed state */}
          {!sidebarOpen && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Log out
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-background flex w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden h-screen shrink-0 flex-col overflow-hidden border-r transition-all duration-300 lg:flex",
          user.role === "admin" ? "border-gray-100 bg-white" : "border-sidebar-border bg-sidebar",
          sidebarOpen ? (user.role === "admin" ? "w-[200px]" : "w-64") : "w-20",
        )}
      >
        {user.role === "admin" ? getAdminSidebarInner(sidebarOpen) : getSidebarInner(sidebarOpen)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside
            className={cn(
              "absolute left-0 top-0 h-full w-[200px] animate-in-up overflow-hidden border-r",
              user.role === "admin"
                ? "border-gray-100 bg-white"
                : "border-sidebar-border bg-sidebar",
            )}
          >
            {user.role === "admin" ? getAdminSidebarInner(true) : getSidebarInner(true)}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 lg:px-6 border-b border-border bg-background/80 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            title="Open navigation"
          >
            <Menu className="size-5" />
          </Button>
          
          {/* Desktop sidebar toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden lg:flex transition-all duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
          </Button>
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search students, teachers, classes..."
                className="pl-9 bg-muted/40 border-0"
              />
            </div>
          </div>
          <div className="flex-1 sm:hidden" />

          {isStudent && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-border bg-muted/40 transition-all">
              <div
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium transition-colors",
                  !parentMode ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <StudentIcon className="size-3.5" />
                <span className="hidden md:inline">Student</span>
              </div>
              <Switch
                checked={parentMode}
                onCheckedChange={setParentMode}
                aria-label="Toggle parent mode"
              />
              <div
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium transition-colors",
                  parentMode ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <ParentIcon className="size-3.5" />
                <span className="hidden md:inline">Parent</span>
              </div>
            </div>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="size-5" />
            <Badge className="absolute -top-1 -right-1 size-4 p-0 grid place-items-center text-[10px] bg-brand-gradient border-0">3</Badge>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                <Avatar className="size-9">
                  <AvatarFallback style={{ backgroundColor: user.avatarColor, color: "white" }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground font-normal">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isStudent && (
                <>
                  <DropdownMenuItem onClick={() => setParentMode(!parentMode)}>
                    {parentMode ? (
                      <StudentIcon className="size-4 mr-2" />
                    ) : (
                      <ParentIcon className="size-4 mr-2" />
                    )}
                    Switch to {parentMode ? "Student" : "Parent"} Mode
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => nav({ to: "/app/profile" })}>
                <UserCircle className="size-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShieldCheck className="size-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  nav({ to: "/login" });
                }}
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main
          key={showParent ? "p" : "s"}
          className="flex-1 overflow-y-auto p-4 lg:p-8 animate-in-up transition-all duration-300"
        >
          {children}
        </main>
      </div>

      {/* ─── Right Sidebar ─── */}
      <aside
        className="hidden lg:flex flex-col shrink-0 h-full bg-sidebar border-l border-sidebar-border z-30 relative"
        style={{
          width: rightOpen ? rightWidth : 0,
          borderLeftWidth: rightOpen ? 1 : 0,
          transition: isResizing ? "none" : "width 0.3s ease-in-out, border-left-width 0.3s ease-in-out",
        }}
      >
        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className={cn(
            "absolute left-0 top-0 h-full w-1.5 cursor-col-resize z-50 transition-colors",
            isResizing ? "bg-emerald-500/60" : "hover:bg-emerald-500/50"
          )}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        />

        {/* Right Sidebar Header */}
        <div className="flex items-center gap-2 h-16 px-5 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white grid place-items-center shrink-0">
              <BrainCircuit className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sidebar-foreground leading-none text-sm">
                {showParent ? "Parent Panel" : isStudent ? "Student Panel" : user?.role === "teacher" ? "Teacher Panel" : "Utilities"}
              </div>
              <div className="text-[11px] text-sidebar-foreground/50 mt-0.5">
                {showParent ? "Family Overview" : isStudent ? "Study Hub" : user?.role === "teacher" ? "Teaching Workspace" : "AI & Actions"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setRightOpen(false)}
            className="size-7 rounded-md flex items-center justify-center text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors shrink-0"
            title="Collapse sidebar"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1 shrink-0">
          {([
            ...(showParent || isStudent || user?.role === "teacher" ? [{ tab: "overview" as RightTab, label: "Overview", icon: BarChart3, badge: undefined }] : []),
            { tab: "chat" as RightTab, label: "AI Chat", icon: MessageCircle, badge: undefined },
            { tab: "notifications" as RightTab, label: "Notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
            { tab: "actions" as RightTab, label: "Quick Actions", icon: Zap, badge: undefined },
          ]).map((item) => {
            const active = rightTab === item.tab;
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                onClick={() => setRightTab(item.tab)}
                className={cn(
                  "group relative w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  active
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="size-4 flex-shrink-0" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-1.5 size-3.5 rounded-full bg-red-500 text-[8px] text-white grid place-items-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="font-medium flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Panel Content */}
        <div className="flex-1 min-h-0 border-t border-sidebar-border overflow-hidden">
            <div className="h-full overflow-y-auto">
              {/* ─── Chat Tab ─── */}
              {rightTab === "chat" && (
                <div className="flex flex-col h-full">
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.length === 0 && (
                      <div className="flex flex-col items-center text-center px-2 pt-4">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white grid place-items-center mb-3">
                          <BrainCircuit className="size-5" />
                        </div>
                        <div className="text-sm font-semibold text-sidebar-foreground">Scholarii AI</div>
                        <p className="text-xs text-sidebar-foreground/50 mt-1 mb-4">Ask anything about your school</p>
                        <div className="space-y-1.5 w-full">
                          {contextPrompts.map((p) => (
                            <button
                              key={p}
                              onClick={() => { setChatInput(p); chatInputRef.current?.focus(); }}
                              className="w-full text-left rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2 text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                          msg.role === "user"
                            ? "bg-brand-gradient text-white rounded-br-md"
                            : "bg-sidebar-accent text-sidebar-foreground rounded-bl-md"
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatThinking && (
                      <div className="flex justify-start">
                        <div className="bg-sidebar-accent rounded-2xl rounded-bl-md px-3 py-2 text-xs text-sidebar-foreground/50">
                          <span className="inline-flex gap-1">
                            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-sidebar-border shrink-0">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-end gap-2">
                        <Textarea
                          ref={chatInputRef}
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChatSend(); } }}
                          placeholder="Ask Scholarii AI..."
                          className="min-h-[40px] max-h-[100px] resize-none text-xs bg-sidebar-accent/30 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                          rows={1}
                        />
                        <Button
                          size="icon"
                          onClick={handleChatSend}
                          disabled={!chatInput.trim() || chatThinking}
                          className="size-9 shrink-0 rounded-full bg-brand-gradient text-white hover:opacity-90 border-0"
                        >
                          <Send className="size-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="size-7 rounded-md flex items-center justify-center text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors" title="Attach file">
                          <Paperclip className="size-3.5" />
                        </button>
                        <button className="size-7 rounded-md flex items-center justify-center text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors" title="Voice input">
                          <Mic className="size-3.5" />
                        </button>
                        <div className="flex items-center gap-1 ml-auto rounded-md border border-sidebar-border px-2 py-1 text-[11px] text-sidebar-foreground/50 cursor-pointer hover:bg-sidebar-accent transition-colors">
                          <Star className="size-3 text-amber-500 fill-amber-500" />
                          <span>Scholarii Default</span>
                          <ChevronDown className="size-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Notifications Tab ─── */}
              {rightTab === "notifications" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-sidebar-border shrink-0">
                    <div className="flex gap-1">
                      {(["all", "school", "system"] as const).map((cat) => (
                        <button
                          key={cat}
                          className="px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-colors text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <button onClick={markAllRead} className="text-[11px] text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors flex items-center gap-1">
                      <CheckCheck className="size-3" />
                      Mark all read
                    </button>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                      {notifications.map((n) => {
                        const Icon = n.icon;
                        return (
                          <div
                            key={n.id}
                            className={cn(
                              "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer",
                              n.read ? "bg-transparent" : "bg-sidebar-accent/30"
                            )}
                            onClick={() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                          >
                            <div className={cn(
                              "size-8 rounded-lg grid place-items-center shrink-0 mt-0.5",
                              n.read ? "bg-sidebar-accent text-sidebar-foreground/40" : "bg-emerald-500/10 text-emerald-500"
                            )}>
                              <Icon className="size-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={cn("text-xs font-semibold truncate", n.read ? "text-sidebar-foreground/50" : "text-sidebar-foreground")}>{n.title}</span>
                                {!n.read && <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />}
                              </div>
                              <p className="text-[11px] text-sidebar-foreground/40 mt-0.5 line-clamp-2">{n.description}</p>
                              <span className="text-[10px] text-sidebar-foreground/25 mt-1 block">{n.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* ─── Quick Actions Tab ─── */}
              {rightTab === "actions" && (
                <div className="p-4 space-y-4">
                  {Array.from(new Set(roleQuickActions.map((a) => a.group))).map((group) => (
                    <div key={group}>
                      <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">{group}</div>
                      <div className="space-y-1">
                        {roleQuickActions.filter((a) => a.group === group).map((action) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={action.label}
                              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left"
                            >
                              <div className="size-8 rounded-lg bg-sidebar-accent grid place-items-center shrink-0">
                                <Icon className="size-4 text-sidebar-foreground/50" />
                              </div>
                              <span className="text-xs font-medium">{action.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ─── Overview Tab (Student/Parent/Teacher) ─── */}
              {rightTab === "overview" && (showParent || isStudent || user?.role === "teacher") && (
                <div className="p-4 space-y-5">
                  {/* Teacher Overview */}
                  {user?.role === "teacher" && (
                    <>
                      {/* Teaching Snapshot */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">Teaching Snapshot</div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "Classes Today", value: "5", icon: Users, color: "text-emerald-500" },
                            { label: "Pending Reviews", value: "20", icon: ClipboardList, color: "text-amber-500" },
                            { label: "Upcoming Exams", value: "2", icon: GraduationCap, color: "text-violet-500" },
                            { label: "Avg. Attendance", value: "92%", icon: ClipboardCheck, color: "text-blue-500" },
                          ].map((stat) => (
                            <div key={stat.label} className="rounded-xl bg-sidebar-accent/30 p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <stat.icon className={`size-3 ${stat.color}`} />
                                <span className="text-[10px] text-sidebar-foreground/50">{stat.label}</span>
                              </div>
                              <p className="text-sm font-bold text-sidebar-foreground">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Upcoming Classes */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">Upcoming Classes</div>
                        <div className="space-y-1.5">
                          {TEACHER_UPCOMING_CLASSES.map((cls) => (
                            <div key={cls.id} className="flex items-center gap-3 rounded-xl bg-sidebar-accent/30 px-3 py-2.5">
                              <div className="size-8 rounded-lg bg-emerald-500/10 grid place-items-center shrink-0">
                                <Users className="size-4 text-emerald-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-sidebar-foreground truncate">{cls.name}</p>
                                <p className="text-[10px] text-sidebar-foreground/40">{cls.time} · {cls.students} students</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pending Assignment Reviews */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">Pending Reviews</div>
                        <div className="space-y-1.5">
                          {TEACHER_PENDING_REVIEWS.map((review) => (
                            <div key={review.id} className="flex items-center gap-3 rounded-xl bg-sidebar-accent/30 px-3 py-2.5">
                              <div className="size-8 rounded-lg bg-amber-500/10 grid place-items-center shrink-0">
                                <ClipboardList className="size-4 text-amber-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-sidebar-foreground truncate">{review.assignment}</p>
                                <p className="text-[10px] text-sidebar-foreground/40">{review.class} · {review.pendingCount} pending</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Upcoming Exams */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">Upcoming Exams</div>
                        <div className="space-y-1.5">
                          {TEACHER_UPCOMING_EXAMS.map((exam) => (
                            <div key={exam.id} className="flex items-center gap-3 rounded-xl bg-sidebar-accent/30 px-3 py-2.5">
                              <div className="size-8 rounded-lg bg-violet-500/10 grid place-items-center shrink-0">
                                <GraduationCap className="size-4 text-violet-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-sidebar-foreground truncate">{exam.name}</p>
                                <p className="text-[10px] text-sidebar-foreground/40">{exam.subject} · {exam.date}</p>
                              </div>
                              {exam.daysRemaining > 0 && (
                                <span className="text-[10px] font-medium text-violet-400">{exam.daysRemaining}d</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Teaching Suggestions */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">AI Suggestions</div>
                        <div className="space-y-1.5">
                          {TEACHER_AI_SUGGESTIONS.map((suggestion) => (
                            <div key={suggestion.id} className="flex items-start gap-2.5 rounded-xl bg-violet-500/5 border border-violet-500/10 px-3 py-2.5">
                              <Lightbulb className="size-3.5 text-violet-400 mt-0.5 shrink-0" />
                              <p className="text-[11px] text-sidebar-foreground/70 leading-relaxed">{suggestion.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Student/Parent Overview */}
                  {(showParent || isStudent) && (
                    <>
                      {/* Academic Snapshot */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">Academic Snapshot</div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "Attendance", value: `${showParent ? PARENT_ACADEMIC_SNAPSHOT.attendance : STUDENT_ACADEMIC_SNAPSHOT.attendance}%`, icon: ClipboardCheck, color: "text-emerald-500" },
                            { label: "Performance", value: `${showParent ? PARENT_ACADEMIC_SNAPSHOT.performance : STUDENT_ACADEMIC_SNAPSHOT.performance}%`, icon: TrendingUp, color: "text-blue-500" },
                            { label: "Assignments", value: `${showParent ? PARENT_ACADEMIC_SNAPSHOT.pendingAssignments : STUDENT_ACADEMIC_SNAPSHOT.pendingAssignments} Pending`, icon: Clock, color: "text-amber-500" },
                            { label: "Exams", value: `${showParent ? PARENT_ACADEMIC_SNAPSHOT.upcomingExams : STUDENT_ACADEMIC_SNAPSHOT.upcomingExams} Upcoming`, icon: CalendarClock, color: "text-violet-500" },
                          ].map((stat) => (
                            <div key={stat.label} className="rounded-xl bg-sidebar-accent/30 p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <stat.icon className={`size-3 ${stat.color}`} />
                                <span className="text-[10px] text-sidebar-foreground/50">{stat.label}</span>
                              </div>
                              <p className="text-sm font-bold text-sidebar-foreground">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Upcoming Deadlines */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">Upcoming Deadlines</div>
                        <div className="space-y-1.5">
                          {(showParent ? PARENT_DEADLINES : STUDENT_DEADLINES).map((deadline) => (
                            <div key={deadline.id} className="flex items-center gap-3 rounded-xl bg-sidebar-accent/30 px-3 py-2.5">
                              <div className={`size-2 rounded-full shrink-0 ${deadline.daysRemaining <= 1 ? "bg-red-500" : deadline.daysRemaining <= 3 ? "bg-amber-500" : "bg-emerald-500"}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-sidebar-foreground truncate">{deadline.name}</p>
                                <p className="text-[10px] text-sidebar-foreground/40">Due {deadline.dueDate}</p>
                              </div>
                              <span className={`text-[10px] font-medium ${deadline.daysRemaining <= 1 ? "text-red-400" : deadline.daysRemaining <= 3 ? "text-amber-400" : "text-emerald-400"}`}>
                                {deadline.daysRemaining === 0 ? "Today" : deadline.daysRemaining === 1 ? "Tomorrow" : `${deadline.daysRemaining}d`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Upcoming Exams */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">Upcoming Exams</div>
                        <div className="space-y-1.5">
                          {(showParent ? PARENT_EXAMS : STUDENT_EXAMS).map((exam) => (
                            <div key={exam.id} className="flex items-center gap-3 rounded-xl bg-sidebar-accent/30 px-3 py-2.5">
                              <div className="size-8 rounded-lg bg-violet-500/10 grid place-items-center shrink-0">
                                <GraduationCap className="size-4 text-violet-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-sidebar-foreground truncate">{exam.name}</p>
                                <p className="text-[10px] text-sidebar-foreground/40">{exam.subject} · {exam.date}</p>
                              </div>
                              {exam.daysRemaining > 0 && (
                                <span className="text-[10px] font-medium text-violet-400">{exam.daysRemaining}d</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Study Suggestions */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">AI Suggestions</div>
                    <div className="space-y-1.5">
                      {(showParent ? [] : STUDENT_AI_SUGGESTIONS).map((suggestion) => (
                        <div key={suggestion.id} className="flex items-start gap-2.5 rounded-xl bg-violet-500/5 border border-violet-500/10 px-3 py-2.5">
                          <Lightbulb className="size-3.5 text-violet-400 mt-0.5 shrink-0" />
                          <p className="text-[11px] text-sidebar-foreground/70 leading-relaxed">{suggestion.text}</p>
                        </div>
                      ))}
                      {showParent && (
                        <div className="flex items-start gap-2.5 rounded-xl bg-violet-500/5 border border-violet-500/10 px-3 py-2.5">
                          <Lightbulb className="size-3.5 text-violet-400 mt-0.5 shrink-0" />
                          <p className="text-[11px] text-sidebar-foreground/70 leading-relaxed">Check Aarav's mid-semester results for performance insights.</p>
                        </div>
                      )}
                    </div>
                  </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
      </aside>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: typeof Home;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning" | "info";
}) {
  const tones = {
    default: "from-brand-from to-brand-to",
    success: "from-emerald-400 to-emerald-600",
    warning: "from-amber-400 to-orange-500",
    info: "from-sky-400 to-blue-600",
  };
  return (
    <div className="glass rounded-2xl p-5 shadow-soft hover:-translate-y-0.5 transition-transform">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-3xl font-bold mt-2 tracking-tight">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div
          className={cn(
            "size-11 rounded-xl grid place-items-center text-white bg-gradient-to-br",
            tones[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
