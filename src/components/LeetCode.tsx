
"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Trophy, Target } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";
import { portfolioData } from "@/data/portfolio";
import type { GithubStats, LeetcodeStats } from "@/lib/stats";
import SectionHeading from "./SectionHeading";
import CountUp from "./CountUp";

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// GitHub's own colours for the languages that show up most; anything else gets grey.
const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    HTML: "#e34c26",
    "C++": "#f34b7d",
    CSS: "#663399",
    Java: "#b07219",
    Rust: "#dea584",
    Go: "#00ADD8",
};
const languageColor = (name: string) => LANGUAGE_COLORS[name] ?? "#6b7280";

interface LeetCodeProps {
    stats: LeetcodeStats;
    /** Live GitHub numbers, or null if GitHub could not be reached at build time. */
    github: GithubStats | null;
}

export default function LeetCode({ stats, github: githubStats }: LeetCodeProps) {
    const github = portfolioData.personal.github;

    // The ring is split by difficulty: each arc is that difficulty's share of everything solved.
    const segments = [
        { label: "Easy", count: stats.easy, color: "#2dd4bf", text: "text-teal-400", hover: "hover:border-teal-500/30" },
        { label: "Medium", count: stats.medium, color: "#facc15", text: "text-yellow-400", hover: "hover:border-yellow-500/30" },
        { label: "Hard", count: stats.hard, color: "#f87171", text: "text-red-400", hover: "hover:border-red-500/30" },
    ];
    const gap = 6;
    const arcs = segments.reduce<{ label: string; color: string; length: number; offset: number }[]>((acc, s) => {
        const start = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].length + gap : 0;
        const length = Math.max((s.count / stats.totalSolved) * CIRCUMFERENCE - gap, 2);
        return [...acc, { label: s.label, color: s.color, length, offset: start }];
    }, []);

    return (
        <section id="stats" className="py-20 md:py-28 px-4 max-w-7xl mx-auto flex flex-col items-center gap-8 relative">
            <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

            <div className="mb-4 md:mb-8 text-center">
                <SectionHeading kicker="Proof" accent="Numbers">By the</SectionHeading>
            </div>

            {/* LeetCode Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-4xl relative"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-400/10 blur-[60px] rounded-3xl" />

                <div className="glow-card rounded-3xl p-8 md:p-12 overflow-hidden group">
                    <div className="flex flex-col md:flex-row gap-12 items-center">

                        {/* Left: Circle Graph */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <svg viewBox="0 0 192 192" className="w-full h-full transform -rotate-90" role="img" aria-label={`${stats.totalSolved} LeetCode problems solved: ${stats.easy} easy, ${stats.medium} medium, ${stats.hard} hard`}>
                                {/* Background Circle */}
                                <circle cx="96" cy="96" r={RADIUS} stroke="#161a2e" strokeWidth="12" fill="none" />
                                {/* each arc draws itself in, one after the other */}
                                {arcs.map((arc, i) => (
                                    <motion.circle
                                        key={arc.label}
                                        cx="96" cy="96" r={RADIUS}
                                        stroke={arc.color}
                                        strokeWidth="12"
                                        fill="none"
                                        strokeDashoffset={-arc.offset}
                                        initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
                                        whileInView={{ strokeDasharray: `${arc.length} ${CIRCUMFERENCE - arc.length}` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 + i * 0.25 }}
                                    />
                                ))}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <span className="text-4xl font-bold font-heading"><CountUp value={stats.totalSolved} /></span>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Solved</span>
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="flex-1 w-full relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                                        <span className="text-glow">LeetCode</span> Profile
                                    </h3>
                                    <p className="text-gray-400 text-sm">Consistent problem solver & algorithm enthusiast</p>
                                </div>
                                <a
                                    href={`https://leetcode.com/u/${stats.username}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open LeetCode profile"
                                    className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {segments.map((s) => (
                                    <div key={s.label} className={`p-4 rounded-2xl bg-white/5 border border-white/5 text-center transition-colors ${s.hover}`}>
                                        <div className={`${s.text} font-bold mb-1`}><CountUp value={s.count} /></div>
                                        <div className="text-[11px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-pink-400" />
                                    <span>{stats.medium + stats.hard} medium &amp; hard</span>
                                </div>
                                {stats.contestRating !== null && (
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-purple-400" />
                                        <span>Contest rating {stats.contestRating.toLocaleString("en-US")}</span>
                                    </div>
                                )}
                                <span className="text-gray-600">updated {stats.asOf}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* GitHub at a glance: fetched at build time, refreshed daily */}
            {githubStats && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="glow-card w-full max-w-4xl rounded-3xl p-8 md:p-12"
                >
                    <div className="flex items-start justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                                <span className="text-glow">GitHub</span> at a glance
                            </h3>
                            <p className="text-gray-500 text-sm">Live from the GitHub API · updated {githubStats.asOf}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-4xl font-bold font-heading text-white leading-none"><CountUp value={githubStats.publicRepos} /></p>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-2">Public repos</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Top languages */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Top languages</h4>
                            <motion.div
                                className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-5 origin-left"
                                aria-hidden
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            >
                                {githubStats.languages.map((lang) => (
                                    <div key={lang.name} style={{ flexGrow: lang.count, backgroundColor: languageColor(lang.name) }} />
                                ))}
                            </motion.div>
                            <ul className="space-y-2.5">
                                {githubStats.languages.map((lang) => (
                                    <li key={lang.name} className="flex items-center gap-3 text-sm">
                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: languageColor(lang.name) }} />
                                        <span className="text-gray-300">{lang.name}</span>
                                        <span className="ml-auto text-gray-500 font-mono text-xs">
                                            {lang.count} {lang.count === 1 ? "repo" : "repos"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Latest pushes */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Latest pushes</h4>
                            <ul className="space-y-1">
                                {githubStats.recent.map((repo) => (
                                    <li key={repo.name}>
                                        <a
                                            href={repo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/repo flex items-center gap-3 -mx-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            <GitBranch className="w-4 h-4 text-gray-600 group-hover/repo:text-purple-400 transition-colors flex-shrink-0" />
                                            <span className="text-gray-200 group-hover/repo:text-white text-sm font-medium truncate">{repo.name}</span>
                                            <span className="ml-auto text-gray-500 font-mono text-xs whitespace-nowrap">{repo.pushedAt}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* GitHub Contribution Calendar */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-4xl relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 blur-[40px] rounded-3xl" />

                <div className="glow-card rounded-3xl p-8 md:p-12 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                <span className="text-glow">GitHub</span> Contributions
                            </h3>
                            <p className="text-gray-500 text-sm">@{github}</p>
                        </div>
                        <a
                            href={`https://github.com/${github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open GitHub profile"
                            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <GitHubCalendar
                            username={github}
                            colorScheme="dark"
                            blockSize={14}
                            blockMargin={5}
                            fontSize={14}
                            theme={{
                                dark: ['#161b22', '#3b1f6e', '#6d28d9', '#a855f7', '#c084fc']
                            }}
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
