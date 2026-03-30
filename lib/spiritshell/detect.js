/**
 * detect.js
 * Maps an interpretation to a coherence result and response mode.
 */

/** @type {Record<string, "holding"|"reflective"|"revealing">} */
const MODE_MAP = {
  approach_avoidance:                       'reflective',
  denial_vs_attachment:                     'revealing',
  dependency_conflict:                      'revealing',
  self_suppression:                         'reflective',
  indecision_due_to_consequence_avoidance:  'reflective',
};

/**
 * @param {{ patternType?: string, intensity?: number }} interpretation
 * @returns {{
 *   hasTension: boolean,
 *   tensionType?: string,
 *   responseMode: "holding"|"reflective"|"revealing",
 * }}
 */
export function detectCoherence(interpretation) {
  const { patternType } = interpretation;

  if (!patternType) {
    return { hasTension: false, responseMode: 'holding' };
  }

  return {
    hasTension:   true,
    tensionType:  patternType,
    responseMode: MODE_MAP[patternType] ?? 'holding',
  };
}
