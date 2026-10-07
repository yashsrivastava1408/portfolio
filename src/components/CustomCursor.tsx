"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = 'a, button, [role="button"], .cursor-pointer';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;
        // Mouse-driven devices only; touch screens keep the native behaviour.
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;
        let scale = 1;
        let targetScale = 1;
        let frame = 0;
        let started = false;

        const show = (visible: boolean) => {
            const opacity = visible ? "1" : "0";
            dot.style.opacity = opacity;
            ring.style.opacity = opacity;
        };

        // The loop only runs while the ring is still catching up, then sleeps
        // until the next mouse move. Nothing is drawn while the mouse is idle.
        const animate = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            scale += (targetScale - scale) * 0.2;

            dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
            ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(${scale})`;

            const settled =
                Math.abs(mouseX - ringX) < 0.1 &&
                Math.abs(mouseY - ringY) < 0.1 &&
                Math.abs(targetScale - scale) < 0.01;
            frame = settled ? 0 : requestAnimationFrame(animate);
        };

        const wake = () => {
            if (!frame) frame = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!started) {
                // first move: start the ring under the pointer instead of flying in from the corner
                started = true;
                ringX = mouseX;
                ringY = mouseY;
                show(true);
            }
            const target = e.target as HTMLElement | null;
            targetScale = target?.closest?.(INTERACTIVE) ? 1.5 : 1;
            wake();
        };

        const handleLeave = () => show(false);
        const handleEnter = () => {
            if (started) show(true);
        };

        document.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", handleLeave);
        document.documentElement.addEventListener("mouseenter", handleEnter);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.documentElement.removeEventListener("mouseleave", handleLeave);
            document.documentElement.removeEventListener("mouseenter", handleEnter);
            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <>
            {/* Inner Dot */}
            <div
                ref={dotRef}
                aria-hidden
                className="custom-cursor fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference opacity-0 transition-opacity duration-300"
                style={{ willChange: "transform" }}
            />
            {/* Outer Ring */}
            <div
                ref={ringRef}
                aria-hidden
                className="custom-cursor fixed top-0 left-0 w-10 h-10 border-2 border-white/50 rounded-full pointer-events-none z-[9998] mix-blend-difference opacity-0 transition-opacity duration-300"
                style={{ willChange: "transform" }}
            />
        </>
    );
}
