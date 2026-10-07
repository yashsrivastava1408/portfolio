import { portfolioData } from "@/data/portfolio";

// Live numbers are fetched when the page is built, and refreshed once a day after that.
// Every fetch has a fallback, so a blocked or slow API can never break the build.
export const STATS_REVALIDATE_SECONDS = 60 * 60 * 24;

const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);

export type LeetcodeStats = {
    username: string;
    totalSolved: number;
    easy: number;
    medium: number;
    hard: number;
    contestRating: number | null;
    asOf: string;
};

export type GithubStats = {
    publicRepos: number;
    languages: { name: string; count: number; percent: number }[];
    recent: { name: string; url: string; description: string | null; language: string | null; pushedAt: string }[];
    asOf: string;
};

const LEETCODE_QUERY = `query($u:String!){
  matchedUser(username:$u){ submitStatsGlobal{ acSubmissionNum{ difficulty count } } }
  userContestRanking(username:$u){ rating }
}`;

export async function getLeetcodeStats(): Promise<LeetcodeStats> {
    const fallback: LeetcodeStats = portfolioData.leetcode;
    try {
        const res = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", Referer: "https://leetcode.com", "User-Agent": "Mozilla/5.0 (portfolio build)" },
            body: JSON.stringify({ query: LEETCODE_QUERY, variables: { u: fallback.username } }),
            signal: AbortSignal.timeout(8000),
            next: { revalidate: STATS_REVALIDATE_SECONDS },
        });
        if (!res.ok) return fallback;

        const { data } = await res.json();
        const rows: { difficulty: string; count: number }[] | undefined = data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
        const count = (difficulty: string) => rows?.find((r) => r.difficulty === difficulty)?.count;
        const [all, easy, medium, hard] = [count("All"), count("Easy"), count("Medium"), count("Hard")];
        if (!all || easy === undefined || medium === undefined || hard === undefined) return fallback;

        const rating = data?.userContestRanking?.rating;
        return {
            username: fallback.username,
            totalSolved: all,
            easy,
            medium,
            hard,
            contestRating: typeof rating === "number" ? Math.round(rating) : fallback.contestRating,
            asOf: formatDate(new Date()),
        };
    } catch {
        return fallback;
    }
}

type GithubRepo = {
    name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    fork: boolean;
    archived: boolean;
    pushed_at: string;
};

export async function getGithubStats(): Promise<GithubStats | null> {
    const user = portfolioData.personal.github;
    try {
        const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build" };
        // Optional: a token raises GitHub's rate limit. The site works without one.
        if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

        const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed&type=owner`, {
            headers,
            signal: AbortSignal.timeout(8000),
            next: { revalidate: STATS_REVALIDATE_SECONDS },
        });
        if (!res.ok) return null;

        const all: GithubRepo[] = await res.json();
        if (!Array.isArray(all)) return null;
        // own work only: no forks, and not the profile README repo
        const repos = all.filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase());
        if (repos.length === 0) return null;

        const counts = new Map<string, number>();
        for (const repo of repos) {
            if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
        }
        const withLanguage = [...counts.values()].reduce((a, b) => a + b, 0);
        const languages = [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count, percent: Math.round((count / withLanguage) * 100) }));

        const recent = repos
            .filter((r) => !r.archived && r.name !== "portfolio")
            .slice(0, 4)
            .map((r) => ({
                name: r.name,
                url: r.html_url,
                description: r.description,
                language: r.language,
                pushedAt: formatDate(new Date(r.pushed_at)),
            }));

        return { publicRepos: repos.length, languages, recent, asOf: formatDate(new Date()) };
    } catch {
        return null;
    }
}
