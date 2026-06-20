export type MeetingStatus = "upcoming" | "completed" | "cancelled";

export interface PTAMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  className: string;
  venue: string;
  status: MeetingStatus;
  agenda: string[];
  attendeesExpected: number;
  attendeesActual: number;
  parentResponses: { accepted: number; declined: number; pending: number };
  notes: string;
  followUpActions: string[];
}

export const PTA_MEETINGS: PTAMeeting[] = [
  {
    id: "pta1",
    title: "Mid-Term Progress Review",
    date: "2026-06-25",
    time: "15:00",
    endTime: "16:30",
    className: "Class 8-A",
    venue: "School Hall",
    status: "upcoming",
    agenda: [
      "Academic performance overview",
      "Attendance improvement plan",
      "Upcoming exam preparation",
      "Parent volunteer opportunities",
    ],
    attendeesExpected: 28,
    attendeesActual: 0,
    parentResponses: { accepted: 18, declined: 3, pending: 7 },
    notes: "",
    followUpActions: [],
  },
  {
    id: "pta2",
    title: "Annual Day Planning",
    date: "2026-05-20",
    time: "15:00",
    endTime: "16:00",
    className: "Class 8-A",
    venue: "Conference Room B",
    status: "completed",
    agenda: [
      "Annual day theme selection",
      "Student performance allocation",
      "Budget approval",
      "Decoration committee formation",
    ],
    attendeesExpected: 28,
    attendeesActual: 22,
    parentResponses: { accepted: 22, declined: 2, pending: 4 },
    notes: "Great turnout. Parents agreed on Cultural Diversity theme. Budget of ₹15,000 approved. Three parent volunteers for decoration committee.",
    followUpActions: [
      "Share costume requirements with parents by 25 May",
      "Form student practice groups",
      "Book catering by 1 June",
    ],
  },
  {
    id: "pta3",
    title: "Science Fair Coordination",
    date: "2026-04-15",
    time: "14:30",
    endTime: "15:30",
    className: "Class 8-B",
    venue: "Staff Room",
    status: "completed",
    agenda: [
      "Project guidelines distribution",
      "Material requirements",
      "Judging criteria",
      "Parent mentor pairing",
    ],
    attendeesExpected: 25,
    attendeesActual: 19,
    parentResponses: { accepted: 19, declined: 4, pending: 2 },
    notes: "Projects finalized. 5 parents volunteered as mentors. Material budget capped at ₹500 per team.",
    followUpActions: [
      "Send project guidelines to all parents",
      "Schedule mentor-student meetups",
      "Finalize judging panel by 22 April",
    ],
  },
  {
    id: "pta4",
    title: "Welcome Meeting — New Session",
    date: "2026-03-10",
    time: "15:00",
    endTime: "16:00",
    className: "Class 8-A",
    venue: "School Hall",
    status: "completed",
    agenda: [
      "Introduction to new class teacher",
      "Curriculum overview for the year",
      "Communication channels",
      "PTA committee elections",
    ],
    attendeesExpected: 30,
    attendeesActual: 26,
    parentResponses: { accepted: 26, declined: 1, pending: 3 },
    notes: "Smooth welcome meeting. New PTA committee elected. Monthly newsletter format agreed upon.",
    followUpActions: [
      "Share class WhatsApp group link",
      "Send curriculum calendar to all parents",
      "Schedule first parent-teacher one-on-ones",
    ],
  },
];

export const PTA_STATS = {
  totalMeetings: 4,
  upcoming: 1,
  completed: 3,
  avgAttendance: 82,
  totalFollowUps: 9,
};
