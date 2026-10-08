"use client";

import { motion, useInView } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Copy, Mail, Check, ExternalLink, Send } from "lucide-react";
import Globe from "./Globe";
import SectionHeading from "./SectionHeading";
import Magnetic from "./Magnetic";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ContactBento() {
    const [copied, setCopied] = useState(false);
    // the big background marquee only moves while it is on screen
    const marqueeRef = useRef<HTMLDivElement>(null);
    const marqueeInView = useInView(marqueeRef, { margin: "200px" });

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(portfolioData.personal.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard blocked: fall back to opening the mail app
            window.location.href = `mailto:${portfolioData.personal.email}`;
        }
    };

    const socialLinks = portfolioData.personal.social;

    return (
        <section id="contact" className="py-20 md:py-28 px-4 max-w-7xl mx-auto relative">
            <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            >
                <SectionHeading kicker="Contact" accent="Touch">Get In</SectionHeading>

                {/* Availability Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">Open to opportunities</span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
                {/* Globe Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glow-card col-span-1 min-h-[360px] lg:min-h-0 rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-8 group"
                >
                    <div className="relative z-10">
                        <h3 className="text-2xl sm:text-3xl font-heading text-white leading-tight mb-4">
                            I&apos;m very flexible with time zone communications
                        </h3>
                        <div className="flex gap-3">
                            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300">🇬🇧 UK</span>
                            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300">🇮🇳 INDIA</span>
                            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300">🇺🇸 USA</span>
                        </div>
                    </div>

                    <div className="absolute inset-0 top-20">
                        <Globe />
                    </div>
                </motion.div>

                {/* Right Column */}
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
                    {/* Collaboration Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glow-card flex-1 rounded-3xl p-8 overflow-hidden flex flex-col items-center justify-center text-center"
                    >
                        <div className="absolute inset-0 bg-primary/5 blur-[100px]" />

                        <div className="relative z-10 w-full flex items-center justify-center mb-8">
                            {/* Abstract Connection Visual */}
                            <div className="relative w-full max-w-md h-24 flex items-center justify-between px-10">
                                <div className="w-16 h-16 rounded-full border-2 border-white/10 bg-black flex items-center justify-center z-10">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                </div>
                                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                <div className="w-20 h-20 rounded-full border-2 border-primary/50 bg-[#111] flex items-center justify-center z-20 shadow-[0_0_30px_rgba(109,40,217,0.3)] relative overflow-hidden">
                                    <Image
                                        src="/profile.jpg"
                                        className="grayscale opacity-80"
                                        alt="Yash Srivastava"
                                        fill
                                        sizes="80px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>

                                <div className="w-16 h-16 rounded-full border-2 border-white/10 bg-black flex items-center justify-center z-10">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-sm tracking-widest text-gray-500 mb-2 uppercase">Collaboration</h3>
                        <p className="text-xl text-white font-medium max-w-sm">I like working in the open: clear updates, honest status, no surprises</p>
                    </motion.div>

                    {/* CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glow-card flex-shrink-0 rounded-3xl p-6 sm:p-8 flex flex-col gap-6"
                    >
                        <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
                            <div className="text-center xl:text-left">
                                <div className="w-10 h-10 bg-purple-500/15 rounded-lg flex items-center justify-center mb-3 mx-auto xl:mx-0 text-purple-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">Let&apos;s work together</h3>
                                <p className="text-gray-400 text-sm">Hiring, or have a project in mind? I reply fast.</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0 w-full sm:w-auto max-w-full">
                                <button
                                    onClick={handleCopy}
                                    aria-label="Copy email address"
                                    className="group flex items-center justify-center gap-3 px-4 sm:px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400 group-hover:text-white" />}
                                    <span className="text-gray-300 group-hover:text-white font-mono text-xs sm:text-sm whitespace-nowrap">{copied ? "Copied!" : portfolioData.personal.email}</span>
                                </button>
                                <Magnetic className="flex">
                                    <a
                                        href={`mailto:${portfolioData.personal.email}`}
                                        className="btn-glow flex flex-1 items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm whitespace-nowrap active:scale-95"
                                    >
                                        <Send className="w-4 h-4" /> Email me
                                    </a>
                                </Magnetic>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4 pt-4 border-t border-white/5">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                                >
                                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                    <span className="text-gray-400 group-hover:text-white text-sm transition-colors">{social.name}</span>
                                    <ExternalLink className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Tech Stack Marquee */}
            <div ref={marqueeRef} className="mt-16 border-t border-white/5 pt-10 overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

                <div className="flex w-max whitespace-nowrap animate-marquee" style={{ animationPlayState: marqueeInView ? "running" : "paused" }} aria-hidden>
                    {[...portfolioData.skills, ...portfolioData.skills].map((skill, i) => (
                        <span key={i} className="text-4xl md:text-6xl font-black text-white/5 mx-6 uppercase">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
