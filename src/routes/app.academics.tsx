import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/app/academics")({ component: AcademicsPage });

function AcademicsPage() {
  return (
    <PlaceholderPage
      title="Academics"
      subtitle="Access your subjects, assignments, study materials, and academic progress."
      icon={BookOpen}
    />
  );
}
