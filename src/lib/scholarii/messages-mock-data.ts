export type ConversationType = "dm" | "channel";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: "text" | "resource" | "assignment" | "link" | "image";
  resourceTitle?: string;
  resourceSubject?: string;
  pinned?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  type: ConversationType;
  avatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: number;
  members?: number;
  description?: string;
  readOnly?: boolean;
  subject?: string;
  role?: string;
  online?: boolean;
  messages: Message[];
}

export const CONVERSATIONS: Conversation[] = [
  // Direct Messages - Teachers
  {
    id: "dm-sharma",
    name: "Mr. Sharma",
    type: "dm",
    avatar: "\ud83d\udc68\u200d\ud83c\udfeb",
    lastMessage: "Don't forget to submit the algebra worksheet by Friday.",
    lastTimestamp: "10:30 AM",
    unread: 2,
    subject: "Mathematics",
    role: "Teacher",
    online: true,
    messages: [
      { id: "s1", senderId: "sharma", senderName: "Mr. Sharma", senderAvatar: "\ud83d\udc68\u200d\ud83c\udfeb", content: "Good morning class! I've uploaded the new algebra notes.", timestamp: "9:00 AM", type: "text" },
      { id: "s2", senderId: "me", senderName: "Rahul Kumar", senderAvatar: "\ud83d\udc64", content: "Thank you sir! Will review them today.", timestamp: "9:15 AM", type: "text" },
      { id: "s3", senderId: "sharma", senderName: "Mr. Sharma", senderAvatar: "\ud83d\udc68\u200d\ud83c\udfeb", content: "Here are the updated notes for Chapter 5.", timestamp: "9:30 AM", type: "resource", resourceTitle: "Algebra Notes Chapter 5", resourceSubject: "Mathematics" },
      { id: "s4", senderId: "sharma", senderName: "Mr. Sharma", senderAvatar: "\ud83d\udc68\u200d\ud83c\udfeb", content: "Don't forget to submit the algebra worksheet by Friday.", timestamp: "10:30 AM", type: "text", pinned: true },
    ],
  },
  {
    id: "dm-gupta",
    name: "Mrs. Gupta",
    type: "dm",
    avatar: "\ud83d\udc69\u200d\ud83c\udfeb",
    lastMessage: "Great work on the photosynthesis project!",
    lastTimestamp: "Yesterday",
    unread: 0,
    subject: "Science",
    role: "Teacher",
    online: false,
    messages: [
      { id: "g1", senderId: "gupta", senderName: "Mrs. Gupta", senderAvatar: "\ud83d\udc69\u200d\ud83c\udfeb", content: "Your photosynthesis project looks excellent!", timestamp: "Yesterday", type: "text" },
      { id: "g2", senderId: "me", senderName: "Rahul Kumar", senderAvatar: "\ud83d\udc64", content: "Thank you ma'am! I worked hard on the diagram.", timestamp: "Yesterday", type: "text" },
      { id: "g3", senderId: "gupta", senderName: "Mrs. Gupta", senderAvatar: "\ud83d\udc69\u200d\ud83c\udfeb", content: "Great work on the photosynthesis project!", timestamp: "Yesterday", type: "text" },
    ],
  },
  {
    id: "dm-wilson",
    name: "Ms. Wilson",
    type: "dm",
    avatar: "\ud83d\udc69\u200d\ud83c\udfeb",
    lastMessage: "Your essay on climate change has been graded.",
    lastTimestamp: "Mon",
    unread: 1,
    subject: "English",
    role: "Teacher",
    online: true,
    messages: [
      { id: "w1", senderId: "wilson", senderName: "Ms. Wilson", senderAvatar: "\ud83d\udc69\u200d\ud83c\udfeb", content: "Your essay on climate change has been graded. Well done!", timestamp: "Mon", type: "text" },
      { id: "w2", senderId: "wilson", senderName: "Ms. Wilson", senderAvatar: "\ud83d\udc69\u200d\ud83c\udfeb", content: "Here's the feedback document.", timestamp: "Mon", type: "resource", resourceTitle: "Essay Feedback - Climate Change", resourceSubject: "English" },
    ],
  },
  // Direct Messages - Classmates
  {
    id: "dm-aarav",
    name: "Aarav Sharma",
    type: "dm",
    avatar: "\ud83d\udc66",
    lastMessage: "Can you share the physics notes?",
    lastTimestamp: "11:00 AM",
    unread: 1,
    messages: [
      { id: "a1", senderId: "aarav", senderName: "Aarav Sharma", senderAvatar: "\ud83d\udc66", content: "Hey! Can you share the physics notes from today?", timestamp: "10:45 AM", type: "text" },
      { id: "a2", senderId: "me", senderName: "Rahul Kumar", senderAvatar: "\ud83d\udc64", content: "Sure! Here they are.", timestamp: "10:50 AM", type: "resource", resourceTitle: "Physics Notes - Motion", resourceSubject: "Science" },
      { id: "a3", senderId: "aarav", senderName: "Aarav Sharma", senderAvatar: "\ud83d\udc66", content: "Thanks! Can you share the physics notes?", timestamp: "11:00 AM", type: "text" },
    ],
  },
  {
    id: "dm-priya",
    name: "Priya Patel",
    type: "dm",
    avatar: "\ud83d\udc67",
    lastMessage: "Study group tomorrow at 4 PM?",
    lastTimestamp: "Yesterday",
    unread: 0,
    messages: [
      { id: "p1", senderId: "priya", senderName: "Priya Patel", senderAvatar: "\ud83d\udc67", content: "Hey! Want to study together for the math exam?", timestamp: "Yesterday", type: "text" },
      { id: "p2", senderId: "me", senderName: "Rahul Kumar", senderAvatar: "\ud83d\udc64", content: "Sure! When?", timestamp: "Yesterday", type: "text" },
      { id: "p3", senderId: "priya", senderName: "Priya Patel", senderAvatar: "\ud83d\udc67", content: "Study group tomorrow at 4 PM?", timestamp: "Yesterday", type: "text" },
    ],
  },
  {
    id: "dm-arjun",
    name: "Arjun Singh",
    type: "dm",
    avatar: "\ud83d\udc66",
    lastMessage: "Check out this YouTube video on HTML",
    lastTimestamp: "Tue",
    unread: 0,
    messages: [
      { id: "ar1", senderId: "arjun", senderName: "Arjun Singh", senderAvatar: "\ud83d\udc66", content: "Check out this YouTube video on HTML basics", timestamp: "Tue", type: "link" },
      { id: "ar2", senderId: "me", senderName: "Rahul Kumar", senderAvatar: "\ud83d\udc64", content: "Looks helpful! Thanks!", timestamp: "Tue", type: "text" },
    ],
  },
  // Channels
  {
    id: "ch-class",
    name: "class-10a",
    type: "channel",
    avatar: "\ud83c\udfe2",
    lastMessage: "Mr. Sharma: Homework due Friday",
    lastTimestamp: "10:30 AM",
    unread: 5,
    members: 42,
    description: "Class 10A official discussion channel",
    messages: [
      { id: "c1", senderId: "sharma", senderName: "Mr. Sharma", senderAvatar: "\ud83d\udc68\u200d\ud83c\udfeb", content: "Good morning everyone! Reminder: homework is due Friday.", timestamp: "9:00 AM", type: "text" },
      { id: "c2", senderId: "aarav", senderName: "Aarav Sharma", senderAvatar: "\ud83d\udc66", content: "Got it sir!", timestamp: "9:05 AM", type: "text" },
      { id: "c3", senderId: "priya", senderName: "Priya Patel", senderAvatar: "\ud83d\udc67", content: "Is the homework on Chapter 5 or 6?", timestamp: "9:10 AM", type: "text" },
      { id: "c4", senderId: "sharma", senderName: "Mr. Sharma", senderAvatar: "\ud83d\udc68\u200d\ud83c\udfeb", content: "Chapter 5, problems 1-10.", timestamp: "9:15 AM", type: "text" },
      { id: "c5", senderId: "gupta", senderName: "Mrs. Gupta", senderAvatar: "\ud83d\udc69\u200d\ud83c\udfeb", content: "Science project presentations are next week.", timestamp: "10:00 AM", type: "text" },
      { id: "c6", senderId: "sharma", senderName: "Mr. Sharma", senderAvatar: "\ud83d\udc68\u200d\ud83c\udfeb", content: "Homework due Friday", timestamp: "10:30 AM", type: "text", pinned: true },
    ],
  },
  {
    id: "ch-announcements",
    name: "announcements",
    type: "channel",
    avatar: "\ud83d\udce2",
    lastMessage: "Annual Day celebration on 25th November",
    lastTimestamp: "Mon",
    unread: 1,
    members: 150,
    description: "Official school announcements (read-only for students)",
    readOnly: true,
    messages: [
      { id: "an1", senderId: "admin", senderName: "School Admin", senderAvatar: "\ud83c\udfeb", content: "Annual Day celebration will be held on 25th November. All students are expected to participate.", timestamp: "Mon", type: "text", pinned: true },
      { id: "an2", senderId: "admin", senderName: "School Admin", senderAvatar: "\ud83c\udfeb", content: "Mid-term exam schedule has been released. Check the Exams tab.", timestamp: "Sun", type: "text" },
    ],
  },
  {
    id: "ch-events",
    name: "events",
    type: "channel",
    avatar: "\ud83c\udfad",
    lastMessage: "Science fair registrations open!",
    lastTimestamp: "Yesterday",
    unread: 0,
    members: 85,
    description: "School events and participation",
    messages: [
      { id: "e1", senderId: "gupta", senderName: "Mrs. Gupta", senderAvatar: "\ud83d\udc69\u200d\ud83c\udfeb", content: "Science fair registrations are now open! Last date: 20th June.", timestamp: "Yesterday", type: "text" },
      { id: "e2", senderId: "me", senderName: "Rahul Kumar", senderAvatar: "\ud83d\udc64", content: "I want to register for the science fair!", timestamp: "Yesterday", type: "text" },
    ],
  },
  {
    id: "ch-ideas",
    name: "ideas",
    type: "channel",
    avatar: "\ud83d\udca1",
    lastMessage: "What if we had a coding club?",
    lastTimestamp: "Tue",
    unread: 0,
    members: 30,
    description: "Share your ideas for school improvement",
    messages: [
      { id: "i1", senderId: "arjun", senderName: "Arjun Singh", senderAvatar: "\ud83d\udc66", content: "What if we had a coding club at school?", timestamp: "Tue", type: "text" },
      { id: "i2", senderId: "priya", senderName: "Priya Patel", senderAvatar: "\ud83d\udc67", content: "That's a great idea! We could learn Python together.", timestamp: "Tue", type: "text" },
    ],
  },
  {
    id: "ch-study",
    name: "study-group",
    type: "channel",
    avatar: "\ud83d\udcda",
    lastMessage: "Let's solve the practice problems together",
    lastTimestamp: "11:00 AM",
    unread: 3,
    members: 15,
    description: "Peer learning and study discussions",
    messages: [
      { id: "sg1", senderId: "priya", senderName: "Priya Patel", senderAvatar: "\ud83d\udc67", content: "Hey everyone! Let's solve the practice problems together.", timestamp: "10:30 AM", type: "text" },
      { id: "sg2", senderId: "aarav", senderName: "Aarav Sharma", senderAvatar: "\ud83d\udc66", content: "I'm in! Which subject?", timestamp: "10:35 AM", type: "text" },
      { id: "sg3", senderId: "priya", senderName: "Priya Patel", senderAvatar: "\ud83d\udc67", content: "Mathematics first, then Science.", timestamp: "10:40 AM", type: "text" },
      { id: "sg4", senderId: "me", senderName: "Rahul Kumar", senderAvatar: "\ud83d\udc64", content: "Count me in too!", timestamp: "10:45 AM", type: "text" },
      { id: "sg5", senderId: "riya", senderName: "Riya Gupta", senderAvatar: "\ud83d\udc67", content: "Let's solve the practice problems together", timestamp: "11:00 AM", type: "text" },
    ],
  },
];
