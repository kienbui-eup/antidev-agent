import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(import.meta.dir, '..');
function read(relPath: string): string {
  return fs.readFileSync(path.resolve(ROOT, relPath), 'utf-8');
}
function readJson(relPath: string): Record<string, string> {
  return JSON.parse(read(relPath)) as Record<string, string>;
}

// ─── vi.json coverage ───────────────────────────────────────────────────────

describe('i18n/vi.json', () => {
  test('file exists', () => {
    expect(fs.existsSync(path.resolve(ROOT, 'i18n/vi.json'))).toBe(true);
  });

  test('has all keys from en.json', () => {
    const en = readJson('i18n/en.json');
    const vi = readJson('i18n/vi.json');
    const missing = Object.keys(en).filter((k) => !(k in vi));
    expect(missing).toHaveLength(0);
  });

  test('no extra keys not in en.json', () => {
    const en = readJson('i18n/en.json');
    const vi = readJson('i18n/vi.json');
    const extra = Object.keys(vi).filter((k) => !(k in en));
    expect(extra).toHaveLength(0);
  });

  test('has eUp skill name translations', () => {
    const vi = readJson('i18n/vi.json');
    expect(vi['skill.content-qa.name']).toBeTruthy();
    expect(vi['skill.super-lang-flow.name']).toBeTruthy();
    expect(vi['skill.localization-workflow.name']).toBeTruthy();
  });

  test('no TODO markers in vi.json', () => {
    const vi = readJson('i18n/vi.json');
    const todos = Object.entries(vi).filter(([, v]) => v.includes('[TODO: translate]'));
    expect(todos).toHaveLength(0);
  });

  test('interpolation variables match en.json', () => {
    const en = readJson('i18n/en.json');
    const vi = readJson('i18n/vi.json');
    const extractVars = (s: string) => (s.match(/\{[^}]+\}/g) ?? []).sort().join(',');

    for (const key of Object.keys(en)) {
      if (key in vi) {
        const enVars = extractVars(en[key]);
        const viVars = extractVars(vi[key]);
        expect(viVars).toBe(enVars);
      }
    }
  });
});

// ─── i18n-validate script ───────────────────────────────────────────────────

describe('scripts/i18n-validate.ts', () => {
  test('file exists', () => {
    expect(fs.existsSync(path.resolve(ROOT, 'scripts/i18n-validate.ts'))).toBe(true);
  });

  test('validates key coverage', () => {
    const script = read('scripts/i18n-validate.ts');
    expect(script).toContain('Missing key');
    expect(script).toContain('en.json');
  });

  test('checks interpolation variables', () => {
    const script = read('scripts/i18n-validate.ts');
    expect(script).toContain('extractVars');
    expect(script).toContain('Variable mismatch');
  });
});

// ─── i18n-extract script ────────────────────────────────────────────────────

describe('scripts/i18n-extract.ts', () => {
  test('file exists', () => {
    expect(fs.existsSync(path.resolve(ROOT, 'scripts/i18n-extract.ts'))).toBe(true);
  });

  test('finds SKILL.md.tmpl files', () => {
    const script = read('scripts/i18n-extract.ts');
    expect(script).toContain('SKILL.md.tmpl');
  });

  test('parses frontmatter name and description', () => {
    const script = read('scripts/i18n-extract.ts');
    expect(script).toContain('parseFrontMatter');
    expect(script).toContain('nameKey');
    expect(script).toContain('descKey');
  });
});
