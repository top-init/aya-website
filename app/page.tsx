import Image from "next/image";
import Link from "next/link";
import { StoreBadges } from "@/components/store-badges";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sunrise">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.6)_0%,_transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/55 backdrop-blur text-[var(--color-lavender-12)] px-3 py-1 t-caption border border-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
                A daily practice, not another to-do list
              </span>
              <h1 className="t-hero text-[var(--color-lavender-12)]">
                Become{" "}
                <span className="t-serif-italic text-[var(--color-brand)]">
                  her
                </span>
                . One sunrise at a time.
              </h1>
              <p className="t-body-lg text-[var(--color-text-secondary)] max-w-xl">
                Aya turns the version of you you&rsquo;ve been imagining into
                a daily practice — manifestations, gratitude, vision boards
                and morning rituals, all designed to feel like a sunrise.
              </p>
              <StoreBadges />
              <div className="flex items-center gap-5 t-caption text-[var(--color-text-tertiary)] pt-2">
                <span>Free to try</span>
                <span aria-hidden>•</span>
                <span>No ads</span>
                <span aria-hidden>•</span>
                <span>Cancel anytime</span>
              </div>
            </div>

            <div className="relative mx-auto lg:mx-0">
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[var(--color-lavender-5)] via-[var(--color-rose-3)] to-transparent blur-2xl -z-10" />
              <div className="relative rounded-[var(--radius-xl)] bg-[var(--color-surface)]/95 backdrop-blur shadow-[0_30px_80px_-30px_rgba(61,43,52,0.35)] border border-white/60 p-8 sm:p-10 w-[280px] sm:w-[340px]">
                <Image
                  src="/appicon.png"
                  alt="Aya app icon"
                  width={260}
                  height={260}
                  className="rounded-3xl w-full h-auto"
                  priority
                />
                <div className="mt-6 space-y-1.5">
                  <p className="t-eyebrow text-[var(--color-brand)]">Aya</p>
                  <p className="t-title2 text-[var(--color-text-primary)]">
                    Manifest your{" "}
                    <span className="t-serif-italic">dream</span> self.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--color-surface-subtle)] border-y border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-24">
          <div className="max-w-2xl mb-14">
            <p className="t-eyebrow text-[var(--color-brand)] mb-3">
              What you get
            </p>
            <h2 className="t-display text-[var(--color-text-primary)]">
              A practice for the version of you that&rsquo;s already on the way.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              title="Morning manifestations"
              body="Wake up with a script tuned to who you&rsquo;re becoming. Read it, record it, or just sit with it for ninety seconds."
            />
            <FeatureCard
              title="Gratitude that actually lands"
              body="Tiny daily prompts — not a journaling chore. Your gratitude becomes the soundtrack of the next sunrise."
            />
            <FeatureCard
              title="Vision boards, alive"
              body="Drag in the photos, places, outfits, lives. Aya animates your board so the future feels close enough to touch."
            />
            <FeatureCard
              title="Whispered affirmations"
              body="A voice in your earbuds before the world&rsquo;s loudest. Pick a vibe — confident, soft, abundant — and press play."
            />
            <FeatureCard
              title="Rituals that fit your day"
              body="Two minutes or twenty — Aya scales to what you can give. Morning, midday wobble, or the wind-down."
            />
            <FeatureCard
              title="Yours, private, kept safe"
              body="No public feed. No comparing. Sign in with Apple, Google, or your email — your manifestations stay with you."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-24">
        <div className="max-w-2xl mb-12">
          <p className="t-eyebrow text-[var(--color-brand)] mb-3">
            How it works
          </p>
          <h2 className="t-display text-[var(--color-text-primary)]">
            Three steps from scroll to sunrise.
          </h2>
        </div>

        <ol className="grid sm:grid-cols-3 gap-6">
          <Step n={1} title="Tell Aya who she is">
            A few minutes of soft questions — your dreams, your softness,
            your edge. Aya listens and tunes itself to you.
          </Step>
          <Step n={2} title="Get your first morning">
            Aya hands you a manifestation, a gratitude prompt, and a tiny
            ritual. All in under two minutes.
          </Step>
          <Step n={3} title="Show up — Aya does the rest">
            Open it tomorrow. And the next day. Aya remembers, evolves, and
            reflects who you&rsquo;re becoming back to you.
          </Step>
        </ol>
      </section>

      {/* CTA */}
      <section className="bg-dusk text-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 sm:py-20 text-center space-y-7">
          <h2 className="t-display text-white">
            Start your{" "}
            <span className="t-serif-italic text-[var(--color-rose-3)]">
              sunrise
            </span>{" "}
            tomorrow.
          </h2>
          <p className="t-body-lg text-white/85 max-w-xl mx-auto">
            Free to try. Designed to feel like a soft place to land — every
            morning.
          </p>
          <div className="flex justify-center">
            <StoreBadges align="center" />
          </div>
          <p className="t-caption text-white/70 pt-4">
            Need help?{" "}
            <Link href="/support" className="underline underline-offset-4">
              Visit support
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-lavender-6)] transition-colors">
      <h3 className="t-title3 text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      <p className="t-body text-[var(--color-text-secondary)]">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] p-6 bg-[var(--color-surface)]">
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-brand-subtle)] text-[var(--color-brand)] t-title3 mb-4">
        {n}
      </span>
      <h3 className="t-title3 text-[var(--color-text-primary)] mb-2">{title}</h3>
      <p className="t-body text-[var(--color-text-secondary)]">{children}</p>
    </li>
  );
}
