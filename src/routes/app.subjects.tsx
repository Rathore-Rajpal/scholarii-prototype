import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/app/subjects")({ component: SubjectsPage });

function SubjectsPage() {
  return (
    <PlaceholderPage
      title="Subjects"
      subtitle="View your enrolled subjects, syllabus coverage, and subject-wise resources."
      icon={BookMarked}
    />
  );
}
