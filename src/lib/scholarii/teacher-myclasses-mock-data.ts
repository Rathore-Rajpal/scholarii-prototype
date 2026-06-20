export interface TeacherClass {
  id: string;
  className: string;
  section: string;
  grade: number;
  subject: string;
  isClassTeacher: boolean;
  studentCount: number;
  avgAttendance: number;
  avgScore: number;
  room: string;
  schedule: string;
  topPerformers: number;
  atRiskStudents: number;
  lastActivity: string;
  nextExam: string;
}

export const TEACHER_CLASSES: TeacherClass[] = [
  {
    id: "c1",
    className: "Class 8-A",
    section: "A",
    grade: 8,
    subject: "Mathematics",
    isClassTeacher: true,
    studentCount: 32,
    avgAttendance: 94,
    avgScore: 78,
    room: "203",
    schedule: "Mon-Fri · 08:00-08:45",
    topPerformers: 8,
    atRiskStudents: 3,
    lastActivity: "Attendance marked today",
    nextExam: "Unit Test · 28 Jun",
  },
  {
    id: "c2",
    className: "Class 8-B",
    section: "B",
    grade: 8,
    subject: "Mathematics",
    isClassTeacher: false,
    studentCount: 28,
    avgAttendance: 91,
    avgScore: 74,
    room: "204",
    schedule: "Mon-Fri · 09:00-09:45",
    topPerformers: 5,
    atRiskStudents: 4,
    lastActivity: "Assignment graded yesterday",
    nextExam: "Unit Test · 28 Jun",
  },
  {
    id: "c3",
    className: "Class 9-A",
    section: "A",
    grade: 9,
    subject: "Mathematics",
    isClassTeacher: false,
    studentCount: 30,
    avgAttendance: 89,
    avgScore: 71,
    room: "205",
    schedule: "Mon-Fri · 12:00-12:45",
    topPerformers: 6,
    atRiskStudents: 5,
    lastActivity: "Chapters updated today",
    nextExam: "Mid-Term · 15 Jul",
  },
];

export const CLASS_OVERVIEW_STATS = {
  totalClasses: 3,
  totalStudents: 90,
  subjectsTeaching: 2,
  classTeacherOf: "Class 8-A",
  avgClassAttendance: 91,
  avgClassScore: 74,
};
