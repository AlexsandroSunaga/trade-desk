
import { useEffect, useState } from "react";
import { api } from "@/api/client";

export default function RiskPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api<any[]>("/risk/limits").then(setRows); }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Risk limits</h1>
      <table className="mt-6 w-full text-sm"><thead><tr><th className="p-3 text-left">Metric</th><th>Threshold</th><th>Current</th><th>Status</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id} className="border-t border-slate-800"><td className="p-3">{r.metric}</td><td className="text-center">{r.threshold}</td><td className="text-center">{r.current_value}</td><td className={`text-center ${r.status === "breach" ? "text-red-400" : "text-emerald-400"}`}>{r.status}</td></tr>)}</tbody></table>
    </div>
  );
}
