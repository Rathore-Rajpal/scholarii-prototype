import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  TrendingUp,
  Clock,
  CalendarDays,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  ArrowRight,
  Banknote,
  Bus,
  Palette,
  BookOpen,
  Monitor,
  Receipt,
  BarChart3,
  Sparkle,
} from "lucide-react";
import { KpiCard } from "@/components/scholarii/KpiCard";
import { useAuth } from "@/lib/scholarii/auth";
import { PlaceholderPage } from "@/components/scholarii/RoleGuard";
import {
  getParentFeesData,
  type ParentFeesData,
} from "@/lib/scholarii/fees-mock-data";
import PrincipalFinancePage from "@/components/scholarii/PrincipalFinancePage";

export const Route = createFileRoute("/app/fees")({
  component: FeesPage,
});

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "history", label: "Payment History", icon: Clock },
  { id: "upcoming", label: "Upcoming Payments", icon: CalendarDays },
  { id: "receipts", label: "Receipts", icon: Receipt },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

function OverviewTab({ data }: { data: ParentFeesData }) {
  return (
    <div className="space-y-6">
      {/* Fee Progress */}
      <Card className="p-5">
        <h3 className="font-semibold mb-1">Fee Progress</h3>
        <p className="text-sm text-muted-foreground mb-4">Annual fee payment status</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-bold text-lg">{data.paidPercentage}%</span>
          </div>
          <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${data.paidPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹{data.paidAmount.toLocaleString()} paid</span>
            <span>₹{data.pendingAmount.toLocaleString()} remaining</span>
          </div>
        </div>
      </Card>

      {/* Fee Breakdown */}
      <Card className="p-5">
        <h3 className="font-semibold mb-1">Fee Breakdown</h3>
        <p className="text-sm text-muted-foreground mb-4">Annual fee structure</p>
        <div className="space-y-3">
          {data.feeBreakdown.map((fee) => {
            const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
              book: BookOpen,
              bus: Bus,
              palette: Palette,
              file: FileText,
              monitor: Monitor,
            };
            const Icon = iconMap[fee.icon] || Wallet;
            return (
              <div key={fee.category} className="flex items-center justify-between p-3 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-violet-500/10 p-2">
                    <Icon className="size-4 text-violet-600" />
                  </div>
                  <span className="text-sm font-medium">{fee.category}</span>
                </div>
                <span className="text-sm font-bold">₹{fee.amount.toLocaleString()}</span>
              </div>
            );
          })}
          <Separator className="my-2" />
          <div className="flex items-center justify-between p-3">
            <span className="text-sm font-semibold">Total Annual Fees</span>
            <span className="text-lg font-bold text-violet-600">₹{data.annualFees.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PaymentHistoryTab({ data }: { data: ParentFeesData }) {
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="font-semibold mb-1">Payment History</h3>
        <p className="text-sm text-muted-foreground mb-4">Record of all fee payments</p>
        <div className="space-y-3">
          {data.paymentHistory.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{payment.installment}</p>
                  <p className="text-xs text-muted-foreground">{payment.paidDate} · {payment.paymentMethod}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">₹{payment.amount.toLocaleString()}</p>
                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Paid
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Paid</span>
            <span className="font-medium text-emerald-600">₹{data.paidAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Pending</span>
            <span className="font-medium text-amber-600">₹{data.pendingAmount.toLocaleString()}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <span className="font-semibold">Total Fees</span>
            <span className="font-bold">₹{data.annualFees.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function UpcomingPaymentsTab({ data }: { data: ParentFeesData }) {
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="font-semibold mb-1">Upcoming Payments</h3>
        <p className="text-sm text-muted-foreground mb-4">Installments due soon</p>
        <div className="space-y-3">
          {data.upcomingPayments.map((payment) => (
            <div key={payment.id} className="p-5 rounded-xl border border-border/50 bg-gradient-to-br from-amber-500/5 to-transparent transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-lg font-bold">{payment.installment}</p>
                  <p className="text-2xl font-bold text-amber-600">₹{payment.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Due: {payment.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-600">{payment.daysRemaining} Days Remaining</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
                  High Priority
                </Badge>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700">
                <CreditCard className="size-4 mr-2" />
                Pay Now
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ReceiptsTab({ data }: { data: ParentFeesData }) {
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="font-semibold mb-1">Download Receipts</h3>
        <p className="text-sm text-muted-foreground mb-4">Download payment receipts for your records</p>
        <div className="space-y-3">
          {data.receipts.map((receipt) => (
            <div key={receipt.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <FileText className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{receipt.receiptNumber}</p>
                  <p className="text-xs text-muted-foreground">{receipt.month} · ₹{receipt.amount.toLocaleString()}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="size-3.5" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FeesPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const data = useMemo(() => getParentFeesData(), []);

  if (user?.role === "principal") {
    return <PrincipalFinancePage />;
  }

  if (user?.role !== "student") {
    return (
      <PlaceholderPage
        title="Fees"
        subtitle="Manage and track student fee payments."
        icon={Wallet}
      />
    );
  }

  return (
    <div className="space-y-6 h-fit">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Fees</h1>
        <p className="text-muted-foreground mt-1">
          Manage your child's school fee payments and receipts.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 auto-rows-fr content-start">
        <KpiCard
          icon={Wallet}
          label="Annual Fees"
          value={`₹${data.annualFees.toLocaleString()}`}
          tone="default"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Paid"
          value={`₹${data.paidAmount.toLocaleString()}`}
          change={`${data.paidPercentage}%`}
          positive={true}
          tone="success"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Pending"
          value={`₹${data.pendingAmount.toLocaleString()}`}
          change={`${data.pendingPercentage}%`}
          positive={false}
          tone="warning"
        />
        <KpiCard
          icon={CalendarDays}
          label="Next Due"
          value={data.nextDueDate}
          change={`${data.nextDueDays} days`}
          tone="info"
        />
      </div>

      {/* Tab Bar */}
      <div className="sticky top-0 z-30 -mx-1 px-1 pt-1 pb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl rounded-2xl" />
          <div className="relative flex gap-1 overflow-x-auto scrollbar-none rounded-2xl border border-border/60 bg-card p-1.5 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-500/10 text-violet-600 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && <OverviewTab data={data} />}
        {activeTab === "history" && <PaymentHistoryTab data={data} />}
        {activeTab === "upcoming" && <UpcomingPaymentsTab data={data} />}
        {activeTab === "receipts" && <ReceiptsTab data={data} />}
      </div>

      {/* AI Insights Card */}
      <Card className="relative overflow-hidden p-5 border-violet-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-violet-600/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 p-2">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">AI Fee Insights</h3>
              <p className="text-xs text-muted-foreground">Smart recommendations for your fee payments</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.feeInsights.map((insight) => {
              const iconMap = {
                positive: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10" },
                suggestion: { icon: Sparkle, color: "text-blue-600", bg: "bg-blue-500/10" },
              };
              const { icon: InsightIcon, color, bg } = iconMap[insight.type as keyof typeof iconMap] || iconMap.positive;
              return (
                <div
                  key={insight.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-background/80 border border-border/50"
                >
                  <div className={`rounded-lg p-1.5 ${bg} shrink-0`}>
                    <InsightIcon className={`size-3.5 ${color}`} />
                  </div>
                  <p className="text-sm leading-relaxed">{insight.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-5">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Download className="size-5 text-violet-600" />
            <span className="text-xs font-medium">Download Receipt</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <FileText className="size-5 text-blue-600" />
            <span className="text-xs font-medium">View Fee Structure</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <BarChart3 className="size-5 text-emerald-600" />
            <span className="text-xs font-medium">Payment Timeline</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => nav({ to: "/app/ai" as never })}
          >
            <Sparkles className="size-5 text-amber-600" />
            <span className="text-xs font-medium">Open AI Assistant</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
