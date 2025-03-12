
import { useCallback, useEffect, useState } from "react";
import { api } from "@/api/client";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";

const base = import.meta.env.VITE_API_BASE ?? "http://localhost:8012";

export default function JournalPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const refresh = useCallback(() => api<any[]>("/trades").then(setTrades), []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    await fetch(`${base}/api/v1/trades/import`, { method: "POST", body: form });
    refresh();
  }

  const filtered = trades.filter((t) => !q || `${t.symbol}`.toLowerCase().includes(q.toLowerCase()));
  const buys = trades.filter((t) => t.side === "buy").length;

  return (
    <ModuleWorkbench
      title="Trade journal"
      subtitle="Structured capture with desk tags, CSV import, and audit-friendly exports."
      kpis={[
        { label: "Entries", value: trades.length },
        { label: "Buy side", value: buys },
        { label: "Sell side", value: trades.length - buys },
        { label: "Unique symbols", value: new Set(trades.map((t) => t.symbol)).size },
      ]}
      actions={
        <label className="cursor-pointer rounded-lg bg-accent/20 px-4 py-2 text-sm text-accent">
          Import CSV
          <input type="file" accept=".csv" className="hidden" onChange={onImport} />
        </label>
      }
      filters={
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter symbol…"
          className="w-full max-w-xs rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        />
      }
      aside={
        <div className="rounded-2xl border border-slate-800 p-4 text-sm text-slate-400">
          <p className="font-medium text-white">Compliance note</p>
          <p className="mt-2">Tags map to strategy books for downstream surveillance rules.</p>
        </div>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-500">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Qty</th>
              <th>Tag</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-slate-800">
                <td className="p-3">{t.date}</td>
                <td className="text-center font-medium">{t.symbol}</td>
                <td className="text-center">{t.side}</td>
                <td className="text-center">{t.quantity}</td>
                <td className="text-center text-slate-500">{t.tag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModuleWorkbench>
  );
}
