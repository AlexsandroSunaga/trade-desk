import { MarketingLayout } from "@/components/MarketingLayout";

const modules = [
  { title: "Command center", body: "Firm-wide KPIs: trades logged, open compliance items, risk breaches." },
  { title: "Trade journal", body: "Structured entries, strategy tags, attachment hooks for fills." },
  { title: "Analytics", body: "Desk roll-ups, win rate, exposure by asset class." },
  { title: "Trading desks", body: "Desk hierarchy, owner assignment, limit inheritance." },
  { title: "Risk limits", body: "Intraday utilization, breach history, escalation paths." },
  { title: "AI coach", body: "Deterministic coaching prompts tied to your rule set (plug in LLM in prod)." },
];

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      <h1 className="text-3xl font-semibold">Platform modules</h1>
      <p className="mt-3 max-w-2xl text-slate-400">Each surface maps to a route in the firm console — no demo-only placeholders.</p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <li key={m.title} className="rounded-2xl border border-slate-800 p-5">
            <h2 className="font-medium text-accent">{m.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{m.body}</p>
          </li>
        ))}
      </ul>
    </MarketingLayout>
  );
}
