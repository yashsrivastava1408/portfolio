
"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Copy, Mail, Check } from "lucide-react";
import Globe from "./Globe";
import { useState } from "react";

export default function ContactBento() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(portfolioData.personal.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="contact" className="py-24 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
            >
                <h2 className="text-5xl font-bold font-heading text-white mb-2">Get In Touch</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                {/* Globe Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="col-span-1 md:col-span-1 bg-[#0A0A0A] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col justify-between p-8 group"
                >
                    <div className="relative z-10">
                        <h3 className="text-3xl font-heading text-white leading-tight mb-4">
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
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                    {/* Collaboration Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center text-center"
                    >
                        <div className="absolute inset-0 bg-primary/5 blur-[100px]" />

                        <div className="relative z-10 w-full flex items-center justify-center mb-8">
                            {/* Abstract Connection Visual */}
                            <div className="relative w-full max-w-md h-24 flex items-center justify-between px-10">
                                <div className="w-16 h-16 rounded-full border-2 border-white/10 bg-black flex items-center justify-center z-10">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                </div>
                                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                <div className="w-20 h-20 rounded-full border-2 border-primary/50 bg-[#111] flex items-center justify-center z-20 shadow-[0_0_30px_rgba(109,40,217,0.3)]">
                                    <img src="/profile.jpg" className="w-full h-full object-cover rounded-full opacity-80 opacity-indicator" alt="User" />
                                </div>

                                <div className="w-16 h-16 rounded-full border-2 border-white/10 bg-black flex items-center justify-center z-10">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-sm tracking-widest text-gray-500 mb-2 uppercase">Collaboration</h3>
                        <p className="text-xl text-white font-medium max-w-sm">I prioritize client collaboration, fostering open communication</p>
                    </motion.div>

                    {/* CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex-shrink-0 h-48 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div className="text-center md:text-left">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 mx-auto md:mx-0 text-primary">
                                <Mail className="w-5 h-5" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">Let&apos;s work together</h3>
                            <p className="text-gray-400 text-sm">Have a project in mind?</p>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="group flex items-center gap-3 px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                        >
                            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400 group-hover:text-white" />}
                            <span className="text-gray-300 group-hover:text-white font-mono text-sm">{portfolioData.personal.email}</span>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Marquee */}
            <div className="mt-20 border-t border-white/5 pt-10 overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

                <div className="flex whitespace-nowrap animate-marquee">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="text-6xl md:text-8xl font-black text-white/5 mx-8 uppercase">
                            The Inside Scoop
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
