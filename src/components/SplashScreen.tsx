
"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

const letterVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -90 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.5,
            ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
        },
    }),
};

export default function SplashScreen({ finishLoading }: { finishLoading: () => void }) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            finishLoading();
        }, 2200); // Faster — 2.2s total

        return () => clearTimeout(timeout);
    }, [finishLoading]);

    const firstName = "YASH".split("");
    const lastName = "SRIVASTAVA".split("");

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ 
                opacity: 0,
                scale: 1.1,
                filter: "blur(10px)",
                transition: { duration: 0.4, ease: "easeInOut" } 
            }}
        >
            {/* Radial Glow Pulse */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(109,40,217,0.15) 0%, rgba(219,39,119,0.08) 40%, transparent 70%)",
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 1.2, 1], opacity: [0, 0.6, 0.4] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Grid Lines (subtle background texture) */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 flex flex-col items-center gap-3">
                {/* Name with per-character animation */}
                <div className="flex items-center gap-3 md:gap-6 overflow-hidden perspective-1000">
                    {/* YASH */}
                    <div className="flex">
                        {firstName.map((letter, i) => (
                            <motion.span
                                key={`first-${i}`}
                                custom={i}
                                variants={letterVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-5xl md:text-8xl font-black font-heading text-white tracking-tighter inline-block"
                                style={{ willChange: "transform, opacity" }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>

                    {/* SRIVASTAVA */}
                    <div className="flex">
                        {lastName.map((letter, i) => (
                            <motion.span
                                key={`last-${i}`}
                                custom={i + firstName.length}
                                variants={letterVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-5xl md:text-8xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white tracking-tighter inline-block"
                                style={{ willChange: "transform, opacity" }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                        {/* Accent Dot */}
                        <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.3, type: "spring", stiffness: 300 }}
                            className="text-primary text-5xl md:text-8xl font-black ml-0.5"
                        >
                            .
                        </motion.span>
                    </div>
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="text-gray-500 text-xs md:text-sm uppercase tracking-[0.3em] font-light"
                >
                    Full Stack Developer & DevSecOps
                </motion.p>
            </div>

            {/* Loading Bar */}
            <motion.div
                className="absolute bottom-16 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.2, duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ willChange: "width" }}
                />
            </motion.div>

        </motion.div>
    );
}
