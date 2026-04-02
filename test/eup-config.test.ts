import { describe, test, expect } from 'bun:test';
import { eupConfig, validateEupConfig } from '../scripts/eup-config';

describe('eup config', () => {
  test('has expected default values', () => {
    expect(eupConfig.team).toBe('eUp Group');
    expect(eupConfig.region).toBe('Vietnam');
    expect(eupConfig.timezone).toBe('Asia/Ho_Chi_Minh');
  });

  test('gitlab defaults are valid', () => {
    expect(eupConfig.gitlab.host).toMatch(/^https:\/\//);
    expect(eupConfig.gitlab.group).toBeTruthy();
    expect(eupConfig.gitlab.defaultBranch).toBe('main');
  });

  test('jira defaults are valid', () => {
    expect(eupConfig.jira.host).toMatch(/^https:\/\//);
    expect(eupConfig.jira.defaultProject).toBe('EUP');
    expect(eupConfig.jira.projects).toContain('EUP');
    expect(eupConfig.jira.transitions.toInReview).toBeTruthy();
    expect(eupConfig.jira.transitions.toDone).toBeTruthy();
  });

  test('i18n includes vi and en', () => {
    expect(eupConfig.i18n.supportedLanguages).toContain('vi');
    expect(eupConfig.i18n.supportedLanguages).toContain('en');
  });

  test('eUp-specific skills are listed', () => {
    expect(eupConfig.skills.eup).toContain('content-qa');
    expect(eupConfig.skills.eup).toContain('super-lang-flow');
    expect(eupConfig.skills.eup).toContain('localization-workflow');
  });

  test('validateEupConfig passes with defaults', () => {
    const { valid, errors } = validateEupConfig();
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });
});
