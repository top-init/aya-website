import type { TFunction } from 'i18next';

import { getNamePre } from './name-pre';

export type StepType =
  | 'typewriter'
  | 'text-input'
  | 'single-select'
  | 'multi-select'
  | 'people-list'
  | 'followup'
  | 'invite-code'
  | 'generating'
  | 'paywall'
  | 'reveal'
  | 'first-listen';

type GetAnswer = (field: string) => string;

export interface OnboardingStep {
  type: StepType;
  // Stable identifier — used by the dev menu to jump to a specific step.
  // For input steps this matches `field`. For typewriter / terminal steps
  // (generating, reveal, first-listen, paywall) it's a hand-picked slug.
  id: string;
  // Optional section header rendered in the dev jump list. Falls under the
  // last section seen until the next step overrides it.
  section?: string;
  // For typewriter steps
  lines?: string[] | ((getAnswer: GetAnswer) => string[]);
  autoAdvanceMs?: number;
  showContinue?: boolean;
  // For input steps
  field?: string;
  question?: string | ((getAnswer: GetAnswer) => string);
  placeholder?: string;
  // `options` holds the canonical English values stored in userData. They are
  // used as stable keys for conditions and StoreReview checks. The labels the
  // user actually sees come from `optionsKey` → `t('options.<key>')`.
  options?: string[];
  optionsKey?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'number-pad';
  emoji?: string;
  condition?: (getAnswer: GetAnswer) => boolean;
  // For multi-select steps: cap how many options can be picked (1..maxSelect).
  maxSelect?: number;
  // For 'followup' steps: the parent field whose answer this follow-up deepens.
  // The step renders nothing and self-skips if the parent wasn't answered
  // (e.g. the dreamPartner branch wasn't taken), so it can live at a fixed
  // index with no condition.
  followupFor?: string;
  // For batch follow-up steps (manifestation A/B): which item in the fetched
  // batch of questions this step shows. Presence = batch mode (localized, no
  // single-fetch, no English gate).
  followupIndex?: number;
}

// Max width for the onboarding content column. Phones fall below this and are
// unaffected; tablets constrain + center to it instead of stretching full-width.
// The web funnel uses the same number so the two flows read identically.
export const ONBOARDING_CONTENT_MAX_WIDTH = 480;

// Max manifestation follow-ups the A/B can ask (mirrors ONBOARDING_FOLLOWUP_MAX
// in services/analytics — kept local so this config has no service import).
const MANIFESTATION_FOLLOWUP_MAX = 4;

/**
 * The onboarding flow, shared by the app questionnaire and the web2app funnel.
 *
 * Platform-free on purpose: no React, no react-native, no i18n singleton. `t`
 * and `lang` are passed in, so the app supplies its i18next instance and the
 * web funnel supplies the one built for the request's locale. Anything that
 * needs a device API belongs in the renderer, not here.
 */
export function getOnboardingSteps(
  t: TFunction,
  followupCount = 0,
  lang = 'en',
): OnboardingStep[] {
  const namePre = (getAnswer: GetAnswer) => getNamePre(getAnswer('name'), lang);

  return [
    // ─── Welcome ───
    // ─── Invite code ───
    // First step — "Do you have a code?" — so a creator sent here can identify
    // up front. Everyone sees it, one-tap skip. A generic entered-code step; a
    // valid code applies its effect by type (creator today → forces sign-in +
    // tags the account). No `field` (nothing saved into the persona).
    {
      id: 'invite-code',
      section: 'Welcome',
      type: 'invite-code',
    },

    {
      id: 'welcome-intro',
      section: 'Welcome',
      type: 'typewriter',
      lines: t('onboarding.welcomeLines', { returnObjects: true }) as string[],
      showContinue: true,
    },

    // ─── Who you are ───
    {
      id: 'name',
      section: 'Who you are',
      type: 'text-input',
      field: 'name',
      question: t('question.name'),
      placeholder: t('placeholder.name'),
    },
    {
      id: 'name-greeting',
      type: 'typewriter',
      lines: (getAnswer) => [t('onboarding.greeting', { name: getAnswer('name') })],
      autoAdvanceMs: 1000,
    },
    {
      id: 'age',
      type: 'text-input',
      field: 'age',
      question: t('question.age'),
      placeholder: t('placeholder.age'),
      keyboardType: 'number-pad',
    },
    {
      id: 'gender',
      type: 'single-select',
      field: 'gender',
      question: t('question.gender'),
      options: ['Woman', 'Man', 'Non-binary', 'Rather not say'],
      optionsKey: 'gender',
    },
    {
      id: 'location',
      type: 'text-input',
      field: 'location',
      question: t('question.location'),
      placeholder: t('placeholder.location'),
    },

    // ─── Life right now ───
    {
      id: 'getToKnow',
      section: 'Life right now',
      type: 'typewriter',
      lines: [t('onboarding.getToKnow')],
      autoAdvanceMs: 1000,
    },
    {
      id: 'work',
      type: 'text-input',
      field: 'work',
      question: t('question.work'),
      placeholder: t('placeholder.work'),
      multiline: true,
    },
    {
      id: 'workFeeling',
      type: 'single-select',
      field: 'workFeeling',
      question: (getAnswer) => t('question.workFeeling', { namePre: namePre(getAnswer) }),
      options: ['I love it', "It's okay for now", 'Ready for something new', 'Building something'],
      optionsKey: 'workFeeling',
    },

    // ─── Going deeper ───
    {
      id: 'beHonest',
      section: 'Going deeper',
      type: 'typewriter',
      lines: [t('onboarding.beHonest1'), t('onboarding.beHonest2')],
      autoAdvanceMs: 1200,
    },
    {
      id: 'selfDescription',
      type: 'text-input',
      field: 'selfDescription',
      question: t('question.selfDescription'),
      placeholder: t('placeholder.selfDescription'),
      multiline: true,
    },
    {
      id: 'formativeExperience',
      type: 'text-input',
      field: 'formativeExperience',
      question: t('question.formativeExperience'),
      placeholder: t('placeholder.formativeExperience'),
      multiline: true,
    },
    {
      id: 'formativeExperience_followup',
      type: 'followup',
      field: 'formativeExperience_followup',
      followupFor: 'formativeExperience',
    },
    {
      id: 'currentStruggle',
      type: 'text-input',
      field: 'currentStruggle',
      question: t('question.currentStruggle'),
      placeholder: t('placeholder.currentStruggle'),
      multiline: true,
    },
    {
      id: 'courage',
      type: 'typewriter',
      lines: (getAnswer) => [
        t('onboarding.courage', { namePre: namePre(getAnswer) }),
        t('onboarding.stronger'),
      ],
      autoAdvanceMs: 1000,
    },

    // ─── Relationship ───
    {
      id: 'relationshipStatus',
      section: 'Relationship',
      type: 'single-select',
      field: 'relationshipStatus',
      question: t('question.relationshipStatus'),
      options: ['In a relationship', 'Single and calling someone in', 'Single and not focused on that'],
      optionsKey: 'relationshipStatus',
    },

    // ── Single & not focused — short acknowledgement before shared steps ──
    {
      id: 'relationshipAck',
      type: 'typewriter',
      lines: (getAnswer) => [t('onboarding.relationshipAck', { namePre: namePre(getAnswer) })],
      autoAdvanceMs: 1200,
      condition: (getAnswer) => getAnswer('relationshipStatus') === 'Single and not focused on that',
    },

    // ── In a relationship path ──
    {
      id: 'specialPersonName',
      type: 'text-input',
      field: 'specialPersonName',
      question: t('question.specialPersonName'),
      placeholder: t('placeholder.specialPersonName'),
      condition: (getAnswer) => getAnswer('relationshipStatus') === 'In a relationship',
    },
    {
      id: 'specialPersonPronouns',
      type: 'single-select',
      field: 'specialPersonPronouns',
      question: (getAnswer) =>
        t('question.personPronounsOnboarding', { name: getAnswer('specialPersonName') || 'them' }),
      options: ['he/him', 'she/her', 'they/them'],
      optionsKey: 'personPronouns',
      condition: (getAnswer) => getAnswer('relationshipStatus') === 'In a relationship',
    },
    {
      id: 'specialPersonDescription',
      type: 'text-input',
      field: 'specialPersonDescription',
      question: (getAnswer) =>
        t('question.specialPersonDescription', { name: getAnswer('specialPersonName') || 'them' }),
      placeholder: t('placeholder.specialPersonDescription'),
      multiline: true,
      condition: (getAnswer) => getAnswer('relationshipStatus') === 'In a relationship',
    },

    // ── Single and manifesting path ──
    {
      id: 'manifestingSpecificPerson',
      type: 'single-select',
      field: 'manifestingSpecificPerson',
      question: t('question.manifestingSpecificPerson'),
      options: ['Yes', 'No'],
      optionsKey: 'yesNo',
      condition: (getAnswer) => getAnswer('relationshipStatus') === 'Single and calling someone in',
    },
    {
      id: 'manifestingPersonName',
      type: 'text-input',
      field: 'manifestingPersonName',
      question: t('question.manifestingPersonName'),
      placeholder: t('placeholder.manifestingPersonName'),
      condition: (getAnswer) =>
        getAnswer('relationshipStatus') === 'Single and calling someone in' &&
        getAnswer('manifestingSpecificPerson') === 'Yes',
    },
    {
      id: 'manifestingPersonPronouns',
      type: 'single-select',
      field: 'manifestingPersonPronouns',
      question: (getAnswer) =>
        t('question.personPronounsOnboarding', { name: getAnswer('manifestingPersonName') || 'them' }),
      options: ['he/him', 'she/her', 'they/them'],
      optionsKey: 'personPronouns',
      condition: (getAnswer) =>
        getAnswer('relationshipStatus') === 'Single and calling someone in' &&
        getAnswer('manifestingSpecificPerson') === 'Yes',
    },
    {
      id: 'dreamPartnerDescription',
      type: 'text-input',
      field: 'dreamPartnerDescription',
      question: (getAnswer) =>
        t('question.dreamPartnerDescription', {
          name: getAnswer('name') || '',
          namePre: namePre(getAnswer),
        }),
      placeholder: t('placeholder.dreamPartnerDescription'),
      multiline: true,
      condition: (getAnswer) => getAnswer('relationshipStatus') === 'Single and calling someone in',
    },
    {
      id: 'dreamPartnerDescription_followup',
      type: 'followup',
      field: 'dreamPartnerDescription_followup',
      followupFor: 'dreamPartnerDescription',
    },
    {
      id: 'importantPeople',
      type: 'people-list',
      field: 'importantPeople',
      question: t('question.importantPeople'),
    },
    {
      id: 'lifeAreas',
      type: 'multi-select',
      field: 'lifeAreas',
      question: t('question.lifeAreas'),
      options: ['Love', 'Career', 'Money', 'Health', 'Confidence', 'Freedom', 'Family'],
      optionsKey: 'lifeAreas',
      maxSelect: 3,
    },
    {
      id: 'coreValues',
      type: 'multi-select',
      field: 'coreValues',
      question: t('question.coreValues'),
      options: [
        'Feeling fulfilled',
        'Being free',
        'Being seen',
        'Living with intention',
        'Leaving a mark',
      ],
      optionsKey: 'coreValues',
      maxSelect: 3,
    },

    // ─── The future you ───
    {
      id: 'thankYou',
      section: 'The future you',
      type: 'typewriter',
      lines: [t('onboarding.thankYou'), t('onboarding.letsDream')],
      autoAdvanceMs: 1200,
    },
    {
      id: 'forgetPossible',
      type: 'typewriter',
      lines: (getAnswer) => [
        t('onboarding.forgetPossible', { namePre: namePre(getAnswer) }),
        t('onboarding.dreamBig'),
      ],
      autoAdvanceMs: 1200,
    },
    {
      id: 'manifestation',
      type: 'text-input',
      field: 'manifestation',
      question: t('question.manifestation'),
      placeholder: t('placeholder.manifestation'),
      multiline: true,
    },
    // Manifestation follow-ups (A/B `onboarding_followups`): batch-fetched,
    // localized, shown one-by-one. `followupCount` (0..4) from PostHog decides
    // how many render; the rest are filtered out by condition. Answers ride
    // into the persona (buildPersona flattens responses) → richer audio.
    ...Array.from({ length: MANIFESTATION_FOLLOWUP_MAX }, (_, i): OnboardingStep => ({
      id: `manifestation_followup_${i + 1}`,
      type: 'followup',
      field: `manifestation_followup_${i + 1}`,
      followupFor: 'manifestation',
      followupIndex: i,
      condition: () => i < followupCount,
    })),
    // ─── Generating + Reveal ───
    // The review ask lives in the first listen now (top toast, 8s in), not as
    // a step here.
    {
      id: 'generating',
      type: 'generating',
    },
    {
      id: 'reveal',
      type: 'reveal',
    },
    {
      id: 'first-listen',
      type: 'first-listen',
    },
  ];
}
