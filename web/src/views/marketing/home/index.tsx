import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/MarketingLayout";

export default function Home() {
  return (
    <MarketingLayout>
      <section className="py-8">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">Capital markets ops</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          Trade journaling, risk limits, and compliance — one desk-grade console.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          TradeDesk is built for prop shops and allocator oversight teams: structured trade capture, desk-level
          analytics, breach workflows, and an AI coach that explains rule violations before they become regulatory
          findings.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/console" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-slate-950">
            Open command center
          </Link>
          <Link to="/features" className="rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200">
            Explore platform
          </Link>
        </div>
      </section>
      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          ["Journal & P&L", "Tag every fill, attach notes, export audit packs."],
          ["Risk & limits", "Per-desk ceilings, soft warnings, hard blocks."],
          ["Compliance", "Rule catalog, attestations, open alert queue."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">{body}</p>
          </div>
        ))}
      </section>
    </MarketingLayout>
  );
}
