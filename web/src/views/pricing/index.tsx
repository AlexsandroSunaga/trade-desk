import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/MarketingLayout";

const tiers = [
  { name: "Desk", price: "$299", seats: "Up to 8 traders", features: ["Journal", "Risk soft limits", "Email support"] },
  { name: "Firm", price: "$899", seats: "Unlimited desks", features: ["Compliance module", "API access", "SSO ready"] },
  { name: "Enterprise", price: "Custom", seats: "Dedicated CSM", features: ["On-prem bridge", "Custom rules", "24/7"] },
];

export default function PricingPage() {
  return (
    <MarketingLayout>
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <p className="mt-2 text-slate-400">Illustrative tiers for portfolio demos — wire to billing in production.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <h2 className="text-lg font-semibold">{t.name}</h2>
            <p className="mt-2 text-3xl font-semibold text-accent">{t.price}</p>
            <p className="text-sm text-slate-500">{t.seats}</p>
            <ul className="mt-4 space-y-1 text-sm text-slate-400">
              {t.features.map((f) => <li key={f}>• {f}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <Link to="/contact" className="mt-8 inline-block text-accent hover:underline">Talk to sales ?</Link>
    </MarketingLayout>
  );
}
