import type { ChatConversation, AiSkill } from "./ai-mock-data";

export const TEACHER_AI_SKILLS: AiSkill[] = [
  { id: "lesson-planning", name: "Lesson Planning" },
  { id: "student-analysis", name: "Student Analysis" },
  { id: "exam-prep", name: "Exam Preparation" },
  { id: "notes-generation", name: "Notes Generation" },
  { id: "quiz-creation", name: "Quiz Creation" },
  { id: "feedback", name: "Student Feedback" },
  { id: "parent-comm", name: "Parent Communication" },
  { id: "class-management", name: "Class Management" },
  { id: "general", name: "General Teaching" },
];

export const TEACHER_SUGGESTED_PROMPTS = [
  "Create lesson plan for Chapter 5",
  "Analyze class 8A performance",
  "Generate practice questions for Unit Test",
  "Help write student report cards",
  "Create engaging activity for Linear Equations",
  "How to improve low-performing students?",
  "Draft parent meeting notes",
  "Suggest teaching strategies for weak students",
];

export const TEACHER_QUICK_ACTIONS = [
  { label: "Lesson Plan", icon: "📝" },
  { label: "Student Report", icon: "📊" },
  { label: "Quiz Builder", icon: "❓" },
  { label: "Notes Generator", icon: "📚" },
  { label: "Parent Message", icon: "💬" },
  { label: "Activity Ideas", icon: "🎯" },
];

export const TEACHER_ATTACHABLE_RESOURCES = [
  { id: "tr1", title: "Mathematics NCERT Class 8", subject: "Mathematics", type: "Book" },
  { id: "tr2", title: "Science NCERT Class 8", subject: "Science", type: "Book" },
  { id: "tr3", title: "Class 8A Attendance Report", subject: "Attendance", type: "Report" },
  { id: "tr4", title: "Unit 1 Results - Class 8", subject: "Exams", type: "Report" },
  { id: "tr5", title: "Lesson Plan Template", subject: "Teaching", type: "Template" },
  { id: "tr6", title: "Student Performance Data", subject: "Analytics", type: "Data" },
  { id: "tr7", title: "Activity Worksheet - Algebra", subject: "Mathematics", type: "Worksheet" },
  { id: "tr8", title: "Parent Communication Log", subject: "Communication", type: "Log" },
];

export const TEACHER_MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "tconv1",
    title: "Lesson Plan - Linear Equations",
    createdAt: "2026-06-20",
    section: "today",
    messages: [
      { id: "tm1", role: "user", content: "Create a detailed lesson plan for Linear Equations in One Variable for Class 8", timestamp: "8:30 AM" },
      { id: "tm2", role: "ai", content: "**Lesson Plan: Linear Equations in One Variable**\n\n**Class:** 8 | **Duration:** 40 minutes | **Subject:** Mathematics\n\n**Learning Objectives:**\n1. Define linear equation in one variable\n2. Solve equations of form ax + b = c\n3. Apply equations to real-life problems\n\n**Materials Needed:**\n- Whiteboard and markers\n- Practice worksheet\n- Real-life example cards\n\n**Lesson Flow:**\n\n**1. Warm-up (5 min)**\n- Quick recap: What is a variable?\n- Write 2x + 3 = 7 on board — ask students to guess x\n\n**2. Introduction (10 min)**\n- Define linear equation: ax + b = 0\n- Explain coefficients and constants\n- Show step-by-step solving method\n\n**3. Guided Practice (10 min)**\n- Solve 3 examples together on board\n- Example 1: 2x + 5 = 15 → x = 5\n- Example 2: 3x - 7 = 8 → x = 5\n- Example 3: 4x + 2 = 3x + 9 → x = 7\n\n**4. Independent Practice (10 min)**\n- Worksheet with 8 problems\n- Difficulty: Easy (3) → Medium (3) → Hard (2)\n\n**5. Wrap-up (5 min)**\n- Quick quiz: 3 questions\n- Homework: 5 problems from textbook\n\n**Assessment:**\n- Observe during independent practice\n- Collect worksheet for review\n- Check homework next class\n\n**Differentiation:**\n- Slow learners: Provide formula card\n- Advanced: Challenge problems with variables on both sides\n\nWant me to generate the practice worksheet?", timestamp: "8:31 AM" },
    ],
  },
  {
    id: "tconv2",
    title: "Class 8A Performance Analysis",
    createdAt: "2026-06-20",
    section: "today",
    messages: [
      { id: "tm3", role: "user", content: "Analyze performance of Class 8A in the last Unit Test", timestamp: "10:45 AM" },
      { id: "tm4", role: "ai", content: "**Class 8A Performance Analysis — Unit Test 1**\n\n**Overall:**\n- Average: 74% (Class avg: 72%)\n- Pass rate: 88% (2 students failed)\n- Top score: 95% (Priya Sharma)\n- Lowest: 38% (Rohan Gupta)\n\n**Subject-wise Breakdown:**\n| Subject | Avg | Pass % | Needs Focus |\n|---------|-----|--------|-------------|\n| Mathematics | 71% | 85% | 4 students below 60% |\n| Science | 78% | 92% | 2 students below 60% |\n| English | 82% | 96% | 1 student below 60% |\n| Hindi | 76% | 90% | 2 students below 60% |\n| Social Studies | 72% | 88% | 3 students below 60% |\n\n**Key Insights:**\n1. Mathematics is the weakest subject — focus needed\n2. 2 students (Rohan, Ananya) need immediate intervention\n3. Top 5 students are consistent across subjects\n4. Middle group (60-75%) shows most improvement potential\n\n**Recommended Actions:**\n1. Conduct remedial classes for Math (Tue/Thu)\n2. Pair weak students with strong peers\n3. Create additional practice sheets for Algebra\n4. Schedule parent meeting for 2 at-risk students\n\nWant me to generate the remedial class plan?", timestamp: "10:46 AM" },
    ],
  },
  {
    id: "tconv3",
    title: "Quiz for Photosynthesis",
    createdAt: "2026-06-19",
    section: "yesterday",
    messages: [
      { id: "tm5", role: "user", content: "Create a 10-question quiz on Photosynthesis for Class 7", timestamp: "4:00 PM" },
      { id: "tm6", role: "ai", content: "**Quiz: Photosynthesis — Class 7**\n\n**Time:** 15 minutes | **Total Marks:** 20\n\n**Q1.** (2 marks) What is photosynthesis?\n**Answer:** The process by which green plants make their own food using sunlight, water, and CO₂.\n\n**Q2.** (2 marks) Name the raw materials of photosynthesis.\n**Answer:** Sunlight, Water (H₂O), Carbon Dioxide (CO₂), Chlorophyll.\n\n**Q3.** (2 marks) Where does photosynthesis occur in a plant cell?\n**Answer:** In chloroplasts.\n\n**Q4.** (2 marks) What is the role of chlorophyll?\n**Answer:** It absorbs light energy needed for the reaction.\n\n**Q5.** (2 marks) Write the chemical equation for photosynthesis.\n**Answer:** 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n\n**Q6.** (2 marks) What is the by-product of photosynthesis?\n**Answer:** Oxygen (O₂).\n\n**Q7.** (2 marks) Do all parts of a plant perform photosynthesis?\n**Answer:** No, only green parts containing chlorophyll (mainly leaves).\n\n**Q8.** (2 marks) What would happen if there was no sunlight?\n**Answer:** Photosynthesis would stop; plants cannot make food.\n\n**Q9.** (2 marks) Name the two stages of photosynthesis.\n**Answer:** Light-dependent reactions and Calvin Cycle.\n\n**Q10.** (2 marks) How do plants use the glucose produced?\n**Answer:** For energy, growth, and storing as starch.\n\n**Grading:** 18-20: Excellent | 14-17: Good | 10-13: Needs improvement | <10: Remedial needed\n\nWant me to create a more detailed version or a different difficulty level?", timestamp: "4:01 PM" },
    ],
  },
  {
    id: "tconv4",
    title: "Parent Meeting Notes",
    createdAt: "2026-06-18",
    section: "previous",
    messages: [
      { id: "tm7", role: "user", content: "Help me draft notes for parent-teacher meeting for underperforming students", timestamp: "11:00 AM" },
      { id: "tm8", role: "ai", content: "**Parent-Teacher Meeting Notes — Underperforming Students**\n\n**Meeting Date:** June 25, 2026 | **Time:** 3:00 PM\n\n---\n\n**Student 1: Rohan Gupta (Class 8A)**\n- **Current Performance:** 52% average\n- **Concerns:** Mathematics (38%), Social Studies (45%)\n- **Attendance:** 82% (below 85% threshold)\n- **Discussion Points:**\n  - Missing homework frequently\n  - Needs to attend remedial classes\n  - Parents to ensure 1-hour daily study time\n- **Action Plan:**\n  - Remedial Math: Tue/Thu 3:30 PM\n  - Weekly progress check with parents\n  - Peer tutoring with Priya Sharma\n\n---\n\n**Student 2: Ananya Joshi (Class 8A)**\n- **Current Performance:** 58% average\n- **Concerns:** Science (52%), Hindi (55%)\n- **Attendance:** 88% (acceptable)\n- **Discussion Points:**\n  - Good effort but concepts unclear\n  - Needs visual learning aids\n  - Parents to support with diagrams/models\n- **Action Plan:**\n  - Extra practice sheets for Science\n  - Flashcard-based learning for Hindi\n  - Monthly progress review\n\n---\n\n**General Notes:**\n- Thank parents for attending\n- Share progress reports\n- Discuss upcoming exam preparation\n- Collect feedback on teaching methods\n\nWant me to create a printable version or add more students?", timestamp: "11:01 AM" },
    ],
  },
  {
    id: "tconv5",
    title: "Engaging Activities for Algebra",
    createdAt: "2026-06-17",
    section: "previous",
    messages: [
      { id: "tm9", role: "user", content: "Suggest some engaging activities to teach Algebra to Class 8", timestamp: "2:30 PM" },
      { id: "tm10", role: "ai", content: "**Engaging Algebra Activities for Class 8**\n\n**1. Equation Balancing Game (15 min)**\n- Use a physical balance scale\n- Place variables on one side, constants on other\n- Students physically balance to find x\n- Great for visual learners\n\n**2. Algebra Tiles (20 min)**\n- Use colored tiles: green (+), red (-)\n- Represent equations physically\n- Students solve by grouping tiles\n- Helps understand positive/negative numbers\n\n**3. Real-Life Algebra (15 min)**\n- \"If you buy 3 notebooks at ₹x each and pay ₹50, get ₹5 back...\"\n- Students create equations from stories\n- Relates algebra to daily life\n\n**4. Math Riddles Competition (10 min)**\n- Teams solve algebraic riddles\n- First correct answer gets points\n- Example: \"I am a number. Double me and add 5, you get 15. What am I?\"\n- Answer: 5\n\n**5. Digital Quiz (Kahoot/Quizizz) (10 min)**\n- Quick quiz on class devices\n- Competitive and fun\n- Instant feedback\n\n**6. Station Rotation (30 min)**\n- 4 stations, 7 min each\n- Station 1: Worksheet problems\n- Station 2: Algebra tiles\n- Station 3: Real-life problems\n- Station 4: Peer teaching\n\n**Implementation Tips:**\n- Mix activities across lessons\n- Use competition for motivation\n- Always connect to real life\n- Provide scaffolded worksheets\n\nWant me to create detailed instructions for any specific activity?", timestamp: "2:31 PM" },
    ],
  },
];

export const TEACHER_AI_RESPONSES: Record<string, string> = {
  "lesson plan": "**Lesson Plan Created**\n\n**Topic:** [Topic Name]\n**Class:** [Class] | **Duration:** 40 min\n\n**Objectives:**\n1. Define key concept\n2. Solve related problems\n3. Apply to real-life\n\n**Flow:**\n1. Warm-up (5 min)\n2. Introduction (10 min)\n3. Guided Practice (10 min)\n4. Independent Practice (10 min)\n5. Wrap-up (5 min)\n\nWant me to customize this for a specific topic?",
  "student analysis": "**Student Analysis**\n\n**Class Average:** 74%\n**Pass Rate:** 88%\n**Top Performer:** 95%\n**At-risk:** 2 students below 50%\n\n**Weakest Subject:** Mathematics (71%)\n**Strongest Subject:** English (82%)\n\nRecommendation: Focus on remedial classes for Math.",
  "exam preparation": "**Exam Preparation Plan**\n\n**Phase 1 (Days 1-3):** Revision of all chapters\n**Phase 2 (Days 4-6):** Practice papers\n**Phase 3 (Days 7-8):** Weak area focus\n**Phase 4 (Day 9):** Quick revision\n**Phase 5 (Day 10):** Rest and confidence\n\nWant me to create chapter-wise revision schedule?",
  "quiz creation": "**Quiz Created**\n\n**Questions:** 10\n**Total Marks:** 20\n**Difficulty:** Mixed (Easy/Medium/Hard)\n**Time:** 15 minutes\n\nDistribution:\n- Easy: 3 questions (6 marks)\n- Medium: 4 questions (8 marks)\n- Hard: 3 questions (6 marks)\n\nWant me to adjust difficulty or number of questions?",
  "feedback": "**Student Feedback Template**\n\n**Student:** [Name]\n**Class:** [Class]\n**Subject:** [Subject]\n\n**Strengths:**\n- [Strength 1]\n- [Strength 2]\n\n**Areas for Improvement:**\n- [Area 1]\n- [Area 2]\n\n**Recommendations:**\n1. [Recommendation 1]\n2. [Recommendation 2]\n\n**Parent Action:**\n- [Action item]\n\nShall I customize this for a specific student?",
  "parent communication": "**Parent Communication Draft**\n\nDear [Parent Name],\n\nI hope this message finds you well. I wanted to share some updates about [Student Name]'s progress in my class.\n\n**Academic Performance:**\n- Current grade: [Grade]\n- Class rank: [Rank]\n- Attendance: [Percentage]\n\n**Strengths:**\n- [Strength]\n\n**Areas to work on:**\n- [Area]\n\n**How you can help at home:**\n- [Suggestion]\n\nPlease feel free to schedule a meeting if you'd like to discuss further.\n\nBest regards,\n[Teacher Name]",
  "default": "As your AI teaching assistant, I can help you with:\n\n1. **Lesson Planning** — Create detailed lesson plans\n2. **Student Analysis** — Analyze class performance\n3. **Quiz Creation** — Generate assessments\n4. **Notes Generation** — Create study materials\n5. **Parent Communication** — Draft messages and reports\n6. **Activity Ideas** — Suggest engaging classroom activities\n\nWhat would you like help with?",
};
