import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ChevronDown,
  ChevronUp,
  Zap,
  Download,
  FileText,
  Bell,
  TrendingDown,
  Receipt,
  Users,
  Package,
  Building,
  BarChart3,
  PieChart,
  Users2,
  Search,
  Filter,
  Wrench,
  BookOpen,
  Monitor,
  Wifi,
  Briefcase,
} from "lucide-react";
import { PieChart as RePieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("1");
  const [period, setPeriod] = useState<"month" | "year">("month");

  const [activeTab, setActiveTab] = useState("fee-analytics");

  // Expenses tab state
  const [expenseSortField, setExpenseSortField] = useState("date");
  const [expenseSortDir, setExpenseSortDir] = useState<"asc" | "desc">("desc");
  const [expenseCatFilter, setExpenseCatFilter] = useState("all");
  const [expenseStatusFilter, setExpenseStatusFilter] = useState("all");

  // Salaries tab state
  const [salarySortField, setSalarySortField] = useState("name");
  const [salarySortDir, setSalarySortDir] = useState<"asc" | "desc">("asc");
  const [salaryDeptFilter, setSalaryDeptFilter] = useState("all");

  // Mock expenses
  const expenses = [
    { id: "EXP001", title: "Electricity Bill", desc: "Monthly electricity charges for campus", amt: 18500, cat: "Utilities", status: "paid", date: "2026-01-05" },
    { id: "EXP002", title: "Water Supply", desc: "Water bill for school premises", amt: 8200, cat: "Utilities", status: "paid", date: "2026-01-03" },
    { id: "EXP003", title: "Internet & Phone", desc: "Broadband and phone line charges", amt: 12500, cat: "Utilities", status: "pending", date: "2026-01-15" },
    { id: "EXP004", title: "AC Maintenance", desc: "Quarterly AC servicing and repairs", amt: 28000, cat: "Maintenance", status: "paid", date: "2026-01-08" },
    { id: "EXP005", title: "Plumbing Work", desc: "Bathroom repairs and pipe fixing", amt: 15000, cat: "Maintenance", status: "paid", date: "2026-01-02" },
    { id: "EXP006", title: "Electrical Repairs", desc: "Wiring and switchboard maintenance", amt: 12000, cat: "Maintenance", status: "pending", date: "2026-01-12" },
    { id: "EXP007", title: "Classroom Furniture", desc: "New desks and chairs for Grade 4", amt: 45000, cat: "Supplies", status: "paid", date: "2026-01-06" },
    { id: "EXP008", title: "Lab Equipment", desc: "Science lab apparatus and chemicals", amt: 32000, cat: "Supplies", status: "paid", date: "2026-01-04" },
    { id: "EXP009", title: "Computer Upgrades", desc: "New monitors and peripherals", amt: 58000, cat: "Supplies", status: "pending", date: "2026-01-18" },
    { id: "EXP010", title: "Annual Sports Day", desc: "Event organization and prizes", amt: 65000, cat: "Events", status: "paid", date: "2026-01-20" },
    { id: "EXP011", title: "Transport Fuel", desc: "School bus diesel charges", amt: 42000, cat: "Miscellaneous", status: "paid", date: "2026-01-10" },
    { id: "EXP012", title: "Printing & Stationery", desc: "Exam papers and office supplies", amt: 18500, cat: "Supplies", status: "paid", date: "2026-01-07" },
    { id: "EXP013", title: "Garden Maintenance", desc: "Landscaping and plant care", amt: 9500, cat: "Maintenance", status: "pending", date: "2026-01-22" },
    { id: "EXP014", title: "Security Services", desc: "Guard services and CCTV maintenance", amt: 35000, cat: "Miscellaneous", status: "paid", date: "2026-01-01" },
    { id: "EXP015", title: "Library Books", desc: "New book purchases for library", amt: 25000, cat: "Supplies", status: "pending", date: "2026-01-25" },
  ];

  // Mock salaries
  const salaries = [
    { id: "SAL001", name: "Dr. Ramesh Kumar", role: "Principal", dept: "Administration", salary: 85000, bonus: 5000, deductions: 8500, status: "paid" },
    { id: "SAL002", name: "Mrs. Priya Sharma", role: "Vice Principal", dept: "Administration", salary: 65000, bonus: 3000, deductions: 6500, status: "paid" },
    { id: "SAL003", name: "Mr. Amit Singh", role: "Head Teacher", dept: "Primary", salary: 48000, bonus: 2000, deductions: 4800, status: "paid" },
    { id: "SAL004", name: "Mrs. Sunita Patel", role: "Senior Teacher", dept: "Primary", salary: 42000, bonus: 1500, deductions: 4200, status: "paid" },
    { id: "SAL005", name: "Mr. Vikram Rao", role: "Math Teacher", dept: "Secondary", salary: 38000, bonus: 1000, deductions: 3800, status: "pending" },
    { id: "SAL006", name: "Mrs. Anjali Gupta", role: "Science Teacher", dept: "Secondary", salary: 40000, bonus: 2000, deductions: 4000, status: "paid" },
    { id: "SAL007", name: "Mr. Deepak Verma", role: "English Teacher", dept: "Secondary", salary: 35000, bonus: 1000, deductions: 3500, status: "paid" },
    { id: "SAL008", name: "Mrs. Meera Iyer", role: "Hindi Teacher", dept: "Secondary", salary: 32000, bonus: 500, deductions: 3200, status: "pending" },
    { id: "SAL009", name: "Mr. Sanjay Nair", role: "PE Teacher", dept: "Sports", salary: 28000, bonus: 2000, deductions: 2800, status: "paid" },
    { id: "SAL010", name: "Mrs. Kavita Reddy", role: "Art Teacher", dept: "Arts", salary: 25000, bonus: 500, deductions: 2500, status: "paid" },
    { id: "SAL011", name: "Mr. Rahul Mehta", role: "Music Teacher", dept: "Arts", salary: 26000, bonus: 1000, deductions: 2600, status: "paid" },
    { id: "SAL012", name: "Mrs. Neha Khanna", role: "Librarian", dept: "Library", salary: 22000, bonus: 0, deductions: 2200, status: "pending" },
    { id: "SAL013", name: "Mr. Arjun Desai", role: "Lab Assistant", dept: "Science", salary: 18000, bonus: 500, deductions: 1800, status: "paid" },
    { id: "SAL014", name: "Mrs. Pooja Shah", role: "Office Assistant", dept: "Administration", salary: 15000, bonus: 0, deductions: 1500, status: "paid" },
    { id: "SAL015", name: "Mr. Manish Joshi", role: "Security Guard", dept: "Security", salary: 12000, bonus: 500, deductions: 1200, status: "paid" },
  ];

  // Revenue Data (SS-1)
  const revenueKpiData = useMemo(() => {
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

  // Expense Data (SS-2)
  const expenseKpiData = useMemo(() => {
    if (period === "month") {
      return {
        totalExpenses: {
          value: "₹3.2L",
          change: "+5% vs last month",
          desc: "Total expenses this month",
          icon: TrendingDown,
          color: "text-red-600",
          bgColor: "bg-red-50",
        },
        salariesPaid: {
          value: "₹2.1L",
          change: "28 Staff",
          desc: "Teacher & staff salaries",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        billsUtilities: {
          value: "₹45K",
          change: "Electricity, Water, Internet",
          desc: "Monthly utility bills",
          icon: Zap,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
        },
        maintenance: {
          value: "₹35K",
          change: "Infrastructure",
          desc: "Building & equipment maintenance",
          icon: Building,
          color: "text-violet-600",
          bgColor: "bg-violet-50",
        },
        otherRevenues: {
          value: "₹28K",
          change: "Donations, Events",
          desc: "Additional income sources",
          icon: Receipt,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
        },
        netPosition: {
          value: "₹1.6L",
          change: "+12% profit",
          desc: "Revenue minus expenses",
          icon: Wallet,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
        },
      };
    } else {
      return {
        totalExpenses: {
          value: "₹42.8L",
          change: "+8% vs last year",
          desc: "Total expenses this year",
          icon: TrendingDown,
          color: "text-red-600",
          bgColor: "bg-red-50",
        },
        salariesPaid: {
          value: "₹28.5L",
          change: "28 Staff Annual",
          desc: "Teacher & staff annual salaries",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        billsUtilities: {
          value: "₹5.4L",
          change: "All Utilities",
          desc: "Annual utility bills",
          icon: Zap,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
        },
        maintenance: {
          value: "₹4.2L",
          change: "Infrastructure",
          desc: "Annual maintenance costs",
          icon: Building,
          color: "text-violet-600",
          bgColor: "bg-violet-50",
        },
        otherRevenues: {
          value: "₹3.6L",
          change: "Donations, Events",
          desc: "Additional annual income",
          icon: Receipt,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
        },
        netPosition: {
          value: "₹25.6L",
          change: "+18% profit",
          desc: "Annual revenue minus expenses",
          icon: Wallet,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
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
    { name: "Grade 1", collected: 92, status: "Excellent", paid: 45, unpaid: 4, partial: 3 },
    { name: "Grade 2", collected: 84, status: "Good", paid: 38, unpaid: 8, partial: 4 },
    { name: "Grade 3", collected: 68, status: "Needs Attention", paid: 28, unpaid: 12, partial: 6 },
    { name: "Grade 4", collected: 88, status: "Good", paid: 42, unpaid: 5, partial: 3 },
    { name: "Grade 5", collected: 76, status: "Good", paid: 35, unpaid: 9, partial: 4 },
    { name: "Grade 6", collected: 72, status: "Needs Attention", paid: 32, unpaid: 10, partial: 5 },
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

  const expenseItems = [
    expenseKpiData.totalExpenses,
    expenseKpiData.salariesPaid,
    expenseKpiData.billsUtilities,
    expenseKpiData.maintenance,
    expenseKpiData.otherRevenues,
    expenseKpiData.netPosition,
  ];

  return (
    <div>
      <PageHeader
        title="Finance"
        subtitle="Comprehensive financial overview including revenue, expenses, and overall school financial health."
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

      {/* REVENUE PERIOD FILTER - SS-1 */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Fee Revenue View:</span>
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

      {/* SS-1: REVENUE KPI CARDS - Keep as is */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-2">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Total Collection</span>
            <TrendingUp className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold">{revenueKpiData.totalCollection.value}</div>
          <div className="text-xs text-emerald-600 mt-1">{revenueKpiData.totalCollection.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{revenueKpiData.totalCollection.desc}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Target Achievement</span>
            <CheckCircle2 className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{revenueKpiData.targetAchievement.value}</div>
          <div className="text-xs text-blue-600 mt-1">{revenueKpiData.targetAchievement.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{revenueKpiData.targetAchievement.desc}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Outstanding Dues</span>
            <AlertCircle className="size-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{revenueKpiData.outstandingDues.value}</div>
          <div className="text-xs text-amber-600 mt-1">{revenueKpiData.outstandingDues.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{revenueKpiData.outstandingDues.desc}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Fee Defaulters</span>
            <AlertTriangle className="size-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{revenueKpiData.defaulters.value}</div>
          <div className="text-xs text-red-600 mt-1">{revenueKpiData.defaulters.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{revenueKpiData.defaulters.desc}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Expected Collection</span>
            <Wallet className="size-4 text-violet-600" />
          </div>
          <div className="text-2xl font-bold">{revenueKpiData.expectedCollection.value}</div>
          <div className="text-xs text-violet-600 mt-1">{revenueKpiData.expectedCollection.change}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {revenueKpiData.expectedCollection.desc}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Health Score</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{revenueKpiData.healthScore.value}</div>
          <div className="text-xs text-emerald-600 mt-1">{revenueKpiData.healthScore.change}</div>
          <div className="text-xs text-muted-foreground mt-2">{revenueKpiData.healthScore.desc}</div>
        </Card>
      </div>

      {/* SS-2: EXPENSES & OTHER REVENUE KPI CARDS - NEW */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground">Overall Financial Position</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {expenseItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    {idx === 0 ? "Total Expenses" : idx === 1 ? "Salaries Paid" : idx === 2 ? "Bills & Utilities" : idx === 3 ? "Maintenance" : idx === 4 ? "Other Revenues" : "Net Position"}
                  </span>
                  <Icon className={`size-4 ${item.color}`} />
                </div>
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className={`text-xs mt-1 ${item.color}`}>{item.change}</div>
                <div className="text-xs text-muted-foreground mt-2">{item.desc}</div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* TABS SECTION */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card className="p-3 border-border/60 bg-white/70 backdrop-blur-xl shadow-sm mb-6">
          <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
            <TabsTrigger value="fee-analytics"
              className="rounded-full border border-border/70 bg-white/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 backdrop-blur-md
                         data-[state=active]:border-emerald-500/70
                         data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-50/90 data-[state=active]:to-white/80
                         data-[state=active]:text-foreground
                         data-[state=active]:shadow-[0_10px_30px_rgba(16,185,129,0.18)]
                         data-[state=active]:ring-1 data-[state=active]:ring-emerald-200/60
                         hover:border-emerald-300 hover:bg-white/80 hover:text-foreground flex items-center gap-2">
              <BarChart3 className="size-4" />
              Fee Analytics
            </TabsTrigger>
            <TabsTrigger value="financial-health"
              className="rounded-full border border-border/70 bg-white/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 backdrop-blur-md
                         data-[state=active]:border-emerald-500/70
                         data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-50/90 data-[state=active]:to-white/80
                         data-[state=active]:text-foreground
                         data-[state=active]:shadow-[0_10px_30px_rgba(16,185,129,0.18)]
                         data-[state=active]:ring-1 data-[state=active]:ring-emerald-200/60
                         hover:border-emerald-300 hover:bg-white/80 hover:text-foreground flex items-center gap-2">
              <PieChart className="size-4" />
              Financial Health
            </TabsTrigger>
            <TabsTrigger value="expenses"
              className="rounded-full border border-border/70 bg-white/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 backdrop-blur-md
                         data-[state=active]:border-emerald-500/70
                         data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-50/90 data-[state=active]:to-white/80
                         data-[state=active]:text-foreground
                         data-[state=active]:shadow-[0_10px_30px_rgba(16,185,129,0.18)]
                         data-[state=active]:ring-1 data-[state=active]:ring-emerald-200/60
                         hover:border-emerald-300 hover:bg-white/80 hover:text-foreground flex items-center gap-2">
              <Receipt className="size-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="salaries"
              className="rounded-full border border-border/70 bg-white/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 backdrop-blur-md
                         data-[state=active]:border-emerald-500/70
                         data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-50/90 data-[state=active]:to-white/80
                         data-[state=active]:text-foreground
                         data-[state=active]:shadow-[0_10px_30px_rgba(16,185,129,0.18)]
                         data-[state=active]:ring-1 data-[state=active]:ring-emerald-200/60
                         hover:border-emerald-300 hover:bg-white/80 hover:text-foreground flex items-center gap-2">
              <Briefcase className="size-4" />
              Salaries &amp; HR
            </TabsTrigger>
            <TabsTrigger value="grade-overview"
              className="rounded-full border border-border/70 bg-white/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 backdrop-blur-md
                         data-[state=active]:border-emerald-500/70
                         data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-50/90 data-[state=active]:to-white/80
                         data-[state=active]:text-foreground
                         data-[state=active]:shadow-[0_10px_30px_rgba(16,185,129,0.18)]
                         data-[state=active]:ring-1 data-[state=active]:ring-emerald-200/60
                         hover:border-emerald-300 hover:bg-white/80 hover:text-foreground flex items-center gap-2">
              <Users2 className="size-4" />
              Grade Overview
            </TabsTrigger>
            <TabsTrigger value="student-records"
              className="rounded-full border border-border/70 bg-white/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 backdrop-blur-md
                         data-[state=active]:border-emerald-500/70
                         data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-50/90 data-[state=active]:to-white/80
                         data-[state=active]:text-foreground
                         data-[state=active]:shadow-[0_10px_30px_rgba(16,185,129,0.18)]
                         data-[state=active]:ring-1 data-[state=active]:ring-emerald-200/60
                         hover:border-emerald-300 hover:bg-white/80 hover:text-foreground flex items-center gap-2">
              <Search className="size-4" />
              Student Records
            </TabsTrigger>
          </TabsList>
        </Card>

        {/* TAB 1: FEE ANALYTICS */}
        <TabsContent value="fee-analytics" className="space-y-6">
          {/* COLLECTION TARGET TRACKER */}
          <Card className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">{period === "month" ? "Monthly Target" : "Annual Target"}</p>
                <p className="text-2xl font-bold">₹{period === "month" ? "80L" : "80L"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Collected So Far</p>
                <p className="text-2xl font-bold text-emerald-600">{period === "month" ? "₹68.4L" : "₹68.4L"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Remaining</p>
                <p className="text-2xl font-bold text-amber-600">{period === "month" ? "₹11.6L" : "₹11.6L"}</p>
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

          {/* PAYMENT STATUS OVERVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          <Card className="p-5">
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
          <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <h2 className="text-lg font-semibold mb-3">Financial Summary</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Collection performance remains healthy this month with 82% of targets achieved and ₹68.4L
              collected. Outstanding dues are concentrated in Grades 3 and 6, requiring targeted
              follow-up. Current trends suggest monthly targets are achievable by month-end with focused
              collection efforts.
            </p>
          </Card>
        </TabsContent>

        {/* TAB 2: FINANCIAL HEALTH */}
        <TabsContent value="financial-health" className="space-y-6">
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
        </TabsContent>

        {/* TAB 3: EXPENSES - NEW */}
        <TabsContent value="expenses" className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold">School Expenses</h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <Select value={expenseCatFilter} onValueChange={setExpenseCatFilter}>
                    <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Supplies">Supplies</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={expenseStatusFilter} onValueChange={setExpenseStatusFilter}>
                  <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>

            {(() => {
              const filtered = expenses
                .filter(e => expenseCatFilter === "all" || e.cat === expenseCatFilter)
                .filter(e => expenseStatusFilter === "all" || e.status === expenseStatusFilter)
                .filter(e => !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.desc.toLowerCase().includes(searchQuery.toLowerCase()))
                .sort((a, b) => {
                  const dir = expenseSortDir === "asc" ? 1 : -1;
                  const field = expenseSortField as "date" | "amt" | "cat";
                  if (field === "amt") return (a.amt - b.amt) * dir;
                  if (field === "date") return a.date.localeCompare(b.date) * dir;
                  return a.cat.localeCompare(b.cat) * dir;
                });

              return (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead className="max-w-xs">Description</TableHead>
                          <TableHead>
                            <button onClick={() => { setExpenseSortField("cat"); setExpenseSortDir(d => d === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 font-semibold text-xs">
                              Category {expenseSortField === "cat" && (expenseSortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                            </button>
                          </TableHead>
                          <TableHead>
                            <button onClick={() => { setExpenseSortField("amt"); setExpenseSortDir(d => d === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 font-semibold text-xs">
                              Amount {expenseSortField === "amt" && (expenseSortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                            </button>
                          </TableHead>
                          <TableHead>
                            <button onClick={() => { setExpenseSortField("date"); setExpenseSortDir(d => d === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 font-semibold text-xs">
                              Date {expenseSortField === "date" && (expenseSortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                            </button>
                          </TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((exp) => (
                          <TableRow key={exp.id}>
                            <TableCell className="font-mono text-xs">{exp.id}</TableCell>
                            <TableCell className="font-medium">{exp.title}</TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{exp.desc}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{exp.cat}</Badge></TableCell>
                            <TableCell className="font-semibold">₹{exp.amt.toLocaleString()}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{exp.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs capitalize ${exp.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                                {exp.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {filtered.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Receipt className="size-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No expenses found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                    <span>Showing {filtered.length} of {expenses.length} expenses</span>
                    <span className="font-semibold">Total: ₹{filtered.reduce((s, e) => s + e.amt, 0).toLocaleString()}</span>
                  </div>
                </>
              );
            })()}
          </Card>
        </TabsContent>

        {/* TAB 4: SALARIES & HR - NEW */}
        <TabsContent value="salaries" className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold">Salaries &amp; HR Expenses</h2>
                <p className="text-sm text-muted-foreground">Staff salary records and HR-related expenses</p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <Select value={salaryDeptFilter} onValueChange={setSalaryDeptFilter}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Primary">Primary</SelectItem>
                    <SelectItem value="Secondary">Secondary</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Library">Library</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(() => {
              const filtered = salaries
                .filter(s => salaryDeptFilter === "all" || s.dept === salaryDeptFilter)
                .sort((a, b) => {
                  const dir = salarySortDir === "asc" ? 1 : -1;
                  const f = salarySortField as "name" | "dept" | "salary";
                  if (f === "salary") return (a.salary - b.salary) * dir;
                  return a[f].localeCompare(b[f]) * dir;
                });

              const totalPayroll = filtered.reduce((s, x) => s + x.salary, 0);
              const totalBonuses = filtered.reduce((s, x) => s + x.bonus, 0);
              const paidCount = filtered.filter(x => x.status === "paid").length;
              const pendingCount = filtered.filter(x => x.status === "pending").length;

              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <p className="text-xs text-muted-foreground mb-1">Total Payroll</p>
                      <p className="text-2xl font-bold">₹{totalPayroll.toLocaleString()}</p>
                    </Card>
                    <Card className="p-4 bg-emerald-50 border-emerald-200">
                      <p className="text-xs text-muted-foreground mb-1">Paid</p>
                      <p className="text-2xl font-bold text-emerald-600">{paidCount}</p>
                      <p className="text-xs text-muted-foreground">Staff</p>
                    </Card>
                    <Card className="p-4 bg-amber-50 border-amber-200">
                      <p className="text-xs text-muted-foreground mb-1">Pending</p>
                      <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                      <p className="text-xs text-muted-foreground">Staff</p>
                    </Card>
                    <Card className="p-4 bg-violet-50 border-violet-200">
                      <p className="text-xs text-muted-foreground mb-1">Total Bonuses</p>
                      <p className="text-2xl font-bold text-violet-600">₹{totalBonuses.toLocaleString()}</p>
                    </Card>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <button onClick={() => { setSalarySortField("name"); setSalarySortDir(d => d === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 font-semibold text-xs">
                              Name {salarySortField === "name" && (salarySortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                            </button>
                          </TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>
                            <button onClick={() => { setSalarySortField("dept"); setSalarySortDir(d => d === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 font-semibold text-xs">
                              Dept {salarySortField === "dept" && (salarySortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                            </button>
                          </TableHead>
                          <TableHead>
                            <button onClick={() => { setSalarySortField("salary"); setSalarySortDir(d => d === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 font-semibold text-xs">
                              Base Salary {salarySortField === "salary" && (salarySortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                            </button>
                          </TableHead>
                          <TableHead>Bonus</TableHead>
                          <TableHead>Deductions</TableHead>
                          <TableHead>Net Pay</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((staff) => (
                          <TableRow key={staff.id}>
                            <TableCell className="font-medium">{staff.name}</TableCell>
                            <TableCell className="text-sm">{staff.role}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{staff.dept}</Badge></TableCell>
                            <TableCell className="font-semibold">₹{staff.salary.toLocaleString()}</TableCell>
                            <TableCell className="text-emerald-600">+₹{staff.bonus.toLocaleString()}</TableCell>
                            <TableCell className="text-red-600">-₹{staff.deductions.toLocaleString()}</TableCell>
                            <TableCell className="font-bold">₹{(staff.salary + staff.bonus - staff.deductions).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs capitalize ${staff.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                                {staff.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {filtered.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="size-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No records found</p>
                      <p className="text-sm">Try adjusting your filters.</p>
                    </div>
                  )}
                </>
              );
            })()}
          </Card>
        </TabsContent>

        {/* TAB 5: GRADE OVERVIEW - UPDATED WITH PIE CHART */}
        <TabsContent value="grade-overview" className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-lg font-semibold">Fee Collection by Grade</h2>
              <div className="min-w-40">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                  <SelectContent>
                    {classCollection.map((cls, index) => (
                      <SelectItem key={cls.name} value={String(index + 1)}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg">{selectedClassCollection.name}</p>
                      <p className="text-sm text-muted-foreground">Collection Status</p>
                    </div>
                    <Badge variant="outline" className="text-xs" style={{
                      backgroundColor: selectedClassCollection.status === "Excellent" ? "#ecfdf5" : selectedClassCollection.status === "Good" ? "#f0f9ff" : "#fffbeb",
                      color: selectedClassCollection.status === "Excellent" ? "#047857" : selectedClassCollection.status === "Good" ? "#0369a1" : "#b45309",
                      borderColor: selectedClassCollection.status === "Excellent" ? "#d1fae5" : selectedClassCollection.status === "Good" ? "#bfdbfe" : "#fef08a",
                    }}>
                      {selectedClassCollection.status}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-2">{selectedClassCollection.collected}%</div>
                  <Progress value={selectedClassCollection.collected} className="h-3 mb-4" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Card className="p-4 bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="size-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Paid</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">{selectedClassCollection.paid}</p>
                    <p className="text-xs text-emerald-600">students</p>
                  </Card>
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="size-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Partial</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{selectedClassCollection.partial}</p>
                    <p className="text-xs text-blue-600">students</p>
                  </Card>
                  <Card className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="size-5 text-red-600" />
                      <span className="text-sm font-medium text-red-700">Unpaid</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{selectedClassCollection.unpaid}</p>
                    <p className="text-xs text-red-600">students</p>
                  </Card>
                </div>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold">{selectedClassCollection.paid + selectedClassCollection.partial + selectedClassCollection.unpaid}</p>
                    </div>
                    <Users2 className="size-8 text-muted-foreground opacity-50" />
                  </div>
                </Card>
              </div>

              <Card className="p-5">
                <h3 className="font-semibold mb-4 text-sm">Payment Distribution</h3>
                {(() => {
                  const pieData = [
                    { name: "Paid", value: selectedClassCollection.paid, color: "#10b981" },
                    { name: "Partial", value: selectedClassCollection.partial, color: "#3b82f6" },
                    { name: "Unpaid", value: selectedClassCollection.unpaid, color: "#ef4444" },
                  ];
                  const total = pieData.reduce((s, i) => s + i.value, 0);
                  return (
                    <>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={true}>
                              {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`${value} students`, "Count"]} />
                            <Legend />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                        {pieData.map((item, index) => (
                          <div key={index} className="text-center">
                            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                            <p className="text-xs font-medium">{item.name}</p>
                            <p className="text-sm font-semibold">{item.value}</p>
                            <p className="text-xs text-gray-500">{((item.value / total) * 100).toFixed(0)}%</p>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </Card>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 5: STUDENT RECORDS */}
        <TabsContent value="student-records" className="space-y-6">
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

          {/* Student Records Table Placeholder */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold mb-4">Student Fee Records</h2>
            <div className="text-center py-12 text-muted-foreground">
              <Users2 className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Student Records View</p>
              <p className="text-sm">Use the filters above to search and view individual student fee records.</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
