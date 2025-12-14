// GitHub Issue Parser - Fetch real issue content from URL

export interface GitHubIssue {
    title: string;
    body: string;
    number: number;
    repo: string;
    owner: string;
    state: string;
    labels: string[];
    url: string;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string; number: number } | null {
    // Match patterns like:
    // https://github.com/owner/repo/issues/123
    // github.com/owner/repo/issues/123
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);

    if (!match) return null;

    return {
        owner: match[1],
        repo: match[2],
        number: parseInt(match[3], 10),
    };
}

export async function fetchGitHubIssue(url: string): Promise<GitHubIssue | null> {
    const parsed = parseGitHubUrl(url);
    if (!parsed) return null;

    try {
        // Use GitHub's public API (no auth needed for public repos)
        const apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues/${parsed.number}`;

        const response = await fetch(apiUrl, {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!response.ok) {
            console.error("GitHub API error:", response.status);
            return null;
        }

        const data = await response.json();

        return {
            title: data.title,
            body: data.body || "",
            number: data.number,
            repo: parsed.repo,
            owner: parsed.owner,
            state: data.state,
            labels: data.labels?.map((l: { name: string }) => l.name) || [],
            url: data.html_url,
        };
    } catch (error) {
        console.error("Failed to fetch GitHub issue:", error);
        return null;
    }
}

export function isGitHubIssueUrl(input: string): boolean {
    return /github\.com\/[^\/]+\/[^\/]+\/issues\/\d+/.test(input);
}
