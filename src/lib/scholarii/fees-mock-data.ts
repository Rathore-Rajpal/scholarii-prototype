// ============================================================
// FEES MOCK DATA
// Used by Parent Fees page
// ============================================================

export interface FeeBreakdown {
  category: string;
  amount: number;
  icon: string;
}

export interface PaymentRecord {
  id: string;
  installment: string;
  amount: number;
  paidDate: string;
  paymentMethod: string;
  status: "paid" | "pending" | "overdue";
  receiptId: string;
}

export interface UpcomingPayment {
  id: string;
  installment: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  priority: "high" | "medium" | "low";
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  month: string;
  amount: number;
  date: string;
  paymentMethod: string;
}

// Summary
export const ANNUAL_FEES = 120000;
export const PAID_AMOUNT = 90000;
export const PENDING_AMOUNT = 30000;
export const NEXT_DUE_DATE = "30 June 2026";
export const NEXT_DUE_DAYS = 15;
export const PAID_PERCENTAGE = 75;
export const PENDING_PERCENTAGE = 25;

// Fee Breakdown
export const feeBreakdown: FeeBreakdown[] = [
  { category: "Tuition Fee", amount: 60000, icon: "book" },
  { category: "Transport Fee", amount: 18000, icon: "bus" },
  { category: "Activity Fee", amount: 12000, icon: "palette" },
  { category: "Examination Fee", amount: 15000, icon: "file" },
  { category: "Technology Fee", amount: 15000, icon: "monitor" },
];

// Payment History
export const paymentHistory: PaymentRecord[] = [
  {
    id: "PAY001",
    installment: "Installment 1",
    amount: 30000,
    paidDate: "15 April 2026",
    paymentMethod: "UPI",
    status: "paid",
    receiptId: "RCP-2026-001",
  },
  {
    id: "PAY002",
    installment: "Installment 2",
    amount: 30000,
    paidDate: "15 May 2026",
    paymentMethod: "Card",
    status: "paid",
    receiptId: "RCP-2026-002",
  },
  {
    id: "PAY003",
    installment: "Installment 3",
    amount: 30000,
    paidDate: "15 June 2026",
    paymentMethod: "Bank Transfer",
    status: "paid",
    receiptId: "RCP-2026-003",
  },
];

// Upcoming Payments
export const upcomingPayments: UpcomingPayment[] = [
  {
    id: "UP001",
    installment: "Installment 4",
    amount: 30000,
    dueDate: "30 June 2026",
    daysRemaining: 15,
    priority: "high",
  },
];

// Receipts
export const receipts: Receipt[] = [
  {
    id: "REC001",
    receiptNumber: "RCP-2026-001",
    month: "April 2026",
    amount: 30000,
    date: "15 April 2026",
    paymentMethod: "UPI",
  },
  {
    id: "REC002",
    receiptNumber: "RCP-2026-002",
    month: "May 2026",
    amount: 30000,
    date: "15 May 2026",
    paymentMethod: "Card",
  },
  {
    id: "REC003",
    receiptNumber: "RCP-2026-003",
    month: "June 2026",
    amount: 30000,
    date: "15 June 2026",
    paymentMethod: "Bank Transfer",
  },
];

// AI Insights
export const feeInsights = [
  { id: "INS001", type: "positive", text: "Your fee payments are up to date." },
  { id: "INS002", type: "warning", text: "One installment is due in 15 days." },
  { id: "INS003", type: "positive", text: "No overdue payments detected." },
];

// Helper function
export function getParentFeesData() {
  return {
    annualFees: ANNUAL_FEES,
    paidAmount: PAID_AMOUNT,
    pendingAmount: PENDING_AMOUNT,
    nextDueDate: NEXT_DUE_DATE,
    nextDueDays: NEXT_DUE_DAYS,
    paidPercentage: PAID_PERCENTAGE,
    pendingPercentage: PENDING_PERCENTAGE,
    feeBreakdown,
    paymentHistory,
    upcomingPayments,
    receipts,
    feeInsights,
  };
}

export type ParentFeesData = ReturnType<typeof getParentFeesData>;
