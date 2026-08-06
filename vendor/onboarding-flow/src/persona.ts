/**
 * Answers → persona: the object the backend generates audio from.
 *
 * Shared with the web2app funnel, because a persona built even slightly
 * differently on the web produces a different first moment than the app would
 * have — and that first moment is what the funnel sells.
 *
 * Structural types, not the app's `UserData`: this file must stay free of
 * app-only imports so the funnel can use it as-is.
 */

export interface PersonaPerson {
  name: string;
  relationship?: string;
  description?: string;
  notes?: string[];
  pronouns?: string;
}

export type PersonaAnswer = string | string[] | PersonaPerson[];

export interface PersonaResponse {
  field: string;
  answer: PersonaAnswer;
  question?: string;
}

/**
 * Fold a person's free-text `notes` into their `description` for the backend
 * persona. `relationship` stays a first-class field (the backend consumes
 * `{ name, relationship, description }`); only the running notes the user adds
 * over time need somewhere to live. People with no notes collapse to just
 * their original description, so existing data is unchanged.
 */
function composePersonDescription(p: PersonaPerson): string {
  const parts: string[] = [];
  if (p.description?.trim()) parts.push(p.description.trim());
  if (p.notes?.length) parts.push(...p.notes.map((n) => n.trim()).filter(Boolean));
  return parts.join('. ');
}

export function buildPersonaFromResponses(
  name: string | undefined,
  responses: PersonaResponse[],
): Record<string, any> {
  const persona: Record<string, any> = { name };
  // Adaptive follow-up questions, kept in their OWN map (not baked into the answer
  // field) so each answer field stays the pure answer. The backend pairs them back
  // up when it folds the follow-ups into the persona — without the question a bare
  // "Japan" or "some entrepreneurs" tells the model nothing.
  const followupQuestions: Record<string, string> = {};

  for (const entry of responses) {
    const { field, answer, question } = entry;

    if (typeof answer === 'string') {
      persona[field] = answer;
      if (question && /_followup(_\d+)?$/.test(field)) {
        followupQuestions[field] = question;
      }
    } else if (Array.isArray(answer)) {
      if (answer.length === 0) {
        persona[field] = '';
      } else if (typeof answer[0] === 'string') {
        persona[field] = (answer as string[]).join(', ');
      } else {
        persona[field] = (answer as PersonaPerson[]).map((p) => ({
          name: p.name,
          relationship: p.relationship ?? '',
          description: composePersonDescription(p),
          // Only send pronouns when the user set them — the backend treats an
          // absent value as "unknown" and stays pronoun-free rather than
          // guessing. Keeps existing (pre-pronoun) data byte-identical.
          ...(p.pronouns ? { pronouns: p.pronouns } : {}),
        }));
      }
    }
  }

  // Legacy compat: if old data has hasSpecialPerson, convert to boolean.
  if (persona.hasSpecialPerson !== undefined) {
    persona.hasSpecialPerson = persona.hasSpecialPerson === 'Yes';
  }

  // manifestingSpecificPerson: string "Yes"/"No" → boolean
  if (persona.manifestingSpecificPerson !== undefined) {
    persona.manifestingSpecificPerson = persona.manifestingSpecificPerson === 'Yes';
  }

  if (Object.keys(followupQuestions).length > 0) {
    persona.followupQuestions = followupQuestions;
  }

  return persona;
}
