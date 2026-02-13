"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.215, 0.61, 0.355, 1]
        },
    },
};

export default function PhotoGallery() {
    const { gallery } = portfolioData;

    if (!gallery || gallery.length === 0) return null;

    return (
        <section id="gallery" className="py-32 bg-background relative z-10">
            <div className="container mx-auto px-4 max-w-7xl relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center justify-center p-4 mb-8 rounded-full bg-white/5 border border-white/10">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-6xl md:text-8xl font-bold font-heading mb-8 tracking-tighter">
                        VISUAL <span className="italic font-serif font-light text-gray-500 underline decoration-1 underline-offset-8">CHRONICLE</span>
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed uppercase tracking-widest">
                        Snapshots of the journey.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                >
                    {gallery.map((item, index) => (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            className="relative group break-inside-avoid rounded-lg overflow-hidden bg-zinc-900 border border-white/5"
                        >
                            {/* Grayscale Image Container */}
                            <div className={`relative w-full overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' :
                                    index % 3 === 1 ? 'aspect-square' :
                                        'aspect-[4/5]'
                                }`}>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out group-hover:scale-105"
                                />

                                {/* High Contrast Overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-700" />

                                {/* Label (Always Visible, Minimal) */}
                                <div className="absolute bottom-0 left-0 w-full p-6 text-white z-20">
                                    <div className="flex items-end justify-between translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div>
                                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 mb-1">
                                                0{index + 1}
                                            </p>
                                            <h3 className="text-lg font-bold tracking-tight leading-none uppercase">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Border Glow */}
                            <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors duration-500 pointer-events-none" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
