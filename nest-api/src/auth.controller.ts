import { Body, Controller, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import { randomBytes } from "node:crypto";

/** Demo-only auth: one configurable account, opaque in-memory tokens. Not for production. */
const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "demo@tradedesk.dev";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "demo1234";
const tokens = new Set<string>();

@Controller("api/v1/auth")
export class AuthController {
  @Post("login")
  @HttpCode(200)
  login(@Body() body: { email?: string; password?: string }) {
    if (body?.email !== DEMO_EMAIL || body?.password !== DEMO_PASSWORD) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const token = randomBytes(24).toString("hex");
    tokens.add(token);
    return { access_token: token, token_type: "bearer", user: { email: DEMO_EMAIL, name: "Demo Trader" } };
  }
}
