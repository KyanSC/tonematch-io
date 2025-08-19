import { NextResponse } from "next/server";
import { buildMatchPreview } from "@/lib/matching/preview";
import type { MatchPreviewInput } from "@/lib/matching/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as MatchPreviewInput;
    if (!body?.toneId || !body?.targetGuitarId || !body?.targetAmpId) {
      return NextResponse.json({ error: "toneId, targetGuitarId, targetAmpId required" }, { status: 400 });
    }
    const result = await buildMatchPreview(body);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "match preview failed" }, { status: 500 });
  }
} 