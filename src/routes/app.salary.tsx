import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Coins,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Search,
  ChevronRight,
  FileText,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SALARY_INFO,
  PAYSLOPS,
  EARNINGS,
  DEDUCTIONS,
  SALARY_STATS,
} from "@/lib/scholarii/teacher-salary-mock-data";
import { toast } from "sonner";
import { ScrollableTabs } from "@/components/scholarii/ScrollableTabs";

export const Route = createFileRoute("/app/salary")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <SalaryPage />
    </RoleGuard>
  ),
});

const TABS = [
  { id: "overview", label: "Overview", icon: Coins },
  { id: "payslips", label: "Payslips", icon: FileText },
  { id: "breakdown", label: "Breakdown", icon: CreditCard },
] as const;

type TabId = (typeof TABS)[number]["id"];

const tabItems = TABS.map((tab) => ({
  id: tab.id,
  label: tab.label,
  icon: <tab.icon className="size-4" />,
}));

function SalaryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedPayslipId, setSelectedPayslipId] = useState<string | null>(null);

  const stats = SALARY_STATS;
  const info = SALARY_INFO;

  const selectedPayslip = PAYSLOPS.find((p) => p.id === selectedPayslipId);

  return (
    <div>
      <PageHeader
        title="Salary & Payroll"
        subtitle="View salary slips, tax deductions, and payment history."
        action={
          <Button size="sm" className="bg-brand-gradient text-white border-0">
            <Download className="size-4 mr-1" />
            Download Form 16
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center">
              <Coins className="size-5 text-violet-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Current Month</div>
              <div className="text-xl font-semibold">{stats.currentMonth}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center">
              <TrendingUp className="size-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Net Pay</div>
              <div className="text-xl font-semibold">₹{stats.netPay.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-sky-500/10 grid place-items-center">
              <TrendingUp className="size-5 text-sky-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">YTD Earnings</div>
              <div className="text-xl font-semibold">₹{stats.ytdEarnings.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center">
              <TrendingDown className="size-5 text-red-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">YTD Deductions</div>
              <div className="text-xl font-semibold">₹{stats.ytdDeductions.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 grid place-items-center">
              <Calendar className="size-5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last Payslip</div>
              <div className="text-xl font-semibold">{stats.lastPayslip}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-4 mb-6">
        <ScrollableTabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Card>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-4 pb-4">
          {/* Current Salary Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="size-12">
                <AvatarFallback className="bg-violet-500 text-white text-lg font-bold">
                  RK
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Mr. Rajesh Kumar</div>
                <div className="text-xs text-muted-foreground">
                  {info.grade} · {info.payBand}
                </div>
              </div>
              <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 border-0">
                Active
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="text-xs text-muted-foreground mb-1">Gross Salary</div>
                <div className="text-lg font-bold text-emerald-600">
                  ₹{info.grossEarnings.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="text-xs text-muted-foreground mb-1">Total Deductions</div>
                <div className="text-lg font-bold text-red-600">
                  ₹{info.totalDeductions.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl bg-violet-500/5 p-4 border border-violet-200/50 dark:border-violet-900/40">
                <div className="text-xs text-muted-foreground mb-1">Net Pay</div>
                <div className="text-lg font-bold text-violet-600">
                  ₹{info.netPay.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="text-xs text-muted-foreground mb-1">Next Increment</div>
                <div className="text-lg font-semibold">{info.incrementDate}</div>
              </div>
            </div>
          </Card>

          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Bank Account</span>
                  <span className="font-medium">{info.bankAccount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">PAN</span>
                  <span className="font-medium">{info.pan}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Pay Band</span>
                  <span className="font-medium">{info.payBand}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Grade</span>
                  <span className="font-medium">{info.grade}</span>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Earnings Summary</h3>
              <div className="space-y-2">
                {EARNINGS.map((e) => (
                  <div key={e.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{e.label}</span>
                    <span className="font-medium text-emerald-600">
                      +₹{e.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border/60 pt-2 flex justify-between text-xs font-semibold">
                  <span>Total Earnings</span>
                  <span className="text-emerald-600">
                    ₹{info.grossEarnings.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Payslips Tab */}
      {activeTab === "payslips" && (
        <div className="space-y-3 pb-4">
          {PAYSLOPS.map((payslip) => (
            <button
              key={payslip.id}
              onClick={() =>
                setSelectedPayslipId(
                  payslip.id === selectedPayslipId ? null : payslip.id
                )
              }
              className={cn(
                "w-full rounded-2xl border p-5 text-left transition-all",
                selectedPayslip?.id === payslip.id
                  ? "border-violet-500 bg-violet-500/5 shadow-sm ring-1 ring-violet-500/20"
                  : "border-border/60 hover:border-border hover:bg-muted/20"
              )}
            >
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarFallback className={cn(
                    "text-white text-sm font-semibold",
                    payslip.status === "paid"
                      ? "bg-emerald-500"
                      : payslip.status === "processing"
                      ? "bg-amber-500"
                      : "bg-sky-500"
                  )}>
                    {payslip.month.slice(0, 3)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">
                      {payslip.month} {payslip.year}
                    </h3>
                    <Badge
                      className={cn(
                        "border-0 text-[10px]",
                        payslip.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : payslip.status === "processing"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-sky-500/10 text-sky-600"
                      )}
                    >
                      {payslip.status === "paid"
                        ? `Paid ${payslip.paidOn ? new Date(payslip.paidOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}`
                        : payslip.status === "processing"
                        ? "Processing"
                        : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      Gross: <span className="font-medium text-foreground">₹{payslip.grossSalary.toLocaleString("en-IN")}</span>
                    </span>
                    <span>
                      Deductions: <span className="font-medium text-red-600">-₹{payslip.deductions.toLocaleString("en-IN")}</span>
                    </span>
                    <span>
                      Net: <span className="font-semibold text-emerald-600">₹{payslip.netSalary.toLocaleString("en-IN")}</span>
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0" />
              </div>

              {/* Expanded */}
              {selectedPayslip?.id === payslip.id && (
                <div className="mt-4 border-t border-border/60 pt-4 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {EARNINGS.map((e) => (
                      <div key={e.label} className="rounded-xl bg-muted/30 p-3">
                        <div className="text-[10px] text-muted-foreground">{e.label}</div>
                        <div className="text-sm font-semibold text-emerald-600">
                          +₹{e.amount.toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DEDUCTIONS.map((d) => (
                      <div key={d.label} className="rounded-xl bg-muted/30 p-3">
                        <div className="text-[10px] text-muted-foreground">{d.label}</div>
                        <div className="text-sm font-semibold text-red-600">
                          -₹{d.amount.toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success("Payslip downloaded (demo)");
                      }}
                    >
                      <Download className="size-3 mr-1" />
                      Download PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success("Payslip emailed (demo)");
                      }}
                    >
                      <Eye className="size-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Breakdown Tab */}
      {activeTab === "breakdown" && (
        <div className="space-y-4 pb-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Salary Breakdown — June 2026</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-lg bg-emerald-500/10 grid place-items-center">
                    <TrendingUp className="size-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-semibold">Earnings</span>
                </div>
                <div className="space-y-2">
                  {EARNINGS.map((e) => (
                    <div key={e.label} className="flex items-center justify-between rounded-xl bg-emerald-500/5 px-4 py-3">
                      <span className="text-xs text-muted-foreground">{e.label}</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        +₹{e.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3 border border-emerald-200/50 dark:border-emerald-900/40">
                    <span className="text-xs font-semibold">Total Earnings</span>
                    <span className="text-sm font-bold text-emerald-600">
                      ₹{info.grossEarnings.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-lg bg-red-500/10 grid place-items-center">
                    <TrendingDown className="size-4 text-red-500" />
                  </div>
                  <span className="text-sm font-semibold">Deductions</span>
                </div>
                <div className="space-y-2">
                  {DEDUCTIONS.map((d) => (
                    <div key={d.label} className="flex items-center justify-between rounded-xl bg-red-500/5 px-4 py-3">
                      <span className="text-xs text-muted-foreground">{d.label}</span>
                      <span className="text-sm font-semibold text-red-600">
                        -₹{d.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-xl bg-red-500/10 px-4 py-3 border border-red-200/50 dark:border-red-900/40">
                    <span className="text-xs font-semibold">Total Deductions</span>
                    <span className="text-sm font-bold text-red-600">
                      ₹{info.totalDeductions.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="mt-6 rounded-2xl bg-violet-500/5 border border-violet-200/50 dark:border-violet-900/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Net Pay (Take Home)</div>
                  <div className="text-2xl font-bold text-violet-600">
                    ₹{info.netPay.toLocaleString("en-IN")}
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-brand-gradient text-white border-0"
                  onClick={() => toast.success("Payslip downloaded (demo)")}
                >
                  <Download className="size-4 mr-1" />
                  Download Payslip
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
