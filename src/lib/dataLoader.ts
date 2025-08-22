import { GuitarSchema, AmpSchema, SongSchema, ToneSchema, type Guitar, type Amp, type Song, type Tone } from "./schemas";
import guitarsRaw from "@/data/guitars.json";
import ampsRaw from "@/data/amps.json";
import songsRaw from "@/data/songs.json";
import tonesRaw from "@/data/tones.json";

function safeParseArray<T>(schema: any, raw: unknown[], label: string): T[] {
  const out: T[] = [];
  for (const item of raw) {
    const parsed = schema.safeParse(item);
    if (!parsed.success) {
      console.error(`[${label}] invalid entry`, parsed.error.flatten());
      continue;
    }
    out.push(parsed.data);
  }
  return out;
}

export const guitars: Guitar[] = safeParseArray<Guitar>(GuitarSchema, guitarsRaw as unknown[], "guitar");
export const amps: Amp[] = safeParseArray<Amp>(AmpSchema, ampsRaw as unknown[], "amp");
export const songs: Song[] = safeParseArray<Song>(SongSchema, songsRaw as unknown[], "song");
export const tones: Tone[] = safeParseArray<Tone>(ToneSchema, tonesRaw as unknown[], "tone");
