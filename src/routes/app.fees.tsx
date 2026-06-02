import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Wallet,
  Send,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Zap,
  Download,
  FileText,
  Bell,
} from "lucide-react";
import { useAuth } from "@/lib/scholarii/auth";
import { loadData } from "@/lib/scholarii/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/app/fees")({ component: FeesPage });

function FeesPage() {
  const { user } = useAuth();
  if (user?.role === "student") return <StudentFeesView />;
  return <AdminFeesView />;
}

function StudentFeesView() {
  return (
    <div>
      <PageHeader title="Fees" subtitle="View and pay your school fees." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">This Year's Fee</h3>
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-sm text-muted-foreground">Paid so far</div>
              <div className="text-3xl font-bold mt-1">
                ₹85,000{" "}
                <span className="text-base text-muted-foreground font-normal">/ ₹1,20,000</span>
              </div>
            </div>
            <Badge className="bg-brand-gradient border-0">71% complete</Badge>
          </div>
          <Progress value={71} className="h-2 mt-3" />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[
              { l: "Tuition", v: "₹80,000" },
              { l: "Library", v: "₹5,000" },
              { l: "Sports", v: "₹10,000" },
              { l: "Lab", v: "₹25,000" },
            ].map((b) => (
              <div key={b.l} className="p-3 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground">{b.l}</div>
                <div className="font-semibold mt-1">{b.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-accent/40 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm text-muted-foreground">Next installment</div>
              <div className="font-semibold mt-0.5">₹35,000 due Jan 10, 2026</div>
            </div>
            <Button
              className="bg-brand-gradient text-white border-0"
              onClick={() => toast.success("Payment gateway opening (demo)")}
            >
              <CreditCard className="size-4 mr-1" />
              Pay Now
            </Button>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Payment History</h3>
          <div className="space-y-3 text-sm">
            {[
              { d: "Oct 5", a: "₹35,000", m: "UPI", r: "RCP-1023" },
              { d: "Jul 8", a: "₹30,000", m: "Card", r: "RCP-0941" },
              { d: "Apr 12", a: "₹20,000", m: "UPI", r: "RCP-0832" },
            ].map((p) => (
              <div
                key={p.r}
                className="flex justify-between items-center p-2 rounded-lg hover:bg-accent/40 transition-colors"
              >
                <div>
                  <div className="font-medium">{p.a}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.d} • {p.m}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {p.r}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminFeesView() {
  const data = useMemo(() => loadData(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("1");
  const [period, setPeriod] = useState<"month" | "year">("month");

  const defaulters = data.students.filter((s) => s.feeStatus !== "Paid").slice(0, 8);

  const kpiData = useMemo(() => {
    if (period === "month") {
      return {
        totalCollection: {
          value: "₹4.8L",
          change: "+8% vs last month",
          desc: "Total fees collected this month",
        },
        targetAchievement: {
          value: "82%",
          change: "On track",
          desc: "Progress towards monthly target",
        },
        outstandingDues: {
          value: "₹14.2L",
          change: "Pending",
          desc: "Total outstanding fees across school",
        },
        defaulters: { value: "84", change: "Students", desc: "Students with pending fees" },
        expectedCollection: {
          value: "₹5.4L",
          change: "End of month forecast",
          desc: "Estimated collection by month-end",
        },
        healthScore: { value: "87/100", change: "Healthy", desc: "Overall financial health score" },
      };
    } else {
      return {
        totalCollection: {
          value: "₹68.4L",
          change: "+12% vs last year",
          desc: "Total fees collected this year",
        },
        targetAchievement: {
          value: "92%",
          change: "Exceeding",
          desc: "Annual collection target progress",
        },
        outstandingDues: {
          value: "₹8.6L",
          change: "Year-to-date",
          desc: "Outstanding fees pending collection",
        },
        defaulters: { value: "84", change: "Students", desc: "Active defaulters in school" },
        expectedCollection: {
          value: "₹77L",
          change: "Year-end forecast",
          desc: "Estimated total collection by year-end",
        },
        healthScore: {
          value: "89/100",
          change: "Very Healthy",
          desc: "Annual financial health score",
        },
      };
    }
  }, [period]);

  const financialMetrics = useMemo(
    () => [
      {
        id: "collection",
        label: "Collection Health",
        value: 87,
        status: "Healthy",
        description: "82% of monthly target achieved. Collection performance is on track.",
      },
      {
        id: "recovery",
        label: "Fee Recovery",
        value: 76,
        status: "Good",
        description: "76% of total fees recovered. Outstanding dues are manageable.",
      },
      {
        id: "defaulter",
        label: "Defaulter Risk",
        value: "High",
        status: "24 students",
        description:
          "24 students have overdue fees exceeding 60 days. Immediate follow-up required.",
      },
      {
        id: "cashflow",
        label: "Cash Flow Status",
        value: "Stable",
        status: "On Track",
        description: "Monthly cash flow is stable with no critical gaps.",
      },
      {
        id: "compliance",
        label: "Payment Compliance",
        value: 92,
        status: "Excellent",
        description: "92% of students maintain payment schedules on time.",
      },
    ],
    [],
  );

  const classCollection = [
    { name: "Grade 1", collected: 92, status: "Excellent" },
    { name: "Grade 2", collected: 84, status: "Good" },
    { name: "Grade 3", collected: 68, status: "Needs Attention" },
    { name: "Grade 4", collected: 88, status: "Good" },
    { name: "Grade 5", collected: 76, status: "Good" },
    { name: "Grade 6", collected: 72, status: "Needs Attention" },
  ];

  const selectedClassCollection =
    classCollection.find((cls) => cls.name === `Grade ${selectedGrade}`) ?? classCollection[0];

  const recentPayments = [
    { name: "Rahul Sharma", amount: "₹12,000", date: "Today", class: "Grade 4", method: "UPI" },
    { name: "Priya Singh", amount: "₹18,500", date: "Yesterday", class: "Grade 5", method: "Card" },
    {
      name: "Aditya Kumar",
      amount: "₹15,000",
      date: "2 days ago",
      class: "Grade 3",
      method: "Cash",
    },
    {
      name: "Maya Patel",
      amount: "₹22,000",
      date: "3 days ago",
      class: "Grade 6",
      method: "Net Banking",
    },
    {
      name: "Vivaan Verma",
      amount: "₹14,200",
      date: "3 days ago",
      class: "Grade 2",
      method: "UPI",
    },
  ];

  const paymentStatus = [
    {
      status: "Paid",
      count: 340,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
    },
    { status: "Partial", count: 48, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { status: "Pending", count: 28, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    { status: "Overdue", count: 14, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  ];

  const financeInsights = [
    "Grade 3 has the highest fee default rate at 32% pending collection.",
    "Collection performance improved by 12% compared to last month.",
    "24 students have overdue fees exceeding 60 days requiring immediate action.",
    "Current trends indicate monthly target achievement is likely at 82%.",
    "Grade 5 shows exceptional collection compliance at 92%.",
  ];

  return (
    <div>
      <PageHeader
        title="Finance"
        subtitle="Comprehensive financial overview, collection performance, and revenue tracking."
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Payment recorded (demo)")}
            >
              <DollarSign className="size-4 mr-2" />
              Record Payment
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Reminder sent (demo)")}
            >
              <Bell className="size-4 mr-2" />
              Send Fee Reminder
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="size-4 mr-2" />
              Generate Report
            </Button>
            <Button size="sm" variant="outline">
              <Download className="size-4 mr-2" />
              Export Data
            </Button>
          </div>
        }
      />

      {/* PERIOD FILTER */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">View:</span>
        <Button
          size="sm"
          variant={period === "month" ? "default" : "outline"}
          onClick={() => setPeriod("month")}
        >
          This Month
        </Button>
        <Button
          size="sm"
          variant={period === "year" ? "default" : "outline"}
          onClick={() => setPeriod("year")}
        >
          This Year
        </Button>
      </div>

      {/* MAIN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Total Collection</span>
            <TrendingUp className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold">{kpiData.totalCollection.value}</div>
          <div className="text-xs text-emerald-600 mt-1">{kpiData.totalCollection.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{kpiData.totalCollection.desc}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Target Achievement</span>
            <CheckCircle2 className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{kpiData.targetAchievement.value}</div>
          <div className="text-xs text-blue-600 mt-1">{kpiData.targetAchievement.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{kpiData.targetAchievement.desc}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Outstanding Dues</span>
            <AlertCircle className="size-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{kpiData.outstandingDues.value}</div>
          <div className="text-xs text-amber-600 mt-1">{kpiData.outstandingDues.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{kpiData.outstandingDues.desc}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Fee Defaulters</span>
            <AlertTriangle className="size-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{kpiData.defaulters.value}</div>
          <div className="text-xs text-red-600 mt-1">{kpiData.defaulters.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{kpiData.defaulters.desc}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Expected Collection</span>
            <Wallet className="size-4 text-violet-600" />
          </div>
          <div className="text-2xl font-bold">{kpiData.expectedCollection.value}</div>
          <div className="text-xs text-violet-600 mt-1">{kpiData.expectedCollection.change}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {kpiData.expectedCollection.desc}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Health Score</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{kpiData.healthScore.value}</div>
          <div className="text-xs text-emerald-600 mt-1">{kpiData.healthScore.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{kpiData.healthScore.desc}</div>
        </Card>
      </div>

      {/* FINANCIAL HEALTH SECTION */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Financial Health Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {financialMetrics.map((metric) => (
            <Card key={metric.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
              </div>
              <div className="text-2xl font-bold mb-2">{metric.value}</div>
              <Badge variant="outline" className="text-xs">
                {metric.status}
              </Badge>
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed">
                {metric.description}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* COLLECTION TARGET TRACKER */}
      <Card className="p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2">Monthly Target</p>
            <p className="text-2xl font-bold">₹80L</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2">Collected So Far</p>
            <p className="text-2xl font-bold text-emerald-600">₹68.4L</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2">Remaining</p>
            <p className="text-2xl font-bold text-amber-600">₹11.6L</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2">Progress</p>
            <div className="mt-1">
              <div className="text-2xl font-bold text-blue-600 mb-2">82%</div>
              <Progress value={82} className="h-2" />
            </div>
          </div>
        </div>
      </Card>

      {/* CLASS COLLECTION OVERVIEW */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold">Collection by Grade</h2>
          <div className="min-w-40">
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {classCollection.map((cls, index) => (
                  <SelectItem key={cls.name} value={String(index + 1)}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border hover:border-muted-foreground transition-colors max-w-sm">
          <p className="font-semibold text-sm mb-2">{selectedClassCollection.name}</p>
          <p className="text-2xl font-bold mb-2">{selectedClassCollection.collected}%</p>
          <Badge
            variant="outline"
            className="text-xs"
            style={{
              backgroundColor:
                selectedClassCollection.status === "Excellent"
                  ? "#ecfdf5"
                  : selectedClassCollection.status === "Good"
                    ? "#f0f9ff"
                    : "#fffbeb",
              color:
                selectedClassCollection.status === "Excellent"
                  ? "#047857"
                  : selectedClassCollection.status === "Good"
                    ? "#0369a1"
                    : "#b45309",
              borderColor:
                selectedClassCollection.status === "Excellent"
                  ? "#d1fae5"
                  : selectedClassCollection.status === "Good"
                    ? "#bfdbfe"
                    : "#fef08a",
            }}
          >
            {selectedClassCollection.status}
          </Badge>
        </div>
      </Card>

      {/* PAYMENT STATUS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Payment Status Summary</h2>
          <div className="space-y-3">
            {paymentStatus.map((status) => (
              <div key={status.status} className={`p-4 rounded-lg border ${status.bg}`}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{status.status}</p>
                  <p className={`text-2xl font-bold ${status.color}`}>{status.count}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Students</p>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT PAYMENTS */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Payments</h2>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {recentPayments.map((payment, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{payment.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {payment.class} • {payment.date} • {payment.method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{payment.amount}</p>
                    <CheckCircle2 className="size-4 text-emerald-600 mt-1 ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINANCE INSIGHTS */}
      <Card className="p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Scholarii Finance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {financeInsights.map((insight, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-blue-200 bg-blue-50">
              <div className="flex gap-2 mb-2">
                <Zap className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
              </div>
              <p className="text-sm text-blue-900 font-medium leading-snug">{insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* COLLECTION SUMMARY */}
      <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-6">
        <h2 className="text-lg font-semibold mb-3">Financial Summary</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Collection performance remains healthy this month with 82% of targets achieved and ₹68.4L
          collected. Outstanding dues are concentrated in Grades 3 and 6, requiring targeted
          follow-up. Current trends suggest monthly targets are achievable by month-end with focused
          collection efforts.
        </p>
      </Card>

      {/* SIMPLE SEARCH & FILTERS */}
      <Card className="p-5">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-60">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Search Student
            </label>
            <Input
              placeholder="Search by name, admission number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="min-w-40">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Grade</label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="1">Grade 1</SelectItem>
                <SelectItem value="2">Grade 2</SelectItem>
                <SelectItem value="3">Grade 3</SelectItem>
                <SelectItem value="4">Grade 4</SelectItem>
                <SelectItem value="5">Grade 5</SelectItem>
                <SelectItem value="6">Grade 6</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-40">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Payment Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
}
