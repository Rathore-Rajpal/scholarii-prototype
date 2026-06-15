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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Sparkles,
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
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import scholariiIconUrl from "../../../Icons/apple-touch-icon.png?url";

type NavItem = { to: string; label: string; icon: typeof Home; activePaths?: string[] };
type AdminNavGroup = {
  label?: string;
  collapsible?: boolean;
  items: NavItem[];
};

const PARENT_NAV: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: Home },
  { to: "/app/children", label: "My Children", icon: Baby },
  { to: "/app/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/app/academics", label: "Academics", icon: BookOpen },
  { to: "/app/fees", label: "Fee Payments", icon: Wallet },
  { to: "/app/communication", label: "Communication", icon: MessageSquare },
  { to: "/app/events", label: "Events", icon: Calendar },
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
  admin: [],
};

const ROLE_LABEL: Record<Role, string> = {
  principal: "Principal",
  teacher: "Teacher",
  student: "Student",
  admin: "Admin",
};

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, theme, toggleTheme, parentMode, setParentMode } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(user?.role === "admin");
  const [adminGroupsOpen, setAdminGroupsOpen] = useState<Record<string, boolean>>({
    Insights: true,
    Administration: true,
  });

  if (!user) return null;
  const isStudent = user.role === "student";
  const showParent = isStudent && parentMode;
  const items = showParent ? PARENT_NAV : NAV[user.role];
  const portalLabel = showParent ? "Parent" : ROLE_LABEL[user.role];
  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

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
      </Link>
    );
  };

  const renderAdminNavItem = (it: NavItem, expanded: boolean) => {
    const active = isNavItemActive(it);
    const Icon = it.icon;
    return (
      <Link
        key={it.to}
        to={it.to}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "group relative mx-2 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
          active
            ? "bg-gradient-to-r from-violet-600 to-purple-600 font-medium text-white"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          !expanded && "mx-1 justify-center px-2",
        )}
        title={!expanded ? it.label : ""}
      >
        <Icon
          className={cn(
            "size-4 flex-shrink-0",
            active ? "text-white" : "text-gray-400 group-hover:text-gray-600",
          )}
        />
        {expanded && <span>{it.label}</span>}
        {!expanded && (
          <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            {it.label}
          </div>
        )}
      </Link>
    );
  };

  const renderAdminUtilityItem = (label: string, Icon: typeof Home, expanded: boolean) => (
    <button
      type="button"
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900",
        !expanded && "justify-center px-2",
      )}
      title={!expanded ? `${label} (coming soon)` : ""}
    >
      <Icon className="size-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
      {expanded && (
        <>
          <span>{label}</span>
          <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400">
            Soon
          </span>
        </>
      )}
    </button>
  );

  const getAdminSidebarInner = (expanded: boolean) => (
    <div className="flex h-full flex-col bg-white">
      <div
        className={cn(
          "flex items-center gap-2 border-b border-gray-100 p-4",
          !expanded && "justify-center px-2",
        )}
      >
        <img
          src={scholariiIconUrl}
          alt="Scholarii icon"
          className="size-8 flex-shrink-0 rounded-full"
        />
        {expanded && (
          <div>
            <div className="text-sm font-bold leading-none text-gray-900">Scholarii</div>
            <div className="mt-1 text-xs text-gray-400">Admin Portal</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {ADMIN_NAV_GROUPS.map((group) => {
          const open = !group.collapsible || adminGroupsOpen[group.label!];
          return (
            <div key={group.label ?? "primary"}>
              {group.label && expanded && (
                <button
                  type="button"
                  onClick={() => {
                    if (!group.collapsible) return;
                    setAdminGroupsOpen((current) => ({
                      ...current,
                      [group.label!]: !open,
                    }));
                  }}
                  className={cn(
                    "flex w-full items-center px-3 pt-4 pb-1 text-left text-xs font-semibold uppercase tracking-wider text-gray-400",
                    !group.collapsible && "cursor-default",
                  )}
                  aria-expanded={group.collapsible ? open : undefined}
                >
                  <span>{group.label}</span>
                  {group.collapsible && (
                    <ChevronDown
                      className={cn(
                        "ml-auto size-3.5 transition-transform duration-200",
                        !open && "-rotate-90",
                      )}
                    />
                  )}
                </button>
              )}
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  open || !expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-1">
                    {group.items.map((it) => renderAdminNavItem(it, expanded))}
                  </div>
                </div>
              </div>
            </div>
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
          {expanded && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  const getSidebarInner = (expanded: boolean) => (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center gap-2 border-b border-sidebar-border transition-all duration-300",
          expanded ? "h-16 px-4" : "h-16 justify-center px-3",
        )}
      >
        <img src={scholariiIconUrl} alt="Scholarii icon" className="size-8 flex-shrink-0" />
        {expanded && (
          <div className="animate-in fade-in">
            <div className="font-semibold text-sidebar-foreground leading-none">Scholarii</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 transition-all">
              {portalLabel} Portal
            </div>
          </div>
        )}
      </div>
      <nav
        key={showParent ? "parent" : "self"}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 animate-in-up"
      >
        {items.map((it) => renderNavItem(it, expanded))}
      </nav>
      <div className="space-y-1 border-t border-sidebar-border p-3">
        <button
          onClick={() => {
            logout();
            nav({ to: "/login" });
          }}
          className={cn(
            "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800",
            !expanded && "justify-center",
          )}
          title={!expanded ? "Log out" : ""}
        >
          <LogOut className="size-4 flex-shrink-0" />
          {expanded && "Log out"}
          {!expanded && (
            <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
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
            <Badge className="absolute -top-1 -right-1 size-4 p-0 grid place-items-center text-[10px] bg-brand-gradient border-0">
              3
            </Badge>
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
