// ============================================================
// TEACHER EXAM DATA VISIBILITY — Class Teacher vs Subject Teacher
// ============================================================

export type TeacherClassRole = "class-teacher" | "subject-teacher";

export interface TeacherClassScope {
  id: string;
  label: string;
  role: TeacherClassRole;
  /** null = all subjects (class teacher). Array = only those subjects. */
  teachingSubjects: string[] | null;
}

export const TEACHER_EXAM_SCOPES: TeacherClassScope[] = [
  { id: "8-a", label: "8-A", role: "class-teacher", teachingSubjects: null },
  { id: "9-a", label: "9-A", role: "subject-teacher", teachingSubjects: ["Mathematics"] },
  { id: "10-b", label: "10-B", role: "subject-teacher", teachingSubjects: ["Mathematics"] },
  { id: "11-a", label: "11-A", role: "subject-teacher", teachingSubjects: ["Computer Science"] },
];

export const CLASS_TEACHER_CLASS = TEACHER_EXAM_SCOPES.find((s) => s.role === "class-teacher")!;

export function getScopeById(id: string): TeacherClassScope {
  return TEACHER_EXAM_SCOPES.find((s) => s.id === id) ?? TEACHER_EXAM_SCOPES[0];
}

export function canViewSubject(scope: TeacherClassScope, subject: string): boolean {
  if (scope.role === "class-teacher" || !scope.teachingSubjects) return true;
  return scope.teachingSubjects.includes(subject);
}

export function filterSubjects<T extends { subject: string }>(
  items: T[],
  scope: TeacherClassScope,
): T[] {
  if (scope.role === "class-teacher" || !scope.teachingSubjects) return items;
  return items.filter((item) => scope.teachingSubjects!.includes(item.subject));
}

export function filterSubjectNames(subjects: string[], scope: TeacherClassScope): string[] {
  if (scope.role === "class-teacher" || !scope.teachingSubjects) return subjects;
  return subjects.filter((s) => scope.teachingSubjects!.includes(s));
}

export function getScopeLabel(scope: TeacherClassScope): string {
  if (scope.role === "class-teacher") return `${scope.label} · Class Teacher`;
  return `${scope.label} · ${scope.teachingSubjects?.join(", ")}`;
}
