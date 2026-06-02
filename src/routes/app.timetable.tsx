import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/timetable")({ component: TimetablePage });

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PERIODS = ["08:30", "09:20", "10:30", "11:20", "12:30", "13:20"];
const SUBJECTS = ["Math", "English", "Science", "Hindi", "History", "Computer", "Art", "PE"];
const COLORS = ["bg-violet-100 text-violet-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-sky-100 text-sky-700", "bg-pink-100 text-pink-700", "bg-orange-100 text-orange-700", "bg-teal-100 text-teal-700", "bg-rose-100 text-rose-700"];

function TimetablePage() {
  return (
    <div>
      <PageHeader title="My Timetable" subtitle="Your weekly class schedule." />
      <Card className="p-5 overflow-x-auto">
        <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-2 min-w-[700px]">
          <div />
          {DAYS.map((d) => <div key={d} className="text-center text-sm font-semibold py-2">{d}</div>)}
          {PERIODS.map((p, pi) => (
            <Fragment key={p}>
              <div className="text-xs text-muted-foreground py-3 text-right pr-2">{p}</div>
              {DAYS.map((d, di) => {
                const idx = (pi + di) % SUBJECTS.length;
                return (
                  <div key={d + p} className={`rounded-lg p-3 dark:bg-opacity-20 ${COLORS[idx]}`}>
                    <div className="font-medium text-xs">{SUBJECTS[idx]}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">Room {100 + idx}</div>
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
}
