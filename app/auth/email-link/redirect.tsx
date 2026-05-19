"use client";

import { useEffect } from "react";

const APP_SCHEME = "aya://auth/email-link";
const APP_STORE_URL =
  "https://apps.apple.com/us/app/aya-manifest-your-dream-self/id6760195623";
const PLAY_STORE_URL = "https://www.fromkuskus.com/";

export function EmailLinkRedirect() {
  useEffect(() => {
    const search = window.location.search;
    const hash = window.location.hash;
    const deepLink = `${APP_SCHEME}${search}${hash}`;

    window.location.replace(deepLink);

    const fallback = window.setTimeout(() => {
      const status = document.getElementById("email-link-status");
      if (status) {
        const ua = navigator.userAgent;
        const isAndroid = /android/i.test(ua);
        const isiOS = /iphone|ipad|ipod/i.test(ua);
        const storeUrl = isAndroid
          ? PLAY_STORE_URL
          : isiOS
            ? APP_STORE_URL
            : null;
        status.innerHTML = storeUrl
          ? `Aya didn't open. <a href="${deepLink}" class="text-[var(--color-brand)] underline">Try again</a> or <a href="${storeUrl}" class="text-[var(--color-brand)] underline">install Aya</a>.`
          : `Open this link on the device where Aya is installed to finish signing in.`;
      }
    }, 1800);

    return () => window.clearTimeout(fallback);
  }, []);

  return null;
}
