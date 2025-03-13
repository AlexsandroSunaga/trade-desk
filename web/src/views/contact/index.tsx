import { MarketingLayout } from "@/components/MarketingLayout";

export default function ContactPage() {
  return (
    <MarketingLayout>
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="mt-4 text-slate-400">Portfolio demo — form posts to your CRM in a real deployment.</p>
      <form className="mt-8 max-w-md space-y-4">
        <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" placeholder="Work email" />
        <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" placeholder="Firm name" />
        <textarea className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" rows={4} placeholder="What are you trading?" />
        <button type="button" className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-slate-950">
          Request demo
        </button>
      </form>
    </MarketingLayout>
  );
}
