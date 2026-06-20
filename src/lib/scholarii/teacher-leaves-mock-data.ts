export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  pending: number;
}

export interface LeaveRequest {
  id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "approved" | "pending" | "rejected";
  appliedOn: string;
  approvedBy?: string;
  substitute?: string;
}

export interface StudentLeaveRequest {
  id: string;
  studentName: string;
  studentId: string;
  className: string;
  roll: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  parentName: string;
  parentContact: string;
  status: "approved" | "pending" | "rejected";
  appliedOn: string;
  approvedBy?: string;
  remarks?: string;
}

export const LEAVE_BALANCES: LeaveBalance[] = [
  { type: "Casual Leave", total: 12, used: 4, pending: 1 },
  { type: "Sick Leave", total: 8, used: 2, pending: 0 },
  { type: "Earned Leave", total: 15, used: 5, pending: 0 },
  { type: "Maternity Leave", total: 180, used: 0, pending: 0 },
];

export const LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "lr1",
    leaveType: "Casual Leave",
    fromDate: "2026-06-25",
    toDate: "2026-06-25",
    days: 1,
    reason: "Family function",
    status: "approved",
    appliedOn: "2026-06-18",
    approvedBy: "Principal Mehta",
    substitute: "Mr. Verma",
  },
  {
    id: "lr2",
    leaveType: "Sick Leave",
    fromDate: "2026-06-10",
    toDate: "2026-06-11",
    days: 2,
    reason: "Fever and cold",
    status: "approved",
    appliedOn: "2026-06-10",
    approvedBy: "Principal Mehta",
    substitute: "Mrs. Sharma",
  },
  {
    id: "lr3",
    leaveType: "Casual Leave",
    fromDate: "2026-07-03",
    toDate: "2026-07-03",
    days: 1,
    reason: "Personal work",
    status: "pending",
    appliedOn: "2026-06-20",
  },
  {
    id: "lr4",
    leaveType: "Earned Leave",
    fromDate: "2026-05-05",
    toDate: "2026-05-07",
    days: 3,
    reason: "Family emergency",
    status: "approved",
    appliedOn: "2026-05-04",
    approvedBy: "Principal Mehta",
    substitute: "Mr. Patel",
  },
  {
    id: "lr5",
    leaveType: "Casual Leave",
    fromDate: "2026-04-15",
    toDate: "2026-04-15",
    days: 1,
    reason: "Personal appointment",
    status: "rejected",
    appliedOn: "2026-04-12",
  },
];

export const STUDENT_LEAVE_REQUESTS: StudentLeaveRequest[] = [
  {
    id: "slr1",
    studentName: "Aarav Sharma",
    studentId: "s1",
    className: "8-A",
    roll: 1,
    leaveType: "Medical Leave",
    fromDate: "2026-06-20",
    toDate: "2026-06-21",
    days: 2,
    reason: "Fever and doctor appointment",
    parentName: "Mr. Sharma",
    parentContact: "+91 98765 43210",
    status: "pending",
    appliedOn: "2026-06-20",
  },
  {
    id: "slr2",
    studentName: "Priya Patel",
    studentId: "s4",
    className: "8-A",
    roll: 4,
    leaveType: "Personal Leave",
    fromDate: "2026-06-25",
    toDate: "2026-06-25",
    days: 1,
    reason: "Family wedding",
    parentName: "Mrs. Patel",
    parentContact: "+91 98765 43211",
    status: "pending",
    appliedOn: "2026-06-19",
  },
  {
    id: "slr3",
    studentName: "Rohan Gupta",
    studentId: "s5",
    className: "8-A",
    roll: 5,
    leaveType: "Sick Leave",
    fromDate: "2026-06-15",
    toDate: "2026-06-16",
    days: 2,
    reason: "Stomach ache",
    parentName: "Mr. Gupta",
    parentContact: "+91 98765 43212",
    status: "approved",
    appliedOn: "2026-06-15",
    approvedBy: "Mr. Rajesh",
    remarks: "Verified with parent over phone",
  },
  {
    id: "slr4",
    studentName: "Sneha Reddy",
    studentId: "s6",
    className: "8-A",
    roll: 6,
    leaveType: "Medical Leave",
    fromDate: "2026-06-10",
    toDate: "2026-06-12",
    days: 3,
    reason: "Dental appointment and recovery",
    parentName: "Mrs. Reddy",
    parentContact: "+91 98765 43213",
    status: "approved",
    appliedOn: "2026-06-08",
    approvedBy: "Mr. Rajesh",
    remarks: "Doctor certificate submitted",
  },
  {
    id: "slr5",
    studentName: "Aditya Singh",
    studentId: "s8",
    className: "8-A",
    roll: 8,
    leaveType: "Personal Leave",
    fromDate: "2026-06-05",
    toDate: "2026-06-05",
    days: 1,
    reason: "Religious function",
    parentName: "Mr. Singh",
    parentContact: "+91 98765 43214",
    status: "rejected",
    appliedOn: "2026-06-03",
    remarks: "Please ensure makeup classes are completed",
  },
  {
    id: "slr6",
    studentName: "Kavya Nair",
    studentId: "s10",
    className: "8-A",
    roll: 10,
    leaveType: "Sick Leave",
    fromDate: "2026-06-22",
    toDate: "2026-06-22",
    days: 1,
    reason: "Migraine",
    parentName: "Mrs. Nair",
    parentContact: "+91 98765 43215",
    status: "pending",
    appliedOn: "2026-06-21",
  },
];

export const LEAVE_STATS = {
  totalBalance: 38,
  usedThisYear: 11,
  pendingRequests: 1,
  upcomingLeaves: 1,
};

export const STUDENT_LEAVE_STATS = {
  totalRequests: 6,
  pending: 3,
  approved: 2,
  rejected: 1,
};
