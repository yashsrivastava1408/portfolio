"use client";

import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { useState, useRef, useEffect } from "react";
import { useLenis } from "./SmoothScroll";



export default function Experience() {
    const [activeIndex, setActiveIndex] = useState(0);
    const experiences = portfolioData.experience;
    const lenis = useLenis();

    const containerRef = useRef<HTMLElement>(null);

    // 🔒 true = scrolling disabled until user stops
    const canScroll = useRef(true);

    // ⏱ detects scroll idle
    const wheelIdleTimeout = useRef<number | null>(null);

    // 🔄 Sync active index to ref for stable event listener
    const activeIndexRef = useRef(activeIndex);
    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            if (!containerRef.current || !containerRef.current.contains(e.target as Node)) return;

            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;
            const isAtEnd = activeIndexRef.current === experiences.length - 1;
            const isAtStart = activeIndexRef.current === 0;

            // ✅ Pass through: Unlock Lenis & Let page scroll
            if ((isScrollingDown && isAtEnd) || (isScrollingUp && isAtStart)) {
                lenis?.start();
                return;
            }

            // ⛔️ Lock: Stop Lenis & Handle locally
            lenis?.stop();
            e.preventDefault();

            // If scrolling is locked, just reset idle timer
            if (!canScroll.current) {
                if (wheelIdleTimeout.current) {
                    window.clearTimeout(wheelIdleTimeout.current);
                }

                wheelIdleTimeout.current = window.setTimeout(() => {
                    canScroll.current = true;
                }, 300);

                return;
            }

            // 🚀 FIRST intentional scroll
            canScroll.current = false;

            if (e.deltaY > 0) {
                setActiveIndex(prev => Math.min(prev + 1, experiences.length - 1));
            } else if (e.deltaY < 0) {
                setActiveIndex(prev => Math.max(prev - 1, 0));
            }

            // Unlock ONLY after wheel fully stops
            wheelIdleTimeout.current = window.setTimeout(() => {
                canScroll.current = true;
            }, 300);
        };

        const element = containerRef.current;
        if (element) {
            element.addEventListener("wheel", handleScroll, { passive: false });
        }

        return () => {
            if (element) {
                element.removeEventListener("wheel", handleScroll);
            }
            if (wheelIdleTimeout.current) {
                window.clearTimeout(wheelIdleTimeout.current);
            }
            // Ensure we restart lenis on unmount
            lenis?.start();
        };
    }, [experiences.length, lenis]);

    return (
        <section
            ref={containerRef}
            onMouseLeave={() => lenis?.start()}
            className="py-32 px-4 relative max-w-7xl mx-auto overflow-hidden min-h-[800px] flex items-center justify-center"
        >
            <div className="flex flex-col md:flex-row items-center justify-center w-full gap-16 md:gap-32 relative z-10">

                {/* Left: Dial */}
                <div className="relative w-[300px] h-[600px] md:w-[400px] flex-shrink-0 flex items-center justify-center">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 opacity-40 translate-x-[50%]" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border-2 border-dashed border-white/10 opacity-30 translate-x-[50%]" />

                    {/* Active Node */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[14px] w-12 h-12 rounded-full border border-accent bg-accent/20 shadow-[0_0_30px_var(--color-accent)] z-20 flex items-center justify-center backdrop-blur-md">
                        <div className="w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_var(--color-accent)]" />
                    </div>

                    {/* Rotating Nodes */}
                    <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full translate-x-[50%] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                        style={{
                            transform: `translateX(50%) translateY(-50%) rotate(${activeIndex * -45}deg)`
                        }}
                    >
                        {experiences.map((_, index) => (
                            <div
                                key={index}
                                className="absolute top-1/2 left-1/2 w-full h-0 origin-center"
                                style={{ transform: `rotate(${index * 45}deg)` }}
                            >
                                <motion.button
                                    onClick={() => setActiveIndex(index)}
                                    className={`absolute right-0 -top-5 w-10 h-10 -mr-5 rounded-full border flex items-center justify-center transition-all duration-300
                                        ${index === activeIndex
                                            ? "bg-black border-accent scale-110 z-30"
                                            : "bg-black/80 border-white/10 hover:border-white/40"
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-accent" : "bg-gray-600"}`} />
                                </motion.button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 max-w-xl relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-6xl font-black text-white/5 font-heading absolute -left-12 -top-10 select-none">
                                    0{activeIndex + 1}
                                </span>
                                <div className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                                    {experiences[activeIndex].period}
                                </div>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                {experiences[activeIndex].role}
                            </h2>
                            <div className="flex items-center gap-3 mb-8">
                                {/* Company Logo */}
                                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
                                    {experiences[activeIndex].logo ? (
                                        <img
                                            src={experiences[activeIndex].logo}
                                            alt={experiences[activeIndex].company}
                                            className="w-full h-full object-contain p-1"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <span className={`text-white/60 font-bold text-sm ${experiences[activeIndex].logo ? 'hidden' : ''}`}>
                                        {experiences[activeIndex].company.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                    </span>
                                </div>
                                <h3 className="text-xl text-gray-400 font-light">
                                    {experiences[activeIndex].company}
                                </h3>
                            </div>

                            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
                                <p className="text-base md:text-lg text-gray-300 leading-relaxed font-light">
                                    {experiences[activeIndex].description}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}