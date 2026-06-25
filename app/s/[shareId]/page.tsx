import type { Metadata } from "next";
import { getShare } from "./mock-data";
import { SharePlayer } from "./share-player";

type Params = { params: Promise<{ shareId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { shareId } = await params;
  const share = await getShare(shareId);
  const noun =
    share.type === "subliminal"
      ? "subliminal"
      : share.type === "sleep"
        ? "sleep journey"
        : "visualization";
  const title = `${share.creatorName} shared a ${noun} with you on Aya`;
  const description = `“${share.title}” — listen now on Aya.`;

  return {
    title,
    description,
    // Unlisted share links shouldn't be indexed.
    robots: { index: false, follow: false },
    // iOS Smart App Banner — native "Open / Get" prompt above the page.
    itunes: { appId: "6760195623" },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: Params) {
  const { shareId } = await params;
  const share = await getShare(shareId);
  return <SharePlayer share={share} />;
}
