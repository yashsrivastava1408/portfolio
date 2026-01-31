"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Download } from "lucide-react";
import Image from "next/image";
import MusicWidget from "./MusicWidget";

export default function About() {
    return (
        <section
            id="about"
            className="py-24 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24"
        >
            {/* Left: Profile Card */}
            {/* Left: Profile Card */}
            <motion.div
                className="w-full max-w-md relative"
            >
                {/* Profile Card Wrapper */}
                <div className="relative">
                    {/* White Card */}
                    <div className="bg-white rounded-[40px] p-6 pb-12 text-center text-black relative z-10 overflow-hidden shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-500 origin-bottom-right">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 left-0 w-32 h-32 border-2 border-dashed border-orange-400 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
                        <div className="absolute bottom-0 right-0 w-40 h-40 border-2 border-dashed border-orange-400 rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />

                        {/* Image */}
                        <div className="relative w-full aspect-[4/5] rounded-[30px] overflow-hidden mb-8 bg-[#1a1a1a] flex items-center justify-center">
                            <Image
                                src="/yash.png"
                                alt="Yash Srivastava"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('fallback-profile');
                                }}
                            />
                            {/* Fallback Initials (Visible if image hidden) */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white font-black text-6xl opacity-0 fallback-opacity">
                                YS
                            </div>
                            <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay pointer-events-none" />
                        </div>

                        <h3 className="text-3xl font-heading font-bold mb-2">
                            {portfolioData.personal.name}
                        </h3>

                        <div className="flex justify-center mb-6">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
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
                className="flex-1"
            >
                <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-2 font-heading tracking-tighter">
                    About
                </h2>
                <h2
                    className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-[0.9] mb-8 font-heading tracking-tighter"
                    style={{ WebkitTextStroke: "2px #333" }}
                >
                    Me
                </h2>

                <p className="text-gray-400 text-lg mb-12 max-w-xl leading-relaxed">
                    {portfolioData.personal.description}
                </p>

                {/* Education */}
                <div className="mb-12">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Education</h3>
                    {portfolioData.education.map((edu, index) => (
                        <div key={index} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div>
                                <h4 className="text-xl font-bold text-white max-w-md">{edu.institution}</h4>
                                <p className="text-gray-400 mt-1">{edu.degree}</p>
                            </div>
                            <div className="text-right md:text-right">
                                <p className="text-orange-400 font-mono text-sm">{edu.period}</p>
                                <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">{edu.location}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                    <div>
                        <h4 className="text-5xl font-bold text-white mb-2">+2</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">
                            Years of<br />Experience
                        </p>
                    </div>
                    <div>
                        <h4 className="text-5xl font-bold text-white mb-2">+15</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">
                            Projects<br />Completed
                        </p>
                    </div>


                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                    <a
                        href="#contact"
                        className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                    >
                        Hire Me
                    </a>
                    <a
                        href={portfolioData.personal.resume}
                        target="_blank"
                        className="px-8 py-4 bg-[#ccff00] text-black rounded-xl font-bold hover:bg-[#b3e600] transition-colors shadow-lg shadow-[#ccff00]/20 flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Download Resume
                    </a>
                </div>
            </motion.div>
        </section>
    );
}