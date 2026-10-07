
"use client";

import { motion } from "framer-motion";
import { ExternalLink, Trophy, Target } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";
import { portfolioData } from "@/data/portfolio";

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function LeetCode() {
    const stats = portfolioData.leetcode;
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
        <section id="stats" className="py-24 px-4 max-w-7xl mx-auto flex flex-col items-center gap-16">
            {/* LeetCode Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-4xl relative"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-[60px] rounded-3xl" />

                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden group">
                    <div className="flex flex-col md:flex-row gap-12 items-center">

                        {/* Left: Circle Graph */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <svg viewBox="0 0 192 192" className="w-full h-full transform -rotate-90" role="img" aria-label={`${stats.totalSolved} LeetCode problems solved: ${stats.easy} easy, ${stats.medium} medium, ${stats.hard} hard`}>
                                {/* Background Circle */}
                                <circle cx="96" cy="96" r={RADIUS} stroke="#1a1a1a" strokeWidth="12" fill="none" />
                                {arcs.map((arc) => (
                                    <circle
                                        key={arc.label}
                                        cx="96" cy="96" r={RADIUS}
                                        stroke={arc.color}
                                        strokeWidth="12"
                                        fill="none"
                                        strokeDasharray={`${arc.length} ${CIRCUMFERENCE - arc.length}`}
                                        strokeDashoffset={-arc.offset}
                                    />
                                ))}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <span className="text-4xl font-bold font-heading">{stats.totalSolved}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Solved</span>
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="flex-1 w-full relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                                        <span className="text-purple-400">LeetCode</span> Profile
                                    </h2>
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
                                        <div className={`${s.text} font-bold mb-1`}>{s.count}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-pink-400" />
                                    <span>{stats.medium + stats.hard} medium &amp; hard</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-purple-400" />
                                    <span>Contest rating {stats.contestRating.toLocaleString("en-US")}</span>
                                </div>
                                <span className="text-gray-600">as of {stats.asOf}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* GitHub Contribution Calendar */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-4xl relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 blur-[40px] rounded-3xl" />

                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                <span className="text-purple-400">GitHub</span> Contributions
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
