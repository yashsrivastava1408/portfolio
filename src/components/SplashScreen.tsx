"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const SEEN_KEY = "splash-seen";

interface SplashScreenProps {
    /** Fired just before the splash starts fading, so the page underneath can get ready. */
    onReveal?: () => void;
    finishLoading: () => void;
}

export default function SplashScreen({ onReveal, finishLoading }: SplashScreenProps) {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Play the full intro once per tab; refreshes and reduced-motion users go straight in.
        let skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        try {
            if (sessionStorage.getItem(SEEN_KEY)) skip = true;
        } catch {
            // storage can be blocked (private mode); just play the intro
        }
        const done = () => {
            try {
                sessionStorage.setItem(SEEN_KEY, "1");
            } catch {}
            finishLoading();
        };

        if (skip) {
            onReveal?.();
            gsap.to(".splash-container", { opacity: 0, duration: 0.25, ease: "power1.out", onComplete: done });
            return;
        }

        const tl = gsap.timeline({
            onComplete: done
        });

        // initial state for 3D explosion effect
        gsap.set(".letter", {
            z: () => gsap.utils.random(-1500, 1500),
            x: () => gsap.utils.random(-800, 800),
            y: () => gsap.utils.random(-800, 800),
            rotationX: () => gsap.utils.random(-360, 360),
            rotationY: () => gsap.utils.random(-360, 360),
            rotationZ: () => gsap.utils.random(-360, 360),
            opacity: 0,
            scale: () => gsap.utils.random(0.2, 3)
        });

        tl.to(".letter", {
            duration: 1.3,
            z: 0,
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            opacity: 1,
            scale: 1,
            stagger: {
                amount: 0.4,
                from: "random"
            },
            ease: "expo.out",
        })
        .from(".subtitle", {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        }, "-=0.8")
        .to(".loading-bar-progress", {
            width: "100%",
            duration: 1.7,
            ease: "power2.inOut"
        }, 0)
        .call(() => onReveal?.(), undefined, "+=0.1")
        .to(".splash-container", {
            duration: 0.6,
            scale: 1.6,
            opacity: 0,
            ease: "power3.in",
        });

    }, { scope: container });

    const firstName = "YASH".split("");
    const lastName = "SRIVASTAVA".split("");

    return (
        <div ref={container} className="fixed inset-0 z-[150]">
            <div className="splash-container absolute inset-0 flex items-center justify-center bg-[#050505] overflow-hidden" style={{ perspective: 1000 }}>
                {/* Radial Glow Pulse */}
                <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none radial-glow" style={{ background: "radial-gradient(circle, rgba(109,40,217,0.15) 0%, rgba(219,39,119,0.08) 40%, transparent 70%)" }} />

                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

                <div className="relative z-10 flex flex-col items-center gap-3" style={{ transformStyle: "preserve-3d" }}>
                    {/* Name */}
                    <div className="flex flex-col md:flex-row items-center gap-1 md:gap-6" style={{ transformStyle: "preserve-3d" }}>
                        {/* YASH */}
                        <div className="flex" style={{ transformStyle: "preserve-3d" }}>
                            {firstName.map((letter, i) => (
                                <span key={`first-${i}`} className="letter text-5xl md:text-8xl font-black font-heading text-white tracking-tighter inline-block">
                                    {letter}
                                </span>
                            ))}
                        </div>

                        {/* SRIVASTAVA */}
                        <div className="flex" style={{ transformStyle: "preserve-3d" }}>
                            {lastName.map((letter, i) => (
                                <span key={`last-${i}`} className="letter text-5xl md:text-8xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white tracking-tighter inline-block">
                                    {letter}
                                </span>
                            ))}
                            {/* Accent Dot */}
                            <span className="letter text-primary text-5xl md:text-8xl font-black ml-0.5">
                                .
                            </span>
                        </div>
                    </div>

                    {/* Subtitle */}
                    <p className="subtitle text-gray-500 text-xs md:text-sm uppercase tracking-[0.3em] font-light mt-4">
                        Full Stack Developer & DevSecOps
                    </p>
                </div>

                {/* Loading Bar */}
                <div className="absolute bottom-16 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <div className="loading-bar-progress h-full bg-gradient-to-r from-primary to-accent rounded-full w-0" />
                </div>
            </div>
        </div>
    );
}
