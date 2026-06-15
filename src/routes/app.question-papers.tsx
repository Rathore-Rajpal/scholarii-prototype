import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { FileQuestion } from "lucide-react";

export const Route = createFileRoute("/app/question-papers")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="Question Papers"
        subtitle="Create, manage, and share question papers for your classes. Design assessments with AI assistance."
        icon={FileQuestion}
      />
    </RoleGuard>
  ),
});
