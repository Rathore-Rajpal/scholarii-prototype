import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import type { ReactNode } from "react";

export function ComingSoon({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <Card className="p-12 text-center">
        <div className="size-16 rounded-2xl bg-brand-gradient grid place-items-center text-white mx-auto mb-4 shadow-glow">
          <Construction className="size-7" />
        </div>
        <h3 className="text-lg font-semibold">This page is being prepared</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          {children ?? "We're polishing the final details. The full feature will be available in the next update."}
        </p>
        <Button className="mt-6 bg-brand-gradient text-white border-0">Notify me when ready</Button>
      </Card>
    </div>
  );
}
