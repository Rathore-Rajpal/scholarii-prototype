import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/scholarii/auth";
import type { Role } from "@/lib/scholarii/types";
import {
  Home, Users, Briefcase, BookOpen, DollarSign, BarChart3, Settings,
  ClipboardCheck, ClipboardList, GraduationCap, CalendarClock, UserCircle, Building2,
  ShieldCheck, FileText, ScrollText, Calendar, Wallet, MessageSquare, Baby,
  LogOut, Bell, Moon, Sun, Search, Menu, BookMarked, User as StudentIcon, Users as ParentIcon,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft, ChevronRight, ChevronDown,
  MessageCircle, Send, Plus, Check, CheckCheck,
  UserPlus, FolderOpen, FilePlus, ClipboardPlus, GraduationCap as ExamIcon,
  TrendingDown, Megaphone, Mail, Zap, X, Hash,
  Paperclip, Mic, Star, PanelRightOpen,
  Sparkles, Database, Activity, Library,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import scholariiIconUrl from "../../../Icons/apple-touch-icon.png?url";

type NavItem = { to: string; label: string; icon: typeof Home };
type NavGroup = { label: string; icon: typeof Home; items: NavItem[] };

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

const PARENT_NAV: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: Home },
  { to: "/app/children", label: "Child Overview", icon: Baby },
  { to: "/app/exams", label: "Performance", icon: Activity },
  { to: "/app/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/app/fees", label: "Fees", icon: Wallet },
  { to: "/app/messages", label: "Messages", icon: MessageCircle },
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/ai", label: "AI Assistant", icon: Sparkles },
  { to: "/app/profile", label: "Profile", icon: UserCircle },
];

const PRINCIPAL_NAV: PrincipalNav = [
  { to: "/app", label: "Dashboard", icon: Home },
  {
    label: "Operations",
    icon: Users,
    items: [
      { to: "/app/admissions", label: "Admissions", icon: FileText },
      { to: "/app/students", label: "Students", icon: Users },
      { to: "/app/teachers", label: "Teachers", icon: Briefcase },
    ],
  },
  { to: "/app/academics", label: "Academics", icon: BookOpen },
  { to: "/app/fees", label: "Finance", icon: DollarSign },
  {
    label: "Insights",
    icon: BarChart3,
    items: [
      { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/app/ai", label: "Scholarii AI", icon: Sparkles },
      { to: "/app/brain", label: "School Brain", icon: Database },
    ],
  },
  {
    label: "Administration",
    icon: ShieldCheck,
    items: [
      { to: "/app/documents", label: "Documents", icon: FileText },
      { to: "/app/facilities", label: "Facilities", icon: Building2 },
      { to: "/app/compliance", label: "Compliance", icon: ShieldCheck },
    ],
  },
  { to: "/app/communication", label: "Communications", icon: MessageSquare },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

const NAV: Record<Role, PrincipalNav | NavItem[]> = {
  principal: PRINCIPAL_NAV,
  teacher: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/classes", label: "My Classes", icon: BookMarked },
    { to: "/app/attendance", label: "Attendance", icon: ClipboardCheck },
    { to: "/app/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/app/gradebook", label: "Gradebook", icon: GraduationCap },
    { to: "/app/meetings", label: "PTA Meetings", icon: CalendarClock },
    { to: "/app/profile", label: "Profile", icon: UserCircle },
  ],
  student: STUDENT_NAV,
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
  principal: "Principal", teacher: "Teacher", student: "Student", admin: "Admin",
};

type RightTab = "chat" | "notifications" | "actions";

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

const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "New Admission Request", description: "Grade 7 — Aarav Sharma application received.", time: "2 min ago", read: false, category: "school", icon: UserPlus },
  { id: "n2", title: "Attendance Alert", description: "12 students absent in Grade 8 today.", time: "15 min ago", read: false, category: "school", icon: ClipboardCheck },
  { id: "n3", title: "Fee Collection Reminder", description: "84 families have pending dues.", time: "1 hour ago", read: false, category: "school", icon: DollarSign },
  { id: "n4", title: "AI Report Generated", description: "Monthly analytics report is ready.", time: "2 hours ago", read: true, category: "system", icon: BrainCircuit },
  { id: "n5", title: "Teacher Leave Request", description: "Ms. Priya filed a leave request for Friday.", time: "3 hours ago", read: true, category: "school", icon: Briefcase },
  { id: "n6", title: "Export Completed", description: "Student directory CSV exported successfully.", time: "5 hours ago", read: true, category: "system", icon: FileText },
  { id: "n7", title: "Exam Schedule Updated", description: "Mid-term exam schedule published.", time: "1 day ago", read: true, category: "school", icon: CalendarClock },
  { id: "n8", title: "Workflow Completed", description: "Parent notification batch sent.", time: "1 day ago", read: true, category: "system", icon: CheckCircle2 },
];

const QUICK_ACTIONS: QuickAction[] = [
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

const CONTEXT_PROMPTS: Record<string, string[]> = {
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

function getDefaultPrompt(path: string): string[] {
  for (const [route, prompts] of Object.entries(CONTEXT_PROMPTS)) {
    if (route === "/app" ? path === "/app" : path.startsWith(route)) return prompts;
  }
  return CONTEXT_PROMPTS["/app"];
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, theme, toggleTheme, parentMode, setParentMode } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Right sidebar state
  const [rightOpen, setRightOpen] = useState(false);
  const [rightTab, setRightTab] = useState<RightTab>(() => {
    try { return (localStorage.getItem("scholarii-right-tab") as RightTab) || "chat"; } catch { return "chat"; }
  });
  const [rightWidth, setRightWidth] = useState<number>(() => {
    try { return parseInt(localStorage.getItem("scholarii-right-width") || "400", 10); } catch { return 400; }
  });
  const [isResizing, setIsResizing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatThinking, setChatThinking] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);
  const resizeRef = useRef<HTMLDivElement | null>(null);

  const RIGHT_MIN = 320;
  const RIGHT_MAX = 800;

  // Persist tab & width
  useEffect(() => {
    try { localStorage.setItem("scholarii-right-tab", rightTab); } catch { /* ok */ }
  }, [rightTab]);

  useEffect(() => {
    try { localStorage.setItem("scholarii-right-width", String(rightWidth)); } catch { /* ok */ }
  }, [rightWidth]);

  // Resize drag handlers
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      const clamped = Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, newWidth));
      setRightWidth(clamped);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatMessages, chatThinking]);

  if (!user) return null;
  const isStudent = user.role === "student";
  const showParent = isStudent && parentMode;
  const items = showParent ? PARENT_NAV : NAV[user.role];
  const portalLabel = showParent ? "Parent" : ROLE_LABEL[user.role];
  const initials = user.name.split(" ").map((s) => s[0]).slice(0, 2).join("");
  const unreadCount = notifications.filter((n) => !n.read).length;
  const contextPrompts = getDefaultPrompt(path);

  const pathExistsInNav = useCallback((targetPath: string, forParentMode: boolean) => {
    const navItems = forParentMode ? PARENT_NAV : STUDENT_NAV;
    return navItems.some((item) => {
      if ("items" in item) {
        return item.items.some((child) =>
          child.to === "/app" ? targetPath === "/app" : targetPath.startsWith(child.to)
        );
      }
      return item.to === "/app" ? targetPath === "/app" : targetPath.startsWith(item.to);
    });
  }, []);

  const prevParentModeRef = useRef(parentMode);

  useEffect(() => {
    if (prevParentModeRef.current !== parentMode) {
      prevParentModeRef.current = parentMode;
      if (!pathExistsInNav(path, parentMode)) {
        nav({ to: "/app" });
      }
    }
  }, [parentMode, path, nav, pathExistsInNav]);

  // Auto-expand groups containing active routes
  useEffect(() => {
    items.forEach((item) => {
      if ("items" in item) {
        const hasActiveChild = item.items.some((child) =>
          child.to === "/app" ? path === "/app" : path.startsWith(child.to)
        );
        if (hasActiveChild) {
          setExpandedGroups((prev) => ({ ...prev, [item.label]: true }));
        }
      }
    });
  }, [path, items]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleChatSend = () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatThinking) return;
    const userMsg: ChatMessage = { id: `rc-${Date.now()}`, role: "user", content: trimmed, timestamp: new Date() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatThinking(true);
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `rc-${Date.now() + 1}`,
        role: "assistant",
        content: `Based on your school data, here's what I found regarding "${trimmed}". The current metrics show stable performance with some areas requiring attention. Would you like me to generate a detailed report?`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, reply]);
      setChatThinking(false);
    }, 2000);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className={cn(
        "flex items-center gap-2 border-b border-sidebar-border transition-all duration-300",
        sidebarOpen ? "h-16 px-5" : "h-16 px-3 justify-center"
      )}>
        <img src={scholariiIconUrl} alt="Scholarii icon" className="size-8 flex-shrink-0" />
        {sidebarOpen && (
          <div className="animate-in fade-in">
            <div className="font-semibold text-sidebar-foreground leading-none">Scholarii</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 transition-all">{portalLabel} Portal</div>
          </div>
        )}
      </div>
      <nav key={showParent ? "parent" : "self"} className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 animate-in-up">
        {items.map((it) => {
          if ("items" in it) {
            const group = it;
            const isExpanded = expandedGroups[group.label] ?? false;
            const hasActiveChild = group.items.some((child) =>
              child.to === "/app" ? path === "/app" : path.startsWith(child.to)
            );
            const GroupIcon = group.icon;

            return (
              <div key={group.label}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={cn(
                    "group relative w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                    hasActiveChild
                      ? "text-sidebar-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    !sidebarOpen && "justify-center"
                  )}
                  title={!sidebarOpen ? group.label : ""}
                >
                  <GroupIcon className="size-4 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="font-medium flex-1 text-left">{group.label}</span>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-200",
                          isExpanded ? "rotate-180" : ""
                        )}
                      />
                    </>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      {group.label}
                    </div>
                  )}
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className={cn("pl-4 space-y-0.5", !sidebarOpen && "pl-0")}>
                    {group.items.map((child) => {
                      const active = child.to === "/app" ? path === "/app" : path.startsWith(child.to);
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                            active
                              ? "bg-brand-gradient text-white shadow-glow"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            !sidebarOpen && "justify-center"
                          )}
                          title={!sidebarOpen ? child.label : ""}
                        >
                          <ChildIcon className="size-4 flex-shrink-0" />
                          {sidebarOpen && (
                            <span className="font-medium">{child.label}</span>
                          )}
                          {!sidebarOpen && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                              {child.label}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          const it_ = it as NavItem;
          const active = it_.to === "/app" ? path === "/app" : path.startsWith(it_.to);
          const Icon = it_.icon;
          return (
            <Link
              key={it_.to}
              to={it_.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                active
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !sidebarOpen && "justify-center"
              )}
              title={!sidebarOpen ? it_.label : ""}
            >
              <Icon className="size-4 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-medium">{it_.label}</span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  {it_.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => { logout(); nav({ to: "/login" }); }}
          className={cn(
            "group relative w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors duration-200",
            !sidebarOpen && "justify-center"
          )}
          title={!sidebarOpen ? "Log out" : ""}
        >
          <LogOut className="size-4 flex-shrink-0" />
          {sidebarOpen && "Log out"}
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
      <aside className={cn(
        "hidden lg:flex flex-col shrink-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        {SidebarInner}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border animate-in-up overflow-hidden">
            {SidebarInner}
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

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex transition-all duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="size-5" />
            ) : (
              <ChevronRight className="size-5" />
            )}
          </Button>
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search students, teachers, classes..." className="pl-9 bg-muted/40 border-0" />
            </div>
          </div>
          <div className="flex-1 sm:hidden" />

          {isStudent && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-border bg-muted/40 transition-all">
              <div className={cn("flex items-center gap-1.5 text-xs font-medium transition-colors", !parentMode ? "text-foreground" : "text-muted-foreground")}>
                <StudentIcon className="size-3.5" />
                <span className="hidden md:inline">Student</span>
              </div>
              <Switch
                checked={parentMode}
                onCheckedChange={setParentMode}
                aria-label="Toggle parent mode"
              />
              <div className={cn("flex items-center gap-1.5 text-xs font-medium transition-colors", parentMode ? "text-foreground" : "text-muted-foreground")}>
                <ParentIcon className="size-3.5" />
                <span className="hidden md:inline">Parent</span>
              </div>
            </div>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setRightOpen(!rightOpen)}
            title={rightOpen ? "Close utilities" : "Open utilities"}
          >
            <PanelRightOpen className={cn("size-5 transition-colors", rightOpen && "text-emerald-600")} />
            {unreadCount > 0 && !rightOpen && (
              <Badge className="absolute -top-1 -right-1 size-4 p-0 grid place-items-center text-[10px] bg-brand-gradient border-0">{unreadCount}</Badge>
            )}
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
                    {parentMode ? <StudentIcon className="size-4 mr-2" /> : <ParentIcon className="size-4 mr-2" />}
                    Switch to {parentMode ? "Student" : "Parent"} Mode
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => nav({ to: "/app/profile" })}><UserCircle className="size-4 mr-2" />Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings className="size-4 mr-2" />Settings</DropdownMenuItem>
              <DropdownMenuItem><ShieldCheck className="size-4 mr-2" />Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { logout(); nav({ to: "/login" }); }}>
                <LogOut className="size-4 mr-2" />Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main key={showParent ? "p" : "s"} className="flex-1 overflow-y-auto p-4 lg:p-8 animate-in-up transition-all duration-300">{children}</main>
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
              <div className="font-semibold text-sidebar-foreground leading-none text-sm">Utilities</div>
              <div className="text-[11px] text-sidebar-foreground/50 mt-0.5">AI & Actions</div>
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
                  {Array.from(new Set(QUICK_ACTIONS.map((a) => a.group))).map((group) => (
                    <div key={group}>
                      <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/30 font-medium mb-2 px-1">{group}</div>
                      <div className="space-y-1">
                        {QUICK_ACTIONS.filter((a) => a.group === group).map((action) => {
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
            </div>
          </div>
      </aside>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
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

export function StatCard({ icon: Icon, label, value, hint, tone = "default" }: {
  icon: typeof Home; label: string; value: string; hint?: string;
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
        <div className={cn("size-11 rounded-xl grid place-items-center text-white bg-gradient-to-br", tones[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
