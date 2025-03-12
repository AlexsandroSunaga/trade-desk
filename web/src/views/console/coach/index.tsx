
import { useState } from "react";

const base = import.meta.env.VITE_API_BASE ?? "http://localhost:8012";

export default function CoachPage() {
  const [text, setText] = useState("");
  async function run() {
    const res = await fetch(`${base}/api/v1/ai/coach`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ focus: "discipline" }) });
    const d = await res.json();
    setText(d.review);
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold">AI trading coach</h1>
      <button onClick={run} className="mt-4 rounded-lg bg-accent px-4 py-2 text-slate-900">Run review</button>
      <pre className="mt-6 whitespace-pre-wrap text-sm text-slate-300">{text}</pre>
    </div>
  );
}
