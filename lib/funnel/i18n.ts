import { createInstance, type TFunction } from "i18next";

// The funnel serves one locale per request, so there is no singleton to
// configure — each call builds an instance over the vendored copy of the app's
// translations. `vendor/onboarding-flow/locales` is generated; edit the app
// repo, not those files (see scripts/sync-onboarding-flow.mjs).
import en from "@/vendor/onboarding-flow/locales/en.json";
import enGB from "@/vendor/onboarding-flow/locales/en-GB.json";
import enAU from "@/vendor/onboarding-flow/locales/en-AU.json";
import enCA from "@/vendor/onboarding-flow/locales/en-CA.json";
import es from "@/vendor/onboarding-flow/locales/es.json";
import esMX from "@/vendor/onboarding-flow/locales/es-MX.json";
import es419 from "@/vendor/onboarding-flow/locales/es-419.json";
import ptBR from "@/vendor/onboarding-flow/locales/pt-BR.json";
import fr from "@/vendor/onboarding-flow/locales/fr.json";
import de from "@/vendor/onboarding-flow/locales/de.json";
import it from "@/vendor/onboarding-flow/locales/it.json";
import nl from "@/vendor/onboarding-flow/locales/nl.json";
import pl from "@/vendor/onboarding-flow/locales/pl.json";

type Bundle = Record<string, unknown>;

const BUNDLES: Record<string, Bundle> = {
  en,
  "en-GB": enGB,
  "en-AU": enAU,
  "en-CA": enCA,
  es,
  "es-MX": esMX,
  "es-419": es419,
  "pt-BR": ptBR,
  fr,
  de,
  it,
  nl,
  pl,
};

export const FUNNEL_LOCALES = Object.keys(BUNDLES);
export const DEFAULT_LOCALE = "en";

/**
 * Pick the closest locale we actually sell in, from an Accept-Language header
 * or a ?lang= value. Exact tag first, then the base language, then English —
 * never a 404 and never an untranslated screen.
 */
export function resolveLocale(requested: string | null | undefined): string {
  if (!requested) return DEFAULT_LOCALE;
  for (const candidate of requested.split(",").map((p) => p.split(";")[0].trim())) {
    if (!candidate) continue;
    if (BUNDLES[candidate]) return candidate;
    const base = candidate.split("-")[0];
    const match = FUNNEL_LOCALES.find((l) => l === base || l.split("-")[0] === base);
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}

export function bundleFor(locale: string): Bundle {
  return BUNDLES[locale] ?? BUNDLES[DEFAULT_LOCALE];
}

/**
 * A `t` for one locale, with English underneath it.
 *
 * The fallback is not cosmetic: the app's own rule is that no user-facing
 * string may be hardcoded or English-only, and a translation that lands late
 * upstream would otherwise render as a raw key in a paid funnel.
 */
export function createT(locale: string, resources?: Bundle): TFunction {
  const instance = createInstance();
  instance.init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    resources: {
      [locale]: { translation: resources ?? bundleFor(locale) },
      [DEFAULT_LOCALE]: { translation: en },
    },
    interpolation: { escapeValue: false },
    // Flat keys ("question.name"), exactly as the app stores them.
    keySeparator: false,
    nsSeparator: false,
  });
  return instance.t.bind(instance) as TFunction;
}
