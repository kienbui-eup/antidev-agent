/**
 * i18n-extract.ts — extract translatable keys from SKILL.md.tmpl files.
 *
 * Scans all SKILL.md.tmpl files and populates i18n/en.json with
 * skill-level metadata keys (name, description). Does not overwrite
 * existing translations — only adds new keys.
 *
 * Usage:
 *   bun run scripts/i18n-extract.ts
 *   bun run scripts/i18n-extract.ts --dry-run
 */
import * as fs from 'fs';
import * as path from 'path';

declare const process: { argv: string[]; exit: (code: number) => never };

const ROOT = path.resolve(import.meta.dir, '..');
const I18N_DIR = path.join(ROOT, 'i18n');
const EN_FILE = path.join(I18N_DIR, 'en.json');
const DRY_RUN = process.argv.includes('--dry-run');

interface FrontMatter {
  name?: string;
  description?: string;
}

function parseFrontMatter(content: string): FrontMatter {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const result: FrontMatter = {};
  const raw = match[1];

  const nameMatch = raw.match(/^name:\s*(.+)/m);
  if (nameMatch) result.name = nameMatch[1].trim();

  // Handle multiline description (yaml block scalar)
  const descMatch = raw.match(/^description:\s*\|?\n((?:[ \t]+.+\n?)+)/m);
  if (descMatch) {
    result.description = descMatch[1]
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join(' ');
  } else {
    const inlineDesc = raw.match(/^description:\s*(.+)/m);
    if (inlineDesc) result.description = inlineDesc[1].trim();
  }

  return result;
}

function findSkillDirs(): string[] {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((d: { isDirectory(): boolean }) => d.isDirectory())
    .map((d: { name: string }) => d.name)
    .filter((name: string) => {
      const tmpl = path.join(ROOT, name, 'SKILL.md.tmpl');
      return fs.existsSync(tmpl);
    });
}

function extract(): Record<string, string> {
  const existing: Record<string, string> = fs.existsSync(EN_FILE)
    ? (JSON.parse(fs.readFileSync(EN_FILE, 'utf-8')) as Record<string, string>)
    : {};

  const updated = { ...existing };
  let added = 0;

  for (const dir of findSkillDirs()) {
    const tmplPath = path.join(ROOT, dir, 'SKILL.md.tmpl');
    const content = fs.readFileSync(tmplPath, 'utf-8');
    const fm = parseFrontMatter(content);

    if (!fm.name) continue;

    const nameKey = `skill.${fm.name}.name`;
    const descKey = `skill.${fm.name}.description`;

    if (!(nameKey in updated)) {
      updated[nameKey] = fm.name;
      added++;
      console.log(`  + ${nameKey}`);
    }
    if (fm.description && !(descKey in updated)) {
      updated[descKey] = fm.description;
      added++;
      console.log(`  + ${descKey}`);
    }
  }

  console.log(`\nExtracted ${added} new key(s)`);
  return updated;
}

const result = extract();

if (DRY_RUN) {
  console.log('\n[dry-run] Would write to en.json:');
  console.log(JSON.stringify(result, null, 2));
} else {
  fs.writeFileSync(EN_FILE, JSON.stringify(result, null, 2) + '\n');
  console.log(`\nUpdated ${EN_FILE}`);
}
