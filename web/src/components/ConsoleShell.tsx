import { Link } from "react-router-dom";
import { AlertTriangle, BookOpen, Briefcase, CalendarDays, LayoutDashboard, LineChart, Scale, Shield } from "lucide-react";

const nav = [
  { href: "/console", label: "Command", icon: LayoutDashboard },
  { href: "/console/journal", label: "Trade journal", icon: BookOpen },
  { href: "/console/analytics", label: "Analytics", icon: LineChart },
  { href: "/console/calendar", label: "P&L calendar", icon: CalendarDays },
  { href: "/console/desks", label: "Trading desks", icon: Briefcase },
  { href: "/console/risk", label: "Risk limits", icon: Scale },
  { href: "/console/compliance", label: "Compliance", icon: Shield },
  { href: "/console/coach", label: "AI coach", icon: AlertTriangle },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="hidden w-64 border-r border-slate-800 p-4 lg:block">
        <p className="font-semibold text-accent">TradeDesk Capital</p>
        <nav className="mt-6 space-y-1 text-sm">
          {nav.map((n) => (
            <Link key={n.href} to={n.href} className="flex items-center gap-2 rounded-lg px-2 py-2 text-slate-400 hover:bg-slate-900 hover:text-white">
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
