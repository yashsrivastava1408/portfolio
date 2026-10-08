"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { heroMusic, HERO_MUSIC_SERVER_STATE } from "@/lib/heroMusic";

/** Sound on/off for the hero's rock loop. Browsers need one click or tap before any sound can play. */
export default function HeroSound() {
    const { muted, unlocked } = useSyncExternalStore(heroMusic.subscribe, heroMusic.getState, () => HERO_MUSIC_SERVER_STATE);

    useEffect(() => {
        heroMusic.arm();
    }, []);

    const on = unlocked && !muted;
    const label = !unlocked ? "Turn sound on" : muted ? "Unmute music" : "Mute music";

    return (
        <button
            type="button"
            onClick={heroMusic.toggleMuted}
            aria-label={label}
            aria-pressed={on}
            title={label}
            className="pointer-events-auto flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 text-[11px] uppercase tracking-[0.2em] text-gray-300 backdrop-blur transition-colors hover:border-white/40 hover:text-white"
        >
            {on ? <Volume2 className="h-4 w-4 text-cyan-300" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline">{!unlocked ? "Tap for sound" : muted ? "Sound off" : "Sound on"}</span>
        </button>
    );
}
