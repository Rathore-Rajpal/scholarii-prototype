import { createFileRoute } from "@tanstack/react-router";
import { Landmark } from "lucide-react";
import { AdminComingSoon } from "@/components/scholarii/AdminComingSoon";

export const Route = createFileRoute("/app/admin/facilities")({
  component: () => (
    <AdminComingSoon
      title="Facilities"
      subtitle="Manage campus spaces, assets, and maintenance"
      icon={Landmark}
    />
  ),
});
