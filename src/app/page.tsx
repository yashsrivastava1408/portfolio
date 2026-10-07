import HomeClient from "@/components/HomeClient";
import { getGithubStats, getLeetcodeStats } from "@/lib/stats";

// Rebuild this page at most once a day so the GitHub and LeetCode numbers stay current.
// Keep in sync with STATS_REVALIDATE_SECONDS (Next needs a plain number here).
export const revalidate = 86400;

export default async function Home() {
  const [github, leetcode] = await Promise.all([getGithubStats(), getLeetcodeStats()]);

  return <HomeClient github={github} leetcode={leetcode} />;
}
