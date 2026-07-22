import type { Metadata } from "next";
import { AppDeeplinkRedirect } from "@/components/app-deeplink-redirect";
import { StoreBadges } from "@/components/store-badges";
import { Orb } from "@/app/s/[shareId]/orb";
import { SHARE_API_BASE } from "@/app/s/[shareId]/mock-data";

type Params = { params: Promise<{ sharedId: string }> };

type Preview = {
  shared_id: string;
  creator_name: string;
  content_type: "playlist" | "subliminal" | "sleep";
  title: string;
  participant_count: number;
};

async function preview(sharedId: string): Promise<Preview | null> {
  try {
    const response = await fetch(
      `${SHARE_API_BASE}/public/shared-manifestations/${encodeURIComponent(sharedId)}`,
      { cache: "no-store" },
    );
    return response.ok ? ((await response.json()) as Preview) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sharedId } = await params;
  const room = await preview(sharedId);
  const title = room
    ? `${room.creator_name} invited you to manifest together`
    : "A friend invited you to manifest together";
  const description = room
    ? `Join “${room.title}” privately in Aya.`
    : "Open this private manifestation in Aya.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    itunes: { appId: "6760195623" },
    openGraph: { title, description, type: "website" },
  };
}

export default async function SharedManifestationLanding({ params }: Params) {
  const { sharedId } = await params;
  const room = await preview(sharedId);
  const creator = room?.creator_name || "A friend";

  return (
    <main className="min-h-screen px-5 py-12 sm:py-20 flex items-center justify-center bg-[radial-gradient(circle_at_50%_15%,#f4e9f9_0%,#f8f8ff_42%,#fdfdff_100%)]">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto w-fit drop-shadow-[0_24px_45px_rgba(142,107,127,0.18)]">
          <Orb playing={false} size={190} />
        </div>
        <p className="t-section-label text-[var(--color-brand)] mt-8 mb-3">
          MANIFEST TOGETHER
        </p>
        <h1 className="t-display text-[var(--color-hero-accent)]">
          {room?.title || "A private manifestation"}
        </h1>
        <p className="t-body text-[var(--color-text-secondary)] mt-4 mb-8">
          {creator} invited you to join and listen together in Aya.
        </p>
        <p
          id="shared-room-status"
          className="t-caption text-[var(--color-text-tertiary)] mb-5 min-h-5"
        >
          Opening Aya…
        </p>
        <StoreBadges align="center" />
        <p className="t-caption text-[var(--color-text-tertiary)] mt-7">
          If you install Aya now, return here and tap this link again to join.
        </p>
        <AppDeeplinkRedirect
          path={`r/${sharedId}`}
          statusElementId="shared-room-status"
        />
      </section>
    </main>
  );
}
