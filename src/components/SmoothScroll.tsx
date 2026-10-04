"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1, // Optional: tweak for wheel sensitivity
        });

        // keep GSAP ScrollTrigger in step with Lenis' smoothed scroll position
        lenisInstance.on("scroll", ScrollTrigger.update);

        // Synchronize GSAP ticker with Lenis to prevent jitter
        const updateLenis = (time: number) => {
            lenisInstance.raf(time * 1000);
        };
        
        gsap.ticker.add(updateLenis);
        gsap.ticker.lagSmoothing(0); // prevent lag smoothing conflicts

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLenis(lenisInstance);

        return () => {
            gsap.ticker.remove(updateLenis);
            lenisInstance.destroy();
            setLenis(null);
        };
    }, []);

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    );
}
