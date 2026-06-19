import { type StudentResult, type AnalyticsData } from "./myclass-exams-mock-data";

export const STUDENT_RESULTS: StudentResult[] = [
  {
    id: "s1", name: "Aarav Sharma", roll: 1, gender: "Male", total: 435, maxTotal: 500, percentage: 87, rank: 2, attendance: 96, status: "top",
    subjects: [
      { name: "Mathematics", marks: 92, max: 100, grade: "A+" },
      { name: "Science", marks: 88, max: 100, grade: "A" },
      { name: "English", marks: 90, max: 100, grade: "A+" },
      { name: "Hindi", marks: 85, max: 100, grade: "A" },
      { name: "Social Science", marks: 80, max: 100, grade: "A" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 82, rank: 3 },
      { exam: "Mid Term", percentage: 87, rank: 2 },
    ],
    strengths: ["Mathematics", "English"],
    weaknesses: ["Social Science"],
  },
  {
    id: "s2", name: "Priya Patel", roll: 2, gender: "Female", total: 420, maxTotal: 500, percentage: 84, rank: 4, attendance: 94, status: "stable",
    subjects: [
      { name: "Mathematics", marks: 85, max: 100, grade: "A" },
      { name: "Science", marks: 82, max: 100, grade: "A" },
      { name: "English", marks: 88, max: 100, grade: "A" },
      { name: "Hindi", marks: 82, max: 100, grade: "A" },
      { name: "Social Science", marks: 83, max: 100, grade: "A" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 80, rank: 5 },
      { exam: "Mid Term", percentage: 84, rank: 4 },
    ],
    strengths: ["English"],
    weaknesses: ["Mathematics"],
  },
  {
    id: "s3", name: "Rohan Gupta", roll: 3, gender: "Male", total: 310, maxTotal: 500, percentage: 62, rank: 10, attendance: 78, status: "at-risk",
    subjects: [
      { name: "Mathematics", marks: 55, max: 100, grade: "C" },
      { name: "Science", marks: 62, max: 100, grade: "B" },
      { name: "English", marks: 68, max: 100, grade: "B" },
      { name: "Hindi", marks: 60, max: 100, grade: "B" },
      { name: "Social Science", marks: 65, max: 100, grade: "B" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 58, rank: 11 },
      { exam: "Mid Term", percentage: 62, rank: 10 },
    ],
    strengths: ["English"],
    weaknesses: ["Mathematics", "Science"],
  },
  {
    id: "s4", name: "Sneha Reddy", roll: 4, gender: "Female", total: 410, maxTotal: 500, percentage: 82, rank: 5, attendance: 92, status: "stable",
    subjects: [
      { name: "Mathematics", marks: 80, max: 100, grade: "A" },
      { name: "Science", marks: 85, max: 100, grade: "A" },
      { name: "English", marks: 82, max: 100, grade: "A" },
      { name: "Hindi", marks: 78, max: 100, grade: "B+" },
      { name: "Social Science", marks: 85, max: 100, grade: "A" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 78, rank: 6 },
      { exam: "Mid Term", percentage: 82, rank: 5 },
    ],
    strengths: ["Science", "Social Science"],
    weaknesses: ["Hindi"],
  },
  {
    id: "s5", name: "Vikram Singh", roll: 5, gender: "Male", total: 385, maxTotal: 500, percentage: 77, rank: 7, attendance: 88, status: "stable",
    subjects: [
      { name: "Mathematics", marks: 75, max: 100, grade: "B+" },
      { name: "Science", marks: 78, max: 100, grade: "B+" },
      { name: "English", marks: 80, max: 100, grade: "A" },
      { name: "Hindi", marks: 72, max: 100, grade: "B+" },
      { name: "Social Science", marks: 80, max: 100, grade: "A" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 74, rank: 8 },
      { exam: "Mid Term", percentage: 77, rank: 7 },
    ],
    strengths: ["English", "Social Science"],
    weaknesses: ["Hindi"],
  },
  {
    id: "s6", name: "Ananya Nair", roll: 6, gender: "Female", total: 460, maxTotal: 500, percentage: 92, rank: 1, attendance: 98, status: "top",
    subjects: [
      { name: "Mathematics", marks: 95, max: 100, grade: "A+" },
      { name: "Science", marks: 92, max: 100, grade: "A+" },
      { name: "English", marks: 94, max: 100, grade: "A+" },
      { name: "Hindi", marks: 90, max: 100, grade: "A+" },
      { name: "Social Science", marks: 89, max: 100, grade: "A" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 90, rank: 1 },
      { exam: "Mid Term", percentage: 92, rank: 1 },
    ],
    strengths: ["Mathematics", "English", "Science"],
    weaknesses: [],
  },
  {
    id: "s7", name: "Karthik Menon", roll: 7, gender: "Male", total: 365, maxTotal: 500, percentage: 73, rank: 8, attendance: 85, status: "stable",
    subjects: [
      { name: "Mathematics", marks: 70, max: 100, grade: "B+" },
      { name: "Science", marks: 75, max: 100, grade: "B+" },
      { name: "English", marks: 78, max: 100, grade: "B+" },
      { name: "Hindi", marks: 70, max: 100, grade: "B+" },
      { name: "Social Science", marks: 72, max: 100, grade: "B+" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 70, rank: 9 },
      { exam: "Mid Term", percentage: 73, rank: 8 },
    ],
    strengths: ["English"],
    weaknesses: ["Mathematics", "Hindi"],
  },
  {
    id: "s8", name: "Divya Joshi", roll: 8, gender: "Female", total: 290, maxTotal: 500, percentage: 58, rank: 11, attendance: 76, status: "at-risk",
    subjects: [
      { name: "Mathematics", marks: 48, max: 100, grade: "C" },
      { name: "Science", marks: 55, max: 100, grade: "C" },
      { name: "English", marks: 62, max: 100, grade: "B" },
      { name: "Hindi", marks: 60, max: 100, grade: "B" },
      { name: "Social Science", marks: 65, max: 100, grade: "B" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 55, rank: 12 },
      { exam: "Mid Term", percentage: 58, rank: 11 },
    ],
    strengths: ["Social Science"],
    weaknesses: ["Mathematics", "Science"],
  },
  {
    id: "s9", name: "Arjun Das", roll: 9, gender: "Male", total: 400, maxTotal: 500, percentage: 80, rank: 6, attendance: 91, status: "stable",
    subjects: [
      { name: "Mathematics", marks: 78, max: 100, grade: "B+" },
      { name: "Science", marks: 82, max: 100, grade: "A" },
      { name: "English", marks: 80, max: 100, grade: "A" },
      { name: "Hindi", marks: 78, max: 100, grade: "B+" },
      { name: "Social Science", marks: 82, max: 100, grade: "A" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 76, rank: 7 },
      { exam: "Mid Term", percentage: 80, rank: 6 },
    ],
    strengths: ["Science", "Social Science"],
    weaknesses: ["Hindi"],
  },
  {
    id: "s10", name: "Neha Kapoor", roll: 10, gender: "Female", total: 445, maxTotal: 500, percentage: 89, rank: 3, attendance: 97, status: "top",
    subjects: [
      { name: "Mathematics", marks: 90, max: 100, grade: "A+" },
      { name: "Science", marks: 88, max: 100, grade: "A" },
      { name: "English", marks: 92, max: 100, grade: "A+" },
      { name: "Hindi", marks: 88, max: 100, grade: "A" },
      { name: "Social Science", marks: 87, max: 100, grade: "A" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 86, rank: 2 },
      { exam: "Mid Term", percentage: 89, rank: 3 },
    ],
    strengths: ["Mathematics", "English"],
    weaknesses: [],
  },
  {
    id: "s11", name: "Rahul Verma", roll: 11, gender: "Male", total: 375, maxTotal: 500, percentage: 75, rank: 9, attendance: 89, status: "stable",
    subjects: [
      { name: "Mathematics", marks: 72, max: 100, grade: "B+" },
      { name: "Science", marks: 75, max: 100, grade: "B+" },
      { name: "English", marks: 78, max: 100, grade: "B+" },
      { name: "Hindi", marks: 75, max: 100, grade: "B+" },
      { name: "Social Science", marks: 75, max: 100, grade: "B+" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 72, rank: 9 },
      { exam: "Mid Term", percentage: 75, rank: 9 },
    ],
    strengths: ["English"],
    weaknesses: ["Mathematics"],
  },
  {
    id: "s12", name: "Simran Kaur", roll: 12, gender: "Female", total: 340, maxTotal: 500, percentage: 68, rank: 9, attendance: 82, status: "at-risk",
    subjects: [
      { name: "Mathematics", marks: 60, max: 100, grade: "B" },
      { name: "Science", marks: 65, max: 100, grade: "B" },
      { name: "English", marks: 72, max: 100, grade: "B+" },
      { name: "Hindi", marks: 68, max: 100, grade: "B" },
      { name: "Social Science", marks: 75, max: 100, grade: "B+" },
    ],
    examHistory: [
      { exam: "UT-1", percentage: 65, rank: 10 },
      { exam: "Mid Term", percentage: 68, rank: 9 },
    ],
    strengths: ["Social Science"],
    weaknesses: ["Mathematics"],
  },
];

export const EXAM_ANALYTICS: AnalyticsData = {
  monthlyTrend: [
    { exam: "UT-1", avg: 75 },
    { exam: "Mid Term", avg: 82 },
  ],
  subjectPerf: [
    { subject: "Mathematics", avg: 76, highest: 95, lowest: 48 },
    { subject: "Science", avg: 79, highest: 92, lowest: 55 },
    { subject: "English", avg: 82, highest: 94, lowest: 62 },
    { subject: "Hindi", avg: 77, highest: 90, lowest: 60 },
    { subject: "Social Science", avg: 79, highest: 89, lowest: 65 },
  ],
  rankDistribution: [
    { range: "1-3", count: 3 },
    { range: "4-6", count: 3 },
    { range: "7-9", count: 3 },
    { range: "10-12", count: 3 },
  ],
  attendanceVsMarks: [
    { name: "Aarav", attendance: 96, marks: 87 },
    { name: "Priya", attendance: 94, marks: 84 },
    { name: "Rohan", attendance: 78, marks: 62 },
    { name: "Sneha", attendance: 92, marks: 82 },
    { name: "Vikram", attendance: 88, marks: 77 },
    { name: "Ananya", attendance: 98, marks: 92 },
    { name: "Karthik", attendance: 85, marks: 73 },
    { name: "Divya", attendance: 76, marks: 58 },
    { name: "Arjun", attendance: 91, marks: 80 },
    { name: "Neha", attendance: 97, marks: 89 },
    { name: "Rahul", attendance: 89, marks: 75 },
    { name: "Simran", attendance: 82, marks: 68 },
  ],
  examReadiness: [
    { subject: "Mathematics", readiness: 78 },
    { subject: "Science", readiness: 85 },
    { subject: "English", readiness: 88 },
    { subject: "Hindi", readiness: 80 },
    { subject: "Social Science", readiness: 76 },
  ],
  passFail: { pass: 10, fail: 2 },
};
