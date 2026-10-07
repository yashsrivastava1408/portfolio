"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";

export default function Testimonials() {
    const { testimonials } = portfolioData;

    // Nothing is shown until real quotes are added to src/data/portfolio.ts.
    if (testimonials.length === 0) return null;

    return (
        <section id="testimonials" className="py-20 md:py-28 px-4 max-w-7xl mx-auto relative">
            <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

            <div className="mb-12 md:mb-16 text-center">
                <SectionHeading kicker="Kind words" accent="Say">What People</SectionHeading>
            </div>

            <div className={`grid gap-6 ${testimonials.length > 1 ? "md:grid-cols-2" : "max-w-3xl mx-auto"}`}>
                {testimonials.map((t, index) => (
                    <motion.figure
                        key={t.name}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                        className="glow-card rounded-3xl p-8 md:p-10"
                    >
                        <Quote className="w-8 h-8 text-purple-400 mb-6" aria-hidden />
                        <blockquote className="text-lg md:text-xl text-gray-200 leading-relaxed font-light">
                            {t.quote}
                        </blockquote>
                        <figcaption className="mt-8 pt-6 border-t border-white/5">
                            {t.url ? (
                                <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">
                                    {t.name}
                                </a>
                            ) : (
                                <span className="text-white font-semibold">{t.name}</span>
                            )}
                            <span className="block text-gray-500 text-sm mt-1">{t.role}</span>
                        </figcaption>
                    </motion.figure>
                ))}
            </div>
        </section>
    );
}
