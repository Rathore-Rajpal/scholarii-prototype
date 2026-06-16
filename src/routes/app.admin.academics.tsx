import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { AdminComingSoon } from "@/components/scholarii/AdminComingSoon";

export const Route = createFileRoute("/app/admin/academics")({
  component: () => (
    <AdminComingSoon
      title="Academics"
      subtitle="Configure classes, subjects, and academic records"
      icon={BookOpen}
    />
  ),
});
