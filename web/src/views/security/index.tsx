import { MarketingLayout } from "@/components/MarketingLayout";

export default function SecurityPage() {
  return (
    <MarketingLayout>
      <h1 className="text-3xl font-semibold">Security &amp; governance</h1>
      <div className="mt-8 space-y-6 text-slate-300">
        <p>Role-based console access, JWT sessions against the Nest API, and immutable audit fields on trade rows.</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-400">
          <li>Secrets via environment — no keys in the browser bundle.</li>
          <li>Compliance module tracks attestations and alert resolution SLAs.</li>
          <li>Export paths for regulator-ready CSV snapshots (demo data).</li>
        </ul>
      </div>
    </MarketingLayout>
  );
}
