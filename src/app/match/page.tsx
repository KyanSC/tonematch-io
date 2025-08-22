"use client";
import { useState } from "react";

export default function MatchPage() {
  const [out, setOut] = useState<any>(null);
  const [toneId, setToneId] = useState("");
  const [guitarId, setGuitarId] = useState("");
  const [ampId, setAmpId] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!toneId || !guitarId || !ampId) return alert("Set IDs first");
    setLoading(true);
    setOut(null);
    const r = await fetch("/api/match/preview", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ toneId, guitarId, ampId })
    });
    const data = await r.json();
    setOut(data);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">ToneMatch — Preview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input className="border rounded-xl px-3 py-2" placeholder="toneId" value={toneId} onChange={e=>setToneId(e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="guitarId" value={guitarId} onChange={e=>setGuitarId(e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="ampId" value={ampId} onChange={e=>setAmpId(e.target.value)} />
      </div>
      <button onClick={run} disabled={loading} className="px-4 py-2 rounded-2xl shadow bg-black text-white disabled:opacity-50">
        {loading ? "Matching..." : "Run Preview"}
      </button>
      {out && (
        <pre className="mt-4 text-sm bg-zinc-900 text-zinc-100 p-4 rounded-2xl overflow-auto">
{JSON.stringify(out, null, 2)}
        </pre>
      )}
      <p className="text-xs text-gray-500">
        Tip: paste your IDs from the admin pages. We model multiple tones per song via Tone.name/slug/role/section. The algorithm adapts Tone.intent to your amp's available knobs (core + extended).
      </p>
    </div>
  );
}
