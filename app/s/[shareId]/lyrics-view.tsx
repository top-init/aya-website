"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ShareData, WordTimestamps, TimedLine } from "./mock-data";

/* ── Faithful web port of the app's LyricsView (ui/primitives/lyrics-view.tsx)
   Two-tone "Spotify Read Along" karaoke: big bold Plus Jakarta Sans, past text
   bright, future text dimmed, per-word highlight on the active line, and the
   active line auto-follows playback toward the top third of the viewport. ──── */

export type LyricsLine = {
  text: string;
  start: number;
  end: number;
  words: string[];
  /** Per-word start times, aligned with `words`. */
  wordStarts: number[];
};

// Per-line opacity targets, indexed by [state][large?]. Matches the app.
const OPACITY = {
  active: 1,
  past: { compact: 1, large: 0.5 },
  future: { compact: 0.3, large: 0.22 },
} as const;

const PRIMARY = "var(--color-text-primary)";
const TERTIARY = "var(--color-text-tertiary)";

/** Sentence-split a transcript and map each line to word-level timing. */
function buildFromWordTimestamps(text: string, wt: WordTimestamps): LyricsLine[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const lines: LyricsLine[] = [];
  let wordIdx = 0;
  for (const sentence of sentences) {
    const sw = sentence.split(/\s+/);
    const startIdx = wordIdx;
    const endIdx = Math.min(wordIdx + sw.length - 1, wt.words.length - 1);
    if (startIdx < wt.words.length) {
      lines.push({
        text: sentence,
        start: wt.start[startIdx],
        end: wt.end[Math.min(endIdx, wt.end.length - 1)],
        words: wt.words.slice(startIdx, endIdx + 1),
        wordStarts: wt.start.slice(startIdx, endIdx + 1),
      });
    } else {
      lines.push({
        text: sentence,
        start: Infinity,
        end: Infinity,
        words: sw,
        wordStarts: sw.map(() => Infinity),
      });
    }
    wordIdx += sw.length;
  }
  return lines;
}

/** Subliminal lines come pre-timed; distribute words evenly across each line. */
function buildFromTimedLines(timed: TimedLine[]): LyricsLine[] {
  return timed.map((l) => {
    const words = l.text.split(/\s+/);
    const span = Math.max(0.001, l.end - l.start);
    return {
      text: l.text,
      start: l.start,
      end: l.end,
      words,
      wordStarts: words.map((_, i) => l.start + (span * i) / words.length),
    };
  });
}

/** Plain fallback — no timing, every line renders full strength. */
function buildPlain(parts: string[]): LyricsLine[] {
  return parts
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({
      text,
      start: Infinity,
      end: Infinity,
      words: text.split(/\s+/),
      wordStarts: text.split(/\s+/).map(() => Infinity),
    }));
}

/** Resolve a share into karaoke lines + the time signal that drives them. */
export function useLyrics(share: ShareData): LyricsLine[] {
  return useMemo(() => {
    // Subliminal + sleep both carry timed lines for the read-along karaoke.
    if (share.type === "subliminal" || share.type === "sleep") {
      if (share.timedLines?.length) return buildFromTimedLines(share.timedLines);
      if (share.lines?.length) return buildPlain(share.lines);
      return [];
    }
    const text = share.transcript ?? "";
    if (!text) return [];
    if (share.wordTimestamps?.words?.length) {
      return buildFromWordTimestamps(text, share.wordTimestamps);
    }
    return buildPlain(text.split(/(?<=[.!?])\s+/));
  }, [share]);
}

function activeIndex(lines: LyricsLine[], t: number): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (t >= lines[i].start) return i;
  }
  return -1;
}

export interface LyricsViewProps {
  lines: LyricsLine[];
  currentTime: number;
  /** Larger immersive type (full-screen) vs. compact card. */
  large?: boolean;
  /** The scroll viewport that should auto-follow the active line. */
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  /** Auto-follow the active line. Off → user reads freely (a scrub still realigns). */
  autoScrollEnabled?: boolean;
}

export function LyricsView({
  lines,
  currentTime,
  large = false,
  scrollContainerRef,
  autoScrollEnabled = true,
}: LyricsViewProps) {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrolled = useRef(-1);
  const prevActive = useRef(-1);

  const hasTiming = lines.some((l) => Number.isFinite(l.start));
  const activeIdx = hasTiming ? activeIndex(lines, currentTime) : -1;

  // Auto-scroll: park the active line ~22% down the viewport. Suppressed while
  // paused in large mode, EXCEPT on a scrub (index jumps by >1 line).
  const jumped =
    prevActive.current >= 0 &&
    activeIdx >= 0 &&
    Math.abs(activeIdx - prevActive.current) > 1;
  const shouldAutoScroll = autoScrollEnabled || jumped;

  useEffect(() => {
    prevActive.current = activeIdx;
    if (!shouldAutoScroll || activeIdx < 0 || activeIdx === lastScrolled.current) {
      return;
    }
    const c = scrollContainerRef.current;
    const el = lineRefs.current[activeIdx];
    if (!c || !el) return;
    lastScrolled.current = activeIdx;
    const top =
      el.getBoundingClientRect().top -
      c.getBoundingClientRect().top +
      c.scrollTop -
      c.clientHeight * 0.22;
    c.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [activeIdx, shouldAutoScroll, scrollContainerRef]);

  const fontSize = large ? 30 : 23;
  const lineHeight = large ? 46 : 34;
  const letterSpacing = large ? -0.3 : -0.2;
  const gap = large ? 32 : 20;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {lines.map((line, i) => {
        const isActive = i === activeIdx;
        const isPast = activeIdx >= 0 && i < activeIdx;
        const opacity = !hasTiming
          ? 1
          : isActive
          ? OPACITY.active
          : isPast
          ? OPACITY.past[large ? "large" : "compact"]
          : OPACITY.future[large ? "large" : "compact"];

        // Inactive lines take a single fallback color; the active line is
        // coloured per word. No weight changes anywhere — colour only.
        const fallback = !hasTiming || isActive || isPast ? PRIMARY : TERTIARY;

        return (
          <div
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            style={{
              opacity,
              transition: `opacity ${large ? 450 : 300}ms cubic-bezier(0.25,0.46,0.45,0.94)`,
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize,
              lineHeight: `${lineHeight}px`,
              letterSpacing,
              color: fallback,
            }}
          >
            {isActive && hasTiming
              ? line.words.map((w, wi) => (
                  <span
                    key={wi}
                    style={{
                      color: currentTime >= line.wordStarts[wi] ? PRIMARY : TERTIARY,
                    }}
                  >
                    {w}
                    {wi < line.words.length - 1 ? " " : ""}
                  </span>
                ))
              : line.text}
          </div>
        );
      })}
    </div>
  );
}
