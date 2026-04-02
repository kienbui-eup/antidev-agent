/**
 * eup.config.ts — eUp Group configuration for antidev-agent.
 *
 * Provides sensible defaults for all eUp integrations.
 * Override any key via environment variables (highest priority).
 * Fall back to ~/.antidev/config.yaml (set via antidev-config CLI).
 *
 * Usage:
 *   import { eupConfig } from './scripts/eup-config';
 *   console.log(eupConfig.jira.host);
 */

declare const process: { env: Record<string, string | undefined> };

// ─── Helpers ────────────────────────────────────────────────────────────────

function env(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function envArray(key: string, fallback: string[]): string[] {
  const val = process.env[key];
  return val ? val.split(',').map((s) => s.trim()) : fallback;
}

// ─── Config Shape ────────────────────────────────────────────────────────────

export interface EupConfig {
  team: string;
  region: string;
  timezone: string;

  gitlab: {
    host: string;
    group: string;
    defaultBranch: string;
  };

  jira: {
    host: string;
    defaultProject: string;
    projects: string[];
    /** Workflow transition names (from → to). Map to your Jira workflow. */
    transitions: {
      toInProgress: string;
      toInReview: string;
      toDone: string;
      toBlocked: string;
    };
  };

  i18n: {
    defaultLanguage: string;
    supportedLanguages: string[];
  };

  skills: {
    /** Skills enabled for eUp deployments. */
    eup: string[];
    /** Skills disabled (e.g. removed from preamble routing). */
    disabled: string[];
  };

  ci: {
    slackWebhook: string;
    notifyOnBranches: string[];
  };
}

// ─── Config Values ───────────────────────────────────────────────────────────

export const eupConfig: EupConfig = {
  team: 'eUp Group',
  region: 'Vietnam',
  timezone: 'Asia/Ho_Chi_Minh',

  gitlab: {
    host: env('GITLAB_HOST', 'https://gitlab.com'),
    group: env('GITLAB_GROUP', 'eup'),
    defaultBranch: env('GITLAB_DEFAULT_BRANCH', 'main'),
  },

  jira: {
    host: env('JIRA_HOST', 'https://eup-group.atlassian.net'),
    defaultProject: env('JIRA_PROJECT', 'EUP'),
    projects: envArray('JIRA_PROJECTS', ['EUP', 'LANG', 'EDU']),
    transitions: {
      toInProgress: env('JIRA_TRANSITION_IN_PROGRESS', 'In Progress'),
      toInReview: env('JIRA_TRANSITION_IN_REVIEW', 'In Review'),
      toDone: env('JIRA_TRANSITION_DONE', 'Done'),
      toBlocked: env('JIRA_TRANSITION_BLOCKED', 'Blocked'),
    },
  },

  i18n: {
    defaultLanguage: env('ANTIDEV_LANG', 'en'),
    supportedLanguages: ['vi', 'en'],
  },

  skills: {
    eup: ['content-qa', 'super-lang-flow', 'localization-workflow', 'jira'],
    disabled: [],
  },

  ci: {
    slackWebhook: env('SLACK_WEBHOOK', ''),
    notifyOnBranches: envArray('CI_NOTIFY_BRANCHES', ['main']),
  },
};

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateEupConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!eupConfig.jira.host.startsWith('https://')) {
    errors.push('JIRA_HOST must start with https://');
  }
  if (!eupConfig.gitlab.host.startsWith('https://')) {
    errors.push('GITLAB_HOST must start with https://');
  }
  if (!eupConfig.i18n.supportedLanguages.includes(eupConfig.i18n.defaultLanguage)) {
    errors.push(
      `ANTIDEV_LANG="${eupConfig.i18n.defaultLanguage}" not in supported: ${eupConfig.i18n.supportedLanguages.join(', ')}`,
    );
  }

  return { valid: errors.length === 0, errors };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

// bun: entry-point detection via CLI arg
if (process.env['_EUP_CONFIG_CLI'] === '1') {
  const { valid, errors } = validateEupConfig();
  console.log('eUp Config:');
  console.log(JSON.stringify(eupConfig, null, 2));
  if (!valid) {
    console.error('\nConfig errors:');
    errors.forEach((e) => console.error(`  ✗ ${e}`));
  } else {
    console.log('\n✅ Config valid');
  }
}
