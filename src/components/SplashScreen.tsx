
"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SplashScreen({ finishLoading }: { finishLoading: () => void }) {
    useEffect(() => {
        // Sync with animation duration
        const timeout = setTimeout(() => {
            finishLoading();
        }, 3500); // Slightly longer to let the animation breathe

        return () => clearTimeout(timeout);
    }, [finishLoading]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
        >
            {/* Ambient Glow - Static optimization */}
            <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-40" />

            <div className="relative z-10 flex items-center gap-4 md:gap-8 overflow-hidden">
                {/* Left Text: YASH */}
                <motion.div
                    initial={{ x: "-100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                        duration: 1.2,
                        type: "spring",
                        stiffness: 70,    // Reduced stiffness
                        damping: 20,      // Increased damping for less calculation
                        mass: 0.8         // Lighter mass
                    }}
                    style={{ willChange: "transform" }}
                    className="flex items-center"
                >
                    <span className="text-5xl md:text-8xl font-black font-heading text-white tracking-tighter">
                        YASH
                    </span>
                </motion.div>

                {/* Right Text: SRIVASTAVA */}
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                        duration: 1.2,
                        type: "spring",
                        stiffness: 70,
                        damping: 20,
                        mass: 0.8,
                        delay: 0.1
                    }}
                    style={{ willChange: "transform" }}
                    className="flex items-center"
                >
                    <span className="text-5xl md:text-8xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white tracking-tighter">
                        SRIVASTAVA
                    </span>
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.3 }}
                        className="text-primary text-5xl md:text-8xl font-black ml-1"
                    >
                        .
                    </motion.span>
                </motion.div>
            </div>

            {/* Loading Bar - Simplified */}
            <motion.div
                className="absolute bottom-20 w-64 h-1 bg-white/10 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.2, duration: 3.0, ease: "linear" }}
                    style={{ willChange: "width" }}
                />
            </motion.div>

        </motion.div>
    );
}
