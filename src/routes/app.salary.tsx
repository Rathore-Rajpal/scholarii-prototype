import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { Coins } from "lucide-react";

export const Route = createFileRoute("/app/salary")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="Salary & Payroll"
        subtitle="View salary slips, tax deductions, and payment history. Access Form 16 and investment declarations."
        icon={Coins}
      />
    </RoleGuard>
  ),
});
