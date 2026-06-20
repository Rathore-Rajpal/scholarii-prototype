import type { ChatConversation, AiSkill } from "./ai-mock-data";

export const PRINCIPAL_AI_SKILLS: AiSkill[] = [
  { id: "school-overview", name: "School Overview" },
  { id: "fee-analysis", name: "Fee Collection Analysis" },
  { id: "staff-performance", name: "Staff Performance" },
  { id: "student-analytics", name: "Student Analytics" },
  { id: "compliance", name: "Compliance & Reports" },
  { id: "budget", name: "Budget Planning" },
  { id: "parent-engagement", name: "Parent Engagement" },
  { id: "academic-insights", name: "Academic Insights" },
  { id: "general", name: "General Queries" },
];

export const PRINCIPAL_SUGGESTED_PROMPTS = [
  "Show school performance overview",
  "Analyze fee collection trends",
  "Which classes need attention?",
  "Staff attendance summary",
  "Upcoming compliance deadlines",
  "Revenue vs expenses this quarter",
  "Generate monthly report",
  "Compare this year vs last year",
];

export const PRINCIPAL_QUICK_ACTIONS = [
  { label: "School Dashboard", icon: "🏫" },
  { label: "Fee Report", icon: "💰" },
  { label: "Staff Overview", icon: "👥" },
  { label: "Academic Report", icon: "📊" },
  { label: "Compliance Check", icon: "✅" },
  { label: "Budget Review", icon: "📋" },
];

export const PRINCIPAL_ATTACHABLE_RESOURCES = [
  { id: "prr1", title: "Annual Report 2025-26", subject: "Administration", type: "Report" },
  { id: "prr2", title: "Fee Collection Summary - June", subject: "Finance", type: "Report" },
  { id: "prr3", title: "Staff Attendance Report", subject: "HR", type: "Report" },
  { id: "prr4", title: "Academic Performance - Unit 1", subject: "Academics", type: "Report" },
  { id: "prr5", title: "Compliance Checklist", subject: "Compliance", type: "Document" },
  { id: "prr6", title: "Budget Utilization - Q1", subject: "Finance", type: "Report" },
  { id: "prr7", title: "Parent Feedback Summary", subject: "Communication", type: "Report" },
  { id: "prr8", title: "Student Enrollment Data", subject: "Admissions", type: "Data" },
];

export const PRINCIPAL_MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "pconv1",
    title: "School Performance Overview",
    createdAt: "2026-06-20",
    section: "today",
    messages: [
      { id: "pm1", role: "user", content: "Give me a quick overview of school performance this quarter", timestamp: "9:15 AM" },
      { id: "pm2", role: "ai", content: "**School Performance Overview — Q1 2026-27**\n\n**Academic Health:**\n- Average pass rate: 91% (up from 88% last quarter)\n- Top performing class: 10A (96% pass rate)\n- Needs attention: 9B (82% pass rate)\n- Board exam readiness: 87% students on track\n\n**Financial Snapshot:**\n- Revenue: ₹29.9L (92% of target)\n- Fee collection rate: 89%\n- Outstanding dues: ₹2.43L from 42 students\n- Net surplus: ₹14.8L\n\n**Staff Update:**\n- 2 pending leave requests\n- 1 teacher on medical leave (Science dept)\n- Staff satisfaction score: 4.2/5\n\n**Key Alerts:**\n- 3 students at risk of dropping below 75% attendance\n- Infrastructure spending 4% over budget\n- Compliance audit due in 6 weeks\n\nWant me to drill down into any specific area?", timestamp: "9:16 AM" },
    ],
  },
  {
    id: "pconv2",
    title: "Fee Defaulters Analysis",
    createdAt: "2026-06-20",
    section: "today",
    messages: [
      { id: "pm3", role: "user", content: "Analyze fee defaulters and suggest actions", timestamp: "11:00 AM" },
      { id: "pm4", role: "ai", content: "**Fee Defaulter Analysis**\n\n**Summary:**\n- Total defaulters: 42 students\n- Total outstanding: ₹2,43,000\n- High-risk (60+ days): 8 students — ₹1,83,000\n- Medium-risk (30-60 days): 12 students — ₹3,20,000\n- Low-risk (<30 days): 22 students — ₹2,80,000\n\n**Class-wise Breakdown:**\n1. Class 9A: ₹83,000 (highest)\n2. Class 8B: ₹52,000\n3. Class 10A: ₹40,000\n\n**Root Causes:**\n- 60% parents cite cash flow issues\n- 25% report dissatisfaction with recent fee hike\n- 15% are genuinely forgetful\n\n**Recommended Actions:**\n1. Send personalized SMS reminders to high-risk defaulters\n2. Offer 2-month EMI option for amounts above ₹30K\n3. Schedule meeting with Class 9 parents\n4. Review fee structure for next quarter\n\nShall I draft the reminder messages?", timestamp: "11:01 AM" },
    ],
  },
  {
    id: "pconv3",
    title: "Staff Performance Insights",
    createdAt: "2026-06-19",
    section: "yesterday",
    messages: [
      { id: "pm5", role: "user", content: "How are the teachers performing overall?", timestamp: "3:30 PM" },
      { id: "pm6", role: "ai", content: "**Staff Performance Summary**\n\n**Teaching Staff (24 members):**\n- Average student feedback: 4.3/5\n- Lesson plan compliance: 94%\n- Average class performance: 78%\n- Top performer: Mrs. Kavita Sharma (Math) — 92% student pass rate\n- Needs support: Mr. Amit Deshmukh (Hindi) — 71% pass rate\n\n**Non-Teaching Staff (12 members):**\n- Task completion rate: 88%\n- Response time: 4.2/5\n- Top performer: Mr. Sunil Jadhav (Admin)\n\n**Concerns:**\n- 3 teachers have inconsistent attendance\n- Science lab maintenance pending\n- 2 staff members have pending leave approvals\n\n**Recommendations:**\n1. Recognize top performers in next staff meeting\n2. Provide mentoring support for underperformers\n3. Address lab maintenance urgently\n\nWant a detailed report on any department?", timestamp: "3:31 PM" },
    ],
  },
  {
    id: "pconv4",
    title: "Budget Utilization Review",
    createdAt: "2026-06-18",
    section: "previous",
    messages: [
      { id: "pm7", role: "user", content: "Show me budget utilization for this quarter", timestamp: "10:00 AM" },
      { id: "pm8", role: "ai", content: "**Q1 Budget Utilization Report**\n\n**Total Budget: ₹14,00,000**\n**Utilized: ₹14,10,000 (100.7%)**\n\n**Category Breakdown:**\n| Category | Budget | Actual | Status |\n|----------|--------|--------|--------|\n| Infrastructure | ₹5,00,000 | ₹5,20,000 | ⚠️ +4% |\n| Utilities | ₹1,80,000 | ₹1,65,000 | ✅ -8% |\n| Events | ₹1,50,000 | ₹1,40,000 | ✅ -7% |\n| Maintenance | ₹1,20,000 | ₹1,35,000 | ⚠️ +12% |\n| Transportation | ₹2,00,000 | ₹1,90,000 | ✅ -5% |\n| Technology | ₹1,00,000 | ₹95,000 | ✅ -5% |\n| Learning | ₹80,000 | ₹72,000 | ✅ -10% |\n| Misc | ₹70,000 | ₹83,000 | ⚠️ +18% |\n\n**Key Findings:**\n- Infrastructure overspend due to unexpected roof repairs\n- Maintenance exceeded due to AC replacements\n- Miscellaneous includes one-time security upgrade\n\n**Forecast:** If trend continues, Q2 will exceed budget by 3%.\n\nWant me to suggest cost optimization measures?", timestamp: "10:01 AM" },
    ],
  },
  {
    id: "pconv5",
    title: "Compliance Status",
    createdAt: "2026-06-17",
    section: "previous",
    messages: [
      { id: "pm9", role: "user", content: "What compliance items are due soon?", timestamp: "2:00 PM" },
      { id: "pm10", role: "ai", content: "**Compliance Status Report**\n\n**Completed (12/15):**\n✅ Annual audit report submitted\n✅ Staff background verification\n✅ Fire safety certificate renewed\n✅ Building safety inspection passed\n✅ Water quality test completed\n✅ Student insurance updated\n✅ Board affiliation renewal\n✅ Environmental compliance\n✅ Tax filings up to date\n✅ Data privacy assessment\n✅ Accessibility audit\n✅ First aid certification\n\n**Pending (3/15):**\n⚠️ **Building Safety Certificate** — Renewal due by Aug 2026\n⚠️ **Water Testing** — Annual test due July 2026\n⚠️ **Staff PF Compliance** — 2 staff members need PF transfer\n\n**Upcoming (Next 90 days):**\n📅 Aug 15: Mid-year inspection\n📅 Sep 1: Board affiliation review\n📅 Sep 15: Staff appraisal deadline\n\n**Risk Level:** LOW — All critical items on track.\n\nWant me to draft action items for the pending items?", timestamp: "2:01 PM" },
    ],
  },
];

export const PRINCIPAL_AI_RESPONSES: Record<string, string> = {
  "school overview": "**School Health Dashboard**\n\n**Academic:** 91% pass rate, improving trend\n**Financial:** ₹14.8L net surplus, 89% collection rate\n**Staff:** 24 teaching, 12 non-teaching — 88% attendance\n**Students:** 480 enrolled, 94% attendance average\n**Compliance:** 12/15 items complete, 3 pending\n\nOverall school health score: **8.2/10**\n\nWant detailed breakdown of any area?",
  "fee analysis": "**Fee Collection Analysis**\n\n**Collected:** ₹26,00,000 (89%)\n**Outstanding:** ₹2,43,000 from 42 students\n**Trend:** Declining 8% month-over-month\n**High-risk:** 8 students with 60+ days overdue\n**Top defaulter class:** 9A (₹83,000)\n\nRecommendation: Initiate fee recovery drive.",
  "staff performance": "**Staff Performance Summary**\n\n**Top Performers:**\n1. Mrs. Kavita Sharma (Math) — 92% pass rate\n2. Mr. Rajesh Kumar (Science) — 89% pass rate\n\n**Needs Support:**\n1. Mr. Amit Deshmukh (Hindi) — 71% pass rate\n2. 3 staff with inconsistent attendance\n\n**Satisfaction Score:** 4.3/5",
  "student analytics": "**Student Analytics**\n\n**Total:** 480 students\n**Attendance Average:** 94%\n**At-risk (<75%):** 3 students\n**Top performing class:** 10A (96% pass rate)\n**Needs attention:** 9B (82% pass rate)\n**Board exam readiness:** 87% on track",
  "compliance": "**Compliance Status**\n\n**Completed:** 12/15 items\n**Pending:** 3 items (non-critical)\n**Next deadline:** Building safety renewal — Aug 2026\n**Risk level:** LOW\n\nAll critical compliance items are on track.",
  "budget": "**Budget Utilization — Q1**\n\n**Total:** ₹14,00,000\n**Utilized:** ₹14,10,000 (100.7%)\n**Over budget by:** ₹10,000\n\n**Key overspends:**\n- Infrastructure: +4%\n- Maintenance: +12%\n- Miscellaneous: +18%\n\nForecast: Q2 may exceed by 3% if trend continues.",
  "revenue": "**Revenue Analysis**\n\n**Total Revenue:** ₹29.9L\n**Primary source:** Tuition fees (62%)\n**Growth:** 5% month-over-month\n**Best month:** May (₹31L)\n**Worst month:** Mar (₹27.5L)\n\nProjected Q2 revenue: ₹32-34L.",
  "report": "**Monthly Report Summary**\n\n**Academics:** Pass rate improved to 91%\n**Finance:** Net surplus ₹14.8L\n**Staff:** 2 pending leave requests\n**Students:** 3 at-risk students identified\n**Compliance:** 3 items pending\n\nShall I generate the full report?",
  "default": "I understand your query. As your AI financial and academic advisor, here's my analysis:\n\n**Key Metrics:**\n1. Academic performance: 91% pass rate\n2. Financial health: ₹14.8L surplus\n3. Staff efficiency: 88% attendance\n4. Compliance: 80% complete\n\n**Recommendations:**\n1. Focus on fee collection improvement\n2. Address staff performance gaps\n3. Complete pending compliance items\n\nWhat specific area would you like me to dive deeper into?",
};
