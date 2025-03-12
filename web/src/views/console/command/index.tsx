
import { useEffect, useState } from "react";
import { api } from "@/api/client";
import { Link } from "react-router-dom";

export default function Command() {
  const [d, setD] = useState<any>(null);
  useEffect(() => {
    api("/command/overview").then(setD).catch(() => setD(null));
  }, []);
  const cards = d
    ? [
        ["Trades logged", d.trades_logged, "/console/journal"],
        ["Trading desks", d.trading_desks, "/console/desks"],
        ["Open compliance", d.open_compliance_alerts, "/console/compliance"],
        ["Risk breaches", d.risk_breaches, "/console/risk"],
      ]
    : [];
  return (
    <div>
      <h1 className="text-2xl font-semibold">Firm command center</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([l, v, href]) => (
          <Link key={l} to={href as string} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 hover:border-accent/40">
            <p className="text-xs text-slate-500">{l}</p>
            <p className="text-3xl font-semibold text-accent">{v}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
