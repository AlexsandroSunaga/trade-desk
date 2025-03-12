
import { useEffect, useState } from "react";
import { api } from "@/api/client";

export default function CompliancePage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api<any[]>("/compliance/alerts").then(setRows); }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Compliance surveillance</h1>
      <div className="mt-6 space-y-3">{rows.map((r) => <div key={r.id} className="rounded-xl border border-slate-800 p-4"><p className="font-medium">{r.rule}</p><p className="text-sm text-slate-400">{r.detail}</p><p className="text-xs text-amber-400">{r.severity} · {r.status}</p></div>)}</div>
    </div>
  );
}
