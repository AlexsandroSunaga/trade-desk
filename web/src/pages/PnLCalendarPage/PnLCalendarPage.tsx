import { useEffect, useState } from "react";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";
import { api } from "@/api/client";

type Day = { date: string; pnl: number };

export default function PnLCalendarPage() {
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    api<{ days: Day[] }>("/analytics/calendar").then((r) => setDays(r.days)).catch(() => setDays([]));
  }, []);

  const total = days.reduce((n, d) => n + d.pnl, 0);

  return (
    <ModuleWorkbench
      title="P&L calendar"
      subtitle="Daily realized P&L from journal fills — comparable to LuxAlgo / eJournal calendars."
      kpis={[
        { label: "Trading days", value: days.length },
        { label: "Net P&L", value: total.toFixed(2), tone: total >= 0 ? "ok" : "warn" },
        { label: "Green days", value: days.filter((d) => d.pnl > 0).length },
        { label: "Red days", value: days.filter((d) => d.pnl < 0).length },
      ]}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
        {days.map((d) => (
          <div
            key={d.date}
            className={`rounded-lg border p-2 text-center text-xs ${d.pnl >= 0 ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}
          >
            <div className="font-mono text-[10px] text-slate-500">{d.date}</div>
            <div className="font-semibold">{d.pnl}</div>
          </div>
        ))}
      </div>
    </ModuleWorkbench>
  );
}
