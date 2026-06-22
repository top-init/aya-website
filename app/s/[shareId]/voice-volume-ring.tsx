"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Web port of the app's VoiceVolumeRing (ui/patterns/player/voice-volume-ring.tsx).
 *
 * A whisper-volume DIAL wrapped around the player orb — drag along the ring to
 * set the subliminal voice's level. Position→volume is CUBIC (volume = max·p³):
 * a subliminal lives at barely-audible levels, so the low end gets most of the
 * arc. The ring is a 270° sweep with the gap at the bottom; speaker glyphs flank
 * the gap, and a live "% voice" readout fades in there while dragging.
 */

// Dial geometry — a 270° arc opening downward (gap at the bottom), starting at
// bottom-left (135° clockwise in screen coords) → bottom-right. Mirrors the app.
const START_DEG = 135;
const SWEEP_DEG = 270;
// Track sits just outside the orbiting-arc hairlines (orb radius + this).
const TRACK_OFFSET = 22;
// Extra canvas beyond the track for the knob + end glyphs.
const EDGE_PAD = 18;
// Touch annulus half-thickness around the track — pointer-downs outside this
// band fall through so they never hijack the rest of the page.
const BAND = 24;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function polar(c: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [c + r * Math.cos(a), c + r * Math.sin(a)];
}

function arcPath(c: number, r: number, fromDeg: number, toDeg: number): string {
  const [x0, y0] = polar(c, r, fromDeg);
  const [x1, y1] = polar(c, r, toDeg);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

export interface VoiceVolumeRingProps {
  /** The orb's box size — the ring positions itself around it. */
  orbSize: number;
  /** Linear volume, 0..maxVolume. */
  volume: number;
  /** The control's ceiling. */
  maxVolume: number;
  /** Live during the drag — set the audio engine directly (cheap path). */
  onChange: (volume: number) => void;
  /** Once on release — commit the value to state. */
  onCommit: (volume: number) => void;
}

export function VoiceVolumeRing({
  orbSize,
  volume,
  maxVolume,
  onChange,
  onCommit,
}: VoiceVolumeRingProps) {
  const trackR = orbSize / 2 + TRACK_OFFSET;
  const size = 2 * (trackR + EDGE_PAD);
  const c = size / 2;

  const svgRef = useRef<SVGSVGElement>(null);
  // position along the sweep, 0..1 — cubic-mapped to volume on the way out.
  const [p, setP] = useState(() => Math.cbrt(clamp01(volume / maxVolume)));
  // Drag-reveal label: the knob % shown in the gap while dragging, so the user
  // learns this dial controls the VOICE (not the bed). null at rest → the
  // speaker range icons show instead.
  const [dragPct, setDragPct] = useState<number | null>(null);
  const dragging = useRef(false);

  // Re-sync when the committed value changes externally (new session).
  useEffect(() => {
    if (!dragging.current) setP(Math.cbrt(clamp01(volume / maxVolume)));
  }, [volume, maxVolume]);

  // Map a pointer event to a position along the sweep, clamping the bottom gap
  // to whichever end it's nearest.
  const posFromEvent = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const dx = ((e.clientX - rect.left) / rect.width) * size - c;
      const dy = ((e.clientY - rect.top) / rect.height) * size - c;
      let ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      ang = (ang + 360) % 360;
      let rel = (ang - START_DEG + 360) % 360;
      if (rel > SWEEP_DEG)
        rel = rel < SWEEP_DEG + (360 - SWEEP_DEG) / 2 ? SWEEP_DEG : 0;
      return { rel: rel / SWEEP_DEG, r: Math.sqrt(dx * dx + dy * dy) };
    },
    [c, size]
  );

  const apply = useCallback(
    (np: number) => {
      setP(np);
      setDragPct(Math.round(np * 100));
      onChange(maxVolume * np ** 3);
    },
    [maxVolume, onChange]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const hit = posFromEvent(e);
      if (!hit) return;
      // Only grab the gesture inside the track's annulus — taps in the middle
      // (over the orb) fall through.
      if (hit.r < trackR - BAND || hit.r > trackR + BAND) return;
      dragging.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      apply(hit.rel);
    },
    [apply, posFromEvent, trackR]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const hit = posFromEvent(e);
      if (hit) apply(hit.rel);
    },
    [apply, posFromEvent]
  );

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setDragPct(null);
    onCommit(maxVolume * p ** 3);
  }, [maxVolume, onCommit, p]);

  const fillD = arcPath(
    c,
    trackR,
    START_DEG,
    START_DEG + SWEEP_DEG * Math.max(p, 0.004)
  );
  const [knobX, knobY] = polar(c, trackR, START_DEG + SWEEP_DEG * p);

  // End glyphs sit INSIDE the bottom gap, flanking its center.
  const [lowX, lowY] = polar(c, trackR, START_DEG - 21);
  const [highX, highY] = polar(c, trackR, START_DEG + SWEEP_DEG + 21);
  const muted = "var(--color-text-tertiary)";

  return (
    <div
      className="absolute touch-none select-none"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
      role="slider"
      aria-label="Voice volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ cursor: "pointer", display: "block" }}
      >
        {/* unfilled track */}
        <path
          d={arcPath(c, trackR, START_DEG, START_DEG + SWEEP_DEG)}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        {/* filled portion */}
        <path
          d={fillD}
          stroke="var(--color-brand)"
          strokeOpacity={0.5}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        {/* knob */}
        <circle
          cx={knobX}
          cy={knobY}
          r={7}
          fill="#FFFFFF"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={1}
        />
        {/* end glyphs flanking the bottom gap */}
        <SpeakerLow x={lowX} y={lowY} color={muted} />
        <SpeakerHigh x={highX} y={highY} color={muted} />
      </svg>

      {/* live readout while dragging — small, muted, centered in the gap.
          Names what's changing: voice. */}
      {dragPct != null && (
        <div
          className="aya-ring-readout pointer-events-none absolute text-center"
          style={{ left: 0, right: 0, top: (lowY + highY) / 2 - 8 }}
        >
          <span className="t-caption" style={{ color: muted }}>
            {dragPct}% voice
          </span>
        </div>
      )}
    </div>
  );
}

/* Small speaker glyphs (phosphor "speaker-simple" family), drawn centered on
   the given track point. */
function SpeakerLow({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x - 7} ${y - 7})`} aria-hidden>
      <path
        d="M2 5.5v3h2.5L8 11.5v-7L4.5 5.5H2z"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <path
        d="M10 5.5a2.6 2.6 0 0 1 0 3"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
      />
    </g>
  );
}

function SpeakerHigh({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x - 7} ${y - 7})`} aria-hidden>
      <path
        d="M1.5 5.5v3H4L7.5 11.5v-7L4 5.5H1.5z"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <path
        d="M9.5 5a2.6 2.6 0 0 1 0 4"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
      />
      <path
        d="M11.5 3.5a5 5 0 0 1 0 7"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
      />
    </g>
  );
}
