/**
 * analyze.js
 * Rule-based input interpreter.
 * Detects emotional pattern types from Chinese text using regex heuristics.
 */

// ─── Pattern definitions ────────────────────────────────────────────────────

const PATTERNS = {

  approach_avoidance: [
    /想.{0,12}(但又|却|但不|但又不|可是|偏偏)/,
    /想.{0,6}(找|联系|见|靠近|回|去).{0,12}(但|却|不应该|不对|不敢|又觉得)/,
    /一边.{0,18}一边/,
    /一方面.{0,25}另一方面/,
    /既.{0,18}又.{0,18}(但|却|不)/,
    /想靠近.{0,12}(退|走|逃|拉开)/,
    /说(想|要).{0,10}(又|但).{0,10}(不敢|不行|不应该)/,
  ],

  denial_vs_attachment: [
    /已经(放下|忘了|不在乎|不在意|过去了|没事了|好了)/,
    /(放下了|忘了|不在意了|无所谓了|不重要了|过去了|释怀了)/,
    /其实(已经|挺好的|没事|还好|可以)/,
    /(不在乎了|不想了|想开了|看开了)/,
    /早就(忘了|放下了|不在意了|不想了)/,
  ],

  dependency_conflict: [
    /(不回|不联系|不理|不回复|不来|消失了|失踪了).{0,20}(难受|难过|很难|不舒服|崩|哭|受不了)/,
    /(难受|难过|崩|哭|受不了).{0,20}(不回|不联系|不理|不来|消失)/,
    /(他|她).{0,6}(不回|不联系|不理|不来|不在|消失|离开).{0,12}(就|我就|让我|我会|我都)/,
    /一直在等.{0,6}(他|她|回复|消息)/,
    /等(他|她).{0,12}(回|联系|消息|出现)/,
    /(看见|看到).{0,5}(他|她).{0,10}(就|又).{0,10}(难受|难过|心里)/,
  ],

  self_suppression: [
    /总是?.{0,4}(迁就|忍|让步|委屈|退让)/,
    /不想让.{0,6}(失望|难过|伤心|担心|麻烦)/,
    /习惯了?.{0,4}(忍|让|委屈|迁就|退)/,
    /(我不重要|我没关系|无所谓我|我不值得)/,
    /不敢(说|表达|提|拒绝|开口)/,
    /为了?.{0,5}(他|她|别人|大家|你).{0,12}(忍|委屈|放弃|让步)/,
    /(自己).{0,5}(不重要|不值得|算什么|不配)/,
    /从来不.{0,5}(说|提|表达|争)/,
  ],

  indecision_due_to_consequence_avoidance: [
    /不知道该(怎么|如何|选|做|决定|走)/,
    /(该选哪|选哪个|选哪边|选A|选B|两个都|两边都)/,
    /左右为难/,
    /两难/,
    /(要不要|去不去|说不说|留不留|走不走).{0,6}(好|呢|了|啊)/,
    /不知道(要|该|怎).{0,5}(选|决定|走|做|办)/,
    /怎么(选|决定|办).{0,5}(都|好|不好|行|不行)/,
  ],
};

// ─── Surface emotion signals ─────────────────────────────────────────────────

const EMOTION_SIGNALS = [
  ['崩溃', 'breakdown'],
  ['难受',  'distress'],
  ['难过',  'sadness'],
  ['委屈',  'feeling_wronged'],
  ['后悔',  'regret'],
  ['害怕',  'fear'],
  ['迷茫',  'lost'],
  ['焦虑',  'anxiety'],
  ['好累',  'exhausted'],
  ['累了',  'exhausted'],
  ['哭',    'crying'],
  ['伤心',  'sadness'],
  ['不开心','unhappy'],
];

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Analyze a user's text and return a structured interpretation.
 *
 * @param {string} text
 * @returns {{
 *   surfaceEmotion?: string,
 *   patternType?: string,
 *   intensity?: number,
 * }}
 */
export function analyzeInput(text) {
  const result = {};

  // Surface emotion — first match wins
  for (const [phrase, label] of EMOTION_SIGNALS) {
    if (text.includes(phrase)) {
      result.surfaceEmotion = label;
      break;
    }
  }

  // Pattern detection — specificity order matters
  for (const [type, regexes] of Object.entries(PATTERNS)) {
    if (regexes.some(r => r.test(text))) {
      result.patternType = type;
      result.intensity   = intensityFor(type);
      break;
    }
  }

  return result;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function intensityFor(type) {
  const map = {
    approach_avoidance:                        0.70,
    denial_vs_attachment:                      0.60,
    dependency_conflict:                       0.75,
    self_suppression:                          0.65,
    indecision_due_to_consequence_avoidance:   0.50,
  };
  return map[type] ?? 0.5;
}
