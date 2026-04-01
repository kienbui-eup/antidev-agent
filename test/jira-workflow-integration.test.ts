import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dir, '..');

function read(relPath: string): string {
    return readFileSync(resolve(ROOT, relPath), 'utf-8');
}

describe('jira workflow integration wiring', () => {
    test('review skill has Jira ticket extraction and review comment hook', () => {
        const reviewTmpl = read('review/SKILL.md.tmpl');

        expect(reviewTmpl).toContain('Step 1.2: Jira ticket detection (auto)');
        expect(reviewTmpl).toContain("grep -oE '[A-Z]+-[0-9]+'");
        expect(reviewTmpl).toContain('Code review started on branch');
        expect(reviewTmpl).toContain('JIRA_HOST');
    });

    test('ship skill links MR URL and transitions Jira states', () => {
        const shipTmpl = read('ship/SKILL.md.tmpl');

        expect(shipTmpl).toContain('Step 8.3: Jira ticket transition (auto)');
        expect(shipTmpl).toContain('MR/PR created: ${MR_URL:-unknown}');
        expect(shipTmpl).toContain('transition --issue $JIRA_TICKET --to "In Review"');
        expect(shipTmpl).toContain('Step 8.4: Jira done transition (post-merge)');
        expect(shipTmpl).toContain('transition --issue "$JIRA_TICKET" --to "Done"');
    });

    test('ship skill remains non-blocking when Jira or merge checks fail', () => {
        const shipTmpl = read('ship/SKILL.md.tmpl');

        expect(shipTmpl).toContain('|| true');
        expect(shipTmpl).toContain('Never stop the ship workflow if this step fails.');
    });
});
