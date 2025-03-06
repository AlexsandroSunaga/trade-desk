import { MarketingNav } from "./MarketingNav";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} TradeDesk Capital · Demo portfolio product
      </footer>
    </div>
  );
}
