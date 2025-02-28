// Run with: npm test  (node:test; boots the real app on a throwaway port + temp data dir)
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const PORT = 18012;
const base = `http://127.0.0.1:${PORT}/api/v1`;
let proc;
let tmp;

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tradedesk-"));
  fs.mkdirSync(path.join(tmp, "data"));
  fs.copyFileSync(path.join(root, "data", "sample_trades.csv"), path.join(tmp, "data", "sample_trades.csv"));
  const tsNode = require.resolve("ts-node/register", { paths: [root] });
  proc = spawn(process.execPath, ["-r", tsNode, path.join(root, "src", "main.ts")], {
    cwd: tmp,
    env: { ...process.env, PORT: String(PORT), TS_NODE_PROJECT: path.join(root, "tsconfig.json") },
    stdio: "ignore",
  });
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(`${base}/health`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error("API did not start");
});

after(() => {
  proc?.kill();
});

test("health", async () => {
  const body = await (await fetch(`${base}/health`)).json();
  assert.equal(body.status, "ok");
});

test("demo login succeeds and bad password is rejected", async () => {
  const post = (b) =>
    fetch(`${base}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
  const ok = await post({ email: "demo@tradedesk.dev", password: "demo1234" });
  assert.equal(ok.status, 200);
  assert.ok((await ok.json()).access_token);
  assert.equal((await post({ email: "demo@tradedesk.dev", password: "nope" })).status, 401);
});

test("trades and analytics", async () => {
  const trades = await (await fetch(`${base}/trades`)).json();
  assert.ok(Array.isArray(trades) && trades.length > 0);
  const created = await fetch(`${base}/trades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: "2026-02-01", symbol: "msft", side: "buy", quantity: 5, price: 400 }),
  });
  assert.ok(created.status < 300);
  const after = await (await fetch(`${base}/trades`)).json();
  assert.equal(after.length, trades.length + 1);
  assert.equal((await fetch(`${base}/analytics`)).status, 200);
});
