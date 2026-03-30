/**
 * engine.js
 * Main entry point. Orchestrates analyze → detect → respond.
 *
 * Usage:
 *   import { runSpiritshellEngine } from './lib/spiritshell/engine.js';
 *
 *   const output = runSpiritshellEngine({
 *     sessionId: 'abc',
 *     text: '我想找他，但又觉得不应该',
 *     createdAt: new Date().toISOString(),
 *   });
 *   // output.response → string[]
 */

import { analyzeInput }    from './analyze.js';
import { detectCoherence } from './detect.js';
import { buildResponse }   from './respond.js';

/**
 * @typedef {{
 *   sessionId: string,
 *   text: string,
 *   createdAt: string,
 * }} UserTurn
 *
 * @typedef {{
 *   interpretation: ReturnType<typeof analyzeInput>,
 *   coherence: ReturnType<typeof detectCoherence>,
 *   response: string[],
 * }} EngineOutput
 */

/**
 * @param {UserTurn} turn
 * @returns {EngineOutput}
 */
export function runSpiritshellEngine(turn) {
  const interpretation = analyzeInput(turn.text);
  const coherence      = detectCoherence(interpretation);
  const response       = buildResponse(interpretation, turn.text);

  return { interpretation, coherence, response };
}
