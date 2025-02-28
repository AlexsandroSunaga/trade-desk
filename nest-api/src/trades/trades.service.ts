import { Injectable, OnModuleInit } from "@nestjs/common";
import Database from "better-sqlite3";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

export type TradeRow = {
  id: number;
  date: string;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  fees: number;
  tag: string;
};

@Injectable()
export class TradesService implements OnModuleInit {
  private db!: Database.Database;

  onModuleInit() {
    const dir = path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });
    this.db = new Database(path.join(dir, "journal.db"));
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        symbol TEXT,
        side TEXT,
        quantity REAL,
        price REAL,
        fees REAL DEFAULT 0,
        tag TEXT DEFAULT ''
      );
      CREATE TABLE IF NOT EXISTS desks (id INTEGER PRIMARY KEY, code TEXT, name TEXT, region TEXT, head TEXT);
      CREATE TABLE IF NOT EXISTS strategies (id INTEGER PRIMARY KEY, code TEXT, name TEXT, desk_code TEXT, max_position REAL);
      CREATE TABLE IF NOT EXISTS risk_limits (id INTEGER PRIMARY KEY, metric TEXT, threshold REAL, current_value REAL, status TEXT);
      CREATE TABLE IF NOT EXISTS compliance_alerts (id INTEGER PRIMARY KEY, rule TEXT, severity TEXT, detail TEXT, status TEXT);
      CREATE TABLE IF NOT EXISTS portfolios (id INTEGER PRIMARY KEY, code TEXT, name TEXT, aum_usd REAL, desk_code TEXT);
    `);
    this.seedEnterprise();
    const count = this.db.prepare("SELECT COUNT(*) as c FROM trades").get() as { c: number };
    if (count.c === 0) {
      const sample = path.join(process.cwd(), "data", "sample_trades.csv");
      if (fs.existsSync(sample)) {
        this.importCsv(fs.readFileSync(sample));
      }
    }
  }

  list(): TradeRow[] {
    return this.db.prepare("SELECT * FROM trades ORDER BY date").all() as TradeRow[];
  }

  create(row: Omit<TradeRow, "id">) {
    const info = this.db
      .prepare(
        "INSERT INTO trades (date, symbol, side, quantity, price, fees, tag) VALUES (@date, @symbol, @side, @quantity, @price, @fees, @tag)"
      )
      .run(row);
    return { id: Number(info.lastInsertRowid) };
  }

  importCsv(buffer: Buffer) {
    const rows = parse(buffer, { columns: true, skip_empty_lines: true }) as Record<string, string>[];
    const stmt = this.db.prepare(
      "INSERT INTO trades (date, symbol, side, quantity, price, fees, tag) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    const tx = this.db.transaction((items: Record<string, string>[]) => {
      for (const row of items) {
        const lower = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]));
        stmt.run(
          lower.date,
          String(lower.symbol).toUpperCase(),
          String(lower.side).toLowerCase(),
          Number(lower.quantity),
          Number(lower.price),
          Number(lower.fees ?? 0),
          String(lower.tag ?? "")
        );
      }
    });
    tx(rows);
    return { imported: rows.length };
  }

  pnlCalendar() {
    const rows = this.list();
    const byDay: Record<string, number> = {};
    for (const r of rows) {
      const signed = r.side === "buy" ? -r.quantity * r.price - r.fees : r.quantity * r.price - r.fees;
      byDay[r.date] = (byDay[r.date] ?? 0) + signed;
    }
    const days = Object.entries(byDay)
      .map(([date, pnl]) => ({ date, pnl: Math.round(pnl * 100) / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return { days, total_days: days.length };
  }

  integrationStatus() {
    return {
      openai: { enabled: Boolean(process.env.OPENAI_API_KEY) },
      stripe: { enabled: Boolean(process.env.STRIPE_SECRET_KEY) },
      alpaca: { enabled: Boolean(process.env.ALPACA_API_KEY) },
      ibkr: { enabled: Boolean(process.env.IBKR_FLEX_TOKEN) },
    };
  }

  analytics() {
    const rows = this.list();
    if (!rows.length) return { equity_curve: [], win_rate: 0, total_pnl: 0, by_symbol: {} };
    let cum = 0;
    const curve: { date: string; equity: number }[] = [];
    const bySymbol: Record<string, number> = {};
    let sellWins = 0;
    let sellCount = 0;
    for (const r of rows) {
      const signed = r.side === "buy" ? r.quantity : -r.quantity;
      const cash = -signed * r.price - r.fees;
      cum += cash;
      curve.push({ date: r.date, equity: cum });
      bySymbol[r.symbol] = (bySymbol[r.symbol] ?? 0) + cash;
      if (r.side === "sell") {
        sellCount += 1;
        if (cash > 0) sellWins += 1;
      }
    }
    return {
      equity_curve: curve,
      win_rate: sellCount ? Math.round((sellWins / sellCount) * 10000) / 100 : 0,
      total_pnl: Math.round(cum * 100) / 100,
      by_symbol: Object.fromEntries(Object.entries(bySymbol).map(([k, v]) => [k, Math.round(v * 100) / 100])),
    };
  }

  seedEnterprise() {
    const d = this.db.prepare("SELECT COUNT(*) as c FROM desks").get() as { c: number };
    if (d.c > 0) return;
    const insDesk = this.db.prepare("INSERT INTO desks (code, name, region, head) VALUES (?, ?, ?, ?)");
    [["EQ-US", "US Equities", "New York", "R. Walsh"], ["FX-LDN", "FX Desk", "London", "M. Singh"], ["MACRO", "Global Macro", "Singapore", "L. Park"]].forEach((r) => insDesk.run(...r));
    const insStrat = this.db.prepare("INSERT INTO strategies (code, name, desk_code, max_position) VALUES (?, ?, ?, ?)");
    [["SWING", "Swing equity", "EQ-US", 50000], ["MOM", "Momentum", "EQ-US", 25000], ["CARRY", "FX carry", "FX-LDN", 100000]].forEach((r) => insStrat.run(...r));
    const insRisk = this.db.prepare("INSERT INTO risk_limits (metric, threshold, current_value, status) VALUES (?, ?, ?, ?)");
    [["Daily loss USD", 50000, 12400, "ok"], ["Gross exposure", 2.5, 1.8, "ok"], ["Single name %", 10, 11.2, "breach"]].forEach((r) => insRisk.run(...r));
    const insComp = this.db.prepare("INSERT INTO compliance_alerts (rule, severity, detail, status) VALUES (?, ?, ?, ?)");
    [["Restricted list", "high", "Attempted buy RESTRICT-1", "open"], ["Wash sale window", "medium", "AAPL round-trip < 30d", "review"]].forEach((r) => insComp.run(...r));
    const insPf = this.db.prepare("INSERT INTO portfolios (code, name, aum_usd, desk_code) VALUES (?, ?, ?, ?)");
    [["ALPHA", "Alpha book", 4200000, "EQ-US"], ["HEDGE", "Hedged sleeve", 1800000, "MACRO"]].forEach((r) => insPf.run(...r));
  }

  overview() {
    const trades = this.list().length;
    const desks = (this.db.prepare("SELECT COUNT(*) as c FROM desks").get() as { c: number }).c;
    const alerts = (this.db.prepare("SELECT COUNT(*) as c FROM compliance_alerts WHERE status='open'").get() as { c: number }).c;
    const breaches = (this.db.prepare("SELECT COUNT(*) as c FROM risk_limits WHERE status='breach'").get() as { c: number }).c;
    return { trades_logged: trades, trading_desks: desks, open_compliance_alerts: alerts, risk_breaches: breaches };
  }

  desks() {
    return this.db.prepare("SELECT * FROM desks").all();
  }

  strategies() {
    return this.db.prepare("SELECT * FROM strategies").all();
  }

  riskLimits() {
    return this.db.prepare("SELECT * FROM risk_limits").all();
  }

  complianceAlerts() {
    return this.db.prepare("SELECT * FROM compliance_alerts").all();
  }

  portfolios() {
    return this.db.prepare("SELECT * FROM portfolios").all();
  }

  coach(focus: string) {
    const recent = this.list().slice(-50).reverse();
    const lines = recent.map((r) => `${r.date} ${r.side} ${r.quantity} ${r.symbol} @ ${r.price} tag=${r.tag}`);
    if (!lines.length) return "No trades yet — import a CSV to get coaching.";
    const tags = new Set(recent.map((r) => r.tag).filter(Boolean));
    return [
      `TradeDesk coach (focus: ${focus})`,
      `Reviewed ${lines.length} recent fills across ${tags.size || 1} strategy tags.`,
      "• Confirm position sizing rules before adding size on correlated symbols.",
      "• Log exit reason on every sell row — win-rate math depends on it.",
      "• Sample activity:",
      ...lines.slice(0, 5).map((l) => `  - ${l}`),
    ].join("\n");
  }
}
