"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Download } from "lucide-react";
import Image from "next/image";
import MusicWidget from "./MusicWidget";

export default function About() {
    // Counted from the data file, so these never drift from what the page shows.
    const stats = [
        { value: portfolioData.experience.length, label: "Internships & roles" },
        { value: `${portfolioData.projects.length}+`, label: "Projects built" },
        { value: `${portfolioData.leetcode.totalSolved}`, label: "LeetCode solved" },
    ];

    return (
        <section
            id="about"
            className="py-24 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24"
        >
            {/* Left: Profile Card */}
            <motion.div
                className="w-full max-w-md relative"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Profile Card Wrapper */}
                <div className="relative">
                    {/* White Card */}
                    <div className="bg-white rounded-[40px] p-6 pb-12 text-center text-black relative z-10 overflow-hidden shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-500 origin-bottom-right">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 left-0 w-32 h-32 border-2 border-dashed border-purple-500/50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
                        <div className="absolute bottom-0 right-0 w-40 h-40 border-2 border-dashed border-pink-500/50 rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />

                        {/* Image */}
                        <div className="relative w-full aspect-[4/5] rounded-[30px] overflow-hidden mb-8 bg-[#1a1a1a] flex items-center justify-center">
                            {/* Initials sit behind the photo and show only if it fails to load */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white font-black text-6xl">
                                YS
                            </div>
                            <Image
                                src="/yash.jpg"
                                alt="Yash Srivastava"
                                fill
                                sizes="(max-width: 768px) 90vw, 400px"
                                className="object-cover origin-[52%_92%] scale-[1.45] grayscale hover:grayscale-0 transition-[filter] duration-500"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay pointer-events-none" />
                        </div>

                        <h3 className="text-3xl font-heading font-bold mb-2">
                            {portfolioData.personal.name}
                        </h3>

                        <div className="flex justify-center mb-6">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                <span className="font-bold text-xs">YS</span>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed px-4">
                            Full Stack Developer &<br />DevSecOps Enthusiast
                        </p>
                    </div>

                    {/* Background Card */}
                    <div className="absolute inset-0 bg-gray-800 rounded-[40px] rotate-3 translate-x-4 translate-y-4 -z-10" />
                </div>

                {/* 🎧 Music Widget (VISIBLE & CENTERED) */}
                <div className="mt-10 flex justify-center relative z-20">
                    <MusicWidget />
                </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
                <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-2 font-heading tracking-tighter">
                    About
                </h2>
                <h2
                    className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-[0.9] mb-8 font-heading tracking-tighter"
                    style={{ WebkitTextStroke: "2px #333" }}
                >
                    Me
                </h2>

                <p className="text-gray-400 text-lg mb-12 max-w-xl leading-relaxed">
                    {portfolioData.personal.description}
                </p>

                {/* Education */}
                <div className="mb-12">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Education</h3>
                    {portfolioData.education.map((edu, index) => (
                        <div key={index} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div>
                                <h4 className="text-xl font-bold text-white max-w-md">{edu.institution}</h4>
                                <p className="text-gray-400 mt-1">{edu.degree}</p>
                            </div>
                            <div className="text-right md:text-right">
                                <p className="text-purple-400 font-mono text-sm">{edu.period}</p>
                                <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">{edu.location}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 md:gap-8 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest max-w-[9rem]">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                    <a
                        href="#contact"
                        className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Hire Me
                    </a>
                    <a
                        href={portfolioData.personal.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-xl font-bold hover:bg-white/20 transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        View Resume
                    </a>
                </div>
            </motion.div>
        </section>
    );
}