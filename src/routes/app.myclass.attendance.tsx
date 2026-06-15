import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/app/myclass/attendance")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="Attendance"
        subtitle="Mark daily attendance, view monthly trends, track absentees, and generate attendance reports."
        icon={ClipboardCheck}
      />
    </RoleGuard>
  ),
});
