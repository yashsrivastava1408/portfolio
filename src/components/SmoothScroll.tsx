"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

// Slow start and slow stop for long jumps between sections.
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        // Respect the OS setting: no smoothing, native scroll only.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Lerp-based smoothing glides continuously toward the target, so quick wheel ticks
        // blend into one motion instead of restarting a timed ease on every tick.
        const lenisInstance = new Lenis({
            lerp: 0.1,
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            // touch screens keep native momentum scrolling, which is already the smoothest option
            syncTouch: false,
        });

        // On phones the address bar showing/hiding fires resize; do not rebuild the pinned hero for that.
        ScrollTrigger.config({ ignoreMobileResize: true });

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

    // One place that handles every in-page link (#about, #contact, "#" = top),
    // so the navbar, footer and hero buttons all scroll the same way.
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
            if (!link) return;

            const hash = link.getAttribute("href") ?? "#";
            const target = hash === "#" ? null : document.getElementById(hash.slice(1));
            if (hash !== "#" && !target) return;

            e.preventDefault();
            if (lenis) {
                lenis.start();
                lenis.scrollTo(target ?? 0, { duration: 1.6, easing: easeInOutCubic });
            } else if (target) {
                target.scrollIntoView();
            } else {
                window.scrollTo(0, 0);
            }
        };

        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, [lenis]);

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    );
}
