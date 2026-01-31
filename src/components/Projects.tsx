
"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Github, ExternalLink, ArrowRight, Plus } from "lucide-react";
import Image from "next/image";

export default function Projects() {
    // We'll limit to top 3-4 projects for this "Curated" view as it takes more space
    const featuredProjects = portfolioData.projects.slice(0, 4);

    const colors = [
        "from-pink-500 to-rose-500", // Pink
        "from-purple-600 to-indigo-600", // Purple
        "from-blue-500 to-cyan-500", // Blue
        "from-emerald-500 to-teal-500", // Green
    ];

    return (
        <section id="projects" className="py-32 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-32 text-center"
            >
                <h2 className="text-6xl md:text-8xl text-white font-heading tracking-tight">
                    Curated <span className="font-cursive text-accent italic pr-2 text-pink-500">Work</span>
                </h2>
            </motion.div>

            <div className="flex flex-col gap-32">
                {featuredProjects.map((project, index) => {
                    const colorGradient = colors[index % colors.length];

                    const hasImage = project.image;

                    return (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="grid lg:grid-cols-2 gap-12 items-center group"
                        >
                            {/* Project Card */}
                            <div className={`relative rounded-3xl p-8 md:p-12 overflow-hidden bg-gradient-to-br ${colorGradient} shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-700`}>
                                <div className="absolute top-4 right-4 text-white/80 z-20">
                                    <ArrowRight className="w-8 h-8 -rotate-45" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 leading-tight max-w-xs relative z-20">{project.description}</h3>

                                {/* Browser Mockup */}
                                <div className="mt-12 relative rounded-t-xl bg-[#0a0a0a] border-t-4 border-x-4 border-[#1a1a1a] shadow-2xl translate-y-4 group-hover:translate-y-2 transition-transform duration-500 overflow-hidden">
                                    {/* Mock Browser Header */}
                                    <div className="h-8 bg-[#1a1a1a] flex items-center px-4 gap-2 z-20 relative">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <div className="ml-4 h-4 w-32 bg-[#2a2a2a] rounded-full text-[8px] text-gray-500 flex items-center px-2 truncate">
                                            {project.link}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="h-48 md:h-64 bg-[#050505] relative w-full group-hover:scale-105 transition-transform duration-700">
                                        {hasImage ? (
                                            <Image

                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover object-top"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden p-6">
                                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br ${colorGradient} opacity-20 blur-[80px] rounded-full`} />
                                                <h4 className="text-3xl font-heading font-bold text-white relative z-10">{project.title}</h4>
                                                <div className="mt-4 px-4 py-1 rounded border border-white/10 text-xs text-gray-400 bg-white/5 relative z-10">
                                                    v1.0.0
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className={`h-1 w-12 bg-gradient-to-r ${colorGradient}`} />
                                    <h3 className="text-4xl font-heading font-bold text-white">{project.title}</h3>
                                </div>

                                <p className="text-lg text-gray-400 leading-relaxed">
                                    A platform designed to solve real-world problems. {project.description}
                                    Built with performance and scalability in mind.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Plus className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                                        <p className="text-gray-300">Advanced architecture using modern tech stack.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Plus className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                                        <p className="text-gray-300">Optimized for speed and user experience.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Plus className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                                        <p className="text-gray-300">Secure and scalable backend integration.</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300 font-mono flex items-center gap-2">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <a href={project.link} target="_blank" className="flex items-center gap-2 text-white border-b border-transparent hover:border-white transition-colors pb-1">
                                        <Github className="w-4 h-4" /> View Source
                                    </a>
                                    <a href={project.link} target="_blank" className="flex items-center gap-2 text-white border-b border-transparent hover:border-white transition-colors pb-1">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-32 text-center">
                <a href="https://github.com/yashsrivastava1408" target="_blank" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all text-sm font-medium tracking-widest uppercase">
                    See More Projects <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </section>
    );
}
