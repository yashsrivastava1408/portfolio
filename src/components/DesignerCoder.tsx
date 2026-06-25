"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Download, Mail } from "lucide-react";

export default function DesignerCoder() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center">
            {/* Spotlight Effects */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/[0.08] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[400px] bg-pink-500/[0.08] blur-[120px] rounded-full pointer-events-none" />

            {/* ── Mobile Layout ── */}
            <div className="flex flex-col items-center justify-center md:hidden px-6 py-24 gap-8">
                {/* Profile Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-64 h-80 rounded-[2rem] overflow-hidden border-2 border-white/10 shadow-2xl"
                >
                    <Image
                        src="/profile-hero.jpg"
                        alt="Yash Srivastava"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </motion.div>

                {/* Availability Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur-md flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Available for opportunities
                    </span>
                </motion.div>

                {/* Name */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-5xl font-black font-heading tracking-tighter leading-none mb-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Yash
                        </span>{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500">
                            Srivastava
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        <span className="text-white font-medium">{portfolioData.personal.title.split("|")[0].trim()}</span>
                        <span className="mx-2 text-purple-500">|</span>
                        <span className="text-gray-400">{portfolioData.personal.title.split("|")[1].trim()}</span>
                    </p>
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-col gap-4 w-full max-w-xs"
                >
                    <a
                        href={portfolioData.personal.resume}
                        target="_blank"
                        className="group relative px-6 py-4 rounded-full bg-white text-black font-bold text-base hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Download className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Download Resume</span>
                    </a>
                    <a
                        href="#contact"
                        className="px-6 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-base transition-all backdrop-blur-sm flex items-center justify-center gap-2"
                    >
                        <Mail className="w-5 h-5" />
                        Contact Me
                    </a>
                </motion.div>
            </div>

            {/* ── Desktop Layout ── */}
            <div className="hidden md:flex flex-row w-full h-screen relative">

                {/* Left Side: DevSecOps */}
                <div className="relative flex-1 group h-full overflow-hidden bg-white text-black flex items-center justify-end pr-20 z-10 transition-all duration-500 hover:flex-[1.5]">
                    <div className="text-right z-20">
                        <h2 className="text-9xl font-heading font-black tracking-tighter mb-4 text-[#1a1a1a]">
                            DEVSECOPS
                        </h2>
                        <p className="text-gray-500 max-w-xs ml-auto font-serif italic text-lg leading-relaxed">
                            Engineer focused on system design, problem solving, and building reliable, scalable solutions.
                        </p>
                    </div>

                    {/* Background Art Effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl mix-blend-multiply" />
                        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-multiply" />
                    </div>
                </div>

                {/* Center Image Split */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[70vh] z-30 pointer-events-none">
                    <div className="relative w-full h-full">

                        {/* Left Half */}
                        <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden bg-transparent">
                            <div className="relative w-[500px] h-full -left-0">
                                <Image
                                    src="/profile-hero.jpg"
                                    alt="Profile Art"
                                    fill
                                    className="object-cover object-top grayscale contrast-125 brightness-110"
                                    priority
                                />
                                <div className="absolute inset-0 bg-purple-500/10 mix-blend-color" />
                            </div>
                        </div>

                        {/* Right Half */}
                        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden bg-transparent">
                            <div className="relative w-[500px] h-full -left-[250px]">
                                <Image
                                    src="/profile-hero.jpg"
                                    alt="Profile Code"
                                    fill
                                    className="object-cover object-top"
                                    priority
                                />
                                <div className="absolute inset-0 bg-purple-900/40 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_2px)] bg-[size:100%_4px] opacity-30" />
                            </div>
                        </div>

                        {/* Split Line */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white z-40">
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white px-6 py-2 rounded-full border border-white/20 font-bold tracking-widest text-sm shadow-2xl">
                                YASH SRIVASTAVA
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Full Stack */}
                <div className="relative flex-1 group h-full overflow-hidden bg-[#050505] text-white flex items-center justify-start pl-20 z-10 transition-all duration-500 hover:flex-[1.5]">
                    <div className="text-left z-20 w-fit relative">
                        <h2 className="text-9xl font-mono font-bold tracking-tighter mb-4 text-white">
                            FULL-STACK
                        </h2>
                        <p className="text-gray-400 max-w-xs font-mono text-sm leading-relaxed">
                            Software engineer with experience in DevOps, backend systems, and cloud-native applications.
                        </p>

                        <div className="absolute -z-10 -top-20 -right-40 text-gray-800/10 text-[200px] font-black select-none pointer-events-none">
                            {"{}"}
                        </div>
                    </div>

                    {/* Background Code Effect */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                        <pre className="text-[10px] text-purple-500/30 font-mono p-4">
                            {`function createMagic() {
  const aesthetic = true;
  const performance = 100;
  return aesthetic && performance;
}

while(alive) {
  code();
  design();
}`}
                        </pre>
                    </div>
                </div>

            </div>

            {/* Scroll Indicator (both layouts) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
            >
                <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent" />
            </motion.div>
        </section>
    );
}