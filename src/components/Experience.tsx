"use client";

import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import Image from "next/image";
import { useState, useRef } from "react";
import SectionHeading from "./SectionHeading";

// Degrees between two neighbouring roles on the dial.
const DIAL_STEP = 40;

export default function Experience() {
    const [activeIndex, setActiveIndex] = useState(0);
    const experiences = portfolioData.experience;
    const active = experiences[activeIndex];

    // 📱 Touch swipe tracking
    const touchStartX = useRef(0);

    const go = (index: number) => setActiveIndex(Math.max(0, Math.min(index, experiences.length - 1)));

    // The page scroll is never hijacked here: roles are picked by click, swipe or arrow keys.
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            go(activeIndex + 1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            go(activeIndex - 1);
        }
    };

    return (
        <section
            id="experience"
            className="py-32 px-4 relative max-w-7xl mx-auto overflow-hidden"
        >
            {/* Section Divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="mb-16 text-center relative z-20">
                <SectionHeading accent="Worked">Where I&apos;ve</SectionHeading>
                <p className="text-gray-500 mt-4 text-sm uppercase tracking-widest">
                    {experiences.length} roles across DevOps, software and R&amp;D
                </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center w-full gap-12 md:gap-20 relative z-10">

                {/* Left: Dial (Desktop Only). A wheel centred on the left edge; the active role sits on the rim facing the content. */}
                <div className="relative w-[340px] h-[600px] flex-shrink-0 overflow-hidden hidden md:block">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 opacity-40" />
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border-2 border-dashed border-white/10 opacity-30" />

                    {/* Active Node */}
                    <div className="absolute left-[300px] top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-accent bg-accent/20 shadow-[0_0_30px_var(--color-accent)] z-20 flex items-center justify-center pointer-events-none">
                        <div className="w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_var(--color-accent)]" />
                    </div>

                    {/* Rotating Nodes */}
                    <div
                        className="absolute left-0 top-1/2 w-[600px] h-[600px] rounded-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                        style={{ transform: `translate(-50%, -50%) rotate(${activeIndex * -DIAL_STEP}deg)` }}
                    >
                        {experiences.map((exp, index) => {
                            const angle = (index * DIAL_STEP * Math.PI) / 180;
                            return (
                                <button
                                    key={exp.company}
                                    onClick={() => setActiveIndex(index)}
                                    aria-label={`Show ${exp.role} at ${exp.company}`}
                                    tabIndex={-1}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300
                                        ${index === activeIndex
                                            ? "bg-black border-accent z-30"
                                            : "bg-black/80 border-white/10 hover:border-white/40"
                                        }`}
                                    style={{
                                        left: `${(50 + 50 * Math.cos(angle)).toFixed(3)}%`,
                                        top: `${(50 + 50 * Math.sin(angle)).toFixed(3)}%`,
                                    }}
                                >
                                    <div className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-accent" : "bg-gray-600"}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 max-w-xl relative w-full">
                    {/* Company tabs: every role is one click away */}
                    <div
                        role="tablist"
                        aria-label="Experience"
                        onKeyDown={handleKeyDown}
                        className="flex flex-wrap gap-2 mb-10"
                    >
                        {experiences.map((exp, index) => (
                            <button
                                key={exp.company}
                                role="tab"
                                aria-selected={index === activeIndex}
                                tabIndex={index === activeIndex ? 0 : -1}
                                onClick={() => setActiveIndex(index)}
                                className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-colors duration-300
                                    ${index === activeIndex
                                        ? "bg-accent/15 border-accent/40 text-white"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                                    }`}
                            >
                                {exp.company}
                            </button>
                        ))}
                    </div>

                    <div
                        className="relative min-h-[420px] md:min-h-[400px]"
                        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                        onTouchEnd={(e) => {
                            const diff = touchStartX.current - e.changedTouches[0].clientX;
                            if (Math.abs(diff) > 50) go(activeIndex + (diff > 0 ? 1 : -1));
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                role="tabpanel"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="relative z-10"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-6xl font-black text-white/5 font-heading absolute -left-4 md:-left-12 -top-10 select-none">
                                        0{activeIndex + 1}
                                    </span>
                                    <div className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                                        {active.period}
                                    </div>
                                </div>

                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-2">
                                    {active.role}
                                </h3>
                                <div className="flex items-center gap-3 mb-8">
                                    {/* Company Logo */}
                                    <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden relative">
                                        <span className="text-white/60 font-bold text-sm">
                                            {active.company.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                        </span>
                                        {active.logo ? (
                                            <Image
                                                src={active.logo}
                                                alt=""
                                                fill
                                                sizes="40px"
                                                className="object-contain p-1 bg-[#1a1a1a]"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                        ) : null}
                                    </div>
                                    <p className="text-xl text-gray-400 font-light">
                                        {active.company}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                                    <p className="text-base md:text-lg text-gray-300 leading-relaxed font-light">
                                        {active.description}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mobile Navigation: Prev/Next + Dots */}
                    <div className="flex items-center justify-center gap-6 mt-8 md:hidden">
                        <button
                            onClick={() => go(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                            aria-label="Previous experience"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <div className="flex gap-2">
                            {experiences.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-accent w-6' : 'bg-white/20 hover:bg-white/40'}`}
                                    aria-label={`Go to experience ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => go(activeIndex + 1)}
                            disabled={activeIndex === experiences.length - 1}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                            aria-label="Next experience"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
