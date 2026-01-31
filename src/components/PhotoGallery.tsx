"use client";

import { motion } from "framer-motion";
import { Camera, ImageIcon } from "lucide-react";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 10 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { type: "spring", stiffness: 40, damping: 20 } as const,
    },
};

export default function PhotoGallery() {
    const { gallery } = portfolioData;

    if (!gallery || gallery.length === 0) return null;

    return (
        <section id="gallery" className="py-32 bg-background relative z-10 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-xl border border-white/5 box-content">
                        <Camera className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
                        Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Chronicle</span>
                    </h2>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Snapshots of milestones, team efforts, and technical breakthroughs.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-10 perspectiv-1000"
                >
                    {gallery.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-none"
                        >
                            {/* Card Border Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 p-[1px] rounded-[2rem] z-20">
                                <div className="absolute inset-0 bg-background rounded-[2rem]" />
                            </div>

                            {/* Main Content */}
                            <div className="absolute inset-[1px] rounded-[2rem] overflow-hidden z-20 bg-gray-900">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                                            {item.title}
                                        </h3>
                                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                                            <p className="text-gray-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Icon */}
                                <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-xl p-3 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transform -rotate-12 group-hover:rotate-0 scale-50 group-hover:scale-100 transition-all duration-500">
                                    <ImageIcon className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            {/* Back Glow */}
                            <div className="absolute top-10 left-10 w-full h-full bg-accent/20 blur-[100px] z-0 group-hover:bg-accent/30 transition-colors duration-500" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
