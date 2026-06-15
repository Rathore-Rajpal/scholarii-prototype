import type { ChatConversation, ChatMessage, AiModel, AiSkill } from "./ai-mock-data";

// ============================================================
// PARENT AI MOCK DATA
// Used by Parent AI Assistant view
// ============================================================

// Parent-specific AI Skills
export const PARENT_AI_SKILLS: AiSkill[] = [
  { id: "child-progress", name: "Child Progress Analysis" },
  { id: "attendance", name: "Attendance Monitoring" },
  { id: "exam-prep", name: "Exam Preparation Guidance" },
  { id: "action-plan", name: "Parent Action Plan" },
  { id: "study-rec", name: "Study Recommendations" },
  { id: "fee-guidance", name: "Fee Guidance" },
  { id: "performance", name: "Performance Analysis" },
  { id: "school-updates", name: "School Updates" },
  { id: "general", name: "General Questions" },
];

// Parent-specific suggested prompts
export const PARENT_SUGGESTED_PROMPTS = [
  "How is my child performing?",
  "What should my child focus on this week?",
  "Summarize recent exam performance",
  "Show attendance concerns",
  "What are the upcoming deadlines?",
  "How can I support my child at home?",
  "Summarize school notices",
  "What subjects need attention?",
];

// Parent-specific quick actions
export const PARENT_QUICK_ACTIONS = [
  { label: "View Attendance Report", icon: "\ud83d\udcca" },
  { label: "Check Fee Status", icon: "\ud83d\udcb0" },
  { label: "Performance Summary", icon: "\ud83d\udcc8" },
  { label: "Upcoming Events", icon: "\ud83d\udcc5" },
  { label: "Download Reports", icon: "\ud83d\udce5" },
  { label: "Contact Teacher", icon: "\ud83d\udcac" },
];

// Parent-specific attachable resources
export const PARENT_ATTACHABLE_RESOURCES = [
  { id: "pr1", title: "Report Card - Term 1", subject: "Academic", type: "Report" },
  { id: "pr2", title: "Attendance Report - June", subject: "Attendance", type: "Report" },
  { id: "pr3", title: "Fee Receipt - April 2026", subject: "Fees", type: "Receipt" },
  { id: "pr4", title: "Fee Receipt - May 2026", subject: "Fees", type: "Receipt" },
  { id: "pr5", title: "School Notice - Sports Day", subject: "Events", type: "Notice" },
  { id: "pr6", title: "School Notice - PTM", subject: "Events", type: "Notice" },
  { id: "pr7", title: "Progress Report - Q1", subject: "Academic", type: "Report" },
  { id: "pr8", title: "Fee Receipt - June 2026", subject: "Fees", type: "Receipt" },
];

// Parent-specific mock conversations
export const PARENT_MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "pconv1",
    title: "How is Aarav performing?",
    createdAt: "2026-06-15",
    section: "today",
    messages: [
      {
        id: "pm1",
        role: "user",
        content: "How is Aarav performing?",
        timestamp: "10:30 AM",
      },
      {
        id: "pm2",
        role: "ai",
        content: "**Aarav's Performance Summary**\n\n**Overall Performance: Improving** \ud83d\udcc8\n\n**Strengths:**\n- Science: 92% (Excellent)\n- English: 88% (Very Good)\n- Computer Science: 90% (Excellent)\n\n**Areas to Focus:**\n- Mathematics: 78% (Needs improvement)\n- Social Studies: 80% (Good, can improve)\n\n**Attendance:** 94% - Excellent attendance record\n\n**Upcoming:**\n- Unit Test in Mathematics: 5 days\n- Science Fair: 10 days\n\n**Recommendation:**\nFocus on Algebra concepts before the upcoming Unit Test. Consider 30 minutes daily practice.\n\nWould you like a detailed subject-wise analysis?",
        timestamp: "10:31 AM",
      },
    ],
  },
  {
    id: "pconv2",
    title: "Attendance Summary",
    createdAt: "2026-06-15",
    section: "today",
    messages: [
      {
        id: "pm3",
        role: "user",
        content: "Show me the attendance summary",
        timestamp: "2:00 PM",
      },
      {
        id: "pm4",
        role: "ai",
        content: "**Attendance Summary for Aarav**\n\n**This Month (June 2026):**\n- Present: 12 days\n- Absent: 1 day\n- Leave: 1 day\n- **Attendance Rate: 86%**\n\n**Overall (Academic Year):**\n- Total School Days: 150\n- Days Present: 141\n- Days Absent: 6\n- Days on Leave: 3\n- **Overall Attendance: 94%**\n\n**Trend:**\n- Last Month: 91%\n- This Month: 86% (5% decrease)\n\n**Concern:**\nAttendance dropped by 5% this month. Consider discussing with Aarav about consistency.\n\n**Recommendation:**\nMaintain 90%+ attendance for optimal academic performance.",
        timestamp: "2:01 PM",
      },
    ],
  },
  {
    id: "pconv3",
    title: "Exam Preparation Plan",
    createdAt: "2026-06-14",
    section: "yesterday",
    messages: [
      {
        id: "pm5",
        role: "user",
        content: "Help me prepare Aarav for upcoming exams",
        timestamp: "4:00 PM",
      },
      {
        id: "pm6",
        role: "ai",
        content: "**Exam Preparation Plan for Aarav**\n\n**Upcoming Exams:**\n1. Mathematics Unit Test: 5 days\n2. Science Unit Test: 7 days\n3. English Unit Test: 9 days\n\n**Preparation Schedule:**\n\n**Day 1-2: Mathematics Focus**\n- Revise Algebra concepts (2 hours)\n- Practice 20 problems daily\n- Focus on word problems\n\n**Day 3-4: Science Revision**\n- Review all chapter notes\n- Practice diagrams\n- Solve previous year questions\n\n**Day 5-6: English Preparation**\n- Grammar revision\n- Writing practice\n- Literature review\n\n**Day 7: Final Revision**\n- Quick revision of all subjects\n- Formula sheets review\n- Light practice\n\n**Parent Tips:**\n- Ensure 7-8 hours of sleep\n- Healthy meals during exam time\n- Create a quiet study environment\n- Be available for doubts\n\nWould you like me to create a detailed daily schedule?",
        timestamp: "4:01 PM",
      },
    ],
  },
  {
    id: "pconv4",
    title: "Mathematics Weaknesses",
    createdAt: "2026-06-13",
    section: "previous",
    messages: [
      {
        id: "pm7",
        role: "user",
        content: "What are Aarav's weaknesses in Mathematics?",
        timestamp: "11:00 AM",
      },
      {
        id: "pm8",
        role: "ai",
        content: "**Mathematics Weakness Analysis for Aarav**\n\n**Current Score: 78%**\n\n**Weak Areas Identified:**\n\n1. **Algebra (65%)**\n   - Linear equations in one variable\n   - Word problems\n   - Factorization\n\n2. **Geometry (72%)**\n   - Construction of triangles\n   - Area and perimeter calculations\n   - Coordinate geometry\n\n3. **Data Handling (80%)**\n   - Statistical measures\n   - Probability concepts\n\n**Recommended Actions:**\n\n**For Parents:**\n- Spend 30 minutes daily on Algebra practice\n- Use visual aids for Geometry concepts\n- Practice with real-life examples\n\n**For Students:**\n- Solve 5 problems daily from weak areas\n- Watch video tutorials for difficult concepts\n- Take practice tests weekly\n\n**Resources:**\n- NCERT Exemplar problems\n- Previous year question papers\n- Online practice platforms\n\nWould you like specific practice problems for any topic?",
        timestamp: "11:01 AM",
      },
    ],
  },
  {
    id: "pconv5",
    title: "Fee Summary",
    createdAt: "2026-06-12",
    section: "previous",
    messages: [
      {
        id: "pm9",
        role: "user",
        content: "What's the fee status?",
        timestamp: "3:00 PM",
      },
      {
        id: "pm10",
        role: "ai",
        content: "**Fee Summary for Aarav**\n\n**Annual Fees: ₹1,20,000**\n\n**Payment Status:**\n- Paid: ₹90,000 (75%)\n- Pending: ₹30,000 (25%)\n\n**Payment History:**\n1. Installment 1: ₹30,000 - Paid (15 April)\n2. Installment 2: ₹30,000 - Paid (15 May)\n3. Installment 3: ₹30,000 - Paid (15 June)\n\n**Upcoming Payment:**\n- Installment 4: ₹30,000\n- Due Date: 30 June 2026\n- Days Remaining: 15\n\n**Fee Breakdown:**\n- Tuition Fee: ₹60,000\n- Transport Fee: ₹18,000\n- Activity Fee: ₹12,000\n- Examination Fee: ₹15,000\n- Technology Fee: ₹15,000\n\n**Recommendation:**\nAll payments are on track. No overdue amounts. Consider setting up auto-pay for the next installment.\n\nWould you like to download the fee receipt?",
        timestamp: "3:01 PM",
      },
    ],
  },
];

// Parent-specific AI responses
export const PARENT_AI_RESPONSES: Record<string, string> = {
  "performance": "**Performance Analysis**\n\n**Current Academic Standing:**\n- Overall Score: 84%\n- Class Rank: Top 25%\n- Improvement: +5% from last term\n\n**Strengths:**\n1. Science (92%) - Excellent\n2. English (88%) - Very Good\n3. Computer Science (90%) - Excellent\n\n**Areas for Improvement:**\n1. Mathematics (78%) - Needs focus\n2. Social Studies (80%) - Can improve\n\n**Attendance:** 94% - Excellent\n\n**Recommendation:**\nFocus on Mathematics practice. Consider tutoring for Algebra concepts.",
  "attendance": "**Attendance Analysis**\n\n**This Month:**\n- Present: 12 days\n- Absent: 1 day\n- Leave: 1 day\n- Rate: 86%\n\n**Overall:**\n- Total Days: 150\n- Present: 141\n- Rate: 94%\n\n**Concern:** 5% decrease from last month.\n\n**Action:** Discuss attendance consistency with child.",
  "fees": "**Fee Status Summary**\n\n**Total:** ₹1,20,000\n**Paid:** ₹90,000 (75%)\n**Pending:** ₹30,000 (25%)\n\n**Next Due:**\n- Amount: ₹30,000\n- Date: 30 June 2026\n- Days: 15 remaining\n\n**Status:** All payments on track. No overdue amounts.",
  "exams": "**Upcoming Exams**\n\n1. Mathematics Unit Test - 5 days\n2. Science Unit Test - 7 days\n3. English Unit Test - 9 days\n\n**Preparation Tips:**\n- Revise weak areas first\n- Practice previous papers\n- Maintain study schedule\n- Ensure proper rest",
  "events": "**Upcoming Events**\n\n1. Science Fair - 20 June\n2. Parent-Teacher Meeting - 25 June\n3. Summer Break - 15 July\n\n**Action Required:**\n- Science Fair: Confirm participation\n- PTM: Mark calendar\n- No administrative pending",
  "focus": "**Weekly Focus Areas**\n\n**Priority 1: Mathematics**\n- Algebra practice (30 min daily)\n- Word problems\n- Formula revision\n\n**Priority 2: Science Project**\n- Complete Electric Circuits project\n- Prepare presentation\n\n**Priority 3: Exam Prep**\n- Start revision for Unit Test\n- Practice papers\n\n**Estimated Time:** 45 minutes daily",
  "support": "**How to Support Your Child**\n\n**Academic Support:**\n1. Create a quiet study space\n2. Set consistent study hours\n3. Be available for doubts\n4. Encourage reading\n\n**Emotional Support:**\n1. Listen to concerns\n2. Celebrate small wins\n3. Stay positive about studies\n4. Maintain routine\n\n**Practical Tips:**\n1. Help with time management\n2. Monitor screen time\n3. Ensure proper sleep\n4. Healthy meals\n\n**Weekly Check-in:**\n- Review progress together\n- Discuss challenges\n- Plan next week",
  "notices": "**School Notices Summary**\n\n**Important Notices:**\n1. Sports Day Registration - Open\n2. Holiday Notice - June 15\n3. Science Exhibition - Call for Projects\n4. PTM - June 25\n5. Fee Deadline Extended - June 30\n\n**No Pending Actions:**\n- All administrative tasks completed\n- No urgent matters\n\n**Recommendation:**\nCheck notices weekly for updates.",
  "default": "**Here's what I can help you with:**\n\n1. **Performance Analysis** - Understand your child's academic progress\n2. **Attendance Monitoring** - Track attendance patterns\n3. **Exam Preparation** - Get guidance for upcoming tests\n4. **Fee Status** - Check payment status and upcoming dues\n5. **School Events** - Stay updated on school activities\n6. **Study Recommendations** - Get tips to support learning\n7. **Parent Action Plan** - Create actionable steps\n\n**Ask me anything about your child's academic journey!**",
};

// Helper function to get parent AI data
export function getParentAiData() {
  return {
    skills: PARENT_AI_SKILLS,
    suggestedPrompts: PARENT_SUGGESTED_PROMPTS,
    quickActions: PARENT_QUICK_ACTIONS,
    attachableResources: PARENT_ATTACHABLE_RESOURCES,
    conversations: PARENT_MOCK_CONVERSATIONS,
    responses: PARENT_AI_RESPONSES,
  };
}

export type ParentAiData = ReturnType<typeof getParentAiData>;
