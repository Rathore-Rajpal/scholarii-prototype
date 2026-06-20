import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Search, Sparkles, Wallet, Users, CreditCard, ArrowUpRight, ArrowDownRight,
  BarChart3, Receipt, Bus, BookOpen, FileText, Building2, Zap, Calendar,
  Wrench, Monitor, Palette, MoreHorizontal, Info, Trophy, Target,
} from "lucide-react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { cn } from "@/lib/utils";
import {
  FINANCE_KPI, FEE_DEFAULTERS, INCOME_SOURCES, EXPENSE_CATEGORIES,
  STAFF_SALARIES, MONTHLY_TRENDS, COLLECTION_TRENDS, DEFAULTER_CLASSES,
  FINANCE_AI_INSIGHTS, RECOMMENDED_ACTIONS,
  ALL_CLASSES, ALL_MONTHS, ALL_QUARTERS, ALL_DEPARTMENTS,
} from "@/lib/scholarii/principal-finance-mock-data";
import type {
  FeeDefaulter, IncomeSource, ExpenseCategory, StaffSalary,
} from "@/lib/scholarii/principal-finance-mock-data";

const PIE_COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#6366f1"];
const RISK_STYLES: Record<string, { bg: string; text: string }> = {
  high: { bg: "bg-red-500/10", text: "text-red-600" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-600" },
  low: { bg: "bg-sky-500/10", text: "text-sky-600" },
};
const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  paid: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  pending: { bg: "bg-amber-500/10", text: "text-amber-600" },
  processing: { bg: "bg-sky-500/10", text: "text-sky-600" },
};
const INSIGHT_STYLES: Record<string, { bg: string; border: string; iconColor: string }> = {
  warning: { bg: "bg-amber-500/5", border: "border-amber-200/50", iconColor: "text-amber-500" },
  success: { bg: "bg-emerald-500/5", border: "border-emerald-200/50", iconColor: "text-emerald-500" },
  danger: { bg: "bg-red-500/5", border: "border-red-200/50", iconColor: "text-red-500" },
  info: { bg: "bg-sky-500/5", border: "border-sky-200/50", iconColor: "text-sky-500" },
};
const INCOME_ICON_MAP: Record<string, typeof BookOpen> = {
  book: BookOpen, file: FileText, bus: Bus, building: Building2,
  palette: Palette, "file-text": FileText, wallet: Wallet,
};
const EXPENSE_ICON_MAP: Record<string, typeof Building2> = {
  building: Building2, zap: Zap, calendar: Calendar, wrench: Wrench,
  bus: Bus, monitor: Monitor, book: BookOpen, "more-horizontal": MoreHorizontal,
};

function fmt(n: number) { return `₹${(n / 1000).toFixed(0)}K`; }
function fmtFull(n: number) { return `₹${n.toLocaleString("en-IN")}`; }

export default function PrincipalFinancePage() {
  const [activeTab, setActiveTab] = useState("fee-mgmt");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedQuarter, setSelectedQuarter] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [sortBy, setSortBy] = useState<"amount" | "overdue" | "class">("amount");

  const filteredDefaulters = useMemo(() => {
    let list = [...FEE_DEFAULTERS];
    if (selectedClass !== "all") list = list.filter((d) => d.class === selectedClass);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d) => d.studentName.toLowerCase().includes(q) || d.parentName.toLowerCase().includes(q) || d.class.toLowerCase().includes(q));
    }
    if (sortBy === "amount") list.sort((a, b) => b.amountDue - a.amountDue);
    else if (sortBy === "overdue") list.sort((a, b) => b.daysOverdue - a.daysOverdue);
    else list.sort((a, b) => a.class.localeCompare(b.class));
    return list;
  }, [searchQuery, selectedClass, sortBy]);

  const filteredSalaries = useMemo(() => {
    let list = [...STAFF_SALARIES];
    if (selectedDepartment !== "all") list = list.filter((s) => s.department === selectedDepartment);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.role.toLowerCase().includes(q));
    }
    return list;
  }, [selectedDepartment, searchQuery]);

  const totalIncome = INCOME_SOURCES.reduce((s, i) => s + i.amount, 0);
  const totalBudget = EXPENSE_CATEGORIES.reduce((s, e) => s + e.budget, 0);
  const totalActual = EXPENSE_CATEGORIES.reduce((s, e) => s + e.actualSpend, 0);

  return (
    <div>
      <PageHeader
        title="Finance"
        subtitle="Financial Command Center — school-wide financial health at a glance."
        action={
          <div className="flex items-center gap-2">
            <Select defaultValue="2025-26">
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2025-26">2025-26</SelectItem>
                <SelectItem value="2026-27">2026-27</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all" onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Month" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {ALL_MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select defaultValue="all" onValueChange={setSelectedClass}>
              <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {ALL_CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-40 pl-8 text-xs"
              />
            </div>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
        <KpiCard icon={DollarSign} label="Total Revenue" value={fmtFull(FINANCE_KPI.totalRevenue)} tone="violet" />
        <KpiCard icon={TrendingDown} label="Total Expenses" value={fmtFull(FINANCE_KPI.totalExpenses)} tone="red" />
        <KpiCard icon={TrendingUp} label="Net Surplus" value={fmtFull(FINANCE_KPI.netSurplus)} tone="emerald" />
        <KpiCard icon={CheckCircle2} label="Fees Collected" value={fmtFull(FINANCE_KPI.totalFeesCollected)} tone="sky" />
        <KpiCard icon={AlertTriangle} label="Outstanding Dues" value={fmtFull(FINANCE_KPI.outstandingDues)} tone="amber" />
        <KpiCard icon={Users} label="Salary Expense" value={fmtFull(FINANCE_KPI.totalSalaryExpense)} tone="violet" />
        <KpiCard icon={Target} label="Collection Rate" value={`${FINANCE_KPI.collectionRate}%`} tone="emerald" />
        <KpiCard icon={CreditCard} label="At-Risk Fees" value={fmtFull(FINANCE_KPI.atRiskFeeAmount)} tone="red" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="p-3 mb-6">
          <TabsList className="h-9">
            <TabsTrigger value="fee-mgmt" className="text-xs gap-1.5"><CreditCard className="size-3" /> Fee Management</TabsTrigger>
            <TabsTrigger value="income" className="text-xs gap-1.5"><DollarSign className="size-3" /> Income Overview</TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs gap-1.5"><Receipt className="size-3" /> Expenses</TabsTrigger>
            <TabsTrigger value="salaries" className="text-xs gap-1.5"><Users className="size-3" /> Salaries & Payroll</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs gap-1.5"><BarChart3 className="size-3" /> Financial Analytics</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs gap-1.5"><Sparkles className="size-3" /> AI Insights</TabsTrigger>
          </TabsList>
        </Card>

        {/* ═══ FEE MANAGEMENT ═══ */}
        <TabsContent value="fee-mgmt">
          <div className="space-y-6">
            {/* Sub KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Total Fees Expected</div><div className="text-lg font-semibold">{fmtFull(3000000)}</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Total Fees Collected</div><div className="text-lg font-semibold text-emerald-600">{fmtFull(FINANCE_KPI.totalFeesCollected)}</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Outstanding Amount</div><div className="text-lg font-semibold text-red-600">{fmtFull(FINANCE_KPI.outstandingDues)}</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Collection %</div><div className="text-lg font-semibold text-emerald-600">{FINANCE_KPI.collectionRate}%</div></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Defaulter Table */}
              <Card className="lg:col-span-2 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Fee Defaulters</h3>
                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                      <SelectTrigger className="w-36 h-7 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amount">Highest Due</SelectItem>
                        <SelectItem value="overdue">Most Overdue</SelectItem>
                        <SelectItem value="class">By Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60">
                        <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Student</th>
                        <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Class</th>
                        <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Parent</th>
                        <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Due</th>
                        <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Days</th>
                        <th className="text-center p-2 text-[10px] font-medium text-muted-foreground">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDefaulters.map((d) => (
                        <tr key={d.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="size-6">
                                <AvatarFallback className="bg-violet-500 text-white text-[8px]">{d.studentName.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{d.studentName}</span>
                            </div>
                          </td>
                          <td className="p-2 text-muted-foreground">{d.class}</td>
                          <td className="p-2 text-muted-foreground">{d.parentName}</td>
                          <td className="p-2 text-right font-semibold text-red-600">{fmtFull(d.amountDue)}</td>
                          <td className="p-2 text-right text-muted-foreground">{d.daysOverdue}d</td>
                          <td className="p-2 text-center">
                            <Badge className={cn("border-0 text-[8px] capitalize", RISK_STYLES[d.riskLevel].bg, RISK_STYLES[d.riskLevel].text)}>
                              {d.riskLevel}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Side charts */}
              <div className="space-y-4">
                <Card className="p-5">
                  <h4 className="text-xs font-semibold mb-3">Top 5 Defaulter Classes</h4>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DEFAULTER_CLASSES} layout="vertical" margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 9 }} />
                        <YAxis type="category" dataKey="className" tick={{ fontSize: 9 }} width={30} />
                        <Tooltip formatter={(v: number) => fmtFull(v)} />
                        <Bar dataKey="amount" radius={[0, 3, 3, 0]} fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card className="p-5">
                  <h4 className="text-xs font-semibold mb-3">Collection Trend</h4>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={COLLECTION_TRENDS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip formatter={(v: number) => fmtFull(v)} />
                        <Bar dataKey="collected" fill="#10b981" radius={[3, 3, 0, 0]} name="Collected" />
                        <Bar dataKey="expected" fill="#e2e8f0" radius={[3, 3, 0, 0]} name="Expected" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══ INCOME OVERVIEW ═══ */}
        <TabsContent value="income">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Pie Chart */}
              <Card className="p-5">
                <h4 className="text-xs font-semibold mb-3">Income Distribution</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={INCOME_SOURCES} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                        {INCOME_SOURCES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmtFull(v)} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Monthly Trend */}
              <Card className="lg:col-span-2 p-5">
                <h4 className="text-xs font-semibold mb-3">Monthly Revenue Trend</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_TRENDS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip formatter={(v: number) => fmtFull(v)} />
                      <Bar dataKey="revenue" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Revenue" />
                      <Bar dataKey="expenses" fill="#06b6d4" radius={[3, 3, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Income Sources Table */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4">Income Sources</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Category</th>
                      <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Amount</th>
                      <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Contribution</th>
                      <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Monthly Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INCOME_SOURCES.map((src) => {
                      const Icon = INCOME_ICON_MAP[src.icon] || Wallet;
                      return (
                        <tr key={src.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <div className="size-7 rounded-lg bg-violet-500/10 grid place-items-center"><Icon className="size-3.5 text-violet-500" /></div>
                              <span className="font-medium">{src.category}</span>
                            </div>
                          </td>
                          <td className="p-2 text-right font-semibold">{fmtFull(src.amount)}</td>
                          <td className="p-2 text-right text-muted-foreground">{src.contribution}%</td>
                          <td className="p-2 text-right">
                            <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-medium", src.monthlyTrend >= 0 ? "text-emerald-600" : "text-red-600")}>
                              {src.monthlyTrend >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                              {Math.abs(src.monthlyTrend)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ═══ EXPENSES ═══ */}
        <TabsContent value="expenses">
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Total Budget</div><div className="text-lg font-semibold">{fmtFull(totalBudget)}</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Actual Spend</div><div className="text-lg font-semibold">{fmtFull(totalActual)}</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Variance</div><div className={cn("text-lg font-semibold", totalActual > totalBudget ? "text-red-600" : "text-emerald-600")}>{totalActual > totalBudget ? "+" : ""}{((totalActual - totalBudget) / totalBudget * 100).toFixed(1)}%</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Salary % of Expenses</div><div className="text-lg font-semibold">{((FINANCE_KPI.totalSalaryExpense / totalActual) * 100).toFixed(0)}%</div></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Expense Breakdown */}
              <Card className="p-5">
                <h4 className="text-xs font-semibold mb-3">Expense Breakdown</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={EXPENSE_CATEGORIES} dataKey="actualSpend" nameKey="category" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                        {EXPENSE_CATEGORIES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmtFull(v)} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Monthly Expense Trend */}
              <Card className="lg:col-span-2 p-5">
                <h4 className="text-xs font-semibold mb-3">Monthly Expense Trend</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MONTHLY_TRENDS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip formatter={(v: number) => fmtFull(v)} />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Expenses" />
                      <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Expense Categories Table */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4">Expense Categories</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Category</th>
                      <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Budget</th>
                      <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Actual</th>
                      <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXPENSE_CATEGORIES.map((exp) => {
                      const Icon = EXPENSE_ICON_MAP[exp.icon] || Wallet;
                      return (
                        <tr key={exp.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <div className="size-7 rounded-lg bg-violet-500/10 grid place-items-center"><Icon className="size-3.5 text-violet-500" /></div>
                              <span className="font-medium">{exp.category}</span>
                            </div>
                          </td>
                          <td className="p-2 text-right text-muted-foreground">{fmtFull(exp.budget)}</td>
                          <td className="p-2 text-right font-semibold">{fmtFull(exp.actualSpend)}</td>
                          <td className="p-2 text-right">
                            <span className={cn("text-[10px] font-medium", exp.variance > 0 ? "text-red-600" : "text-emerald-600")}>
                              {exp.variance > 0 ? "+" : ""}{exp.variance}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ═══ SALARIES & PAYROLL ═══ */}
        <TabsContent value="salaries">
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Total Salary</div><div className="text-lg font-semibold">{fmtFull(FINANCE_KPI.totalSalaryExpense)}</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Teaching Staff</div><div className="text-lg font-semibold">{fmtFull(STAFF_SALARIES.filter((s) => s.staffType === "teaching").reduce((a, s) => a + s.salary, 0))}</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Non-Teaching</div><div className="text-lg font-semibold">{fmtFull(STAFF_SALARIES.filter((s) => s.staffType === "non-teaching").reduce((a, s) => a + s.salary, 0))}</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Pending</div><div className="text-lg font-semibold text-amber-600">{fmtFull(STAFF_SALARIES.filter((s) => s.status === "pending").reduce((a, s) => a + s.salary, 0))}</div></Card>
              <Card className="p-4"><div className="text-[10px] text-muted-foreground mb-1">Processing</div><div className="text-lg font-semibold text-sky-600">{fmtFull(STAFF_SALARIES.filter((s) => s.status === "processing").reduce((a, s) => a + s.salary, 0))}</div></Card>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {ALL_DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4">Staff Payroll</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Staff</th>
                      <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Department</th>
                      <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Role</th>
                      <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Salary</th>
                      <th className="text-center p-2 text-[10px] font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalaries.map((s) => (
                      <tr key={s.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarFallback className="bg-violet-500 text-white text-[8px]">{s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{s.name}</span>
                          </div>
                        </td>
                        <td className="p-2 text-muted-foreground">{s.department}</td>
                        <td className="p-2 text-muted-foreground">{s.role}</td>
                        <td className="p-2 text-right font-semibold">{fmtFull(s.salary)}</td>
                        <td className="p-2 text-center">
                          <Badge className={cn("border-0 text-[8px] capitalize", STATUS_STYLES[s.status].bg, STATUS_STYLES[s.status].text)}>
                            {s.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ═══ FINANCIAL ANALYTICS ═══ */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue vs Expense */}
              <Card className="p-5">
                <h4 className="text-xs font-semibold mb-3">Revenue vs Expense Trend</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_TRENDS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip formatter={(v: number) => fmtFull(v)} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                      <Bar dataKey="revenue" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Revenue" />
                      <Bar dataKey="expenses" fill="#ef4444" radius={[3, 3, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Monthly Profitability */}
              <Card className="p-5">
                <h4 className="text-xs font-semibold mb-3">Monthly Profitability</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_TRENDS.map((m) => ({ ...m, profit: m.revenue - m.expenses }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip formatter={(v: number) => fmtFull(v)} />
                      <Bar dataKey="profit" radius={[3, 3, 0, 0]} name="Profit">
                        {MONTHLY_TRENDS.map((m, i) => <Cell key={i} fill={m.revenue - m.expenses >= 0 ? "#10b981" : "#ef4444"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Fee Collection Trend */}
            <Card className="p-5">
              <h4 className="text-xs font-semibold mb-3">Fee Collection Trend</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={COLLECTION_TRENDS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip formatter={(v: number) => fmtFull(v)} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                    <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Collected" />
                    <Line type="monotone" dataKey="expected" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" name="Expected" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Top Insights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-4">
                <div className="text-[10px] text-muted-foreground mb-1">Highest Earning</div>
                <div className="text-sm font-semibold">Tuition Fees</div>
                <div className="text-[10px] text-emerald-600">62% of total</div>
              </Card>
              <Card className="p-4">
                <div className="text-[10px] text-muted-foreground mb-1">Highest Expense</div>
                <div className="text-sm font-semibold">Infrastructure</div>
                <div className="text-[10px] text-red-600">+4% over budget</div>
              </Card>
              <Card className="p-4">
                <div className="text-[10px] text-muted-foreground mb-1">Best Month</div>
                <div className="text-sm font-semibold">May 2026</div>
                <div className="text-[10px] text-emerald-600">₹31L revenue</div>
              </Card>
              <Card className="p-4">
                <div className="text-[10px] text-muted-foreground mb-1">Worst Month</div>
                <div className="text-sm font-semibold">Mar 2026</div>
                <div className="text-[10px] text-red-600">₹27.5L revenue</div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ═══ AI INSIGHTS ═══ */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Sparkles className="size-3.5 text-violet-500" /> AI Financial Insights
              </h4>
              <div className="space-y-2">
                {FINANCE_AI_INSIGHTS.map((insight) => {
                  const styles = INSIGHT_STYLES[insight.type];
                  const iconMap: Record<string, typeof AlertTriangle> = { "alert-triangle": AlertTriangle, "trending-down": TrendingDown, "check-circle": CheckCircle2, info: Info, "trending-up": TrendingUp };
                  const Icon = iconMap[insight.icon] || Info;
                  return (
                    <div key={insight.id} className={cn("flex items-start gap-3 rounded-xl border p-3", styles.bg, styles.border)}>
                      <Icon className={cn("size-3.5 shrink-0 mt-0.5", styles.iconColor)} />
                      <span className="text-xs">{insight.text}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                {RECOMMENDED_ACTIONS.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5">
                    <div className={cn(
                      "size-6 rounded-lg grid place-items-center shrink-0",
                      action.priority === "high" ? "bg-red-500/10" : action.priority === "medium" ? "bg-amber-500/10" : "bg-sky-500/10"
                    )}>
                      <span className={cn(
                        "text-[10px] font-bold",
                        action.priority === "high" ? "text-red-600" : action.priority === "medium" ? "text-amber-600" : "text-sky-600"
                      )}>
                        {action.priority === "high" ? "!" : action.priority === "medium" ? "•" : "i"}
                      </span>
                    </div>
                    <p className="text-xs flex-1">{action.text}</p>
                    <Badge variant="outline" className="text-[9px] capitalize">{action.priority}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── KPI Card ─── */
function KpiCard({ icon: Icon, label, value, tone }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "violet" | "sky" | "emerald" | "amber" | "red";
}) {
  const tones = {
    violet: "bg-violet-500/10 text-violet-500",
    sky: "bg-sky-500/10 text-sky-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    red: "bg-red-500/10 text-red-500",
  };
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2.5">
        <div className={cn("size-8 rounded-lg grid place-items-center shrink-0", tones[tone])}>
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-muted-foreground truncate">{label}</div>
          <div className="text-sm font-semibold truncate">{value}</div>
        </div>
      </div>
    </Card>
  );
}
