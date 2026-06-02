import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Zap } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

import { loadData } from "@/lib/scholarii/mock";
import { 
  calculateStudentAttendanceKPI,
  calculateTeacherAttendanceKPI,
  calculateFeeCollectionKPI,
  calculateAcademicPerformanceKPI,
  calculateParentEngagementKPI,
  calculateTeacherWorkloadKPI,
  calculateSchoolPulse,
  generateOperationalSummary,
  generateLiveActivityEvent,
} from "@/lib/scholarii/kpi-calculations";

// NEW: Intelligence engine
import {
  generateAttendanceAlerts,
  generateFeeAlerts,
  generateAcademicAlerts,
  generateEngagementAlerts,
  generateWorkloadAlerts,
  generateRecommendations,
  calculateRiskMetrics,
} from "@/lib/scholarii/intelligence-engine";

import { KPICarousel } from "@/components/scholarii/KPICarousel";
import { SchoolPulse } from "@/components/scholarii/SchoolPulse";
import { LiveActivityFeed } from "@/components/scholarii/LiveActivityFeed";
import { AIInsightsPanel } from "@/components/scholarii/AIInsightsPanel"; // NEW

// Import all modal components
import { AttendanceDetailModal } from "@/components/scholarii/modals/AttendanceDetailModal";
import { TeacherAttendanceModal } from "@/components/scholarii/modals/TeacherAttendanceModal";
import { FeeCollectionDetailModal } from "@/components/scholarii/modals/FeeCollectionDetailModal";
import { AcademicPerformanceModal } from "@/components/scholarii/modals/AcademicPerformanceModal";
import { ParentEngagementModal } from "@/components/scholarii/modals/ParentEngagementModal";
import { TeacherWorkloadModal } from "@/components/scholarii/modals/TeacherWorkloadModal";

import type { KPICard, ActivityEvent, Alert, Recommendation } from "@/lib/scholarii/types";
import { monthlyAttendance, feeCollection } from "@/lib/scholarii/mock";

export function PrincipalDashboard() {
  const data = useMemo(() => loadData(), []);

  const statusLabel = (status: "healthy" | "moderate" | "attention") =>
    status === "healthy" ? "Healthy" : status === "moderate" ? "Moderate" : "Attention Needed";

  const impactRanges = ["Today", "This week", "This month", "This year"] as const;
  type ImpactRange = (typeof impactRanges)[number];
  const [impactRange, setImpactRange] = useState<ImpactRange>("This month");
  
  // Calculate all KPIs
  const attendanceKPI = useMemo(() => calculateStudentAttendanceKPI(data.students), [data.students]);
  const teacherAttendanceKPI = useMemo(() => calculateTeacherAttendanceKPI(data.teachers), [data.teachers]);
  const feeCollectionKPI = useMemo(() => calculateFeeCollectionKPI(data.students, data.feeTarget), [data.students, data.feeTarget]);
  const academicPerformanceKPI = useMemo(() => calculateAcademicPerformanceKPI(data.students), [data.students]);
  const parentEngagementKPI = useMemo(() => calculateParentEngagementKPI(data.students), [data.students]);
  const teacherWorkloadKPI = useMemo(() => calculateTeacherWorkloadKPI(data.teachers), [data.teachers]);
  const classPerformanceByGrade = useMemo(() => {
    const gradeMap = new Map<number, { total: number; count: number }>();

    data.students.forEach((student) => {
      if (!student.testScores) return;

      const scores = Object.values(student.testScores);
      if (scores.length === 0) return;

      const studentAverage = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const current = gradeMap.get(student.grade) || { total: 0, count: 0 };
      gradeMap.set(student.grade, {
        total: current.total + studentAverage,
        count: current.count + 1,
      });
    });

    return Array.from({ length: 10 }, (_, index) => {
      const grade = index + 1;
      const bucket = gradeMap.get(grade);

      return {
        c: String(grade),
        v: bucket && bucket.count > 0 ? Math.round(bucket.total / bucket.count) : 0,
        students: bucket?.count || 0,
      };
    });
  }, [data.students]);

  const kpis: KPICard[] = [
    attendanceKPI,
    teacherAttendanceKPI,
    feeCollectionKPI,
    academicPerformanceKPI,
    parentEngagementKPI,
    teacherWorkloadKPI,
  ];

  // School Pulse & Summary
  const schoolPulseSectors = useMemo(() => calculateSchoolPulse(data.students, data.teachers, data.feeTarget), [data.students, data.teachers, data.feeTarget]);
  const operationalSummary = useMemo(() => generateOperationalSummary(data.students, data.teachers, data.feeTarget), [data.students, data.teachers, data.feeTarget]);

  const schoolPulseDetails = useMemo(() => {
    const attendanceTarget = 90;
    const feeTargetPercent = 85;
    const engagementTarget = 75;
    const academicTarget = 80;
    const overloadedTeachers = data.teachers.filter((t) => t.isOverloaded).length;
    const avgClassesPerDay = Math.round(
      data.teachers.reduce((sum, t) => sum + (t.classesPerDay || 0), 0) / data.teachers.length
    );

    return {
      Attendance: {
        metric: "Student attendance rate across all grades",
        currentValue: `${attendanceKPI.percentage}% present today`,
        target: `${attendanceTarget}% school target`,
        reason:
          attendanceKPI.percentage >= attendanceTarget
            ? "Attendance has remained above target for the last month."
            : attendanceKPI.percentage >= 80
            ? "Attendance is close to target but dips in a few grades."
            : "Attendance is below target in multiple grades.",
        status: statusLabel(attendanceKPI.status),
        calculation: "Healthy >= 90%, Moderate 80-89%, Attention < 80%.",
        recommendation:
          attendanceKPI.percentage >= attendanceTarget
            ? "Continue monitoring Grade 9 attendance."
            : "Focus on grades below 80% attendance.",
      },
      "Fee Collection": {
        metric: "Fees collected vs monthly target",
        currentValue: `${feeCollectionKPI.percentage}% of target collected`,
        target: `${feeTargetPercent}% monthly target`,
        reason:
          feeCollectionKPI.percentage >= feeTargetPercent
            ? "Collections are on track for the month."
            : feeCollectionKPI.percentage >= 70
            ? "Collections are slightly behind target."
            : "Collections are behind target with overdue accounts.",
        status: statusLabel(feeCollectionKPI.status),
        calculation: "Healthy >= 85%, Moderate 70-84%, Attention < 70%.",
        recommendation:
          feeCollectionKPI.percentage >= feeTargetPercent
            ? "Maintain reminder cadence."
            : "Prioritize outreach to overdue families.",
      },
      "Teacher Workload": {
        metric: "Teacher workload balance and overload risk",
        currentValue: `${overloadedTeachers} overloaded, ${avgClassesPerDay} avg classes/day`,
        target: "0 overloaded teachers",
        reason:
          overloadedTeachers === 0
            ? "Workload is balanced across staff."
            : overloadedTeachers <= 2
            ? "A few staff members are nearing overload."
            : "Multiple teachers are overloaded.",
        status: statusLabel(teacherWorkloadKPI.status),
        calculation: "Healthy = 0 overloaded, Moderate = 1-2, Attention >= 3.",
        recommendation:
          overloadedTeachers === 0
            ? "Keep current distribution."
            : "Rebalance class assignments this week.",
      },
      "Parent Engagement": {
        metric: "Average parent engagement score",
        currentValue: `${parentEngagementKPI.percentage}% engagement score`,
        target: `${engagementTarget}% engagement target`,
        reason:
          parentEngagementKPI.percentage >= engagementTarget
            ? "Engagement remains strong across most grades."
            : parentEngagementKPI.percentage >= 60
            ? "Engagement is stable but trending lower in some classes."
            : "Engagement is below target in several classes.",
        status: statusLabel(parentEngagementKPI.status),
        calculation: "Healthy >= 75%, Moderate 60-74%, Attention < 60%.",
        recommendation:
          parentEngagementKPI.percentage >= engagementTarget
            ? "Continue weekly communication cadence."
            : "Launch outreach for low-engagement families.",
      },
      "Academic Performance": {
        metric: "School-wide academic performance average",
        currentValue: `${academicPerformanceKPI.percentage}% average score`,
        target: `${academicTarget}% academic target`,
        reason:
          academicPerformanceKPI.percentage >= academicTarget
            ? "Scores are above target across core subjects."
            : academicPerformanceKPI.percentage >= 70
            ? "Performance is stable but uneven across grades."
            : "Performance is below target in multiple subjects.",
        status: statusLabel(academicPerformanceKPI.status),
        calculation: "Healthy >= 80%, Moderate 70-79%, Attention < 70%.",
        recommendation:
          academicPerformanceKPI.percentage >= academicTarget
            ? "Share best practices across departments."
            : "Schedule focused support for weak subjects.",
      },
      Compliance: {
        metric: "Policy, reporting, and safety compliance",
        currentValue: "97% compliance score",
        target: "95% compliance target",
        reason: "All required submissions are on time with no overdue filings.",
        status: "Healthy",
        calculation: "Healthy >= 95%, Moderate 90-94%, Attention < 90%.",
        recommendation: "Maintain monthly audit checks.",
      },
    };
  }, [
    data.students,
    data.teachers,
    attendanceKPI,
    feeCollectionKPI,
    parentEngagementKPI,
    teacherWorkloadKPI,
    academicPerformanceKPI,
  ]);

  const impactDataByRange: Record<ImpactRange, {
    adoptionScore: { score: string; label: string };
    adoptionBreakdown: Array<{ label: string; value: string }>;
    impactKpis: Array<{ label: string; value: string }>;
    valueHighlights: Array<{ value: string; label: string }>;
    summary: string;
  }> = {
    Today: {
      adoptionScore: { score: "82%", label: "Strong Adoption" },
      adoptionBreakdown: [
        { label: "Teacher Usage", value: "88" },
        { label: "Student Usage", value: "80" },
        { label: "Parent Usage", value: "66" },
        { label: "Automation Usage", value: "79" },
      ],
      impactKpis: [
        { label: "Teacher AI Queries", value: "96" },
        { label: "Student AI Queries", value: "240" },
        { label: "Administrative Hours Saved", value: "3.4 Hours" },
        { label: "Documents in School Brain", value: "4" },
        { label: "AI Tasks Completed", value: "110" },
        { label: "Staff Adoption Rate", value: "89%" },
        { label: "Parent Adoption Rate", value: "64%" },
        { label: "Student Adoption Rate", value: "78%" },
        { label: "Automations Executed", value: "38" },
      ],
      valueHighlights: [
        { value: "3.4 Hours Saved", label: "Administrative hours saved" },
        { value: "260 Manual Entries Avoided", label: "Operational entries removed" },
        { value: "+1% Fee Collection Improvement", label: "Collection uplift" },
        { value: "38% Faster Attendance Processing", label: "Attendance workflow" },
        { value: "1.3x Faster Parent Communication", label: "Communication cycle" },
      ],
      summary:
        "Scholarii usage is steady today. Teachers saved 3.4 administrative hours through automation, and staff adoption is at 89%.",
    },
    "This week": {
      adoptionScore: { score: "84%", label: "Strong Adoption" },
      adoptionBreakdown: [
        { label: "Teacher Usage", value: "90" },
        { label: "Student Usage", value: "84" },
        { label: "Parent Usage", value: "72" },
        { label: "Automation Usage", value: "82" },
      ],
      impactKpis: [
        { label: "Teacher AI Queries", value: "640" },
        { label: "Student AI Queries", value: "1,840" },
        { label: "Administrative Hours Saved", value: "22 Hours" },
        { label: "Documents in School Brain", value: "22" },
        { label: "AI Tasks Completed", value: "720" },
        { label: "Staff Adoption Rate", value: "91%" },
        { label: "Parent Adoption Rate", value: "72%" },
        { label: "Student Adoption Rate", value: "84%" },
        { label: "Automations Executed", value: "210" },
      ],
      valueHighlights: [
        { value: "22 Hours Saved", label: "Administrative hours saved" },
        { value: "1,800 Manual Entries Avoided", label: "Operational entries removed" },
        { value: "+4% Fee Collection Improvement", label: "Collection uplift" },
        { value: "56% Faster Attendance Processing", label: "Attendance workflow" },
        { value: "2.2x Faster Parent Communication", label: "Communication cycle" },
      ],
      summary:
        "Scholarii usage is up week over week. Teachers saved 22 administrative hours, and staff adoption is holding at 91%.",
    },
    "This month": {
      adoptionScore: { score: "86%", label: "Excellent Adoption" },
      adoptionBreakdown: [
        { label: "Teacher Usage", value: "92" },
        { label: "Student Usage", value: "88" },
        { label: "Parent Usage", value: "81" },
        { label: "Automation Usage", value: "85" },
      ],
      impactKpis: [
        { label: "Teacher AI Queries", value: "2,840" },
        { label: "Student AI Queries", value: "7,920" },
        { label: "Administrative Hours Saved", value: "96 Hours" },
        { label: "Documents in School Brain", value: "380" },
        { label: "AI Tasks Completed", value: "3,120" },
        { label: "Staff Adoption Rate", value: "93%" },
        { label: "Parent Adoption Rate", value: "81%" },
        { label: "Student Adoption Rate", value: "88%" },
        { label: "Automations Executed", value: "920" },
      ],
      valueHighlights: [
        { value: "96 Hours Saved", label: "Administrative hours saved" },
        { value: "7,800 Manual Entries Avoided", label: "Operational entries removed" },
        { value: "+9% Fee Collection Improvement", label: "Collection uplift" },
        { value: "70% Faster Attendance Processing", label: "Attendance workflow" },
        { value: "3.4x Faster Parent Communication", label: "Communication cycle" },
      ],
      summary:
        "Scholarii usage continues to grow across the school. Teachers have saved 96 administrative hours through automation and AI assistance. Staff adoption remains high at 93%.",
    },
    "This year": {
      adoptionScore: { score: "90%", label: "Outstanding Adoption" },
      adoptionBreakdown: [
        { label: "Teacher Usage", value: "94" },
        { label: "Student Usage", value: "90" },
        { label: "Parent Usage", value: "86" },
        { label: "Automation Usage", value: "89" },
      ],
      impactKpis: [
        { label: "Teacher AI Queries", value: "28,600" },
        { label: "Student AI Queries", value: "78,400" },
        { label: "Administrative Hours Saved", value: "1,140 Hours" },
        { label: "Documents in School Brain", value: "4,820" },
        { label: "AI Tasks Completed", value: "28,900" },
        { label: "Staff Adoption Rate", value: "94%" },
        { label: "Parent Adoption Rate", value: "86%" },
        { label: "Student Adoption Rate", value: "90%" },
        { label: "Automations Executed", value: "8,200" },
      ],
      valueHighlights: [
        { value: "1,140 Hours Saved", label: "Administrative hours saved" },
        { value: "92,000 Manual Entries Avoided", label: "Operational entries removed" },
        { value: "+14% Fee Collection Improvement", label: "Collection uplift" },
        { value: "78% Faster Attendance Processing", label: "Attendance workflow" },
        { value: "4.4x Faster Parent Communication", label: "Communication cycle" },
      ],
      summary:
        "Year to date, Scholarii has saved 1,140 administrative hours through automation and AI assistance. Staff adoption remains high at 94%.",
    },
  };

  const impactData = impactDataByRange[impactRange];

  // NEW: Intelligence Layer Calculations
  const alerts = useMemo(() => {
    const all: Alert[] = [];
    all.push(...generateAttendanceAlerts(data.students));
    all.push(...generateFeeAlerts(data.students, data.feeTarget));
    all.push(...generateAcademicAlerts(data.students));
    all.push(...generateEngagementAlerts(data.students));
    all.push(...generateWorkloadAlerts(data.teachers));

    // Sort: critical > warning > info
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return all
      .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
      .slice(0, 8); // Limit to 8 total
  }, [data.students, data.teachers, data.feeTarget]);

  const recommendations = useMemo(() => {
    return generateRecommendations(
      data.students,
      data.teachers,
      data.feeTarget,
      alerts
    ).slice(0, 3); // Top 3
  }, [data.students, data.teachers, data.feeTarget, alerts]);

  const riskMetrics = useMemo(() => {
    return calculateRiskMetrics(data.students, data.teachers);
  }, [data.students, data.teachers]);

  // Live summary numbers for quick glance
  const presentCount = useMemo(() => data.students.filter((s) => s.attendance >= 75).length, [data.students]);
  const absentCount = useMemo(() => data.students.filter((s) => s.attendance < 75).length, [data.students]);
  const chronicCount = useMemo(() => data.students.filter((s) => s.isChronicAbsentee).length, [data.students]);

  // Activity feed state with real-time simulation
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(data.activityEvents);

  // Simulate real-time activity events
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateLiveActivityEvent();
      setActivityEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Modal state management
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  const handleKPIClick = (kpiId: string) => {
    setSelectedKPI(kpiId);
  };

  // NEW: Alert and recommendation handlers
  const handleAlertClick = (alert: Alert) => {
    // Map alert context to KPI modal
    if (alert.context.type === "attendance") {
      setSelectedKPI("attendance-kpi");
    } else if (alert.context.type === "fees") {
      setSelectedKPI("fee-collection-kpi");
    } else if (alert.context.type === "academics") {
      setSelectedKPI("academic-performance-kpi");
    } else if (alert.context.type === "engagement") {
      setSelectedKPI("parent-engagement-kpi");
    } else if (alert.context.type === "workload") {
      setSelectedKPI("teacher-workload-kpi");
    }
  };

  const handleRecommendationClick = (recommendation: Recommendation) => {
    // Map recommendation target to KPI modal
    if (recommendation.actionTarget) {
      setSelectedKPI(recommendation.actionTarget);
    }
  };

  const modalProps = {
    students: data.students,
    teachers: data.teachers,
    feeTarget: data.feeTarget,
  };

  return (
    <div>
      <PageHeader
        title="Welcome back, Dr. Asha"
        subtitle="Real-time school operations command center"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="size-4 mr-1" />
              Report
            </Button>
            <Button size="sm" className="bg-brand-gradient text-white border-0">
              <Plus className="size-4 mr-1" />
              Quick Action
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* KPI Carousel Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Key Performance Indicators</h2>
              <Badge variant="secondary">Click to drill down</Badge>
            </div>
            <KPICarousel kpis={kpis} onKPIClick={handleKPIClick} />
          </div>

          {/* School Pulse Section */}
          <div>
            <SchoolPulse
              sectors={schoolPulseSectors}
              summary={operationalSummary}
              details={schoolPulseDetails}
            />
          </div>

          {/* Scholarii Impact & Adoption */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Scholarii Impact &amp; Adoption</h2>
              <div className="flex items-center gap-2">
                {impactRanges.map((range) => (
                  <Button
                    key={range}
                    size="sm"
                    variant={impactRange === range ? "secondary" : "outline"}
                    onClick={() => setImpactRange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="p-5 border-2 border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                      Scholarii Adoption Score
                    </p>
                    <div className="text-3xl font-bold text-foreground">{impactData.adoptionScore.score}</div>
                    <p className="text-sm text-muted-foreground">{impactData.adoptionScore.label}</p>
                  </div>
                  <div className="space-y-2">
                    {impactData.adoptionBreakdown.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-semibold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {impactData.impactKpis.map((item) => (
                  <Card key={item.label} className="p-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-lg font-semibold text-foreground">{item.value}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Value Generated</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {impactData.valueHighlights.map((item) => (
                  <Card
                    key={item.value}
                    className="p-4 border-2 border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-4 border border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">{impactData.summary}</p>
            </Card>
          </div>

          {/* Main Content Grid: Activity Feed + Analytics + AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column: Live Activity Feed + Quick Summary */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold text-sm mb-2">Live Summary</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Present</div>
                      <div className="text-lg font-bold text-emerald-600">{presentCount}</div>
                      <div className="text-xs text-muted-foreground">{Math.round((presentCount / data.students.length) * 100)}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Absent</div>
                      <div className="text-lg font-bold text-red-600">{absentCount}</div>
                      <div className="text-xs text-muted-foreground">{Math.round((absentCount / data.students.length) * 100)}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Chronic</div>
                      <div className="text-lg font-bold text-amber-600">{chronicCount}</div>
                      <div className="text-xs text-muted-foreground">{Math.round((chronicCount / data.students.length) * 100)}%</div>
                    </div>
                  </div>
                </Card>

                <LiveActivityFeed events={activityEvents} />
              </div>
            </div>

            {/* Middle Column: Analytics Charts */}
            <div className="lg:col-span-1 space-y-4">
              {/* Attendance Analytics Mini */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-sm">Student Attendance Trend</h3>
                    <p className="text-xs text-muted-foreground">Monthly average attendance across all students</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Last 8mo</Badge>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={monthlyAttendance}>
                    <defs>
                      <linearGradient id="attTrendMini" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--brand-from)" />
                        <stop offset="100%" stopColor="var(--brand-to)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis domain={[80, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip
                      contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
                      formatter={(value: number) => [`${value}% average`, "Attendance"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line type="monotone" dataKey="v" stroke="url(#attTrendMini)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Class Performance Mini */}
              <Card className="p-5">
                <div className="mb-4">
                  <h3 className="font-semibold text-sm">Class Performance by Grade</h3>
                  <p className="text-xs text-muted-foreground">Average test score across all subjects for each grade</p>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={classPerformanceByGrade}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="c" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis domain={[60, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip
                      contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
                      formatter={(value: number) => [`${value}% average`, "Class average"]}
                      labelFormatter={(label) => `Grade ${label}`}
                    />
                    <Bar dataKey="v" fill="var(--brand-to)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Fee Collection Mini */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Fee Trends</h3>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={feeCollection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Bar dataKey="v" fill="var(--brand-from)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

            </div>

            {/* Right Column: AI Insights */}
            <div className="lg:col-span-1">
              <Card className="p-5 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="size-5 text-amber-500" />
                  <h3 className="font-semibold">AI Insights</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  <AIInsightsPanel
                    alerts={alerts}
                    recommendations={recommendations}
                    riskMetrics={riskMetrics}
                    onAlertClick={handleAlertClick}
                    onActionClick={handleRecommendationClick}
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* System Status Footer */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold mb-4">System Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Students</div>
                  <div className="text-2xl font-bold mt-1">{data.students.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Teachers</div>
                  <div className="text-2xl font-bold mt-1">{data.teachers.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Admission Pipeline</div>
                  <div className="text-2xl font-bold mt-1">{data.admissionFunnel.admitted}</div>
                  <div className="text-xs text-muted-foreground">Admitted this term</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fee Target</div>
                  <div className="text-2xl font-bold mt-1">₹{(data.feeTarget / 100000).toFixed(1)}L</div>
                  <div className="text-xs text-muted-foreground">Monthly target</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

      {/* Modal Components */}
      <AttendanceDetailModal open={selectedKPI === "attendance-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <TeacherAttendanceModal open={selectedKPI === "teacher-attendance-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <FeeCollectionDetailModal open={selectedKPI === "fee-collection-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <AcademicPerformanceModal open={selectedKPI === "academic-performance-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <ParentEngagementModal open={selectedKPI === "parent-engagement-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <TeacherWorkloadModal open={selectedKPI === "teacher-workload-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
    </div>
  );
}
