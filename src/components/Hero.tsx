
"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Download, Mail } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
            {/* Spotlight Effect - Colorful */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[800px] h-[500px] bg-purple-500/[0.1] blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-0 right-1/4 translate-x-1/2 w-[800px] h-[500px] bg-pink-500/[0.1] blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-blue-500/[0.1] blur-[100px] rounded-full pointer-events-none -z-10" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                            delayChildren: 0.3,
                        },
                    },
                }}
                className="relative z-10 max-w-5xl"
            >
                <motion.div
                    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    className="mb-8 flex justify-center"
                >
                    <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur-md flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Available for immediate joining
                    </span>
                </motion.div>

                <motion.h2
                    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    className="text-xl md:text-2xl font-medium text-gray-400 mb-6 tracking-wide"
                >
                    Hello, I&apos;m
                </motion.h2>

                <motion.h1
                    variants={{ hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    className="text-5xl md:text-[10rem] font-bold font-heading mb-8 tracking-tighter leading-none"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Yash
                    </span>
                    <br className="md:hidden" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">
                        Srivastava
                    </span>
                </motion.h1>

                <motion.p
                    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    className="text-xl md:text-3xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
                >
                    <span className="text-white font-medium">{portfolioData.personal.title.split("|")[0].trim()}</span>
                    <span className="mx-3 text-purple-500">|</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">{portfolioData.personal.title.split("|")[1].trim()}</span>
                </motion.p>

                <motion.div
                    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center"
                >
                    <a
                        href={portfolioData.personal.resume}
                        target="_blank"
                        className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center gap-2 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform relative z-10" />
                        <span className="relative z-10">Download Resume</span>
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-lg transition-all backdrop-blur-sm flex items-center gap-2 group"
                    >
                        <Mail className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                        Contact Me
                    </a>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent" />
            </motion.div>
        </section>
    );
}
