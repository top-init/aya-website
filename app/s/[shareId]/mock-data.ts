// ShareData is the contract between the web player and the backend's
// GET /public/shares/<share_id> endpoint. The share id is an opaque short
// code; the backend resolves it to the underlying audio/subliminal.

export type WordTimestamps = { words: string[]; start: number[]; end: number[] };
export type TimedLine = { index: number; text: string; start: number; end: number };

export type ShareData = {
  shareId: string;
  type: "moment" | "subliminal";
  creatorName: string;
  title: string;
  theme?: string;

  // moment: a single self-contained track + narration transcript
  audioUrl?: string;
  transcript?: string;
  wordTimestamps?: WordTimestamps;
  durationLabel?: string;

  // subliminal: a looping voice affirmation (+ optional ambient bed)
  voiceUrl?: string;
  bedUrl?: string;
  bedName?: string;
  lines?: string[]; // plain text, for display
  timedLines?: TimedLine[]; // text + start/end, for read-along sync
  loopSeconds?: number;
  voiceVolume?: number;
};

// Backend base URL. Server-side fetch (Next server → backend), so localhost
// works in dev with no CORS. Exposed so the client player can beacon
// engagement events to the same backend. Override via SHARE_API_BASE.
export const SHARE_API_BASE =
  process.env.SHARE_API_BASE || "http://127.0.0.1:8080";

function mapApiToShare(api: Record<string, unknown>): ShareData {
  const type = api.type as "moment" | "subliminal";
  if (type === "subliminal") {
    const timed = ((api.lines as TimedLine[]) || [])
      .slice()
      .sort((a, b) => a.index - b.index);
    return {
      shareId: String(api.share_id),
      type: "subliminal",
      creatorName: (api.creator_name as string) || "Someone",
      title: (api.name as string) || "A subliminal",
      theme: api.theme as string | undefined,
      voiceUrl: api.audio_url as string | undefined,
      bedUrl: api.bed_url as string | undefined,
      bedName: (api.bed_name as string) || "Ambient",
      loopSeconds: (api.loop_seconds as number) || 30,
      lines: timed.map((l) => l.text),
      timedLines: timed,
    };
  }
  const dur = api.duration_estimate_s as number | undefined;
  return {
    shareId: String(api.share_id),
    type: "moment",
    creatorName: (api.creator_name as string) || "Someone",
    title: (api.title as string) || "A visualization",
    theme: api.theme as string | undefined,
    audioUrl: api.audio_url as string | undefined,
    transcript: api.text as string | undefined,
    wordTimestamps: api.word_timestamps as WordTimestamps | undefined,
    durationLabel: dur ? `${Math.max(1, Math.round(dur / 60))} min` : undefined,
  };
}

/** Resolve a share id to real data from the backend, with a demo fallback. */
export async function getShare(shareId: string): Promise<ShareData> {
  if (!shareId.startsWith("demo-")) {
    try {
      const res = await fetch(
        `${SHARE_API_BASE}/public/shares/${encodeURIComponent(shareId)}`,
        { cache: "no-store" }
      );
      if (res.ok) return mapApiToShare(await res.json());
    } catch {
      // fall through to demo fixture
    }
  }
  return getMockShare(shareId);
}

// ── Demo fixtures (used for /s/demo-* and as offline fallback) ──────────
const SAMPLE_MOMENT = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3";
const SAMPLE_VOICE = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const SAMPLE_BED = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

// Demos ship without real Cartesia timing, so synthesize an even cadence to
// show the read-along karaoke. Real shares carry word_timestamps / timed lines.
function synthWordTimestamps(text: string, secPerWord = 0.5): WordTimestamps {
  const words = text.split(/\s+/).filter(Boolean);
  const start: number[] = [];
  const end: number[] = [];
  words.forEach((_, i) => {
    start.push(+(i * secPerWord).toFixed(2));
    end.push(+((i + 1) * secPerWord).toFixed(2));
  });
  return { words, start, end };
}

function synthTimedLines(lines: string[], loopSeconds: number): TimedLine[] {
  const slice = loopSeconds / Math.max(1, lines.length);
  return lines.map((text, index) => ({
    index,
    text,
    start: +(index * slice).toFixed(2),
    end: +((index + 1) * slice).toFixed(2),
  }));
}

const DEMO_TRANSCRIPT =
  "Good morning. Take a slow breath in — and let it go. " +
  "Right now, somewhere just ahead of you, there's a version of you who moves through her day with quiet certainty. " +
  "She isn't waiting to feel ready. She simply begins. " +
  "Picture her shoulders, soft and open. Hear the steadiness in her voice. " +
  "This is who you are becoming, and you are closer than you think.";

const DEMO_AFFIRMATIONS = [
  "I am worthy of every good thing coming to me.",
  "My confidence grows quietly and completely.",
  "I trust myself to handle whatever comes.",
  "Everything I need is already within me.",
];

const MOCK: Record<string, ShareData> = {
  "demo-moment": {
    shareId: "demo-moment",
    type: "moment",
    creatorName: "Maya",
    title: "The morning you wake up already her",
    theme: "Confidence",
    audioUrl: SAMPLE_MOMENT,
    durationLabel: "4 min",
    transcript: DEMO_TRANSCRIPT,
    wordTimestamps: synthWordTimestamps(DEMO_TRANSCRIPT),
  },
  "demo-subliminal": {
    shareId: "demo-subliminal",
    type: "subliminal",
    creatorName: "Maya",
    title: "Unshakeable self-worth",
    theme: "Self-love",
    voiceUrl: SAMPLE_VOICE,
    bedUrl: SAMPLE_BED,
    bedName: "Deep focus · lofi",
    loopSeconds: 24,
    voiceVolume: 0.0178,
    lines: DEMO_AFFIRMATIONS,
    timedLines: synthTimedLines(DEMO_AFFIRMATIONS, 24),
  },
};

export function getMockShare(shareId: string): ShareData {
  return MOCK[shareId] ?? { ...MOCK["demo-subliminal"], shareId };
}
