
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/api/client";

export default function AnalyticsPage() {
  const [a, setA] = useState<any>(null);
  useEffect(() => { api("/analytics").then(setA); }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Portfolio analytics</h1>
      {a && <p>P&amp;L ${a.total_pnl} · Win rate {a.win_rate}%</p>}
      <div className="h-80 rounded-2xl border border-slate-800 p-4">
        {a?.equity_curve?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={a.equity_curve}><XAxis dataKey="date" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} /><Tooltip /><Area type="monotone" dataKey="equity" stroke="#22d3ee" fill="#22d3ee33" /></AreaChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
}
