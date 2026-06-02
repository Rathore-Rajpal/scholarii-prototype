import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Eye
} from "lucide-react";

export const Route = createFileRoute("/app/academics")({ component: AcademicsPage });

const exams = [
  { id: 1, name: "Unit-1 Exam", status: "Conducted", date: "Apr 15-20, 2026" },
  { id: 2, name: "Mid-Semester Exam", status: "Conducted", date: "May 10-15, 2026" },
  { id: 3, name: "Unit-2 Exam", status: "Pending", date: "Jun 20-25, 2026" },
  { id: 4, name: "Final Exams", status: "Pending", date: "Jul 15-30, 2026" },
];

const classes = [
  "Class 10A", "Class 10B", "Class 9A", "Class 9B", "Class 8A", "Class 8B"
];

type StudentPerformance = {
  id: string;
  name: string;
  percentage: number;
  totalMarks: number;
  maxMarks: number;
  subjectMarks: { subject: string; marks: number; maxMarks: number; percentage: number }[];
};

function generateStudentData(): StudentPerformance[] {
  const firstNames = ["Aarav", "Maya", "Ishaan", "Diya", "Rohan", "Kavya", "Saanvi", "Aditya", "Priya", "Kabir"];
  const lastNames = ["Singh", "Rao", "Patel", "Sharma", "Verma", "Nair", "Gupta", "Joshi", "Menon", "Khan"];
  const subjects = ["Mathematics", "English", "Science", "Social Studies", "Hindi"];
  const maxMarks = 450;
  const subjectMax = 90;

  const students: StudentPerformance[] = [];
  // Generate 72 students per class (430 total / 6 classes)
  for (let i = 0; i < 72; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const subjectMarks = subjects.map(subject => {
      const marks = Math.floor(Math.random() * 80) + 10;
      return {
        subject,
        marks,
        maxMarks: subjectMax,
        percentage: Math.round((marks / subjectMax) * 100)
      };
    });
    const totalMarks = subjectMarks.reduce((sum, s) => sum + s.marks, 0);
    const percentage = Math.round((totalMarks / maxMarks) * 100);
    students.push({
      id: `STU-${i + 1}`,
      name: `${firstName} ${lastName}`,
      percentage,
      totalMarks,
      maxMarks,
      subjectMarks
    });
  }
  
  return students.sort((a, b) => b.percentage - a.percentage);
}

function AcademicsPage() {
  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const [selectedExam, setSelectedExam] = useState(1);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [showMoreTopStudents, setShowMoreTopStudents] = useState(false);
  const [showMoreBottomStudents, setShowMoreBottomStudents] = useState(false);

  const allStudents = useMemo(() => generateStudentData(), []);
  const topStudents = allStudents.slice(0, 5);
  const bottomStudents = allStudents.slice(-5).reverse();
  const topStudentsWithMore = showMoreTopStudents ? allStudents.slice(0, 15) : topStudents;
  const bottomStudentsWithMore = showMoreBottomStudents ? allStudents.slice(-15).reverse() : bottomStudents;

  const classStats = useMemo(() => {
    const passCount = allStudents.filter(s => s.percentage >= 40).length;
    const failCount = allStudents.length - passCount;
    const passingPercent = Math.round((passCount / allStudents.length) * 100);
    
    const avgPercentages = [0, 0, 0, 0, 0];
    allStudents.forEach(student => {
      student.subjectMarks.forEach((s, idx) => {
        avgPercentages[idx] += s.percentage;
      });
    });
    avgPercentages.forEach((_, idx) => {
      avgPercentages[idx] = Math.round(avgPercentages[idx] / allStudents.length);
    });

    const subjectNames = ["Mathematics", "English", "Science", "Social Studies", "Hindi"];
    const highestPerformingIdx = avgPercentages.indexOf(Math.max(...avgPercentages));
    const lowestPerformingIdx = avgPercentages.indexOf(Math.min(...avgPercentages));

    return {
      totalStudents: allStudents.length,
      passCount,
      failCount,
      passingPercent,
      classAverage: Math.round(allStudents.reduce((sum, s) => sum + s.percentage, 0) / allStudents.length),
      highestPerformingSubject: subjectNames[highestPerformingIdx],
      lowestPerformingSubject: subjectNames[lowestPerformingIdx],
      highestPerformingPercent: avgPercentages[highestPerformingIdx],
      lowestPerformingPercent: avgPercentages[lowestPerformingIdx],
    };
  }, [allStudents]);

  const exam = exams.find(e => e.id === selectedExam);

  const overallStats = useMemo(() => {
    if (!exam || exam.status === "Pending") {
      return null;
    }
    
    // Generate exam-specific stats (430 total students in school)
    const statsByExam: Record<number, any> = {
      1: { // Unit-1 Exam
        totalStudents: 430,
        averagePercentage: 74,
        passedStudents: 408,
        failedStudents: 22,
        passingPercent: 95,
      },
      2: { // Mid-Semester Exam
        totalStudents: 430,
        averagePercentage: 76,
        passedStudents: 415,
        failedStudents: 15,
        passingPercent: 96,
      },
      3: { // Unit-2 Exam
        totalStudents: 430,
        averagePercentage: 75,
        passedStudents: 412,
        failedStudents: 18,
        passingPercent: 96,
      },
      4: { // Final Exams
        totalStudents: 430,
        averagePercentage: 78,
        passedStudents: 420,
        failedStudents: 10,
        passingPercent: 98,
      },
    };
    
    return statsByExam[selectedExam] || statsByExam[1];
  }, [selectedExam, exam]);

  return (
    <div>
      <PageHeader 
        title="Exam Performance & Analytics" 
        subtitle="Track exam results and student performance across classes."
      />

      {/* OVERALL SCHOOL STATISTICS */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Overall School Performance - {exams.find(e => e.id === selectedExam)?.name}</h2>
        {overallStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Total Students</p>
              <p className="text-3xl font-bold">{overallStats.totalStudents}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">School Average</p>
              <p className="text-3xl font-bold">{overallStats.averagePercentage}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Students Passed</p>
              <p className="text-3xl font-bold text-emerald-600">{overallStats.passedStudents}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Students Failed</p>
              <p className="text-3xl font-bold text-red-600">{overallStats.failedStudents}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Pass Rate</p>
              <p className="text-3xl font-bold text-blue-600">{overallStats.passingPercent}%</p>
            </Card>
          </div>
        ) : (
          <Card className="p-4 text-center bg-amber-50 border border-amber-200">
            <p className="text-amber-700 font-medium">Select a conducted exam to view overall school performance</p>
          </Card>
        )}
      </div>

      {/* EXAM STATUS */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Exam Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {exams.map((e) => (
            <Card 
              key={e.id}
              className={`p-4 cursor-pointer transition-all border-2 ${selectedExam === e.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-muted'}`}
              onClick={() => setSelectedExam(e.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{e.name}</h3>
                {e.status === "Conducted" ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="size-5 text-amber-600" />
                )}
              </div>
              <Badge variant={e.status === "Conducted" ? "secondary" : "outline"} className={e.status === "Conducted" ? "bg-emerald-100 text-emerald-700 border-0" : "bg-amber-100 text-amber-700 border-0"}>
                {e.status}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">{e.date}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* EXAM DETAILS & CLASS SELECTION */}
      {exam && (
        exam.status === "Pending" ? (
          <Card className="p-8 text-center border-2 border-amber-200 bg-amber-50">
            <AlertCircle className="size-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-amber-900 mb-2">{exam.name}</h2>
            <p className="text-amber-700 mb-2">This exam is scheduled for {exam.date}</p>
            <p className="text-sm text-amber-600">Results and performance data will be available once the exam is conducted.</p>
          </Card>
        ) : (
          <div className="space-y-6">
          <Card className="p-5 border-2 border-blue-200 bg-blue-50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{exam.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">Timeline: {exam.date}</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">{exam.status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Total Marks</p>
                <p className="text-2xl font-bold">450</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Per Subject</p>
                <p className="text-2xl font-bold">90</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Subjects</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Duration</p>
                <p className="text-2xl font-bold">6 days</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Classes</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </Card>

          {/* CLASS SELECTOR */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Class Performance</h2>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CLASS OVERALL STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-6 pb-6 border-b">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-muted-foreground font-medium mb-1">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{classStats.totalStudents}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-xs text-muted-foreground font-medium mb-1">Passed</p>
                <p className="text-2xl font-bold text-emerald-600">{classStats.passCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs text-muted-foreground font-medium mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-600">{classStats.failCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-xs text-muted-foreground font-medium mb-1">Pass %</p>
                <p className="text-2xl font-bold text-green-600">{classStats.passingPercent}%</p>
              </div>
              <div className="p-3 rounded-lg bg-violet-50 border border-violet-200">
                <p className="text-xs text-muted-foreground font-medium mb-1">Class Avg</p>
                <p className="text-2xl font-bold text-violet-600">{classStats.classAverage}%</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs text-muted-foreground font-medium mb-1">Best Subject</p>
                <p className="text-sm font-bold text-amber-600">{classStats.highestPerformingSubject}</p>
                <p className="text-xs text-amber-600">{classStats.highestPerformingPercent}%</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                <p className="text-xs text-muted-foreground font-medium mb-1">Weakest Subject</p>
                <p className="text-sm font-bold text-orange-600">{classStats.lowestPerformingSubject}</p>
                <p className="text-xs text-orange-600">{classStats.lowestPerformingPercent}%</p>
              </div>
            </div>

            {/* TOP 5 STUDENTS */}
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3">Top 5 Performing Students</h3>
              <div className="space-y-2">
                {topStudentsWithMore.map((student) => (
                  <div key={student.id} className="p-4 rounded-lg border border-muted hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{student.name}</p>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">{student.percentage}%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{student.totalMarks} / {student.maxMarks} Marks</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                      >
                        {expandedStudent === student.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </Button>
                    </div>

                    {expandedStudent === student.id && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {student.subjectMarks.map((subject) => (
                          <div key={subject.subject} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{subject.subject}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={subject.percentage} className="w-24 h-2" />
                              <span className="font-medium w-12 text-right">{subject.percentage}%</span>
                              <span className="text-muted-foreground w-16 text-right">{subject.marks}/{subject.maxMarks}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {!showMoreTopStudents && allStudents.length > 5 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => setShowMoreTopStudents(true)}
                >
                  Load More Top Students
                </Button>
              )}
            </div>

            {/* BOTTOM 5 STUDENTS */}
            <div>
              <h3 className="text-base font-semibold mb-3">Bottom 5 Performing Students</h3>
              <div className="space-y-2">
                {bottomStudentsWithMore.map((student) => (
                  <div key={student.id} className="p-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{student.name}</p>
                          <Badge variant="destructive" className="bg-red-200 text-red-700 border-0">{student.percentage}%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{student.totalMarks} / {student.maxMarks} Marks</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                      >
                        {expandedStudent === student.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </Button>
                    </div>

                    {expandedStudent === student.id && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {student.subjectMarks.map((subject) => (
                          <div key={subject.subject} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{subject.subject}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={subject.percentage} className="w-24 h-2" />
                              <span className="font-medium w-12 text-right">{subject.percentage}%</span>
                              <span className="text-muted-foreground w-16 text-right">{subject.marks}/{subject.maxMarks}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {!showMoreBottomStudents && allStudents.length > 5 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => setShowMoreBottomStudents(true)}
                >
                  Load More Bottom Students
                </Button>
              )}
            </div>
          </Card>
        </div>
        )
      )}
    </div>
  );
}
