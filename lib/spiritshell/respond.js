/**
 * respond.js
 * Handcrafted response templates per pattern type.
 *
 * Tone guide: quiet, present, non-diagnostic.
 * Each template is an array of lines rendered separately on the page.
 * No advice. No diagnosis. No preach.
 */

/** @type {Record<string, string[][]>} */
const TEMPLATES = {

  approach_avoidance: [
    [
      "你一边想靠近，",
      "一边在往后退。",
      "这两件事都是真的。",
    ],
    [
      "那个"想去"，",
      "和那个"但是"，",
      "都是你的一部分。",
    ],
    [
      "你在拉自己，",
      "也在推自己。",
      "先停一停也好。",
    ],
  ],

  denial_vs_attachment: [
    [
      "你不是没有放下。",
      "你是在慢慢放。",
      "只是你希望它更快一点。",
    ],
    [
      "说"已经过了"，",
      "但还是说了出来。",
      "能说出来，就好。",
    ],
    [
      "你说它过了。",
      "但你还记得很清楚。",
      "这很正常。",
    ],
  ],

  dependency_conflict: [
    [
      "他不回，你就很难受。",
      "你的状态，",
      "跟着他走了。",
    ],
    [
      "你在等的，",
      "不只是一条消息。",
    ],
    [
      "这份在乎，挺重的。",
      "一直等，很累吧。",
    ],
  ],

  self_suppression: [
    [
      "你总是在让。",
      "有没有人问过你，",
      "你自己想要什么？",
    ],
    [
      "先考虑别人，",
      "已经是你的习惯了。",
      "那你自己呢？",
    ],
    [
      "你不想让别人失望。",
      "你失望的时候，",
      "谁来问你一句？",
    ],
  ],

  indecision_due_to_consequence_avoidance: [
    [
      "两个都有代价。",
      "你在犹豫，",
      "是因为两边都有你在乎的东西。",
    ],
    [
      "不是选不出来。",
      "是每一个选，",
      "都意味着放弃什么。",
    ],
    [
      "先不用选。",
      "可以先说说，",
      "两边各有什么？",
    ],
  ],

  holding: [
    [
      "你说了。",
      "我在这里。",
    ],
    [
      "嗯。",
      "可以再多说一点。",
    ],
    [
      "我听到了。",
    ],
  ],
};

/**
 * Select a response template.
 * Deterministic per input text: same input → same template,
 * different inputs → naturally spread across the pool.
 *
 * @param {{ patternType?: string }} interpretation
 * @param {string} inputText  — used for deterministic selection
 * @returns {string[]}
 */
export function buildResponse(interpretation, inputText) {
  const key  = interpretation.patternType ?? 'holding';
  const pool = TEMPLATES[key] ?? TEMPLATES.holding;
  return pool[hashIndex(inputText, pool.length)];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Simple, stable string hash → pool index. */
function hashIndex(text, length) {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h % length;
}
