
"use client";

import { motion } from "framer-motion";
import { ExternalLink, Trophy, Target } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";

export default function LeetCode() {
    const stats = {
        totalSolved: 200,
        easy: 70,
        medium: 111,
        hard: 19,
        ranking: "N/A",
        contestRating: 1650,
        username: "Qce4QmSNDd"
    };

    const totalQuestions = 3000;
    const percentage = Math.round((stats.totalSolved / totalQuestions) * 100);

    return (
        <section className="py-24 px-4 max-w-7xl mx-auto flex flex-col items-center gap-16">
            {/* LeetCode Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-4xl relative"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-[60px] rounded-3xl" />

                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden group">
                    <div className="flex flex-col md:flex-row gap-12 items-center">

                        {/* Left: Circle Graph */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                {/* Background Circle */}
                                <circle cx="96" cy="96" r="88" stroke="#1a1a1a" strokeWidth="12" fill="none" />
                                {/* Progress Circle */}
                                <circle
                                    cx="96" cy="96" r="88"
                                    stroke="url(#lc-gradient)"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_10px_rgba(109,40,217,0.5)]"
                                />
                                <defs>
                                    <linearGradient id="lc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#db2777" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <span className="text-4xl font-bold font-heading">{stats.totalSolved}+</span>
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
                                    href={`https://leetcode.com/${stats.username}`}
                                    target="_blank"
                                    className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center hover:border-teal-500/30 transition-colors">
                                    <div className="text-teal-400 font-bold mb-1">{stats.easy}+</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Easy</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center hover:border-yellow-500/30 transition-colors">
                                    <div className="text-yellow-400 font-bold mb-1">{stats.medium}+</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Medium</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center hover:border-red-500/30 transition-colors">
                                    <div className="text-red-400 font-bold mb-1">{stats.hard}+</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Hard</div>
                                </div>
                            </div>

                            {/* Fun Stats */}
                            <div className="flex gap-6 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-purple-400" />
                                    <span>Top 15%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-pink-400" />
                                    <span>Acceptance 68%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* GitHub Contribution Calendar */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-4xl relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 blur-[40px] rounded-3xl" />

                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                <span className="text-purple-400">GitHub</span> Contributions
                            </h3>
                            <p className="text-gray-500 text-sm">@yashsrivastava1408</p>
                        </div>
                        <a
                            href="https://github.com/yashsrivastava1408"
                            target="_blank"
                            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <GitHubCalendar
                            username="yashsrivastava1408"
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
