import { Link } from "react-router-dom";

const links = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Platform" },
  { href: "/security", label: "Security" },
  { href: "/institutions", label: "Institutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNav() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="font-semibold text-accent">TradeDesk Capital</Link>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-400">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className="hover:text-white">{l.label}</Link>
          ))}
          <Link to="/console" className="rounded-full bg-accent/20 px-3 py-1 text-accent hover:bg-accent/30">
            Firm console
          </Link>
        </nav>
      </div>
    </header>
  );
}
