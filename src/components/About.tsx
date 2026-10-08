"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { ArrowUpRight, Download } from "lucide-react";
import Image from "next/image";
import MusicWidget from "./MusicWidget";
import SectionHeading from "./SectionHeading";
import CountUp from "./CountUp";
import Magnetic from "./Magnetic";

export default function About({ leetcodeSolved }: { leetcodeSolved: number }) {
    // Counted from the data file, so these never drift from what the page shows.
    const stats = [
        { value: portfolioData.experience.length, suffix: "", label: "Internships & roles" },
        { value: portfolioData.projects.length, suffix: "+", label: "Projects built" },
        { value: leetcodeSolved, suffix: "", label: "LeetCode solved" },
    ];

    const { currentlyBuilding } = portfolioData.personal;

    return (
        <section
            id="about"
            className="py-20 md:py-24 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-20 xl:gap-24"
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
                className="w-full min-w-0 max-w-2xl lg:max-w-none lg:flex-1"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
                <SectionHeading kicker="Who I am" accent="Me" className="mb-8">About</SectionHeading>

                <p className="text-gray-400 text-base sm:text-lg mb-12 max-w-xl leading-relaxed">
                    {portfolioData.personal.description}
                </p>

                {/* Currently building */}
                {currentlyBuilding && (
                    <a
                        href={currentlyBuilding.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glow-card group flex items-start gap-3 mb-12 -mt-4 p-4 rounded-2xl max-w-xl"
                    >
                        <span className="relative flex w-2.5 h-2.5 mt-1.5 flex-shrink-0">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />
                            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-green-500" />
                        </span>
                        <span className="text-sm text-gray-300 leading-relaxed">
                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Currently building</span>
                            {currentlyBuilding.text}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors flex-shrink-0 mt-1 ml-auto" />
                    </a>
                )}

                {/* Education */}
                <div className="mb-12">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Education</h3>
                    {portfolioData.education.map((edu, index) => (
                        <div key={index} className="glow-card flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-5 sm:p-6 rounded-2xl">
                            <div>
                                <h4 className="text-xl font-bold text-white max-w-md">{edu.institution}</h4>
                                <p className="text-gray-400 mt-1">{edu.degree}</p>
                            </div>
                            <div className="sm:text-right shrink-0">
                                <p className="text-cyan-300 font-mono text-sm">{edu.period}</p>
                                <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">{edu.location}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-[clamp(1.75rem,9vw,2.25rem)] md:text-5xl font-bold text-white mb-2">
                                <CountUp value={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest max-w-[9rem]">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                    <Magnetic>
                        <a href="#contact" className="btn-glow block px-8 py-4 rounded-xl font-bold">
                            Hire Me
                        </a>
                    </Magnetic>
                    <Magnetic>
                        <a
                            href={portfolioData.personal.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-white/5 text-white border border-white/15 rounded-xl font-bold hover:bg-white/10 hover:border-cyan-300/40 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            View Resume
                        </a>
                    </Magnetic>
                </div>
            </motion.div>
        </section>
    );
}