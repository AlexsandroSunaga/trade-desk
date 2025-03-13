import { MarketingLayout } from "@/components/MarketingLayout";

export default function InstitutionsPage() {
  return (
    <MarketingLayout>
      <h1 className="text-3xl font-semibold">Built for oversight teams</h1>
      <p className="mt-4 max-w-2xl text-slate-400">
        Allocator and risk committees get read-only dashboards; desk leads capture activity daily; compliance owns the
        rule catalog.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {["Prop desk", "Family office", "Fund admin"].map((seg) => (
          <div key={seg} className="rounded-xl border border-slate-800 p-4 text-center">
            <p className="font-medium">{seg}</p>
            <p className="mt-2 text-xs text-slate-500">Sample playbooks in console seed data</p>
          </div>
        ))}
      </div>
    </MarketingLayout>
  );
}
