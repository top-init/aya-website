"use client";

import { useEffect } from "react";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/aya-manifest-your-dream-self/id6760195623";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.litapps.aya";

// Bounces an opened Universal Link / App Link into the Aya app via its custom
// scheme, then — if nothing took over — swaps the status line for an install /
// retry prompt. On a device with Aya installed and the domain association
// verified, the OS opens the app directly and this page is never seen; this is
// the fallback path (app missing, or an in-app browser that ignored the
// association).
export function AppDeeplinkRedirect({
  path,
  statusElementId,
}: {
  path: string; // e.g. "auth/verify" or "reactivate"
  statusElementId: string;
}) {
  useEffect(() => {
    const { search, hash } = window.location;
    const deepLink = `aya://${path}${search}${hash}`;

    window.location.replace(deepLink);

    const fallback = window.setTimeout(() => {
      const status = document.getElementById(statusElementId);
      if (!status) return;
      const ua = navigator.userAgent;
      const storeUrl = /android/i.test(ua)
        ? PLAY_STORE_URL
        : /iphone|ipad|ipod/i.test(ua)
          ? APP_STORE_URL
          : null;
      status.innerHTML = storeUrl
        ? `Aya didn't open. <a href="${deepLink}" class="text-[var(--color-brand)] underline">Try again</a> or <a href="${storeUrl}" class="text-[var(--color-brand)] underline">install Aya</a>.`
        : "Open this link on the device where Aya is installed.";
    }, 1800);

    return () => window.clearTimeout(fallback);
  }, [path, statusElementId]);

  return null;
}
