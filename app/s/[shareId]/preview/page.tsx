import type { Metadata } from "next";
import { getShare } from "../mock-data";

// Dev/visualization page: shows EXACTLY what unfurls when this share link is
// pasted — the real generated OG image + the real title/description/domain
// metadata, composed like a chat link-preview card. Nothing here is invented:
// the image is /s/<id>/opengraph-image and the text mirrors generateMetadata.
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Params = { params: Promise<{ shareId: string }> };

export default async function SharePreview({ params }: Params) {
  const { shareId } = await params;
  const share = await getShare(shareId);
  const noun =
    share.type === "subliminal"
      ? "subliminal"
      : share.type === "sleep"
        ? "sleep journey"
        : "visualization";

  // These two strings are produced identically in the page's generateMetadata.
  const title = `${share.creatorName} shared a ${noun} with you on Aya`;
  const description = `“${share.title}” — listen now on Aya.`;
  const ogSrc = `/s/${encodeURIComponent(shareId)}/opengraph-image`;
  const shareUrl = `fromaya.com/s/${shareId}`;

  return (
    <div className="min-h-[100dvh] bg-[var(--color-canvas)] px-5 py-12">
      <div className="mx-auto w-full max-w-[520px]">
        <p className="t-eyebrow text-[var(--color-brand)]">Link preview</p>
        <h1 className="t-title2 mt-1 text-[var(--color-text-primary)]">
          How <span className="t-serif-italic">/s/{shareId}</span> unfurls
        </h1>
        <p className="t-body mt-1 text-[var(--color-text-secondary)]">
          The exact card recipients see in iMessage, WhatsApp, X and LinkedIn.
        </p>

        {/* iMessage-style large link card */}
        <div className="mt-8">
          <p className="t-caption mb-2 text-[var(--color-text-tertiary)]">
            iMessage · X · LinkedIn (large card)
          </p>
          <div className="overflow-hidden rounded-[18px] border border-[var(--color-border-default)] bg-[var(--color-surface)] shadow-[0_10px_30px_-12px_rgba(61,43,52,0.25)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ogSrc} alt="Aya share card" className="block w-full" />
            <div className="border-t border-[var(--color-border-subtle)] px-4 py-3">
              <p className="t-label text-[var(--color-text-primary)]">{title}</p>
              <p className="t-caption mt-1 text-[var(--color-text-secondary)]">
                {description}
              </p>
              <p className="t-caption mt-1 text-[var(--color-text-tertiary)]">
                fromaya.com
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp-style compact card */}
        <div className="mt-8">
          <p className="t-caption mb-2 text-[var(--color-text-tertiary)]">
            WhatsApp (compact)
          </p>
          <div className="overflow-hidden rounded-[14px] bg-[#DCF8C6] p-2">
            <div className="overflow-hidden rounded-[10px] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ogSrc} alt="" className="block w-full" />
              <div className="px-3 py-2">
                <p className="t-label text-[var(--color-text-primary)]">{title}</p>
                <p className="t-caption mt-0.5 line-clamp-2 text-[var(--color-text-secondary)]">
                  {description}
                </p>
                <p className="t-caption mt-0.5 text-[var(--color-text-tertiary)]">
                  fromaya.com
                </p>
              </div>
            </div>
            <p className="px-2 pt-1.5 pb-0.5 text-[13px] text-[var(--color-text-secondary)]">
              {shareUrl}
            </p>
          </div>
        </div>

        <p className="t-caption mt-8 text-[var(--color-text-tertiary)]">
          Note: real chat apps fetch the public URL, so this only unfurls once
          fromaya.com is deployed. This page renders the same image + metadata
          locally so you can see it now.
        </p>
      </div>
    </div>
  );
}
