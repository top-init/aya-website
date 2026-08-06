"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createT } from "@/lib/funnel/i18n";
import {
  getOnboardingSteps,
  type OnboardingStep,
} from "@/vendor/onboarding-flow/src/steps";
import {
  buildPersonaFromResponses,
  type PersonaResponse,
} from "@/vendor/onboarding-flow/src/persona";

import { Paywall } from "./paywall";
import { StepView, type Answer } from "./steps";

// How many manifestation follow-ups the funnel asks. The app varies this by
// experiment; the web is fixed until the funnel has enough traffic of its own
// to A/B — a mid-funnel experiment with no data behind it is just noise.
const FOLLOWUP_COUNT = 2;

// The flow config ends at first-listen; selling is the funnel's job, so the
// paywall is appended here rather than added upstream, where it would show up
// in the app's questionnaire too.
const PAYWALL_STEP: OnboardingStep = { id: "paywall", type: "paywall" };

export type Moment = {
  audio_id: string;
  title: string;
  text: string;
  audio_url: string;
};

type Props = {
  locale: string;
  bundle: Record<string, unknown>;
  utm: Record<string, string>;
  cancelled?: boolean;
};

export function Quiz({ locale, bundle, utm, cancelled }: Props) {
  const t = useMemo(() => createT(locale, bundle), [locale, bundle]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [questions, setQuestions] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [moment, setMoment] = useState<Moment | null>(null);
  const [ready, setReady] = useState(false);
  const [fatal, setFatal] = useState(false);
  const started = useRef(false);

  const getAnswer = useCallback(
    (field: string) => {
      const value = answers[field];
      if (typeof value === "string") return value;
      if (Array.isArray(value)) {
        return value
          .map((v) => (typeof v === "string" ? v : v.name))
          .filter(Boolean)
          .join(", ");
      }
      return "";
    },
    [answers],
  );

  // Recomputed on every answer because conditions read answers: choosing "In a
  // relationship" adds three steps and removes four. Same rule as the app.
  const steps = useMemo(() => {
    const all = getOnboardingSteps(t, FOLLOWUP_COUNT, locale);
    return [...all, PAYWALL_STEP].filter((step) => {
      // The invite code applies creator effects that only exist inside the app,
      // so asking for one here would take a code and do nothing with it.
      if (step.type === "invite-code") return false;
      if (step.condition && !step.condition(getAnswer)) return false;
      // A follow-up with no parent answer has nothing to deepen.
      if (step.followupFor && !getAnswer(step.followupFor).trim()) return false;
      return true;
    });
  }, [t, locale, getAnswer]);

  const step = steps[Math.min(index, steps.length - 1)];

  // First contact: mint the funnel user before she can type anything, so no
  // answer is ever collected with nowhere to store it.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        const res = await fetch("/api/funnel/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, utm }),
        });
        if (!res.ok) throw new Error(String(res.status));
        setReady(true);
      } catch {
        setFatal(true);
      }
    })();
  }, [locale, utm]);

  // Someone who bounced out of Stripe lands back here; drop them straight on
  // the paywall rather than at the top of a questionnaire they finished.
  useEffect(() => {
    if (cancelled && steps.length) setIndex(steps.length - 1);
    // Only on mount: after that, navigation is hers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelled]);

  const responses = useMemo<PersonaResponse[]>(
    () =>
      Object.entries(answers).map(([field, answer]) => ({
        field,
        answer: answer as PersonaResponse["answer"],
        question: questions[field],
      })),
    [answers, questions],
  );

  const persona = useMemo(
    () => buildPersonaFromResponses(getAnswer("name"), responses),
    [getAnswer, responses],
  );

  const advance = useCallback(() => setIndex((i) => i + 1), []);

  const answer = useCallback(
    (field: string, value: Answer, question?: string) => {
      setAnswers((prev) => ({ ...prev, [field]: value }));
      if (question) setQuestions((prev) => ({ ...prev, [field]: question }));
    },
    [],
  );

  if (fatal) {
    return (
      <Shell>
        <p className="t-body text-[var(--color-text-secondary)] text-center">
          {t("errorGeneric")}
        </p>
      </Shell>
    );
  }

  if (!ready || !step) {
    return (
      <Shell>
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-lavender-4)] border-t-[var(--color-brand)]" />
      </Shell>
    );
  }

  if (step.type === "paywall") {
    return (
      <Shell>
        <Paywall t={t} locale={locale} moment={moment} />
      </Shell>
    );
  }

  return (
    <Shell>
      <Progress current={index} total={steps.length} />
      <StepView
        key={step.id}
        step={step}
        t={t}
        locale={locale}
        getAnswer={getAnswer}
        value={answers[step.field ?? step.id]}
        persona={persona}
        moment={moment}
        onMoment={setMoment}
        onAnswer={answer}
        onNext={advance}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center gap-6 px-5 py-12">
      {children}
    </div>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.round(((current + 1) / total) * 100));
  return (
    <div
      className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-lavender-4)]"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-[var(--color-brand)] transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
