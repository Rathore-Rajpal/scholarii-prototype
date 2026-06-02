import type { Student, Teacher, Announcement, Assignment, AdmissionFunnel, ActivityEvent } from "./types";

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Ananya", "Diya", "Aadhya", "Saanvi", "Aanya", "Pari", "Anaya", "Myra", "Sara", "Iraa", "Kabir", "Advait", "Dhruv", "Kiaan", "Aryan", "Ria", "Nisha", "Kavya", "Tara", "Zara"];
const lastNames = ["Sharma", "Verma", "Patel", "Kumar", "Singh", "Gupta", "Mehta", "Rao", "Iyer", "Reddy", "Joshi", "Nair", "Khan", "Das", "Kapoor"];
const subjects = ["Mathematics", "English", "Science", "Social Studies", "Hindi", "Computer Science", "Physics", "Chemistry", "Biology", "History"];
const palette = ["#667eea", "#764ba2", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];

/**
 * Seeded random number generator for deterministic mock data
 * Ensures the same data is generated consistently across page loads and ports
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  next(): number {
    // Linear congruential generator (deterministic)
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }
}

const rng = new SeededRandom();

export function getSeededRandom(): SeededRandom {
  return rng;
}

function makeStudents(): Student[] {
  const out: Student[] = [];
  let i = 0;
  // Generate 430 students across grades 1-10
  // Grades 1-5: 24 students per section = 240
  // Grades 6-10: 19 students per section = 190
  // Total: 430 students
  for (let grade = 1; grade <= 10; grade++) {
    for (const section of ["A", "B"]) {
      const count = grade <= 5 ? 24 : 19;
      for (let n = 0; n < count; n++) {
        const fn = pick(firstNames, i * 3 + n);
        const ln = pick(lastNames, i + n);
        // More realistic attendance distribution:
        // 60% of students: 85-95% attendance
        // 30% of students: 75-85% attendance  
        // 10% of students: 65-75% attendance
        const rand = i % 100;
        let attendance: number;
        if (rand < 60) {
          attendance = 85 + rng.nextInt(0, 10); // 85-95%
        } else if (rand < 90) {
          attendance = 75 + rng.nextInt(0, 10); // 75-85%
        } else {
          attendance = 65 + rng.nextInt(0, 10); // 65-75%
        }
        
        // Fee status: 75% paid, 15% pending, 10% overdue
        let feeStatus: "Paid" | "Pending" | "Overdue";
        const feeRand = i % 100;
        if (feeRand < 75) feeStatus = "Paid";
        else if (feeRand < 90) feeStatus = "Pending";
        else feeStatus = "Overdue";
        
        // Test scores with more realistic distribution
        const baseScore = 65 + ((i * 7) % 25); // 65-90%
        
        out.push({
          id: `S${String(i + 1).padStart(4, "0")}`,
          name: `${fn} ${ln}`,
          roll: `${grade}${section}${String(n + 1).padStart(2, "0")}`,
          grade,
          section,
          attendance,
          feeStatus,
          parent: `${pick(firstNames, i + 5)} ${ln}`,
          parentPhone: `+91 9${String(800000000 + i * 137).slice(0, 9)}`,
          gender: i % 2 === 0 ? "M" : "F",
          avatarColor: pick(palette, i),
          testScores: {
            Mathematics: baseScore + ((i * 13) % 15),
            English: baseScore + ((i * 11) % 12),
            Science: baseScore + ((i * 7) % 18),
            "Social Studies": baseScore + ((i * 9) % 14),
            Hindi: baseScore + ((i * 5) % 10),
          },
          isChronicAbsentee: attendance < 75,
          parentEngagementScore: 50 + ((i * 3) % 40),
        });
        i++;
      }
    }
  }
  return out;
}

function makeTeachers(): Teacher[] {
  const out: Teacher[] = [];
  const departments = ["Science", "Mathematics", "Languages", "Social Studies", "Physical Education", "Arts"];
  for (let i = 0; i < 18; i++) {
    const fn = pick(firstNames, i * 2 + 1);
    const ln = pick(lastNames, i * 3 + 2);
    const classesPerDay = 3 + ((i % 4) * 2);
    const pendingTasks = Math.floor((i % 7) * 2);
    const isOverloaded = classesPerDay > 7 || pendingTasks > 8;
    const statusOptions: Array<"Active" | "On Leave" | "Late"> = ["Active", "On Leave", "Late"];
    const status = i % 10 === 0 ? "On Leave" : i % 15 === 0 ? "Late" : "Active";
    
    out.push({
      id: `T${String(i + 1).padStart(3, "0")}`,
      name: `${fn} ${ln}`,
      subject: pick(subjects, i),
      classes: [`${(i % 10) + 1}-A`, `${((i + 3) % 10) + 1}-B`],
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@scholarii.school`,
      phone: `+91 98${String(76543210 + i * 11).slice(0, 8)}`,
      rating: 3.5 + ((i % 4) * 0.4),
      status: status as "Active" | "On Leave" | "Late",
      avatarColor: pick(palette, i + 2),
      department: pick(departments, i),
      classesPerDay,
      pendingTasks,
      isOverloaded,
    });
  }
  return out;
}

function makeAnnouncements(): Announcement[] {
  const items = [
    { title: "Annual Sports Day on Dec 15", audience: "All" as const, priority: "Important" as const, message: "Join us for the Annual Sports Day. All students must report by 8 AM in proper sports uniform." },
    { title: "Mid-term Exam Schedule Released", audience: "Students" as const, priority: "Important" as const, message: "The mid-term examination schedule has been published. Please check your dashboard." },
    { title: "PTA Meeting — Class 10", audience: "Parents" as const, priority: "Normal" as const, message: "PTA meeting for class 10 parents on Saturday at 10 AM in the auditorium." },
    { title: "Diwali Holidays Announced", audience: "All" as const, priority: "Normal" as const, message: "The school will remain closed from Oct 28 to Nov 5 for Diwali festivities." },
    { title: "Fee Payment Deadline Extended", audience: "Parents" as const, priority: "Urgent" as const, message: "The Q3 fee payment deadline has been extended to Nov 10. Late fees will apply after." },
  ];
  return items.map((it, i) => ({
    id: `A${i + 1}`,
    ...it,
    date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    reads: 80 + (i * 35) % 200,
    recipients: 450,
  }));
}

function makeAssignments(): Assignment[] {
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `AS${i + 1}`,
    title: `${pick(subjects, i)} Worksheet ${i + 1}`,
    subject: pick(subjects, i),
    class: `${(i % 6) + 5}-A`,
    dueDate: new Date(Date.now() + (i - 2) * 86400000 * 2).toISOString(),
    submitted: 20 + i * 3,
    total: 35,
    graded: 10 + i * 2,
  }));
}

function makeAdmissionFunnel(): AdmissionFunnel {
  return {
    inquiries: 1240,
    applications: 640,
    shortlisted: 420,
    admitted: 320,
    conversions: {
      inquiryToApp: 51.6,
      appToShortlist: 65.6,
      shortlistToAdmit: 76.2,
    },
  };
}

function makeActivityEvents(): ActivityEvent[] {
  const eventTypes = ["fee_payment", "admission", "attendance", "leave", "announcement", "homework", "exam", "ptm"] as const;
  const activities = [
    { type: "fee_payment" as const, title: "Fee Payment", description: "₹45,000 received from Class 10-B", severity: "success" as const },
    { type: "admission" as const, title: "New Admission", description: "Aarush Joshi enrolled in Class 6-A", severity: "info" as const },
    { type: "leave" as const, title: "Leave Request", description: "Mr. Verma requested leave for Dec 15", severity: "warning" as const },
    { type: "announcement" as const, title: "Announcement Sent", description: "Sports Day notice — 450 recipients", severity: "info" as const },
    { type: "attendance" as const, title: "Attendance Marked", description: "Attendance marked for Grade 10", severity: "info" as const },
    { type: "homework" as const, title: "Homework Uploaded", description: "Homework uploaded for Class 8A", severity: "info" as const },
  ];
  
  return activities.map((act, i) => ({
    id: `EV${i + 1}`,
    type: act.type,
    title: act.title,
    description: act.description,
    timestamp: new Date(Date.now() - i * 3600000 * (2 + (i % 3))),
    severity: act.severity,
    icon: act.type,
  }));
}

const KEY = "scholarii-data-v2";

interface StoreData {
  students: Student[];
  teachers: Teacher[];
  announcements: Announcement[];
  assignments: Assignment[];
  admissionFunnel: AdmissionFunnel;
  activityEvents: ActivityEvent[];
  feeTarget: number;
}

export function loadData(): StoreData {
  if (typeof window === "undefined") {
    return { 
      students: makeStudents(), 
      teachers: makeTeachers(), 
      announcements: makeAnnouncements(), 
      assignments: makeAssignments(),
      admissionFunnel: makeAdmissionFunnel(),
      activityEvents: makeActivityEvents(),
      feeTarget: 10750000, // 430 students × ₹25,000 annual per student
    };
  }
  
  const fresh = { 
    students: makeStudents(), 
    teachers: makeTeachers(), 
    announcements: makeAnnouncements(), 
    assignments: makeAssignments(),
    admissionFunnel: makeAdmissionFunnel(),
    activityEvents: makeActivityEvents(),
    feeTarget: 10750000, // 430 students × ₹25,000 annual per student
  };
  
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      // Ensure all required fields exist (handles schema updates)
      return {
        students: stored.students || fresh.students,
        teachers: stored.teachers || fresh.teachers,
        announcements: stored.announcements || fresh.announcements,
        assignments: stored.assignments || fresh.assignments,
        admissionFunnel: stored.admissionFunnel || fresh.admissionFunnel,
        activityEvents: stored.activityEvents || fresh.activityEvents,
        feeTarget: stored.feeTarget || fresh.feeTarget,
      };
    }
  } catch {}
  
  localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
}

export function saveData(data: StoreData) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(data));
}

// Charts
export const monthlyAttendance = [
  { m: "Apr", v: 89 }, { m: "May", v: 91 }, { m: "Jun", v: 88 },
  { m: "Jul", v: 92 }, { m: "Aug", v: 87 }, { m: "Sep", v: 90 },
  { m: "Oct", v: 93 }, { m: "Nov", v: 89 },
];

// Attendance distribution (pie chart data)
export const attendanceDistribution = [
  { name: "Present", value: 378, color: "#10b981" }, // 88%
  { name: "Absent", value: 32, color: "#ef4444" }, // 7%
  { name: "On Leave", value: 20, color: "#f59e0b" }, // 5%
];

// Fee collection data for 430 students (avg ₹2,500/month per student)
// Monthly target: 430 × ₹2,500 = ₹10,75,000
export const feeCollection = [
  { m: "Apr", v: 895000 }, { m: "May", v: 965000 }, { m: "Jun", v: 1020000 },
  { m: "Jul", v: 985000 }, { m: "Aug", v: 1035000 }, { m: "Sep", v: 1065000 },
  { m: "Oct", v: 1085000 }, { m: "Nov", v: 1015000 },
];

export const classPerformance = [
  { c: "1", v: 78 }, { c: "2", v: 82 }, { c: "3", v: 80 },
  { c: "4", v: 85 }, { c: "5", v: 79 }, { c: "6", v: 83 },
  { c: "7", v: 86 }, { c: "8", v: 81 }, { c: "9", v: 84 }, { c: "10", v: 88 },
];
