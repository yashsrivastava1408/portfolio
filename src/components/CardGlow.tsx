"use client";

import { useEffect } from "react";

/**
 * One listener for the whole page: tells whichever `.glow-card` is under the cursor
 * where the cursor is, so its CSS light and border glow can follow it.
 */
export default function CardGlow() {
    useEffect(() => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        let frame = 0;
        let last: PointerEvent | null = null;

        const update = () => {
            frame = 0;
            const card = (last?.target as Element | null)?.closest?.<HTMLElement>(".glow-card");
            if (!card || !last) return;
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${last.clientX - rect.left}px`);
            card.style.setProperty("--my", `${last.clientY - rect.top}px`);
        };

        const onMove = (e: PointerEvent) => {
            last = e;
            if (!frame) frame = requestAnimationFrame(update);
        };

        document.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            document.removeEventListener("pointermove", onMove);
            cancelAnimationFrame(frame);
        };
    }, []);

    return null;
}
