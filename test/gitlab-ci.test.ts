import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(import.meta.dir, '..');
function read(relPath: string): string {
  return fs.readFileSync(path.resolve(ROOT, relPath), 'utf-8');
}

// ─── .gitlab-ci.yml structure ───────────────────────────────────────────────

describe('.gitlab-ci.yml', () => {
  test('file exists', () => {
    expect(fs.existsSync(path.resolve(ROOT, '.gitlab-ci.yml'))).toBe(true);
  });

  test('has required stages', () => {
    const ci = read('.gitlab-ci.yml');
    expect(ci).toContain('validate');
    expect(ci).toContain('test');
    expect(ci).toContain('build');
    expect(ci).toContain('deploy');
  });

  test('validate stage includes skill-docs check', () => {
    const ci = read('.gitlab-ci.yml');
    expect(ci).toContain('skill-docs');
  });

  test('validate stage includes code-style check', () => {
    const ci = read('.gitlab-ci.yml');
    expect(ci).toContain('code-style');
  });

  test('test:free job is defined', () => {
    const ci = read('.gitlab-ci.yml');
    expect(ci).toContain('test:free');
  });

  test('build job creates artifacts', () => {
    const ci = read('.gitlab-ci.yml');
    expect(ci).toContain('artifacts');
  });

  test('deploy stage needs build', () => {
    const ci = read('.gitlab-ci.yml');
    // deploy jobs should reference build artifacts or have needs
    expect(ci).toContain('deploy');
    expect(ci).toMatch(/needs|dependencies/);
  });

  test('includes skill-docs.yml', () => {
    const ci = read('.gitlab-ci.yml');
    expect(ci).toContain('skill-docs.yml');
  });
});

// ─── .gitlab/ci/skill-docs.yml ──────────────────────────────────────────────

describe('.gitlab/ci/skill-docs.yml', () => {
  test('file exists', () => {
    expect(fs.existsSync(path.resolve(ROOT, '.gitlab/ci/skill-docs.yml'))).toBe(true);
  });

  test('runs gen-skill-docs', () => {
    const yml = read('.gitlab/ci/skill-docs.yml');
    expect(yml).toContain('gen:skill-docs');
  });

  test('checks for stale docs', () => {
    const yml = read('.gitlab/ci/skill-docs.yml');
    // Either dry-run check or git diff check
    expect(yml).toMatch(/dry-run|git diff|stale/i);
  });
});

// ─── bin/gitlab-config ──────────────────────────────────────────────────────

describe('bin/gitlab-config', () => {
  test('file exists', () => {
    expect(fs.existsSync(path.resolve(ROOT, 'bin/gitlab-config'))).toBe(true);
  });

  test('has setup command', () => {
    const script = read('bin/gitlab-config');
    expect(script).toContain('setup');
  });

  test('has verify command', () => {
    const script = read('bin/gitlab-config');
    expect(script).toContain('verify');
  });

  test('handles GITLAB_TOKEN', () => {
    const script = read('bin/gitlab-config');
    expect(script).toContain('GITLAB_TOKEN');
  });

  test('handles JIRA_HOST', () => {
    const script = read('bin/gitlab-config');
    expect(script).toContain('JIRA_HOST');
  });

  test('uses antidev-config for persistent settings', () => {
    const script = read('bin/gitlab-config');
    expect(script).toContain('antidev-config');
  });
});
