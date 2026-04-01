export interface SkillAnalyticsMeta {
  team: string;
  bu: string;
  workflow: string;
}

const DEFAULT_META: SkillAnalyticsMeta = {
  team: 'platform',
  bu: 'engineering',
  workflow: 'general',
};

const EXACT_RULES: Record<string, SkillAnalyticsMeta> = {
  antidev: { team: 'platform', bu: 'engineering', workflow: 'general' },
  browse: { team: 'platform', bu: 'engineering', workflow: 'platform' },

  qa: { team: 'quality', bu: 'engineering', workflow: 'qa' },
  'qa-only': { team: 'quality', bu: 'engineering', workflow: 'qa' },
  'setup-browser-cookies': { team: 'quality', bu: 'engineering', workflow: 'qa' },

  'design-review': { team: 'design', bu: 'product', workflow: 'design' },
  'design-consultation': { team: 'design', bu: 'product', workflow: 'design' },

  'office-hours': { team: 'strategy', bu: 'product', workflow: 'planning' },
  'plan-ceo-review': { team: 'strategy', bu: 'product', workflow: 'planning' },

  review: { team: 'engineering', bu: 'engineering', workflow: 'delivery' },
  ship: { team: 'engineering', bu: 'engineering', workflow: 'delivery' },
  'plan-eng-review': { team: 'engineering', bu: 'engineering', workflow: 'delivery' },
  retro: { team: 'engineering', bu: 'engineering', workflow: 'delivery' },
  investigate: { team: 'engineering', bu: 'engineering', workflow: 'delivery' },

  'antidev-upgrade': { team: 'platform', bu: 'engineering', workflow: 'ops' },
};

const PREFIX_RULES: Array<{ prefix: string; meta: SkillAnalyticsMeta }> = [
  { prefix: 'plan-design-', meta: { team: 'design', bu: 'product', workflow: 'design' } },
  { prefix: 'plan-', meta: { team: 'strategy', bu: 'product', workflow: 'planning' } },
  { prefix: 'ezami-', meta: { team: 'automation', bu: 'operations', workflow: 'business-ops' } },
];

export function resolveSkillAnalyticsMeta(skillName: string): SkillAnalyticsMeta {
  const exact = EXACT_RULES[skillName];
  if (exact) return exact;

  for (const rule of PREFIX_RULES) {
    if (skillName.startsWith(rule.prefix)) return rule.meta;
  }

  return DEFAULT_META;
}
