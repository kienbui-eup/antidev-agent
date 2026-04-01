#!/usr/bin/env bun
/**
 * skill:check — Health summary for all SKILL.md files.
 *
 * Reports:
 *   - Command validation (valid/invalid/snapshot errors)
 *   - Template coverage (which SKILL.md files have .tmpl sources)
 *   - Freshness check (generated files match committed files)
 *   - Metadata coverage (name/team/bu/workflow in generated telemetry)
 */

import { validateSkill } from '../test/helpers/skill-parser';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dir, '..');

interface SkillFilePair {
  dir: string;
  generated: string;
  template: string;
}

function discoverSkillPairs(): SkillFilePair[] {
  const out: SkillFilePair[] = [];
  const skipDirs = new Set(['.git', 'node_modules', '.claude', '.antidev']);

  const rootGenerated = path.join(ROOT, 'SKILL.md');
  const rootTemplate = path.join(ROOT, 'SKILL.md.tmpl');
  if (fs.existsSync(rootGenerated) || fs.existsSync(rootTemplate)) {
    out.push({ dir: '.', generated: 'SKILL.md', template: 'SKILL.md.tmpl' });
  }

  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || skipDirs.has(entry.name)) continue;
    const generated = path.join(ROOT, entry.name, 'SKILL.md');
    const template = path.join(ROOT, entry.name, 'SKILL.md.tmpl');
    if (fs.existsSync(generated) || fs.existsSync(template)) {
      out.push({
        dir: entry.name,
        generated: path.join(entry.name, 'SKILL.md'),
        template: path.join(entry.name, 'SKILL.md.tmpl'),
      });
    }
  }

  return out.sort((a, b) => a.generated.localeCompare(b.generated));
}

const SKILL_PAIRS = discoverSkillPairs();
const SKILL_FILES = SKILL_PAIRS.map(p => p.generated).filter(f => fs.existsSync(path.join(ROOT, f)));
let hasErrors = false;
let hasWarnings = false;
let metadataChecked = 0;
let metadataMissing = 0;

// ─── Skills ─────────────────────────────────────────────────

console.log('  Skills:');
for (const file of SKILL_FILES) {
  const fullPath = path.join(ROOT, file);
  const result = validateSkill(fullPath);

  if (result.warnings.length > 0) {
    hasWarnings = true;
    console.log(`  ⚠️  ${file.padEnd(30)} — ${result.warnings.join(', ')}`);
    continue;
  }

  const totalValid = result.valid.length;
  const totalInvalid = result.invalid.length;
  const totalSnapErrors = result.snapshotFlagErrors.length;

  if (totalInvalid > 0 || totalSnapErrors > 0) {
    hasErrors = true;
    console.log(`  ❌ ${file.padEnd(30)} — ${totalValid} valid, ${totalInvalid} invalid, ${totalSnapErrors} snapshot errors`);
    for (const inv of result.invalid) {
      console.log(`      line ${inv.line}: unknown command '${inv.command}'`);
    }
    for (const se of result.snapshotFlagErrors) {
      console.log(`      line ${se.command.line}: ${se.error}`);
    }
  } else {
    console.log(`  ✅ ${file.padEnd(30)} — ${totalValid} commands, all valid`);
  }
}

// ─── Templates ──────────────────────────────────────────────

console.log('\n  Templates:');
for (const pair of SKILL_PAIRS) {
  const tmplPath = path.join(ROOT, pair.template);
  const outPath = path.join(ROOT, pair.generated);
  const hasTemplate = fs.existsSync(tmplPath);
  const hasGenerated = fs.existsSync(outPath);

  if (!hasTemplate && !hasGenerated) {
    continue;
  }

  if (hasTemplate && !hasGenerated) {
    hasErrors = true;
    console.log(`  ❌ ${pair.generated.padEnd(30)} — generated file missing! Run: bun run gen:skill-docs`);
    continue;
  }

  if (!hasTemplate && hasGenerated) {
    hasWarnings = true;
    console.log(`  ⚠️  ${pair.generated.padEnd(30)} — no template (.tmpl) found`);
    continue;
  }

  console.log(`  ✅ ${pair.template.padEnd(30)} → ${pair.generated}`);
}

// ─── Metadata ──────────────────────────────────────────────

console.log('\n  Metadata:');
for (const file of SKILL_FILES) {
  const fullPath = path.join(ROOT, file);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const hasTelemetry = content.includes('skill-usage.jsonl');
  if (!hasTelemetry) continue;

  const usesStandardPreamble = content.includes('## Preamble (run first)');
  if (!usesStandardPreamble) {
    console.log(`  ℹ️  ${file.padEnd(30)} — custom telemetry block (metadata optional)`);
    continue;
  }

  metadataChecked++;
  const hasTeam = content.includes('"team":"');
  const hasBu = content.includes('"bu":"');
  const hasWorkflow = content.includes('"workflow":"');

  if (!hasTeam || !hasBu || !hasWorkflow) {
    metadataMissing++;
    hasWarnings = true;
    console.log(`  ⚠️  ${file.padEnd(30)} — telemetry metadata missing (team/bu/workflow)`);
  } else {
    console.log(`  ✅ ${file.padEnd(30)} — telemetry metadata present`);
  }
}

// ─── Freshness ──────────────────────────────────────────────

console.log('\n  Freshness:');
try {
  execSync('bun run scripts/gen-skill-docs.ts --dry-run', { cwd: ROOT, stdio: 'pipe' });
  console.log('  \u2705 All generated files are fresh');
} catch (err: any) {
  hasErrors = true;
  const output = err.stdout?.toString() || '';
  console.log('  \u274c Generated files are stale:');
  for (const line of output.split('\n').filter((l: string) => l.startsWith('STALE'))) {
    console.log(`      ${line}`);
  }
  console.log('      Run: bun run gen:skill-docs');
}

console.log('');
console.log('  Summary:');
console.log(`  - Skills discovered: ${SKILL_PAIRS.length}`);
console.log(`  - Generated skills checked: ${SKILL_FILES.length}`);
console.log(`  - Telemetry metadata checks: ${metadataChecked} (${metadataMissing} missing)`);
console.log(`  - Status: ${hasErrors ? 'ERROR' : (hasWarnings ? 'WARN' : 'OK')}`);
console.log('');
process.exit(hasErrors ? 1 : 0);
