import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { resolveSkillAnalyticsMeta } from '../scripts/skill-taxonomy';

const ROOT = path.resolve(import.meta.dir, '..');

interface SkillPair {
    dir: string;
    tmpl: string;
    generated: string;
}

function discoverSkillPairs(): SkillPair[] {
    const pairs: SkillPair[] = [];

    const rootTmpl = path.join(ROOT, 'SKILL.md.tmpl');
    const rootGenerated = path.join(ROOT, 'SKILL.md');
    if (fs.existsSync(rootTmpl) || fs.existsSync(rootGenerated)) {
        pairs.push({ dir: '.', tmpl: rootTmpl, generated: rootGenerated });
    }

    for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const tmpl = path.join(ROOT, entry.name, 'SKILL.md.tmpl');
        const generated = path.join(ROOT, entry.name, 'SKILL.md');
        if (fs.existsSync(tmpl) || fs.existsSync(generated)) {
            pairs.push({ dir: entry.name, tmpl, generated });
        }
    }

    return pairs.sort((a, b) => a.generated.localeCompare(b.generated));
}

function extractFrontmatterName(content: string): string | null {
    const match = content.match(/^name:\s*(.+)$/m);
    return match ? match[1].trim() : null;
}

describe('skill lifecycle matrix', () => {
    const pairs = discoverSkillPairs();

    test('every discovered skill pair has template and generated doc', () => {
        expect(pairs.length).toBeGreaterThan(0);

        for (const pair of pairs) {
            expect(fs.existsSync(pair.tmpl)).toBe(true);
            expect(fs.existsSync(pair.generated)).toBe(true);
        }
    });

    test('generated docs include auto-generated header and no unresolved placeholders', () => {
        for (const pair of pairs) {
            const content = fs.readFileSync(pair.generated, 'utf-8');
            expect(content).toContain('AUTO-GENERATED from SKILL.md.tmpl');
            expect(content).toContain('Regenerate: bun run gen:skill-docs');
            expect(content.match(/\{\{[A-Z_]+\}\}/g)).toBeNull();
        }
    });

    test('frontmatter name stays stable from template to generated output', () => {
        for (const pair of pairs) {
            const tmplName = extractFrontmatterName(fs.readFileSync(pair.tmpl, 'utf-8'));
            const generatedName = extractFrontmatterName(fs.readFileSync(pair.generated, 'utf-8'));
            expect(tmplName).toBeTruthy();
            expect(generatedName).toBeTruthy();
            expect(generatedName).toBe(tmplName);
        }
    });

    test('preamble telemetry includes standardized metadata where telemetry exists', () => {
        for (const pair of pairs) {
            const content = fs.readFileSync(pair.generated, 'utf-8');
            if (!content.includes('skill-usage.jsonl')) continue;
            if (!content.includes('## Preamble (run first)')) continue;

            const skillName = extractFrontmatterName(content);
            expect(skillName).toBeTruthy();
            const expected = resolveSkillAnalyticsMeta(skillName!);

            expect(content).toContain(`"team":"${expected.team}"`);
            expect(content).toContain(`"bu":"${expected.bu}"`);
            expect(content).toContain(`"workflow":"${expected.workflow}"`);
        }
    });
});
