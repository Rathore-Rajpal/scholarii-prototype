export interface Payslip {
  id: string;
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: "paid" | "pending" | "processing";
  paidOn?: string;
}

export interface SalaryBreakdown {
  label: string;
  amount: number;
  type: "earning" | "deduction";
}

export const SALARY_INFO = {
  basicPay: 45000,
  hra: 18000,
  conveyance: 1600,
  medical: 1250,
  specialAllowance: 5000,
  pf: 5400,
  professionalTax: 200,
  tds: 4200,
  grossEarnings: 70850,
  totalDeductions: 9800,
  netPay: 61050,
  payBand: "Level 7",
  grade: "Senior Teacher",
  incrementDate: "01 Jul 2026",
  bankAccount: "HDFC ****4521",
  pan: "ABCPK1234M",
};

export const PAYSLOPS: Payslip[] = [
  { id: "ps1", month: "June", year: 2026, grossSalary: 70850, deductions: 9800, netSalary: 61050, status: "processing" },
  { id: "ps2", month: "May", year: 2026, grossSalary: 70850, deductions: 9800, netSalary: 61050, status: "paid", paidOn: "2026-05-31" },
  { id: "ps3", month: "April", year: 2026, grossSalary: 70850, deductions: 9800, netSalary: 61050, status: "paid", paidOn: "2026-04-30" },
  { id: "ps4", month: "March", year: 2026, grossSalary: 70850, deductions: 9800, netSalary: 61050, status: "paid", paidOn: "2026-03-31" },
  { id: "ps5", month: "February", year: 2026, grossSalary: 70850, deductions: 9800, netSalary: 61050, status: "paid", paidOn: "2026-02-28" },
  { id: "ps6", month: "January", year: 2026, grossSalary: 70850, deductions: 9800, netSalary: 61050, status: "paid", paidOn: "2026-01-31" },
];

export const EARNINGS: SalaryBreakdown[] = [
  { label: "Basic Pay", amount: 45000, type: "earning" },
  { label: "House Rent Allowance", amount: 18000, type: "earning" },
  { label: "Conveyance Allowance", amount: 1600, type: "earning" },
  { label: "Medical Allowance", amount: 1250, type: "earning" },
  { label: "Special Allowance", amount: 5000, type: "earning" },
];

export const DEDUCTIONS: SalaryBreakdown[] = [
  { label: "Provident Fund", amount: 5400, type: "deduction" },
  { label: "Professional Tax", amount: 200, type: "deduction" },
  { label: "TDS", amount: 4200, type: "deduction" },
];

export const SALARY_STATS = {
  currentMonth: "June 2026",
  netPay: 61050,
  ytdEarnings: 425100,
  ytdDeductions: 58800,
  lastPayslip: "31 May 2026",
};
