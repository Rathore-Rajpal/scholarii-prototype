import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { CalendarClock } from "lucide-react";

export const Route = createFileRoute("/app/ptameetings")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="PTA Meetings"
        subtitle="Schedule and manage Parent-Teacher Association meetings. Track attendance and follow-up actions."
        icon={CalendarClock}
      />
    </RoleGuard>
  ),
});
