"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";
import { useState, useCallback, useEffect } from "react";
import { useLenis } from "./SmoothScroll";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
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
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const lenis = useLenis();

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const goNext = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex + 1) % gallery.length);
    }, [lightboxIndex, gallery.length]);

    const goPrev = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
    }, [lightboxIndex, gallery.length]);

    // Keyboard navigation
    useEffect(() => {
        if (lightboxIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };

        document.addEventListener("keydown", handleKeyDown);
        // freeze the page (native and Lenis) while the lightbox is open
        document.body.style.overflow = "hidden";
        lenis?.stop();

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
            lenis?.start();
        };
    }, [lightboxIndex, goNext, goPrev, lenis]);

    if (!gallery || gallery.length === 0) return null;

    return (
        <section id="gallery" className="py-32 bg-background relative z-10">
            {/* Section Divider */}
            <div className="w-full max-w-lg mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-32" />

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
                        VISUAL <span className="italic font-cursive font-light text-gray-500 underline decoration-1 underline-offset-8">CHRONICLE</span>
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
                        <motion.button
                            type="button"
                            key={item.id}
                            variants={itemVariants}
                            aria-label={`Open photo: ${item.title}`}
                            className="relative group block w-full text-left break-inside-avoid rounded-lg overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
                            onClick={() => openLightbox(index)}
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
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                                />

                                {/* High Contrast Overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-700" />

                                {/* View indicator on hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                                    <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                {/* Label */}
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
                        </motion.button>
                    ))}
                </motion.div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={gallery[lightboxIndex].title}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            aria-label="Close photo"
                            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation Arrows */}
                        <button
                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            aria-label="Previous photo"
                            className="absolute left-4 md:left-8 z-50 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            aria-label="Next photo"
                            className="absolute right-4 md:right-8 z-50 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Image + Description */}
                        <motion.div
                            key={lightboxIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative max-w-4xl w-full mx-4 md:mx-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full aspect-[16/10] max-h-[65vh] rounded-2xl overflow-hidden bg-black">
                                <Image
                                    src={gallery[lightboxIndex].imageUrl}
                                    alt={gallery[lightboxIndex].title}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 900px"
                                />
                            </div>

                            {/* Caption */}
                            <div className="mt-6 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {gallery[lightboxIndex].title}
                                </h3>
                                <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
                                    {gallery[lightboxIndex].description}
                                </p>
                                <p className="text-gray-600 text-xs mt-4 uppercase tracking-widest">
                                    {lightboxIndex + 1} / {gallery.length}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
