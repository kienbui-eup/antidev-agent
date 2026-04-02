/**
 * i18n-validate.ts — validate translation coverage.
 *
 * Checks that every key in en.json exists in all other locale files.
 * Also checks interpolation variable consistency.
 *
 * Usage:
 *   bun run scripts/i18n-validate.ts
 *   bun run scripts/i18n-validate.ts --check-glossary
 */
import * as fs from 'fs';
import * as path from 'path';

declare const process: { argv: string[]; exit: (code: number) => never };

const I18N_DIR = path.resolve(import.meta.dir, '../i18n');

function readJson(filePath: string): Record<string, string> {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, string>;
}

function extractVars(value: string): string[] {
  return (value.match(/\{[^}]+\}/g) ?? []).sort();
}

function validate(): boolean {
  if (!fs.existsSync(I18N_DIR)) {
    console.error(`i18n directory not found: ${I18N_DIR}`);
    return false;
  }

  const localeFiles = fs.readdirSync(I18N_DIR).filter((f: string) => f.endsWith('.json'));
  if (localeFiles.length === 0) {
    console.error('No locale files found in i18n/');
    return false;
  }

  const enFile = path.join(I18N_DIR, 'en.json');
  if (!fs.existsSync(enFile)) {
    console.error('en.json (base locale) not found in i18n/');
    return false;
  }

  const en = readJson(enFile);
  const enKeys = Object.keys(en);
  let allPassed = true;

  for (const file of localeFiles) {
    if (file === 'en.json') continue;
    const locale = file.replace('.json', '');
    const localeData = readJson(path.join(I18N_DIR, file));
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const key of enKeys) {
      if (!(key in localeData)) {
        errors.push(`  ✗ Missing key: "${key}"`);
        continue;
      }

      // Check interpolation variable consistency
      const enVars = extractVars(en[key]);
      const localeVars = extractVars(localeData[key]);
      if (JSON.stringify(enVars) !== JSON.stringify(localeVars)) {
        errors.push(
          `  ✗ Variable mismatch for "${key}": en=${JSON.stringify(enVars)} ${locale}=${JSON.stringify(localeVars)}`,
        );
      }

      // Warn on TODO markers
      if (localeData[key].includes('[TODO: translate]')) {
        warnings.push(`  ⚠ Untranslated: "${key}"`);
      }
    }

    if (errors.length > 0 || warnings.length > 0) {
      console.log(`\n${locale}.json:`);
      errors.forEach((e) => console.error(e));
      warnings.forEach((w) => console.warn(w));
      if (errors.length > 0) allPassed = false;
    } else {
      console.log(`✅ ${locale}.json — all ${enKeys.length} keys valid`);
    }
  }

  return allPassed;
}

const passed = validate();
if (!passed) {
  console.error('\ni18n validation failed');
  process.exit(1);
}
console.log('\ni18n validation passed');
