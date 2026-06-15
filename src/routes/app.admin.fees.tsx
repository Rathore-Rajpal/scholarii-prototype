import { createFileRoute } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { CalendarDays, Download, FileDown, Search, Upload, X } from "lucide-react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin/fees")({
  component: AdminFeesPage,
});

type PaymentMode = "Cash" | "UPI" | "Cheque" | "NEFT" | "DD";
type ReceiptDraft = {
  student: string;
  admissionNo: string;
  klass: string;
  feeType: string;
  month: string;
  amount: string;
  mode: PaymentMode;
  reference: string;
  date: string;
  remarks: string;
};

const todayTransactions = [
  ["Aarav Sharma", "1-A", "Tuition Fee", "Rs 4,500", "Cash", "9:10 AM", "R-2026-001"],
  ["Priya Mehta", "2-B", "Tuition Fee", "Rs 3,200", "UPI", "9:45 AM", "R-2026-002"],
  ["Kabir Joshi", "3-A", "Exam Fee", "Rs 800", "Cash", "10:15 AM", "R-2026-003"],
  ["Sneha Rao", "1-B", "Tuition Fee", "Rs 3,500", "Cheque", "11:00 AM", "R-2026-004"],
  ["Aryan Khan", "4-A", "Transport Fee", "Rs 1,200", "UPI", "11:30 AM", "R-2026-005"],
  ["Meera Nair", "5-B", "Tuition Fee", "Rs 4,500", "Cash", "12:00 PM", "R-2026-006"],
  ["Dev Sharma", "1-A", "Library Fee", "Rs 300", "UPI", "1:15 PM", "R-2026-007"],
  ["Kavya Iyer", "2-A", "Sports Fee", "Rs 500", "Cash", "2:00 PM", "R-2026-008"],
];

const pendingSeed = [
  ["Aarav Sharma", "1-A", "Tuition", "Rs 12,000", "2026-04-01", "75 days"],
  ["Rohan Patel", "3-B", "Tuition", "Rs 8,500", "2026-04-15", "60 days"],
  ["Kavya Joshi", "4-C", "Tuition+Exam", "Rs 14,000", "2026-05-01", "44 days"],
  ["Meera Pillai", "2-A", "Tuition", "Rs 6,000", "2026-05-01", "44 days"],
  ["Sanvi Kapoor", "5-B", "Tuition", "Rs 9,500", "2026-05-15", "30 days"],
  ["Ishaan Singh", "2-B", "Transport", "Rs 7,200", "2026-05-20", "25 days"],
  ["Diya Sharma", "1-B", "Tuition", "Rs 5,500", "2026-05-25", "20 days"],
  ["Arjun Verma", "3-A", "Tuition", "Rs 11,000", "2026-04-01", "75 days"],
  ["Tina Mehta", "5-A", "Tuition", "Rs 8,000", "2026-05-10", "35 days"],
  ["Riya Desai", "1-A", "Exam+Sports", "Rs 2,800", "2026-06-01", "14 days"],
];

const pendingFees = Array.from({ length: 38 }, (_, index) => {
  if (index < pendingSeed.length) return pendingSeed[index];
  const names = ["Nikhil Rao", "Anaya Gupta", "Vivaan Shah", "Myra Nair", "Dev Patel", "Sara Khan"];
  const grade = (index % 5) + 1;
  const amount = 2400 + (index % 7) * 850;
  const days = 6 + (index % 34);
  return [
    names[index % names.length],
    `${grade}-${String.fromCharCode(65 + (index % 3))}`,
    index % 3 === 0 ? "Tuition" : index % 3 === 1 ? "Transport" : "Exam",
    `Rs ${amount.toLocaleString("en-IN")}`,
    `2026-05-${String(1 + (index % 28)).padStart(2, "0")}`,
    `${days} days`,
  ];
});

const feeStructure = Array.from({ length: 10 }, (_, index) => {
  const grade = index + 1;
  const tuition = 3000 + index * 200;
  const exam = grade <= 5 ? 800 : 1000;
  const transport = 1200 + Math.floor(index / 3) * 200;
  const library = 300;
  const sports = grade <= 5 ? 500 : 700;
  const annual = tuition * 12 + exam * 2 + transport * 12 + library + sports;
  return {
    grade: `Grade ${grade}`,
    tuition: `Rs ${tuition.toLocaleString("en-IN")}/mo`,
    exam: `Rs ${exam}/term`,
    transport: `Rs ${transport.toLocaleString("en-IN")}/mo`,
    library: `Rs ${library}/term`,
    sports: `Rs ${sports}/term`,
    annual: `Rs ${annual.toLocaleString("en-IN")}`,
  };
});

const olderReceipts = Array.from({ length: 12 }, (_, index) => [
  `R-2026-${String(index + 9).padStart(3, "0")}`,
  ["Rohan Patel", "Kavya Joshi", "Meera Pillai", "Sanvi Kapoor"][index % 4],
  `${(index % 5) + 1}-${String.fromCharCode(65 + (index % 3))}`,
  `Rs ${(1800 + index * 300).toLocaleString("en-IN")}`,
  index % 2 === 0 ? "Tuition" : "Transport",
  index % 3 === 0 ? "Cash" : "UPI",
  `2026-06-${String(14 - (index % 8)).padStart(2, "0")}`,
  "Issued",
]);

const allReceipts = [
  ...todayTransactions.map(([student, klass, type, amount, mode, , receipt]) => [
    receipt,
    student,
    klass,
    amount,
    type.replace(" Fee", ""),
    mode,
    "2026-06-15",
    "Issued",
  ]),
  ...olderReceipts,
];

const gradePending = [
  { grade: "Grade 1", amount: 42000 },
  { grade: "Grade 2", amount: 36000 },
  { grade: "Grade 3", amount: 31000 },
  { grade: "Grade 4", amount: 39000 },
  { grade: "Grade 5", amount: 34000 },
];

const initialDraft: ReceiptDraft = {
  student: "",
  admissionNo: "",
  klass: "",
  feeType: "",
  month: "June",
  amount: "",
  mode: "Cash",
  reference: "",
  date: "2026-06-15",
  remarks: "",
};

function AdminFeesPage() {
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<ReceiptDraft | null>(null);
  const [transactionRange, setTransactionRange] = useState("Today");
  const [pendingPage, setPendingPage] = useState(1);
  const [receiptPage, setReceiptPage] = useState(1);
  const [receiptQuery, setReceiptQuery] = useState("");
  const [dateRange, setDateRange] = useState("");

  const filteredReceipts = useMemo(() => {
    const term = receiptQuery.trim().toLowerCase();
    return allReceipts.filter((receipt) => {
      if (term && !`${receipt[0]} ${receipt[1]}`.toLowerCase().includes(term)) return false;
      if (dateRange && receipt[6] !== dateRange) return false;
      return true;
    });
  }, [dateRange, receiptQuery]);

  const pendingRows = pendingFees.slice((pendingPage - 1) * 10, pendingPage * 10);
  const pendingPages = Math.ceil(pendingFees.length / 10);
  const receiptRows = filteredReceipts.slice((receiptPage - 1) * 10, receiptPage * 10);
  const receiptPages = Math.max(1, Math.ceil(filteredReceipts.length / 10));

  const submitCollection = (draft: ReceiptDraft) => {
    setReceiptPreview(draft);
    setCollectModalOpen(false);
    toast.success("Receipt generated");
  };

  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader
        title="Fee Collection & Management"
        subtitle="Collect fees, generate receipts, track dues, and manage payments"
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-violet-600 text-white hover:bg-violet-700"
              onClick={() => setCollectModalOpen(true)}
            >
              💰 Collect Fee
            </Button>
            <Button variant="ghost" onClick={() => toast.info("Fee report opened")}>
              📊 Fee Report
            </Button>
            <Button variant="ghost" onClick={() => toast.info("Import dues selected")}>
              📥 Import Dues
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <KpiTile
          label="Total Collected (Month)"
          value="Rs 4,82,000"
          hint="June 2026"
          tone="green"
        />
        <KpiTile label="Collected Today" value="Rs 24,500" hint="8 receipts" tone="green" />
        <KpiTile label="Total Pending" value="Rs 1,82,000" hint="38 students" tone="amber" />
        <KpiTile label="Overdue (30+ days)" value="Rs 86,000" hint="12 students" tone="red" />
        <KpiTile label="Fee Waivers" value="Rs 15,000" hint="4 approved by principal" tone="blue" />
        <KpiTile label="Receipts Today" value="8" hint="All generated" tone="gray" />
      </div>

      <Card className="mt-6 overflow-hidden border-gray-100 bg-white shadow-sm">
        <Tabs defaultValue="collect">
          <div className="border-b border-gray-100 px-5 pt-5">
            <TabsList className="h-auto flex-wrap rounded-none bg-transparent p-0">
              <FeeTab value="collect">💳 Collect & Transactions</FeeTab>
              <FeeTab value="pending">⚠️ Pending & Overdue</FeeTab>
              <FeeTab value="structure">📊 Fee Structure</FeeTab>
              <FeeTab value="receipts">🖨️ Receipts</FeeTab>
            </TabsList>
          </div>

          <TabsContent value="collect" className="m-0 p-5">
            <div className="grid gap-5 xl:grid-cols-[65fr_35fr]">
              <SectionCard>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <SectionHeading title="Today's Transactions" />
                  <div className="flex rounded-lg border border-gray-200 p-1">
                    {["Today", "This Week", "This Month"].map((item) => (
                      <Button
                        key={item}
                        size="sm"
                        variant={transactionRange === item ? "secondary" : "ghost"}
                        onClick={() => setTransactionRange(item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
                <TransactionsTable rows={todayTransactions} />
              </SectionCard>

              <SectionCard>
                <SectionHeading title="Collect Fee" />
                <FeeForm compact onSubmit={submitCollection} />
              </SectionCard>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="m-0 p-5">
            <div className="grid gap-5 xl:grid-cols-[60fr_40fr]">
              <SectionCard>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <SectionHeading title="All Pending Fees" />
                  <Button
                    className="bg-violet-600 text-white hover:bg-violet-700"
                    onClick={() => toast.success("Reminder sent to all pending parents")}
                  >
                    Bulk Remind All
                  </Button>
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Since</TableHead>
                        <TableHead>Days Overdue</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRows.map((row, index) => (
                        <TableRow key={`${row[0]}-${index}`}>
                          {row.map((cell) => (
                            <TableCell key={`${row[0]}-${cell}`}>{cell}</TableCell>
                          ))}
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-violet-600"
                              onClick={() => toast.success("Reminder sent to parent")}
                            >
                              Remind
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Pager page={pendingPage} pages={pendingPages} setPage={setPendingPage} />
              </SectionCard>

              <SectionCard>
                <SectionHeading title="Overdue Summary" />
                <div className="mt-4 space-y-3">
                  <SummaryRow label="Total overdue" value="Rs 1,82,000" />
                  <SummaryRow label="30+ days" value="Rs 86,000 (12 students)" tone="red" />
                  <SummaryRow label="15-30 days" value="Rs 54,000 (14 students)" tone="amber" />
                  <SummaryRow label="0-15 days" value="Rs 42,000 (12 students)" tone="yellow" />
                </div>
                <div className="mt-6 h-72 rounded-xl border border-gray-100 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradePending}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </div>
          </TabsContent>

          <TabsContent value="structure" className="m-0 p-5">
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Fee structure changes require Principal approval. Contact Dr. Asha to modify any
              amounts.
            </div>
            <SectionCard>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      {[
                        "Grade",
                        "Tuition",
                        "Exam",
                        "Transport",
                        "Library",
                        "Sports",
                        "Total Annual",
                      ].map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStructure.map((row) => (
                      <TableRow key={row.grade}>
                        <TableCell className="font-medium">{row.grade}</TableCell>
                        <TableCell>{row.tuition}</TableCell>
                        <TableCell>{row.exam}</TableCell>
                        <TableCell>{row.transport}</TableCell>
                        <TableCell>{row.library}</TableCell>
                        <TableCell>{row.sports}</TableCell>
                        <TableCell className="font-semibold">{row.annual}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="receipts" className="m-0 p-5">
            <SectionCard>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative min-w-64 flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={receiptQuery}
                    onChange={(event) => {
                      setReceiptQuery(event.target.value);
                      setReceiptPage(1);
                    }}
                    placeholder="Search by receipt no or student name"
                    className="pl-9"
                  />
                </div>
                <div className="relative w-48">
                  <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="date"
                    value={dateRange}
                    onChange={(event) => {
                      setDateRange(event.target.value);
                      setReceiptPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReceiptQuery("");
                    setDateRange("");
                    setReceiptPage(1);
                  }}
                >
                  Clear
                </Button>
              </div>
              <ReceiptsTable rows={receiptRows} />
              <Pager page={receiptPage} pages={receiptPages} setPage={setReceiptPage} />
            </SectionCard>
          </TabsContent>
        </Tabs>
      </Card>

      {collectModalOpen && (
        <CollectFeeModal onClose={() => setCollectModalOpen(false)} onSubmit={submitCollection} />
      )}
      {receiptPreview && (
        <ReceiptPreviewModal draft={receiptPreview} onClose={() => setReceiptPreview(null)} />
      )}
    </div>
  );
}

function KpiTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "green" | "amber" | "red" | "blue" | "gray";
}) {
  const dots = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    gray: "bg-gray-400",
  };
  return (
    <Card className="border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{hint}</p>
        </div>
        <span className={cn("mt-1 size-2.5 rounded-full", dots[tone])} />
      </div>
    </Card>
  );
}

function FeeTab({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-b-2 border-transparent px-4 py-3 shadow-none data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-violet-600 data-[state=active]:shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}

function SectionCard({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      {children}
    </section>
  );
}

function SectionHeading({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold text-gray-900">{title}</h2>;
}

function TransactionsTable({ rows }: { rows: string[][] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {["Student", "Class", "Fee Type", "Amount", "Mode", "Time", "Receipt", "Action"].map(
              (header) => (
                <TableHead key={header} className={header === "Action" ? "text-right" : ""}>
                  {header}
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[6]}>
              {row.map((cell) => (
                <TableCell key={`${row[6]}-${cell}`}>{cell}</TableCell>
              ))}
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-violet-600"
                  onClick={() => toast.success("Receipt sent to printer")}
                >
                  Reprint
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function FeeForm({
  onSubmit,
  compact = false,
}: {
  onSubmit: (draft: ReceiptDraft) => void;
  compact?: boolean;
}) {
  const [draft, setDraft] = useState<ReceiptDraft>(initialDraft);
  const setField = (key: keyof ReceiptDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(draft);
  };

  return (
    <form className={cn("mt-4 space-y-3", compact && "text-sm")} onSubmit={submit}>
      <Field label="Student Name *">
        <Input
          required
          value={draft.student}
          onChange={(event) => setField("student", event.target.value)}
        />
      </Field>
      <Field label="Admission No">
        <Input
          value={draft.admissionNo}
          onChange={(event) => setField("admissionNo", event.target.value)}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Class *">
          <Select value={draft.klass} onValueChange={(value) => setField("klass", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, index) => `Grade ${index + 1}`).map((klass) => (
                <SelectItem key={klass} value={klass}>
                  {klass}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Fee Type *">
          <Select
            value={draft.feeType}
            onValueChange={(value) => setField("feeType", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {["Tuition", "Exam", "Transport", "Library", "Sports", "Misc"].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Month *">
          <Select value={draft.month} onValueChange={(value) => setField("month", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
                "January",
                "February",
                "March",
              ].map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Amount Rs *">
          <Input
            required
            type="number"
            min={1}
            value={draft.amount}
            onChange={(event) => setField("amount", event.target.value)}
          />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Payment Mode *">
          <Select
            value={draft.mode}
            onValueChange={(value) => setField("mode", value as PaymentMode)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Cash", "UPI", "Cheque", "NEFT", "DD"].map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {draft.mode !== "Cash" && (
          <Field label="Reference No">
            <Input
              value={draft.reference}
              onChange={(event) => setField("reference", event.target.value)}
            />
          </Field>
        )}
      </div>
      <Field label="Date *">
        <Input
          required
          type="date"
          value={draft.date}
          onChange={(event) => setField("date", event.target.value)}
        />
      </Field>
      <Field label="Remarks">
        <textarea
          value={draft.remarks}
          onChange={(event) => setField("remarks", event.target.value)}
          className="min-h-20 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
        />
      </Field>
      <Button type="submit" className="w-full bg-violet-600 text-white hover:bg-violet-700">
        Generate Receipt
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({
  label,
  value,
  tone = "gray",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  const tones: Record<string, string> = {
    gray: "bg-gray-50 text-gray-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };
  return (
    <div className={cn("flex items-center justify-between rounded-xl p-3 text-sm", tones[tone])}>
      <span className="font-medium">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function ReceiptsTable({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {[
              "Receipt No",
              "Student",
              "Class",
              "Amount",
              "Type",
              "Mode",
              "Date",
              "Status",
              "Action",
            ].map((header) => (
              <TableHead key={header} className={header === "Action" ? "text-right" : ""}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[0]}>
              {row.map((cell) => (
                <TableCell key={`${row[0]}-${cell}`}>{cell}</TableCell>
              ))}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-violet-600"
                    onClick={() => toast.success("Receipt sent to printer")}
                  >
                    Reprint
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.success("PDF downloaded")}>
                    <FileDown className="mr-1.5 size-4" />
                    Download PDF
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Pager({
  page,
  pages,
  setPage,
}: {
  page: number;
  pages: number;
  setPage: (page: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-sm">
      <Button
        size="sm"
        variant="outline"
        disabled={page === 1}
        onClick={() => setPage(Math.max(1, page - 1))}
      >
        Previous
      </Button>
      <span className="min-w-16 text-center font-medium">
        {page}/{pages}
      </span>
      <Button
        size="sm"
        variant="outline"
        disabled={page === pages}
        onClick={() => setPage(Math.min(pages, page + 1))}
      >
        Next
      </Button>
    </div>
  );
}

function CollectFeeModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (draft: ReceiptDraft) => void;
}) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] grid place-items-center overflow-y-auto bg-black/60 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="my-6 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Collect Fee</h2>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>
        <FeeForm onSubmit={onSubmit} />
      </div>
    </div>,
    document.body,
  );
}

function ReceiptPreviewModal({ draft, onClose }: { draft: ReceiptDraft; onClose: () => void }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] grid place-items-center bg-black/60 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Receipt Preview</h2>
            <p className="text-sm text-gray-500">R-2026-009</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
          <Info label="Student" value={draft.student || "Student Name"} />
          <Info label="Class" value={draft.klass || "-"} />
          <Info label="Fee Type" value={draft.feeType || "-"} />
          <Info label="Month" value={draft.month} />
          <Info label="Amount" value={`Rs ${Number(draft.amount || 0).toLocaleString("en-IN")}`} />
          <Info label="Mode" value={draft.mode} />
          {draft.reference && <Info label="Reference" value={draft.reference} />}
          <Info label="Date" value={draft.date} />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            className="bg-violet-600 text-white hover:bg-violet-700"
            onClick={() => toast.success("Receipt sent to printer")}
          >
            <Download className="mr-2 size-4" />
            Print Receipt
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2 flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
