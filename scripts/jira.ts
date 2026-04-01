#!/usr/bin/env bun

declare const process: {
    env: Record<string, string | undefined>;
    argv: string[];
    exit(code?: number): never;
};

declare function btoa(data: string): string;

const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const DEFAULT_PROJECT = process.env.JIRA_PROJECT || 'EUP';

interface JiraSearchIssue {
    key: string;
    fields: {
        summary: string;
    };
}

interface JiraSearchResponse {
    issues?: JiraSearchIssue[];
}

interface JiraCreateResponse {
    key: string;
}

interface JiraTransition {
    id: string;
    name: string;
}

interface JiraTransitionsResponse {
    transitions?: JiraTransition[];
}

function requireConfig() {
    if (!JIRA_HOST || !JIRA_EMAIL || !JIRA_API_TOKEN) {
        throw new Error('Missing Jira config. Required: JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN');
    }
}

function authHeader() {
    return `Basic ${btoa(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`)}`;
}

async function jiraFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    requireConfig();

    const response = await fetch(`${JIRA_HOST}${path}`, {
        ...options,
        headers: {
            Authorization: authHeader(),
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Jira API error ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
}

async function searchIssues(jql: string) {
    const data = await jiraFetch<JiraSearchResponse>(`/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=20`);
    for (const issue of data.issues || []) {
        console.log(`${issue.key}: ${issue.fields.summary}`);
    }
}

async function createIssue(args: string[]) {
    const project = getArg(args, '--project') || DEFAULT_PROJECT;
    const type = getArg(args, '--type') || 'Task';
    const summary = getArg(args, '--summary');
    const description = getArg(args, '--description') || '';

    if (!summary) {
        throw new Error('Missing --summary');
    }

    const data = await jiraFetch<JiraCreateResponse>('/rest/api/3/issue', {
        method: 'POST',
        body: JSON.stringify({
            fields: {
                project: { key: project },
                summary,
                issuetype: { name: type },
                description: {
                    type: 'doc',
                    version: 1,
                    content: [
                        {
                            type: 'paragraph',
                            content: description
                                ? [{ type: 'text', text: description }]
                                : [],
                        },
                    ],
                },
            },
        }),
    });

    console.log(`${data.key}: ${JIRA_HOST}/browse/${data.key}`);
}

async function addComment(args: string[]) {
    const issue = getArg(args, '--issue');
    const text = getArg(args, '--text');

    if (!issue || !text) {
        throw new Error('Missing --issue or --text');
    }

    await jiraFetch(`/rest/api/3/issue/${issue}/comment`, {
        method: 'POST',
        body: JSON.stringify({
            body: {
                type: 'doc',
                version: 1,
                content: [
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text }],
                    },
                ],
            },
        }),
    });

    console.log(`Comment added to ${issue}`);
}

async function transitionIssue(args: string[]) {
    const issue = getArg(args, '--issue');
    const to = getArg(args, '--to');

    if (!issue || !to) {
        throw new Error('Missing --issue or --to');
    }

    const transitions = await jiraFetch<JiraTransitionsResponse>(`/rest/api/3/issue/${issue}/transitions`);
    const target = (transitions.transitions || []).find((item) => item.name === to);

    if (!target) {
        throw new Error(`Transition '${to}' not found for ${issue}`);
    }

    await jiraFetch(`/rest/api/3/issue/${issue}/transitions`, {
        method: 'POST',
        body: JSON.stringify({ transition: { id: target.id } }),
    });

    console.log(`${issue} -> ${to}`);
}

function getArg(args: string[], name: string) {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
}

async function main() {
    const [, , command, ...args] = process.argv;

    try {
        if (command === 'search') {
            const query = args.join(" ").trim();
            if (!query) throw new Error('Missing JQL query');
            await searchIssues(query);
            return 0;
        }

        if (command === 'create') {
            await createIssue(args);
            return 0;
        }

        if (command === 'comment') {
            await addComment(args);
            return 0;
        }

        if (command === 'transition') {
            await transitionIssue(args);
            return 0;
        }

        console.error('Usage: bun run scripts/jira.ts <search|create|comment|transition> ...');
        return 1;
    } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        return 1;
    }
}

const exitCode = await main();
if (exitCode !== 0) {
    process.exit(exitCode);
}

export { };
