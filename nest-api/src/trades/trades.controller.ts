import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { TradesService } from "./trades.service";

@Controller("api/v1")
export class TradesController {
  constructor(private readonly trades: TradesService) {}

  @Get("health")
  health() {
    return { status: "ok", stack: "nestjs" };
  }

  @Get("command/overview")
  overview() {
    return this.trades.overview();
  }

  @Get("desks")
  desks() {
    return this.trades.desks();
  }

  @Get("strategies")
  strategies() {
    return this.trades.strategies();
  }

  @Get("risk/limits")
  risk() {
    return this.trades.riskLimits();
  }

  @Get("compliance/alerts")
  compliance() {
    return this.trades.complianceAlerts();
  }

  @Get("portfolios")
  portfolios() {
    return this.trades.portfolios();
  }

  @Get("trades")
  listTrades() {
    return this.trades.list();
  }

  @Post("trades")
  create(@Body() body: Record<string, unknown>) {
    return this.trades.create({
      date: String(body.date),
      symbol: String(body.symbol).toUpperCase(),
      side: String(body.side).toLowerCase(),
      quantity: Number(body.quantity),
      price: Number(body.price),
      fees: Number(body.fees ?? 0),
      tag: String(body.tag ?? ""),
    });
  }

  @Post("trades/import")
  @UseInterceptors(FileInterceptor("file"))
  import(@UploadedFile() file?: { buffer: Buffer }) {
    if (!file) return { error: "file required" };
    return this.trades.importCsv(file.buffer);
  }

  @Get("analytics")
  analytics() {
    return this.trades.analytics();
  }

  @Get("analytics/calendar")
  calendar() {
    return this.trades.pnlCalendar();
  }

  @Get("integrations/status")
  integrations() {
    return this.trades.integrationStatus();
  }

  @Post("ai/coach")
  coach(@Body() body: { focus?: string }) {
    return { review: this.trades.coach(body.focus ?? "risk"), generated_at: new Date().toISOString() };
  }
}
