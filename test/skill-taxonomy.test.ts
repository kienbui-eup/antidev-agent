import { describe, test, expect } from 'bun:test';
import { resolveSkillAnalyticsMeta } from '../scripts/skill-taxonomy';

describe('skill taxonomy registry', () => {
  test('maps key exact skills to expected metadata', () => {
    expect(resolveSkillAnalyticsMeta('qa')).toEqual({ team: 'quality', bu: 'engineering', workflow: 'qa' });
    expect(resolveSkillAnalyticsMeta('design-review')).toEqual({ team: 'design', bu: 'product', workflow: 'design' });
    expect(resolveSkillAnalyticsMeta('ship')).toEqual({ team: 'engineering', bu: 'engineering', workflow: 'delivery' });
    expect(resolveSkillAnalyticsMeta('antidev-upgrade')).toEqual({ team: 'platform', bu: 'engineering', workflow: 'ops' });
  });

  test('supports prefix-based planning and business ops skills', () => {
    expect(resolveSkillAnalyticsMeta('plan-design-review')).toEqual({ team: 'design', bu: 'product', workflow: 'design' });
    expect(resolveSkillAnalyticsMeta('plan-something-new')).toEqual({ team: 'strategy', bu: 'product', workflow: 'planning' });
    expect(resolveSkillAnalyticsMeta('ezami-ops-monitor')).toEqual({ team: 'automation', bu: 'operations', workflow: 'business-ops' });
  });

  test('falls back to default platform taxonomy for unknown skill', () => {
    expect(resolveSkillAnalyticsMeta('totally-new-skill')).toEqual({ team: 'platform', bu: 'engineering', workflow: 'general' });
  });
});
