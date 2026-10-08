"use client";

import { motion } from "framer-motion";
import { portfolioData, type ProjectCategory } from "@/data/portfolio";
import { Github, ExternalLink, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SectionHeading from "./SectionHeading";

const colors = [
    "from-pink-500 to-rose-500", // Pink
    "from-purple-600 to-indigo-600", // Purple
    "from-blue-500 to-cyan-500", // Blue
    "from-emerald-500 to-teal-500", // Green
    "from-amber-500 to-orange-600", // Amber
];

// How many of the smaller cards show before "Show all".
const INITIAL_MORE = 6;

export default function Projects() {
    const featuredProjects = portfolioData.projects.filter((p) => p.featured);
    const moreProjects = portfolioData.projects.filter((p) => !p.featured);
    const [showAll, setShowAll] = useState(false);
    const [filter, setFilter] = useState<ProjectCategory | "All">("All");

    // Only offer filters that actually match something, in a fixed order.
    const filters = (["AI", "DevOps", "Full-stack", "IoT"] as const).filter((c) =>
        moreProjects.some((p) => p.categories.includes(c)),
    );
    const filtered = filter === "All" ? moreProjects : moreProjects.filter((p) => p.categories.includes(filter));
    // A chosen filter shows every match; "All" keeps the short list until "Show all" is pressed.
    const visibleMore = showAll || filter !== "All" ? filtered : filtered.slice(0, INITIAL_MORE);

    return (
        <section id="projects" className="py-20 md:py-28 px-4 max-w-7xl mx-auto relative">
            {/* Section Divider */}
            <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

            <div className="mb-16 md:mb-20 text-center">
                <SectionHeading kicker="Projects" accent="Work">Curated</SectionHeading>
            </div>

            <div className="flex flex-col gap-20 md:gap-24">
                {featuredProjects.map((project, index) => {
                    const colorGradient = colors[index % colors.length];

                    return (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="grid lg:grid-cols-2 gap-12 items-center group"
                        >
                            {/* Project Card */}
                            <a
                                href={project.liveUrl ?? project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${project.title}`}
                                className={`relative block rounded-3xl p-8 md:p-12 overflow-hidden bg-gradient-to-br ${colorGradient} shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-700 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                            >
                                <div className="absolute top-4 right-4 text-white/80 z-20">
                                    <ArrowRight className="w-8 h-8 -rotate-45" />
                                </div>

                                <p className="text-2xl font-bold text-white mb-2 leading-tight max-w-xs relative z-20">{project.tagline}</p>

                                {/* Browser Mockup */}
                                <div className="mt-12 relative rounded-t-xl bg-[#0a0a0a] border-t-4 border-x-4 border-[#1a1a1a] shadow-2xl translate-y-4 group-hover:translate-y-2 transition-transform duration-500 overflow-hidden">
                                    {/* Mock Browser Header */}
                                    <div className="h-8 bg-[#1a1a1a] flex items-center px-4 gap-2 z-20 relative">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <div className="ml-4 h-4 max-w-[60%] bg-[#2a2a2a] rounded-full text-[8px] text-gray-500 flex items-center px-2">
                                            <span className="truncate">{(project.liveUrl ?? project.link).replace("https://", "")}</span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="h-48 md:h-64 bg-[#050505] relative w-full group-hover:scale-105 transition-transform duration-700">
                                        {project.image ? (
                                            <Image
                                                src={project.image}
                                                alt={`${project.title} screenshot`}
                                                fill
                                                sizes="(max-width: 1024px) 90vw, 560px"
                                                className="object-cover object-top"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden p-6">
                                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br ${colorGradient} opacity-20 blur-[80px] rounded-full`} />
                                                <p className="text-3xl font-heading font-bold text-white relative z-10">{project.title}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </a>

                            {/* Project Details */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className={`h-1 w-12 bg-gradient-to-r ${colorGradient}`} />
                                    <h3 className="text-4xl font-heading font-bold text-white">{project.title}</h3>
                                </div>

                                <p className="text-lg text-gray-400 leading-relaxed">
                                    {project.description}
                                </p>

                                {project.highlights && (
                                    <ul className="space-y-3">
                                        {project.highlights.map((highlight) => (
                                            <li key={highlight} className="flex items-start gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colorGradient} mt-2 flex-shrink-0`} />
                                                <p className="text-gray-300 text-sm">{highlight}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300 font-mono flex items-center gap-2">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-6 pt-4">
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white border-b border-transparent hover:border-white transition-colors py-2">
                                        <Github className="w-4 h-4" /> View Source
                                    </a>
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white border-b border-transparent hover:border-white transition-colors py-2">
                                            <ExternalLink className="w-4 h-4" /> Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* More projects */}
            <div className="mt-24">
                <div className="flex items-end justify-between gap-4 mb-10">
                    <div>
                        <h3 className="text-3xl md:text-4xl font-heading font-bold text-white">More builds</h3>
                        <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">
                            Hackathons, systems work and experiments
                        </p>
                    </div>
                    <span className="text-gray-600 text-sm font-mono hidden sm:block" aria-live="polite">
                        {filter === "All" ? `${moreProjects.length} projects` : `${filtered.length} of ${moreProjects.length}`}
                    </span>
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter projects by type">
                    {(["All", ...filters] as const).map((option) => (
                        <button
                            key={option}
                            onClick={() => setFilter(option)}
                            aria-pressed={filter === option}
                            className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-colors duration-300
                                ${filter === option
                                    ? "btn-glow border-transparent"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                                }`}
                        >
                            {option}
                            <span className={`ml-2 font-mono ${filter === option ? "text-white/70" : "text-gray-600"}`}>
                                {option === "All" ? moreProjects.length : moreProjects.filter((p) => p.categories.includes(option)).length}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleMore.map((project, index) => (
                        <motion.article
                            key={`${filter}-${project.title}`}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: (index % 3) * 0.06 }}
                            className="glow-card group flex flex-col rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h4 className="text-xl font-bold text-white leading-snug">{project.title}</h4>
                                <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors flex-shrink-0 mt-1" />
                            </div>
                            <p className="text-sm text-cyan-200/80 mb-3">{project.tagline}</p>
                            <p className="text-sm text-gray-400 leading-relaxed mb-5">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mt-auto mb-5">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] text-gray-400 font-mono">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-5 text-sm">
                                {/* the ::after stretches this link over the whole card */}
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors after:absolute after:inset-0 after:rounded-2xl">
                                    <Github className="w-4 h-4" /> Source
                                </a>
                                {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                        <ExternalLink className="w-4 h-4" /> Live
                                    </a>
                                )}
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                    {filter === "All" && moreProjects.length > INITIAL_MORE && (
                        <button
                            onClick={() => setShowAll((v) => !v)}
                            aria-expanded={showAll}
                            className="px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all text-sm font-medium tracking-widest uppercase"
                        >
                            {showAll ? "Show fewer" : `Show all ${moreProjects.length}`}
                        </button>
                    )}
                    <a href={`https://github.com/${portfolioData.personal.github}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all text-sm font-medium tracking-widest uppercase">
                        All repos on GitHub <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
