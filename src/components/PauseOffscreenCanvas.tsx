"use client";

import { useEffect } from "react";

/**
 * Stops a react-three-fiber canvas from rendering while it is scrolled out of view,
 * and resumes it when it comes back. The scene itself is not changed in any way:
 * it just stops burning GPU frames behind the rest of the page, which keeps
 * scrolling smooth and the laptop cool.
 */
export default function PauseOffscreenCanvas({ selector }: { selector: string }) {
    useEffect(() => {
        let io: IntersectionObserver | undefined;
        let timer = 0;
        let cancelled = false;

        const attach = async () => {
            const host = document.querySelector(selector);
            const canvas = host?.querySelector("canvas");
            if (!host || !canvas) {
                // the scene is loaded lazily, so keep looking until it is there
                timer = window.setTimeout(attach, 300);
                return;
            }

            // already downloaded with the scene, so this does not add to the first load
            const { _roots } = await import("@react-three/fiber");
            if (cancelled) return;

            io = new IntersectionObserver(
                ([entry]) => {
                    _roots.get(canvas)?.store.getState().setFrameloop(entry.isIntersecting ? "always" : "never");
                },
                { rootMargin: "150px" },
            );
            io.observe(host);
        };
        attach();

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            io?.disconnect();
        };
    }, [selector]);

    return null;
}
