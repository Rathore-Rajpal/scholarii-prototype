export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  attachedResource?: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  section: "today" | "yesterday" | "previous";
}

export interface AiModel {
  id: string;
  name: string;
  icon: string;
  label: string;
}

export interface AiSkill {
  id: string;
  name: string;
}

export const AI_MODELS: AiModel[] = [
  { id: "fast", name: "Scholarii Fast", icon: "\u26a1", label: "Fast" },
  { id: "smart", name: "Scholarii Smart", icon: "\ud83e\udde0", label: "Smart" },
  { id: "reasoning", name: "Scholarii Reasoning", icon: "\ud83c\udfaf", label: "Reasoning" },
];

export const AI_SKILLS: AiSkill[] = [
  { id: "general", name: "General Study" },
  { id: "homework", name: "Homework Help" },
  { id: "exam", name: "Exam Preparation" },
  { id: "concept", name: "Concept Explanation" },
  { id: "notes", name: "Notes Generation" },
  { id: "quiz", name: "Quiz Creation" },
  { id: "flashcards", name: "Flashcards" },
  { id: "assignment", name: "Assignment Assistant" },
  { id: "research", name: "Research Assistant" },
  { id: "doubt", name: "Doubt Solving" },
  { id: "planning", name: "Study Planning" },
];

export const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv1",
    title: "Photosynthesis Notes",
    createdAt: "2026-06-15",
    section: "today",
    messages: [
      { id: "m1", role: "user", content: "Create detailed notes on Photosynthesis from Chapter 6 Biology", timestamp: "10:30 AM" },
      { id: "m2", role: "ai", content: "Here are comprehensive notes on Photosynthesis:\n\n**Photosynthesis** is the process by which green plants convert light energy into chemical energy.\n\n**Key Components:**\n1. Sunlight - Energy source\n2. Water (H\u2082O) - Absorbed by roots\n3. Chlorophyll - Green pigment in leaves\n4. Carbon Dioxide (CO\u2082) - Absorbed from air\n\n**Equation:**\n6CO\u2082 + 6H\u2082O + Light \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082\n\n**Two Stages:**\n1. Light-dependent reactions (in thylakoids)\n2. Calvin Cycle (in stroma)\n\n**Importance:**\n- Produces food for plants\n- Releases oxygen\n- Base of all food chains\n\nShall I create flashcards or a quiz from these notes?", timestamp: "10:31 AM" },
      { id: "m3", role: "user", content: "Yes, create flashcards", timestamp: "10:32 AM" },
      { id: "m4", role: "ai", content: "Here are your Photosynthesis flashcards:\n\n**Card 1:**\nQ: What is photosynthesis?\nA: The process by which green plants convert light energy into chemical energy (food)\n\n**Card 2:**\nQ: What are the raw materials?\nA: Sunlight, Water (H\u2082O), Carbon Dioxide (CO\u2082), Chlorophyll\n\n**Card 3:**\nQ: What is the chemical equation?\nA: 6CO\u2082 + 6H\u2082O + Light \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082\n\n**Card 4:**\nQ: Where does photosynthesis occur?\nA: In chloroplasts, specifically in the thylakoid membrane\n\n**Card 5:**\nQ: What is the role of chlorophyll?\nA: It absorbs light energy needed for the reaction\n\nTotal: 12 flashcards created. Want me to create a quiz?", timestamp: "10:33 AM" },
    ],
  },
  {
    id: "conv2",
    title: "Math Doubts",
    createdAt: "2026-06-15",
    section: "today",
    messages: [
      { id: "m5", role: "user", content: "Explain linear equations in one variable", timestamp: "2:00 PM" },
      { id: "m6", role: "ai", content: "**Linear Equations in One Variable**\n\nA linear equation in one variable is an equation that can be written in the form:\n\n**ax + b = 0**\n\nWhere:\n- x is the variable\n- a and b are constants\n- a \u2260 0\n\n**Example:**\n2x + 5 = 15\n\n**Steps to solve:**\n1. Move constants to one side: 2x = 15 - 5\n2. Simplify: 2x = 10\n3. Divide by coefficient: x = 10/2 = 5\n\n**Verification:**\n2(5) + 5 = 10 + 5 = 15 \u2714\n\nWant me to generate practice problems?", timestamp: "2:01 PM" },
    ],
  },
  {
    id: "conv3",
    title: "Climate Change Essay",
    createdAt: "2026-06-14",
    section: "yesterday",
    messages: [
      { id: "m7", role: "user", content: "Help me write an essay on climate change", timestamp: "4:00 PM" },
      { id: "m8", role: "ai", content: "Here's a structured essay outline on Climate Change:\n\n**Title:** Climate Change: Causes, Effects, and Solutions\n\n**Introduction (100 words):**\nClimate change refers to the long-term alteration of global temperatures and weather patterns. While natural factors contribute, human activities have been the primary driver since the Industrial Revolution.\n\n**Body Paragraph 1 - Causes:**\n- Burning fossil fuels (coal, oil, gas)\n- Deforestation\n- Industrial processes\n- Agriculture (methane emissions)\n\n**Body Paragraph 2 - Effects:**\n- Rising sea levels\n- Extreme weather events\n- Loss of biodiversity\n- Food and water insecurity\n\n**Conclusion:**\nAddressing climate change requires global cooperation, sustainable practices, and immediate action.\n\nShall I expand any section?", timestamp: "4:01 PM" },
    ],
  },
  {
    id: "conv4",
    title: "Physics Revision",
    createdAt: "2026-06-13",
    section: "previous",
    messages: [
      { id: "m9", role: "user", content: "Summarize Newton's Laws of Motion", timestamp: "11:00 AM" },
      { id: "m10", role: "ai", content: "**Newton's Three Laws of Motion:**\n\n**1st Law (Inertia):**\nAn object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n**2nd Law (F=ma):**\nThe force acting on an object equals its mass times its acceleration.\nF = ma\n\n**3rd Law (Action-Reaction):**\nFor every action, there is an equal and opposite reaction.\n\n**Applications:**\n- Seatbelts (1st Law)\n- Rocket propulsion (3rd Law)\n- Car acceleration (2nd Law)\n\nWant practice problems on Newton's Laws?", timestamp: "11:01 AM" },
    ],
  },
  {
    id: "conv5",
    title: "Computer Networks",
    createdAt: "2026-06-12",
    section: "previous",
    messages: [
      { id: "m11", role: "user", content: "Explain HTML basics for my portfolio project", timestamp: "3:00 PM" },
      { id: "m12", role: "ai", content: "**HTML Basics for Portfolio Page:**\n\n**HTML Structure:**\n```html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>My Portfolio</title>\n</head>\n<body>\n  <h1>Hello, I'm Rahul</h1>\n  <p>Student at Delhi Public School</p>\n</body>\n</html>\n```\n\n**Essential Elements:**\n- `<h1>` to `<h6>` - Headings\n- `<p>` - Paragraphs\n- `<img>` - Images\n- `<a>` - Links\n- `<div>` - Container\n- `<ul>`, `<li>` - Lists\n\n**Portfolio Sections:**\n1. Profile section\n2. Skills section\n3. Projects section\n4. Contact section\n\nWant me to create the full HTML template?", timestamp: "3:01 PM" },
    ],
  },
];

export const SUGGESTED_PROMPTS = [
  "Explain Photosynthesis",
  "Create notes from Chapter 5",
  "Generate quiz questions",
  "Help me prepare for Unit Test",
  "Summarize this PDF",
  "Solve algebraic equations",
  "Create flashcards for Science",
  "Explain Newton's Laws",
];

export const QUICK_ACTIONS = [
  { label: "Explain Concept", icon: "\ud83d\udca1" },
  { label: "Create Notes", icon: "\ud83d\udcdd" },
  { label: "Generate Quiz", icon: "\ud83e\udd11" },
  { label: "Flashcards", icon: "\ud83d\udca3" },
  { label: "Prepare for Exam", icon: "\ud83c\udf93" },
  { label: "Summarize", icon: "\ud83d\udcc4" },
  { label: "Solve Doubt", icon: "\u2753" },
];

export const ATTACHABLE_RESOURCES = [
  { id: "r1", title: "Mathematics NCERT", subject: "Mathematics", type: "Book" },
  { id: "r2", title: "Science NCERT", subject: "Science", type: "Book" },
  { id: "r3", title: "English Reader", subject: "English", type: "Book" },
  { id: "r4", title: "Algebra Complete Notes", subject: "Mathematics", type: "Notes" },
  { id: "r5", title: "Photosynthesis Project Guide", subject: "Science", type: "PPT" },
  { id: "r6", title: "Climate Change Worksheet", subject: "English", type: "Worksheet" },
  { id: "r7", title: "Physics Formula Sheet", subject: "Science", type: "Notes" },
  { id: "r8", title: "Unit Test 1 - Mathematics", subject: "Mathematics", type: "Paper" },
  { id: "r9", title: "Mid-Term - Science", subject: "Science", type: "Paper" },
];

export const AI_RESPONSES: Record<string, string> = {
  "explain concept": "I'll explain this concept clearly.\n\nLet me break it down into simple terms:\n\n1. **Definition**: The core idea involves understanding fundamental principles.\n\n2. **Key Components**: There are several important elements to consider.\n\n3. **Real-world Application**: This concept applies to everyday situations.\n\n4. **Visual Example**: Think of it like a simple analogy.\n\nWant me to go deeper into any specific aspect?",
  "create notes": "Here are your comprehensive study notes:\n\n**Topic Overview**\n- Key concept 1\n- Key concept 2\n- Key concept 3\n\n**Detailed Notes**\n\n1. First important point with explanation\n2. Second important point with examples\n3. Third important point with applications\n\n**Summary Points**\n- Point 1\n- Point 2\n- Point 3\n\n**Practice Questions**\n1. Question 1\n2. Question 2\n3. Question 3\n\nShall I expand on any section?",
  "generate quiz": "Here's your quiz:\n\n**Question 1** (Easy)\nMultiple choice question...\na) Option A\nb) Option B\nc) Option C\nd) Option D\n**Answer: b)**\n\n**Question 2** (Medium)\nShort answer question...\n**Answer:** Detailed explanation\n\n**Question 3** (Hard)\nLong answer question...\n**Answer:** Comprehensive response\n\nTotal: 10 questions generated. Want more?",
  "flashcards": "Here are your flashcards:\n\n**Card 1**\nQ: Key term definition?\nA: Clear explanation\n\n**Card 2**\nQ: Formula or concept?\nA: Application and example\n\n**Card 3**\nQ: Important principle?\nA: Real-world relevance\n\nTotal: 15 flashcards created. Want me to create a quiz from these?",
  "prepare for exam": "Here's your exam preparation plan:\n\n**Phase 1: Foundation** (Days 1-3)\n- Review all chapter notes\n- Identify weak areas\n- Create revision schedule\n\n**Phase 2: Practice** (Days 4-6)\n- Solve previous papers\n- Practice important questions\n- Take mock tests\n\n**Phase 3: Revision** (Days 7-9)\n- Quick revision notes\n- Flashcard review\n- Formula sheets\n\n**Phase 4: Final** (Day 10)\n- Light revision\n- Rest and relax\n- Confidence building\n\nWant me to create a detailed schedule?",
  "summarize": "Here's a concise summary:\n\n**Key Points:**\n1. Main idea 1\n2. Main idea 2\n3. Main idea 3\n\n**Important Details:**\n- Detail 1\n- Detail 2\n- Detail 3\n\n**Conclusion:**\nBrief overview of the main takeaway.\n\n**Quick Facts:**\n- Fact 1\n- Fact 2\n- Fact 3\n\nWant me to expand on any point?",
  "solve doubt": "Let me help you with this doubt.\n\n**Understanding the Problem:**\nThe question asks about...\n\n**Step-by-Step Solution:**\n1. First, identify the given information\n2. Next, apply the relevant formula/concept\n3. Then, solve step by step\n4. Finally, verify the answer\n\n**Common Mistakes to Avoid:**\n- Mistake 1\n- Mistake 2\n\n**Similar Practice Problems:**\n1. Problem 1\n2. Problem 2\n\nDoes this clear your doubt?",
};
