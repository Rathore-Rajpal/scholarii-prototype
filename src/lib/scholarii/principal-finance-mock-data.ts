export interface FeeDefaulter {
  id: string;
  studentName: string;
  class: string;
  parentName: string;
  amountDue: number;
  dueDate: string;
  daysOverdue: number;
  riskLevel: "high" | "medium" | "low";
}

export interface IncomeSource {
  id: string;
  category: string;
  amount: number;
  contribution: number;
  monthlyTrend: number;
  icon: string;
}

export interface ExpenseCategory {
  id: string;
  category: string;
  budget: number;
  actualSpend: number;
  variance: number;
  icon: string;
}

export interface StaffSalary {
  id: string;
  name: string;
  department: string;
  role: string;
  salary: number;
  status: "paid" | "pending" | "processing";
  staffType: "teaching" | "non-teaching";
}

export interface AIInsight {
  id: string;
  text: string;
  type: "warning" | "success" | "info" | "danger";
  icon: string;
}

export interface RecommendedAction {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  expenses: number;
}

export interface CollectionTrend {
  month: string;
  collected: number;
  expected: number;
}

export interface DefaulterClass {
  className: string;
  amount: number;
}

export const FEE_DEFAULTERS: FeeDefaulter[] = [
  { id: "d1", studentName: "Aarav Sharma", class: "9A", parentName: "Rajesh Sharma", amountDue: 45000, dueDate: "2026-04-01", daysOverdue: 80, riskLevel: "high" },
  { id: "d2", studentName: "Priya Patel", class: "9A", parentName: "Suresh Patel", amountDue: 38000, dueDate: "2026-04-15", daysOverdue: 66, riskLevel: "high" },
  { id: "d3", studentName: "Rohan Gupta", class: "8B", parentName: "Anil Gupta", amountDue: 32000, dueDate: "2026-05-01", daysOverdue: 50, riskLevel: "high" },
  { id: "d4", studentName: "Sneha Deshmukh", class: "10A", parentName: "Vikram Deshmukh", amountDue: 28000, dueDate: "2026-05-10", daysOverdue: 41, riskLevel: "medium" },
  { id: "d5", studentName: "Karan Singh", class: "7B", parentName: "Mohit Singh", amountDue: 25000, dueDate: "2026-05-15", daysOverdue: 36, riskLevel: "medium" },
  { id: "d6", studentName: "Ananya Joshi", class: "8A", parentName: "Prakash Joshi", amountDue: 22000, dueDate: "2026-05-20", daysOverdue: 31, riskLevel: "medium" },
  { id: "d7", studentName: "Vivek Kumar", class: "9B", parentName: "Sanjay Kumar", amountDue: 18000, dueDate: "2026-06-01", daysOverdue: 19, riskLevel: "low" },
  { id: "d8", studentName: "Meera Reddy", class: "7A", parentName: "Ramesh Reddy", amountDue: 15000, dueDate: "2026-06-05", daysOverdue: 15, riskLevel: "low" },
  { id: "d9", studentName: "Arjun Mehta", class: "10B", parentName: "Deepak Mehta", amountDue: 12000, dueDate: "2026-06-10", daysOverdue: 10, riskLevel: "low" },
  { id: "d10", studentName: "Nisha Verma", class: "6A", parentName: "Ashok Verma", amountDue: 8000, dueDate: "2026-06-15", daysOverdue: 5, riskLevel: "low" },
];

export const INCOME_SOURCES: IncomeSource[] = [
  { id: "inc1", category: "Tuition Fees", amount: 1850000, contribution: 62, monthlyTrend: 5, icon: "book" },
  { id: "inc2", category: "Admission Fees", amount: 280000, contribution: 9, monthlyTrend: -2, icon: "file" },
  { id: "inc3", category: "Transport Fees", amount: 320000, contribution: 11, monthlyTrend: 3, icon: "bus" },
  { id: "inc4", category: "Hostel Fees", amount: 180000, contribution: 6, monthlyTrend: 0, icon: "building" },
  { id: "inc5", category: "Activity Fees", amount: 150000, contribution: 5, monthlyTrend: 8, icon: "palette" },
  { id: "inc6", category: "Examination Fees", amount: 120000, contribution: 4, monthlyTrend: 12, icon: "file-text" },
  { id: "inc7", category: "Miscellaneous", amount: 100000, contribution: 3, monthlyTrend: -1, icon: "wallet" },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: "exp1", category: "Infrastructure", budget: 500000, actualSpend: 520000, variance: 4, icon: "building" },
  { id: "exp2", category: "Utilities", budget: 180000, actualSpend: 165000, variance: -8, icon: "zap" },
  { id: "exp3", category: "Events", budget: 150000, actualSpend: 140000, variance: -7, icon: "calendar" },
  { id: "exp4", category: "Maintenance", budget: 120000, actualSpend: 135000, variance: 12, icon: "wrench" },
  { id: "exp5", category: "Transportation", budget: 200000, actualSpend: 190000, variance: -5, icon: "bus" },
  { id: "exp6", category: "Technology", budget: 100000, actualSpend: 95000, variance: -5, icon: "monitor" },
  { id: "exp7", category: "Learning Resources", budget: 80000, actualSpend: 72000, variance: -10, icon: "book" },
  { id: "exp8", category: "Miscellaneous", budget: 70000, actualSpend: 83000, variance: 18, icon: "more-horizontal" },
];

export const STAFF_SALARIES: StaffSalary[] = [
  { id: "s1", name: "Mrs. Kavita Sharma", department: "Mathematics", role: "Senior Teacher", salary: 55000, status: "paid", staffType: "teaching" },
  { id: "s2", name: "Mr. Rajesh Kumar", department: "Science", role: "HOD", salary: 62000, status: "paid", staffType: "teaching" },
  { id: "s3", name: "Mrs. Priya Verma", department: "English", role: "Teacher", salary: 48000, status: "paid", staffType: "teaching" },
  { id: "s4", name: "Mr. Amit Deshmukh", department: "Hindi", role: "Teacher", salary: 45000, status: "pending", staffType: "teaching" },
  { id: "s5", name: "Mrs. Sunita Patil", department: "Social Studies", role: "Teacher", salary: 46000, status: "processing", staffType: "teaching" },
  { id: "s6", name: "Mr. Sunil Jadhav", department: "Administration", role: "Office Manager", salary: 38000, status: "paid", staffType: "non-teaching" },
  { id: "s7", name: "Mrs. Rekha More", department: "Accounts", role: "Accountant", salary: 35000, status: "paid", staffType: "non-teaching" },
  { id: "s8", name: "Mr. Ganesh Koli", department: "Transport", role: "Driver", salary: 22000, status: "pending", staffType: "non-teaching" },
  { id: "s9", name: "Mrs. Lata Bhosale", department: "Library", role: "Librarian", salary: 28000, status: "processing", staffType: "non-teaching" },
  { id: "s10", name: "Mr. Prakash Sawant", department: "Maintenance", role: "Supervisor", salary: 25000, status: "paid", staffType: "non-teaching" },
];

export const MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: "Jan", revenue: 2800000, expenses: 1950000 },
  { month: "Feb", revenue: 2900000, expenses: 2000000 },
  { month: "Mar", revenue: 2750000, expenses: 2100000 },
  { month: "Apr", revenue: 3000000, expenses: 1900000 },
  { month: "May", revenue: 3100000, expenses: 2050000 },
  { month: "Jun", revenue: 2950000, expenses: 2000000 },
];

export const COLLECTION_TRENDS: CollectionTrend[] = [
  { month: "Jan", collected: 2600000, expected: 2800000 },
  { month: "Feb", collected: 2750000, expected: 2900000 },
  { month: "Mar", collected: 2500000, expected: 2750000 },
  { month: "Apr", collected: 2850000, expected: 3000000 },
  { month: "May", collected: 2900000, expected: 3100000 },
  { month: "Jun", collected: 2700000, expected: 2950000 },
];

export const DEFAULTER_CLASSES: DefaulterClass[] = [
  { className: "9A", amount: 83000 },
  { className: "8B", amount: 52000 },
  { className: "10A", amount: 40000 },
  { className: "7B", amount: 25000 },
  { className: "8A", amount: 22000 },
];

export const FINANCE_AI_INSIGHTS: AIInsight[] = [
  { id: "fi1", text: "Fee collection has declined by 8% compared to last month. Immediate follow-up needed with defaulters.", type: "warning", icon: "alert-triangle" },
  { id: "fi2", text: "Class 9 has the highest outstanding dues totaling ₹1.2L across 12 students.", type: "danger", icon: "trending-down" },
  { id: "fi3", text: "Salary expenses account for 48% of monthly spending — within healthy range.", type: "success", icon: "check-circle" },
  { id: "fi4", text: "Infrastructure costs have exceeded budget by 4%. Review pending approvals.", type: "warning", icon: "alert-triangle" },
  { id: "fi5", text: "Revenue is projected to increase 12% next quarter with new admissions.", type: "info", icon: "info" },
  { id: "fi6", text: "Transport fees collection rate improved by 5% after automated reminders.", type: "success", icon: "trending-up" },
];

export const RECOMMENDED_ACTIONS: RecommendedAction[] = [
  { id: "ra1", text: "Send reminder SMS to 10 high-risk fee defaulters with overdue payments.", priority: "high" },
  { id: "ra2", text: "Review infrastructure spending and approve pending maintenance requests.", priority: "high" },
  { id: "ra3", text: "Optimize transportation routes to reduce fuel costs by estimated 8%.", priority: "medium" },
  { id: "ra4", text: "Follow up on 3 pending salary approvals for non-teaching staff.", priority: "medium" },
  { id: "ra5", text: "Schedule fee collection drive for Class 9 and 8 defaulters.", priority: "high" },
  { id: "ra6", text: "Generate quarterly financial report for school management committee.", priority: "low" },
];

export const FINANCE_KPI = {
  totalRevenue: 2990000,
  totalExpenses: 1510000,
  netSurplus: 1480000,
  totalFeesCollected: 2600000,
  outstandingDues: 243000,
  totalSalaryExpense: 720000,
  collectionRate: 89,
  atRiskFeeAmount: 183000,
};

export const ALL_CLASSES = ["6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"];
export const ALL_MONTHS = ["January", "February", "March", "April", "May", "June"];
export const ALL_QUARTERS = ["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"];
export const ALL_DEPARTMENTS = ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Administration", "Accounts", "Transport", "Library", "Maintenance"];
