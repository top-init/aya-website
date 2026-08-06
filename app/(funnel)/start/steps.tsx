"use client";

import { useEffect, useRef, useState } from "react";
import type { TFunction } from "i18next";

import type { OnboardingStep } from "@/vendor/onboarding-flow/src/steps";
import type { PersonaPerson } from "@/vendor/onboarding-flow/src/persona";

import type { Moment } from "./quiz";

export type Answer = string | string[] | PersonaPerson[];

type Props = {
  step: OnboardingStep;
  t: TFunction;
  locale: string;
  getAnswer: (field: string) => string;
  value: Answer | undefined;
  persona: Record<string, unknown>;
  moment: Moment | null;
  onMoment: (moment: Moment) => void;
  onAnswer: (field: string, value: Answer, question?: string) => void;
  onNext: () => void;
};

/**
 * One renderer per StepType from the shared flow. Every visible string here is
 * a key from the app's own locale files — the funnel says exactly what the app
 * says, in the same 13 languages, because that copy is the product.
 */
export function StepView(props: Props) {
  switch (props.step.type) {
    case "typewriter":
      return <Typewriter {...props} />;
    case "text-input":
      return <TextInput {...props} />;
    case "single-select":
      return <SingleSelect {...props} />;
    case "multi-select":
      return <MultiSelect {...props} />;
    case "people-list":
      return <PeopleList {...props} />;
    case "followup":
      return <Followup {...props} />;
    case "generating":
      return <Generating {...props} />;
    case "reveal":
      return <Reveal {...props} />;
    case "first-listen":
      return <FirstListen {...props} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function Question({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="t-title2 text-balance text-[var(--color-text-primary)]">{children}</h1>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-[var(--color-brand)] px-6 py-4 text-[15px] font-semibold text-[var(--color-text-on-brand)] transition-colors hover:bg-[var(--color-brand-hover)] disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function resolveText(
  value: string | ((get: (field: string) => string) => string) | undefined,
  getAnswer: (field: string) => string,
): string {
  if (typeof value === "function") return value(getAnswer);
  return value ?? "";
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

function Typewriter({ step, t, getAnswer, onNext }: Props) {
  const lines = (
    typeof step.lines === "function" ? step.lines(getAnswer) : (step.lines ?? [])
  ).filter(Boolean);
  const [shown, setShown] = useState(1);

  useEffect(() => {
    if (shown >= lines.length) return;
    const timer = setTimeout(() => setShown((n) => n + 1), 1200);
    return () => clearTimeout(timer);
  }, [shown, lines.length]);

  useEffect(() => {
    // Auto-advance steps wait for their last line to land first, otherwise the
    // second half of a two-line beat is never read.
    if (!step.autoAdvanceMs || shown < lines.length) return;
    const timer = setTimeout(onNext, step.autoAdvanceMs);
    return () => clearTimeout(timer);
  }, [step.autoAdvanceMs, shown, lines.length, onNext]);

  return (
    <div className="flex flex-col gap-4">
      {lines.slice(0, shown).map((line, i) => (
        <p
          key={i}
          className="t-title3 animate-[fadeIn_600ms_ease-out] text-balance text-[var(--color-text-primary)]"
        >
          {line}
        </p>
      ))}
      {step.showContinue && shown >= lines.length ? (
        <div className="pt-2">
          <PrimaryButton onClick={onNext}>{t("continue")}</PrimaryButton>
        </div>
      ) : null}
    </div>
  );
}

function TextInput({ step, t, getAnswer, value, onAnswer, onNext }: Props) {
  const field = step.field ?? step.id;
  const [draft, setDraft] = useState(typeof value === "string" ? value : "");
  const question = resolveText(step.question, getAnswer);

  const submit = () => {
    if (!draft.trim()) return;
    onAnswer(field, draft.trim(), question);
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <Question>{question}</Question>
      {step.multiline ? (
        <textarea
          autoFocus
          rows={4}
          value={draft}
          placeholder={step.placeholder}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full resize-none rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4 t-body text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand)]"
        />
      ) : (
        <input
          autoFocus
          value={draft}
          inputMode={step.keyboardType === "default" ? "text" : "numeric"}
          placeholder={step.placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4 t-body text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand)]"
        />
      )}
      <PrimaryButton disabled={!draft.trim()} onClick={submit}>
        {t("continue")}
      </PrimaryButton>
    </div>
  );
}

/**
 * Options are stored in canonical English (`step.options`) and displayed from
 * `optionsKey` — the app's rule, and the reason a French answer still matches
 * `relationshipStatus === "In a relationship"` in the branching conditions.
 */
function useOptionLabels(step: OnboardingStep, t: TFunction): string[] {
  const options = step.options ?? [];
  if (!step.optionsKey) return options;
  const labels = t(`options.${step.optionsKey}`, { returnObjects: true });
  return Array.isArray(labels) && labels.length === options.length
    ? (labels as string[])
    : options;
}

function SingleSelect({ step, t, getAnswer, onAnswer, onNext }: Props) {
  const question = resolveText(step.question, getAnswer);
  const labels = useOptionLabels(step, t);
  const field = step.field ?? step.id;

  return (
    <div className="flex flex-col gap-5">
      <Question>{question}</Question>
      <div className="flex flex-col gap-3">
        {(step.options ?? []).map((option, i) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              onAnswer(field, option, question);
              onNext();
            }}
            className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] px-5 py-4 text-left t-body text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-brand)]"
          >
            {labels[i]}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiSelect({ step, t, getAnswer, value, onAnswer, onNext }: Props) {
  const question = resolveText(step.question, getAnswer);
  const labels = useOptionLabels(step, t);
  const field = step.field ?? step.id;
  const [picked, setPicked] = useState<string[]>(Array.isArray(value) ? (value as string[]) : []);
  const max = step.maxSelect ?? (step.options?.length ?? 0);

  const toggle = (option: string) => {
    setPicked((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : prev.length >= max
          ? prev
          : [...prev, option],
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <Question>{question}</Question>
      <div className="flex flex-wrap gap-2">
        {(step.options ?? []).map((option, i) => {
          const on = picked.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(option)}
              className={`rounded-full border px-4 py-2.5 t-body transition-colors ${
                on
                  ? "border-[var(--color-brand)] bg-[var(--color-brand-subtle)] text-[var(--color-text-primary)]"
                  : "border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
              }`}
            >
              {labels[i]}
            </button>
          );
        })}
      </div>
      <PrimaryButton
        disabled={picked.length === 0}
        onClick={() => {
          onAnswer(field, picked, question);
          onNext();
        }}
      >
        {t("continue")}
      </PrimaryButton>
    </div>
  );
}

function PeopleList({ step, t, getAnswer, value, onAnswer, onNext }: Props) {
  const question = resolveText(step.question, getAnswer);
  const field = step.field ?? step.id;
  const [people, setPeople] = useState<PersonaPerson[]>(
    Array.isArray(value) && typeof value[0] === "object" ? (value as PersonaPerson[]) : [],
  );
  const [draft, setDraft] = useState<PersonaPerson>({ name: "", relationship: "", description: "" });

  const add = () => {
    if (!draft.name.trim()) return;
    setPeople((prev) => [...prev, { ...draft, name: draft.name.trim() }]);
    setDraft({ name: "", relationship: "", description: "" });
  };

  return (
    <div className="flex flex-col gap-5">
      <Question>{question}</Question>
      {people.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {people.map((person, i) => (
            <li
              key={`${person.name}-${i}`}
              className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 t-body text-[var(--color-text-primary)]"
            >
              <span className="font-semibold">{person.name}</span>
              {person.relationship ? (
                <span className="text-[var(--color-text-secondary)]"> · {person.relationship}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4">
        <input
          value={draft.name}
          placeholder={t("placeholder.personName")}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          className="w-full bg-transparent t-body text-[var(--color-text-primary)] outline-none"
        />
        <input
          value={draft.relationship ?? ""}
          placeholder={t("placeholder.personRelationship")}
          onChange={(e) => setDraft((d) => ({ ...d, relationship: e.target.value }))}
          className="w-full bg-transparent t-body text-[var(--color-text-secondary)] outline-none"
        />
        <textarea
          rows={2}
          value={draft.description ?? ""}
          placeholder={t("placeholder.personDescription")}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          className="w-full resize-none bg-transparent t-body text-[var(--color-text-secondary)] outline-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.name.trim()}
          className="self-start t-label text-[var(--color-brand)] disabled:opacity-40"
        >
          {t("onboarding.addPerson")}
        </button>
      </div>
      <PrimaryButton
        onClick={() => {
          onAnswer(field, people, question);
          onNext();
        }}
      >
        {t("continue")}
      </PrimaryButton>
    </div>
  );
}

/**
 * Adaptive follow-up. Single follow-ups ask the backend to write one question
 * about the parent answer; the manifestation batch is fetched once and indexed.
 * A failure skips the step rather than blocking the funnel on an LLM call.
 */
function Followup(props: Props) {
  const { step, t, getAnswer, persona, locale, onAnswer, onNext } = props;
  const parentField = step.followupFor ?? "";
  const parentAnswer = getAnswer(parentField);
  const [question, setQuestion] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const asked = useRef(false);

  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    (async () => {
      try {
        const batch = typeof step.followupIndex === "number";
        const res = await fetch("/api/funnel/followup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: batch ? "manifestation-followups" : "followup",
            payload: batch
              ? {
                  answer: parentAnswer,
                  count: (step.followupIndex ?? 0) + 1,
                  language: locale,
                  persona,
                }
              : { field: parentField, answer: parentAnswer, language: locale, persona },
          }),
        });
        const json = await res.json();
        const next = batch
          ? (json?.questions ?? [])[step.followupIndex ?? 0]
          : json?.question;
        if (typeof next === "string" && next.trim()) setQuestion(next.trim());
        else onNext();
      } catch {
        onNext();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!question) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-lavender-4)] border-t-[var(--color-brand)]" />
      </div>
    );
  }

  const field = step.field ?? step.id;
  return (
    <div className="flex flex-col gap-5">
      <Question>{question}</Question>
      <textarea
        autoFocus
        rows={3}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-full resize-none rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4 t-body text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand)]"
      />
      <PrimaryButton
        disabled={!draft.trim()}
        onClick={() => {
          onAnswer(field, draft.trim(), question);
          onNext();
        }}
      >
        {t("continue")}
      </PrimaryButton>
    </div>
  );
}

/**
 * Save the persona, then generate her first moment.
 *
 * Two failure modes are handled differently on purpose: a save/generation error
 * still advances (the paywall is downstream and she has already given us
 * everything), while the backend answering `force_paywall` skips generation
 * entirely — that is the abuse gate, and honouring it is what keeps cold
 * traffic from costing an LLM+TTS run each.
 */
function Generating({ t, persona, locale, onMoment, onNext }: Props) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        await fetch("/api/funnel/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona, locale }),
        });
        const res = await fetch("/api/funnel/moment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona, language: locale }),
        });
        const json = await res.json();
        if (res.ok && json?.audio_url) {
          onMoment(json as Moment);
        }
      } catch {
        // fall through — the funnel continues without a moment to play
      } finally {
        onNext();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-lavender-4)] border-t-[var(--color-brand)]" />
      <p className="t-title3 text-[var(--color-text-primary)]">{t("onboarding.generating")}</p>
      <p className="t-body text-[var(--color-text-secondary)]">
        {t("onboarding.generatingSubtitle")}
      </p>
    </div>
  );
}

function Reveal({ t, getAnswer, moment, onNext }: Props) {
  const name = getAnswer("name");
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      <h1 className="t-display text-balance text-[var(--color-text-primary)]">
        {name ? t("reveal.title", { name }) : t("reveal.titleNoName")}
      </h1>
      <p className="t-body text-[var(--color-text-secondary)]">
        {moment ? t("reveal.body") : t("reveal.arriving")}
      </p>
      <PrimaryButton onClick={onNext}>{t("reveal.cta")}</PrimaryButton>
    </div>
  );
}

/**
 * The moment itself — the only proof the funnel has that any of this is real.
 * A plain <audio> element: it inherits the platform's own controls, background
 * behaviour and lock-screen handling, which a custom player on mobile Safari
 * would have to re-earn.
 */
function FirstListen({ t, moment, onNext }: Props) {
  if (!moment) {
    // Generation failed or was gated. Say nothing about it and move on — she
    // still sees the offer, which is what the funnel is for.
    return (
      <div className="flex flex-col gap-5 py-8 text-center">
        <p className="t-body text-[var(--color-text-secondary)]">{t("reveal.arriving")}</p>
        <PrimaryButton onClick={onNext}>{t("continue")}</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-6">
      <h1 className="t-title2 text-balance text-[var(--color-text-primary)]">{moment.title}</h1>
      <audio
        controls
        autoPlay
        src={moment.audio_url}
        className="w-full"
        onEnded={onNext}
        aria-label={t("play")}
      />
      <p className="t-body max-h-64 overflow-y-auto whitespace-pre-wrap text-[var(--color-text-secondary)]">
        {moment.text}
      </p>
      <PrimaryButton onClick={onNext}>{t("continue")}</PrimaryButton>
    </div>
  );
}
