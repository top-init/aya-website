"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ShareData } from "./mock-data";
import { Orb as WebGLOrb } from "./orb";
import { VoiceVolumeRing } from "./voice-volume-ring";
import { LyricsView, useLyrics, type LyricsLine } from "./lyrics-view";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/aya-manifest-your-dream-self/id6760195623";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.litapps.aya";

// The WebGL orb's diameter — the voice ring positions itself around it.
const ORB_SIZE = 170;
// The voice dial's ceiling; the cubic position→volume curve lives under this.
const MAX_VOICE_VOLUME = 1;
// Where the dial starts when a share carries no explicit voice level. Mirrors
// the app's DEFAULT_VOICE_VOLUME (services/subliminal-overlay.ts): a subliminal
// rides barely-audible UNDER the bed, so this is intentionally tiny (linear).
const DEFAULT_VOICE_VOLUME = 0.0178;
// Flat, whisper-light page tone behind the full-screen read-along — the
// feathered top/bottom fades dissolve into this same color (app parity).
const FLAT_BG = "#F4EFF2";

/* Best-effort engagement beacon — POSTs to our same-origin proxy
   (/api/share-events), which forwards to the backend server-side. Going
   same-origin avoids the CORS preflight a direct browser→backend POST hits.
   Fire-and-forget: analytics must never interfere with playback. */
function sendShareEvent(shareId: string, event: "open" | "play") {
  void fetch(`/api/share-events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shareId, event }),
    keepalive: true,
  }).catch(() => {});
}

function formatTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* ── Shared playback controller ─────────────────────────────────────────
   One <audio> (moment) or voice + optional bed (subliminal), so the transport
   AND the read-along karaoke read from a single source of truth. `voiceVol`
   is owned by SharePlayer (driven by the orb dial) and flows in here. */
function usePlayerController(share: ShareData, voiceVol: number) {
  const isSubliminal = share.type === "subliminal";
  const primaryRef = useRef<HTMLAudioElement>(null); // moment track OR voice loop
  const bedRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Set when the source can't be played (e.g. a dead/forbidden audio URL) so
  // the UI can say so instead of silently sticking in a "playing" state.
  const [failed, setFailed] = useState(false);

  const loopWindow = isSubliminal ? share.loopSeconds ?? 24 : 0;
  const captionTime = loopWindow > 0 ? currentTime % loopWindow : currentTime;
  const hasBed = isSubliminal && !!share.bedUrl;

  useEffect(() => {
    if (primaryRef.current && isSubliminal) primaryRef.current.volume = voiceVol;
  }, [voiceVol, isSubliminal]);

  const toggle = useCallback(() => {
    const a = primaryRef.current;
    if (!a) return;
    if (a.paused) {
      if (isSubliminal) a.volume = voiceVol;
      setFailed(false);
      setIsPlaying(true);
      // play() rejects on a missing/forbidden source (403, CORS, bad codec).
      // Catch it so it isn't an uncaught rejection and the orb doesn't stick.
      a.play().catch(() => {
        setIsPlaying(false);
        setFailed(true);
        if (bedRef.current) bedRef.current.pause();
      });
      if (hasBed && bedRef.current) {
        bedRef.current.volume = 1;
        void bedRef.current.play().catch(() => {});
      }
    } else {
      a.pause();
      if (bedRef.current) bedRef.current.pause();
      setIsPlaying(false);
    }
  }, [isSubliminal, voiceVol, hasBed]);

  const seekTo = useCallback((s: number) => {
    const a = primaryRef.current;
    if (a && Number.isFinite(s)) {
      a.currentTime = s;
      setCurrentTime(s);
    }
  }, []);

  const seekBack = useCallback(
    () => seekTo(Math.max(0, (primaryRef.current?.currentTime ?? 0) - 15)),
    [seekTo],
  );
  const seekForward = useCallback(
    () =>
      seekTo(
        Math.min(
          duration || Number.MAX_SAFE_INTEGER,
          (primaryRef.current?.currentTime ?? 0) + 15,
        ),
      ),
    [seekTo, duration],
  );

  const audioEls = (
    <>
      <audio
        ref={primaryRef}
        src={isSubliminal ? share.voiceUrl : share.audioUrl}
        loop={isSubliminal}
        preload={isSubliminal ? "auto" : "metadata"}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={isSubliminal ? undefined : () => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setFailed(true);
        }}
      />
      {hasBed && <audio ref={bedRef} src={share.bedUrl} loop preload="auto" />}
    </>
  );

  return {
    isSubliminal,
    isPlaying,
    failed,
    currentTime,
    duration,
    captionTime,
    hasBed,
    toggle,
    seekTo,
    seekBack,
    seekForward,
    audioEls,
    bedName: share.bedName,
  };
}

type Controller = ReturnType<typeof usePlayerController>;

/* The orb centerpiece + glow halo. An optional `ring` overlay (the
   voice-volume dial) is drawn centered on top. */
function Orb({ playing, ring }: { playing: boolean; ring?: ReactNode }) {
  return (
    <div className="relative grid place-items-center h-[206px] w-[206px]">
      <div className="absolute h-[178px] w-[178px] rounded-full aya-halo" aria-hidden />

      {/* the orb — faithful WebGL port of the app's SkSL shader */}
      <div className={`relative aya-orb-glow ${playing ? "aya-breathe" : ""}`} aria-hidden>
        <WebGLOrb playing={playing} size={ORB_SIZE} />
      </div>

      {/* voice-volume dial, wrapped around the orb (subliminals only) */}
      {ring}
    </div>
  );
}

/* 64px white play/pause button — matches the app transport. */
function PlayButton({
  playing,
  onClick,
}: {
  playing: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={playing ? "Pause" : "Play"}
      className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_12px_28px_-6px_rgba(28,21,54,0.45)] transition-transform active:scale-90"
    >
      {playing ? (
        <svg width="26" height="26" viewBox="0 0 24 24" className="fill-[var(--color-lavender-12)]">
          <rect x="6" y="5" width="4" height="14" rx="1.6" />
          <rect x="14" y="5" width="4" height="14" rx="1.6" />
        </svg>
      ) : (
        <svg width="28" height="28" viewBox="0 0 24 24" className="fill-[var(--color-lavender-12)]">
          <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" />
        </svg>
      )}
    </button>
  );
}

const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const IconExpand = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H3v5M21 8V3h-5M16 21h5v-5M3 16v5h5" />
  </svg>
);

export function SharePlayer({ share }: { share: ShareData }) {
  const isSubliminal = share.type === "subliminal";
  const noun = isSubliminal ? "subliminal" : "visualization";
  const nounPlural = `${noun}s`;

  // Voice level (subliminals): owned here so the orb dial and the <audio> in
  // the controller stay in lockstep. Linear 0..MAX_VOICE_VOLUME.
  const [voiceVol, setVoiceVol] = useState(
    share.voiceVolume ?? DEFAULT_VOICE_VOLUME,
  );

  const player = usePlayerController(share, voiceVol);
  const lines = useLyrics(share);
  const hasReadAlong = lines.length > 0;
  const [expanded, setExpanded] = useState(false);

  // Engagement analytics (best-effort): one "open" per mount, one "play" the
  // first time playback starts. Counted server-side on shares/{code}.
  const playReported = useRef(false);
  useEffect(() => {
    sendShareEvent(share.shareId, "open");
  }, [share.shareId]);
  useEffect(() => {
    if (player.isPlaying && !playReported.current) {
      playReported.current = true;
      sendShareEvent(share.shareId, "play");
    }
  }, [player.isPlaying, share.shareId]);

  // Time signal that drives the karaoke — subliminals run on the caption loop.
  const raTime = player.isSubliminal ? player.captionTime : player.currentTime;

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-sunrise">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.7)_0%,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 aya-grain" />

      <div className="relative mx-auto flex min-h-0 w-full max-w-[460px] flex-1 flex-col overflow-hidden px-6 pt-6">
        {/* who shared */}
        <div className="text-center">
          <p className="t-title3 text-[var(--color-lavender-12)]">
            <span className="t-serif-italic text-[var(--color-brand)]">{share.creatorName}</span> shared a{" "}
            <span className="t-serif-italic text-[var(--color-brand)]">{noun}</span>
            <br className="sm:hidden" /> with you on{" "}
            <span className="t-serif-italic text-[var(--color-brand)]">Aya</span>
          </p>
        </div>

        {/* orb */}
        <div className="mt-4 flex shrink-0 justify-center">
          <Orb
            playing={player.isPlaying}
            ring={
              isSubliminal ? (
                <VoiceVolumeRing
                  orbSize={ORB_SIZE}
                  volume={voiceVol}
                  maxVolume={MAX_VOICE_VOLUME}
                  onChange={setVoiceVol}
                  onCommit={setVoiceVol}
                />
              ) : undefined
            }
          />
        </div>

        {/* controls (per type) */}
        {isSubliminal ? (
          <SubliminalTransport share={share} player={player} />
        ) : (
          <MomentTransport share={share} player={player} />
        )}

        {/* read along — compact card; tap to expand full-screen */}
        {hasReadAlong && (
          <ReadAlongCard
            lines={lines}
            currentTime={raTime}
            onOpen={() => setExpanded(true)}
          />
        )}
      </div>

      <DownloadBar nounPlural={nounPlural} overlay />

      {/* full-screen read along (always mounted; slides up on open) */}
      {hasReadAlong && (
        <ReadAlongOverlay
          share={share}
          player={player}
          lines={lines}
          currentTime={raTime}
          open={expanded}
          onClose={() => setExpanded(false)}
        />
      )}

      {player.audioEls}
    </div>
  );
}

/* ── Moment transport — scrub bar + transport ──────────────────────────── */
function MomentTransport({
  share,
  player,
}: {
  share: ShareData;
  player: Controller;
}) {
  return (
    <div className="mt-5 flex shrink-0 flex-col items-center">
      <h1 className="t-title1 text-center text-[var(--color-text-primary)]">
        {share.title}
      </h1>
      {share.theme && (
        <span className="t-eyebrow mt-2 text-[var(--color-brand)]">{share.theme}</span>
      )}

      <div className="mt-5 w-full">
        <input
          type="range"
          min={0}
          max={player.duration || 0}
          value={player.currentTime}
          onChange={(e) => player.seekTo(Number(e.target.value))}
          className="aya-range w-full"
          aria-label="Seek"
        />
        <div className="mt-1.5 flex justify-between t-caption tabular-nums text-[var(--color-text-tertiary)]">
          <span>{formatTime(player.currentTime)}</span>
          <span>{formatTime(player.duration)}</span>
        </div>
      </div>

      <div className="mt-4">
        <PlayButton playing={player.isPlaying} onClick={player.toggle} />
      </div>

      {player.failed && <AudioUnavailable />}
    </div>
  );
}

/* ── Subliminal transport — voice loop + optional ambient bed ───────────
   Voice level is set by the dial around the orb; the loop/ambient mix runs in
   the controller. The affirmations live in the read-along card below. */
function SubliminalTransport({
  share,
  player,
}: {
  share: ShareData;
  player: Controller;
}) {
  return (
    <div className="mt-5 flex shrink-0 flex-col items-center">
      <h1 className="t-title1 text-center text-[var(--color-text-primary)]">
        {share.title}
      </h1>
      <span className="t-eyebrow mt-2 text-[var(--color-brand)]">
        {share.theme ?? "Subliminal"}
      </span>

      <div className="mt-5">
        <PlayButton playing={player.isPlaying} onClick={player.toggle} />
      </div>

      {player.failed && <AudioUnavailable />}
    </div>
  );
}

/* Shown when the audio source can't be loaded (e.g. an expired/forbidden URL). */
function AudioUnavailable() {
  return (
    <p className="mt-4 t-caption text-center text-[var(--color-text-tertiary)]">
      This audio is no longer available.
    </p>
  );
}

/* ── Compact read-along card (Spotify-style) ──────────────────────────── */
function ReadAlongCard({
  lines,
  currentTime,
  onOpen,
}: {
  lines: LyricsLine[];
  currentTime: number;
  onOpen: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onClick={onOpen}
      className="mt-5 flex min-h-0 flex-1 cursor-pointer flex-col rounded-[var(--radius-xl)] bg-white/60 p-5 shadow-[0_18px_40px_-20px_rgba(28,21,54,0.45)] backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className="text-[16px] font-semibold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Read along
        </span>
        <span
          aria-hidden
          className="grid h-8 w-8 place-items-center rounded-full bg-[rgba(28,21,54,0.08)] text-[var(--color-text-secondary)]"
        >
          <IconExpand />
        </span>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <LyricsView
          lines={lines}
          currentTime={currentTime}
          scrollContainerRef={scrollRef}
          autoScrollEnabled
        />
        <div className="h-1/2" />
      </div>
    </div>
  );
}

/* ── Full-screen read along — immersive transcript, slides up on open ──── */
function ReadAlongOverlay({
  share,
  player,
  lines,
  currentTime,
  open,
  onClose,
}: {
  share: ShareData;
  player: Controller;
  lines: LyricsLine[];
  currentTime: number;
  open: boolean;
  onClose: () => void;
}) {
  const nounPlural = share.type === "subliminal" ? "subliminals" : "visualizations";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(0);
  const dragState = useRef({ startY: 0, active: false });

  useEffect(() => {
    if (!open) {
      setDrag(0);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [open]);

  // Pull-to-dismiss: only engages from the top of the transcript.
  const onTouchStart = (e: React.TouchEvent) => {
    dragState.current = {
      startY: e.touches[0].clientY,
      active: (scrollRef.current?.scrollTop ?? 0) <= 0,
    };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragState.current.active) return;
    const dy = e.touches[0].clientY - dragState.current.startY;
    if (dy > 0) setDrag(dy);
  };
  const onTouchEnd = () => {
    if (drag > 120) onClose();
    else setDrag(0);
    dragState.current.active = false;
  };

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[60] flex flex-col"
      style={{
        backgroundColor: FLAT_BG,
        transform: open ? `translateY(${drag}px)` : "translateY(100%)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: drag
          ? "none"
          : "transform 450ms cubic-bezier(0.22,1,0.36,1), opacity 450ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className="mx-auto flex min-h-0 w-full max-w-[460px] flex-1 flex-col pt-[max(0.75rem,env(safe-area-inset-top))]">
        {/* header — close chevron · centered title · spacer */}
        <div
          className="flex items-center gap-3 px-4 pb-3"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(28,21,54,0.08)] text-[var(--color-text-primary)]"
          >
            <IconChevronDown />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="t-title3 truncate text-[var(--color-text-primary)]">
              {share.theme ?? share.title}
            </p>
          </div>
          <div className="h-9 w-9" />
        </div>

        {/* transcript — big karaoke, feathered top + bottom */}
        <div className="relative min-h-0 flex-1">
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto px-5 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <LyricsView
              lines={lines}
              currentTime={currentTime}
              large
              scrollContainerRef={scrollRef}
              autoScrollEnabled={player.isPlaying}
            />
            <div className="h-1/2" />
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[132px]"
            style={{ background: `linear-gradient(${FLAT_BG} 0%, ${FLAT_BG} 35%, ${FLAT_BG}00 100%)` }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[184px]"
            style={{ background: `linear-gradient(${FLAT_BG}00 0%, ${FLAT_BG} 55%, ${FLAT_BG} 100%)` }}
          />
        </div>

      </div>

      {/* same install bar as the player — no transport in the read-along */}
      <DownloadBar nounPlural={nounPlural} />
    </div>
  );
}

/* Prominent, full-width install bar pinned to the bottom of the screen.
   Headlines "Create your own …" then offers both official store badges. */
function DownloadBar({
  nounPlural,
  overlay = false,
}: {
  nounPlural: string;
  overlay?: boolean;
}) {
  return (
    <div className={overlay ? "absolute inset-x-0 bottom-0 z-10" : "relative z-10 shrink-0"}>
      {/* progressive frosted blend: the read-along above blurs + lightens as it
          meets the bar, so there's no hard seam while it plays. Sits just above
          the bar (bottom-full) so it overlaps the card without taking layout. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-full h-24 backdrop-blur-md"
        style={{
          maskImage: "linear-gradient(to top, #000 0%, #000 30%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, #000 0%, #000 30%, transparent 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-full h-24 bg-gradient-to-t from-white/85 to-transparent" />
      <div className="border-t border-white/55 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[460px] px-6 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-4">
          <p className="text-center t-title1 text-[var(--color-lavender-12)]">
            Create your own{" "}
            <span className="t-serif-italic text-[var(--color-brand)]">
              {nounPlural}
            </span>
          </p>
          <div className="mt-3.5 flex items-stretch justify-center gap-2.5">
            <AppStoreBadge />
            <GooglePlayBadge />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Official-style "Download on the App Store" badge. */
function AppStoreBadge() {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download on the App Store"
      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-black px-4 text-white transition-transform active:scale-[0.97]"
    >
      <svg viewBox="0 0 384 512" className="h-6 w-6 fill-white" aria-hidden>
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[9px] font-medium tracking-wide">Download on the</span>
        <span className="-mt-0.5 text-[17px] font-semibold leading-tight">App Store</span>
      </span>
    </a>
  );
}

/* Official-style "Get it on Google Play" badge. */
function GooglePlayBadge() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get it on Google Play"
      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-black px-4 text-white transition-transform active:scale-[0.97]"
    >
      <svg viewBox="0 0 512 512" className="h-5 w-5" aria-hidden>
        <path fill="#00D3FF" d="M48 53.6C42.2 59.7 39 68 39 78.6v354.8c0 10.6 3.2 18.9 9 25l1.2 1.1L247.3 261v-2.3L49.2 52.5 48 53.6z" />
        <path fill="#FFCE00" d="M313.6 327.1l-66.3-66.3v-4.7l66.4-66.4 1.5.9 78.6 44.7c22.5 12.7 22.5 33.6 0 46.4l-78.6 44.7-1.6.7z" />
        <path fill="#FF3A44" d="M315.2 326.4L247.3 258.5 48 457.9c7.4 7.9 19.7 8.8 33.5 1l233.7-132.5z" />
        <path fill="#00F076" d="M315.2 190.6L81.5 58.2C67.7 50.3 55.4 51.3 48 59.2l199.3 199.3 67.9-67.9z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[9px] font-medium uppercase tracking-wide">Get it on</span>
        <span className="-mt-0.5 text-[17px] font-semibold leading-tight">Google Play</span>
      </span>
    </a>
  );
}
