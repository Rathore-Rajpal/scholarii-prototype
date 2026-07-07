import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/scholarii/auth";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardCheck,
  TrendingUp,
  Wallet,
  CalendarDays,
  Search,
  GraduationCap,
  ArrowRight,
  Users,
  AlertTriangle,
  Baby,
} from "lucide-react";
import { KpiCard } from "@/components/scholarii/KpiCard";
import { PlaceholderPage } from "@/components/scholarii/RoleGuard";

export const Route = createFileRoute("/app/children")({
  component: ChildrenPage,
});

interface Child {
  id: string;
  name: string;
  class: string;
  section: string;
  roll: string;
  attendance: number;
  academicScore: number;
  grade: string;
  feeStatus: "Paid" | "Pending";
  upcoming: string;
  termProgress: number;
  color: string;
}

const CHILDREN: Child[] = [
  {
    id: "child1",
    name: "Aarav Sharma",
    class: "8",
    section: "A",
    roll: "8A07",
    attendance: 94,
    academicScore: 84,
    grade: "A",
    feeStatus: "Paid",
    upcoming: "Math Test · Friday",
    termProgress: 94,
    color: "#667eea",
  },
  {
    id: "child2",
    name: "Diya Sharma",
    class: "5",
    section: "B",
    roll: "5B03",
    attendance: 88,
    academicScore: 81,
    grade: "A-",
    feeStatus: "Pending",
    upcoming: "Art Project · Monday",
    termProgress: 88,
    color: "#ec4899",
  },
];

function ChildrenPage() {
  const { user, parentMode } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const isParent = user?.role === "student" && parentMode;
  const isStudent = user?.role === "student";
  const isNonStudentRole = user?.role !== "student";

  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");

  useEffect(() => {
    if (isStudent && !parentMode && path !== "/app") {
      nav({ to: "/app" });
    }
  }, [isStudent, parentMode, path, nav]);

  if (isStudent && !parentMode) return null;

  if (isNonStudentRole) {
    return (
      <PlaceholderPage
        title="Child Overview"
        subtitle="View your children's academic progress, attendance, and school activities."
        icon={Baby}
      />
    );
  }

  const filteredChildren = useMemo(() => {
    return CHILDREN.filter((child) => {
      const matchesSearch =
        searchQuery === "" ||
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.class.includes(searchQuery) ||
        child.roll.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        schoolFilter === "all" ||
        (schoolFilter === "primary" && parseInt(child.class) <= 5) ||
        (schoolFilter === "middle" && parseInt(child.class) >= 6 && parseInt(child.class) <= 8) ||
        (schoolFilter === "high" && parseInt(child.class) >= 9);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, schoolFilter]);

  const totalChildren = CHILDREN.length;
  const avgAttendance = Math.round(
    CHILDREN.reduce((acc, c) => acc + c.attendance, 0) / totalChildren
  );
  const avgScore = Math.round(
    CHILDREN.reduce((acc, c) => acc + c.academicScore, 0) / totalChildren
  );
  const pendingFees = CHILDREN.filter((c) => c.feeStatus === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          My Children
        </h1>
        <p className="text-muted-foreground mt-1">
          View and monitor your enrolled children at a glance.
        </p>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 auto-rows-fr">
        <KpiCard
          icon={Users}
          label="Total Children"
          value={`${totalChildren} Children`}
          tone="default"
        />
        <KpiCard
          icon={ClipboardCheck}
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          tone="success"
        />
        <KpiCard
          icon={TrendingUp}
          label="Avg Academic Score"
          value={`${avgScore}%`}
          tone="info"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Pending Fee Actions"
          value={pendingFees > 0 ? `${pendingFees} Pending` : "None"}
          tone={pendingFees > 0 ? "warning" : "success"}
        />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, class, or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            <SelectItem value="primary">Primary School (1-5)</SelectItem>
            <SelectItem value="middle">Middle School (6-8)</SelectItem>
            <SelectItem value="high">High School (9-12)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Children Grid */}
      {filteredChildren.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">
              No children found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredChildren.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChildCard({ child }: { child: Child }) {
  const nav = useNavigate();

  const initials = child.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  const attendanceTone =
    child.attendance >= 90 ? "success" : child.attendance >= 80 ? "warning" : "destructive";

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Card Top Accent */}
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-80"
        style={{ background: child.color }}
      />

      <div className="p-5 pt-6">
        {/* Avatar + Name + Grade */}
        <div className="flex items-start gap-4">
          <Avatar className="size-14 border-2 border-background shadow-md shrink-0">
            <AvatarFallback
              className="font-bold text-lg"
              style={{ backgroundColor: child.color, color: "white" }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold tracking-tight truncate">
              {child.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Class {child.class}-{child.section} · Roll {child.roll}
            </p>
          </div>

          <Badge
            variant="outline"
            className="text-xs font-bold shrink-0"
            style={{
              backgroundColor: `${child.color}15`,
              color: child.color,
              borderColor: `${child.color}30`,
            }}
          >
            {child.grade}
          </Badge>
        </div>

        {/* Quick Metrics - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40">
            <div className="rounded-lg bg-emerald-500/10 p-1.5">
              <ClipboardCheck className="size-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Attendance
              </p>
              <p className="text-sm font-bold">{child.attendance}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40">
            <div className="rounded-lg bg-violet-500/10 p-1.5">
              <GraduationCap className="size-3.5 text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Academic
              </p>
              <p className="text-sm font-bold">{child.academicScore}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40">
            <div className="rounded-lg bg-blue-500/10 p-1.5">
              <Wallet className="size-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Fee Status
              </p>
              <p
                className={`text-sm font-bold ${
                  child.feeStatus === "Paid"
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                {child.feeStatus}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40">
            <div className="rounded-lg bg-amber-500/10 p-1.5">
              <CalendarDays className="size-3.5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Upcoming
              </p>
              <p className="text-sm font-bold truncate">{child.upcoming.split("·")[0].trim()}</p>
            </div>
          </div>
        </div>

        {/* Term Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground text-xs">Term Progress</span>
            <span className="font-bold text-sm">{child.termProgress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${child.termProgress}%`,
                background: `linear-gradient(90deg, ${child.color}, ${child.color}cc)`,
              }}
            />
          </div>
        </div>

        {/* Next Event + View Button */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Next:</span>
            <span className="font-medium">{child.upcoming}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-violet-600 hover:text-violet-700 hover:bg-violet-500/10"
            onClick={() =>
              nav({ to: `/app/children/progress/${child.id}` as never })
            }
          >
            View Child
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
