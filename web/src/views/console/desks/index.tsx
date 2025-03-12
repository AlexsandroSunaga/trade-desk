
import { useEffect, useState } from "react";
import { api } from "@/api/client";

export default function DesksPage() {
  const [desks, setDesks] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  useEffect(() => {
    api<any[]>("/desks").then(setDesks);
    api<any[]>("/strategies").then(setStrategies);
    api<any[]>("/portfolios").then(setPortfolios);
  }, []);
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Trading desks & books</h1>
      <section><h2 className="font-medium">Desks</h2><ul className="mt-2 space-y-2">{desks.map((d) => <li key={d.id} className="rounded-lg border border-slate-800 p-3">{d.code} — {d.name} ({d.region}) · Head {d.head}</li>)}</ul></section>
      <section><h2 className="font-medium">Strategies</h2><ul className="mt-2 space-y-2">{strategies.map((s) => <li key={s.id} className="text-sm text-slate-400">{s.code} {s.name} · desk {s.desk_code} · max ${s.max_position}</li>)}</ul></section>
      <section><h2 className="font-medium">Portfolios</h2><ul className="mt-2 space-y-2">{portfolios.map((p) => <li key={p.id}>{p.code} {p.name} · AUM ${p.aum_usd}</li>)}</ul></section>
    </div>
  );
}
