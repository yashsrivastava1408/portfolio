"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Music, Play, Pause, SkipForward, SkipBack } from "lucide-react";

const PLAYLIST = [
    {
        title: "On Top",
        artist: "Karan Aujla",
        album: "Single",
        art: "/music/on-top.jpg",
        color: "bg-red-500"
    },
    {
        title: "At Peace",
        artist: "Karan Aujla",
        album: "Single",
        art: "/music/at-peace.jpg",
        color: "bg-amber-700"
    }
];

export default function MusicWidget() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % PLAYLIST.length);
        setProgress(0);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        setCurrentIndex(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
        setProgress(0);
        setIsPlaying(true);
    };

    // Simulate progress
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setProgress(prev => (prev >= 100 ? 0 : prev + 1));
        }, 300);

        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        if (progress >= 100) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            handleNext();
        }
    }, [progress]);

    const currentSong = PLAYLIST[currentIndex];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-50 w-full max-w-sm mx-auto mt-12 group"
        >
            {/* Glass Container */}
            <div className="relative overflow-hidden rounded-[32px] bg-black/40 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">

                {/* Background Blur */}
                <div className="absolute inset-0 -z-10 opacity-30 blur-2xl transition-colors duration-1000">
                    <Image
                        src={currentSong.art}
                        alt="Background Blur"
                        fill
                        className="object-cover"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6 text-white/50 text-xs font-bold tracking-widest uppercase">
                    <div className="flex items-center gap-2">
                        <Music className="w-3 h-3" />
                        <span>Apple Music</span>
                    </div>

                    {/* Equalizer */}
                    <div className="flex gap-[2px] h-3 items-end">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: isPlaying ? [4, 12, 6, 12] : 4 }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: i * 0.1
                                }}
                                className="w-[3px] bg-white/80 rounded-full"
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex gap-5 items-center">
                    {/* Album Art */}
                    <motion.div
                        animate={{
                            scale: isPlaying ? 1 : 0.95,
                            rotate: isPlaying ? 360 : 0
                        }}
                        transition={{
                            rotate: { duration: 10, ease: "linear", repeat: Infinity },
                            scale: { duration: 0.2 }
                        }}
                        className="w-24 h-24 rounded-full shadow-2xl flex-shrink-0 border-4 border-black/50 relative overflow-hidden"
                    >
                        <Image
                            src={currentSong.art}
                            alt={currentSong.album}
                            fill
                            className="object-cover"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                        <div className="absolute inset-0 m-auto w-8 h-8 bg-black/80 rounded-full border border-white/10" />
                    </motion.div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSong.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h3 className="text-white font-bold text-xl truncate">
                                    {currentSong.title}
                                </h3>
                                <p className="text-white/60 text-sm truncate font-medium">
                                    {currentSong.artist}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Progress & Controls */}
                <div className="mt-6 flex flex-col gap-3">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white opacity-80"
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear", duration: 0.3 }}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-6 text-white">
                        <button onClick={handlePrev} className="hover:text-white/70">
                            <SkipBack className="w-5 h-5 fill-current" />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95"
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                        </button>

                        <button onClick={handleNext} className="hover:text-white/70">
                            <SkipForward className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}