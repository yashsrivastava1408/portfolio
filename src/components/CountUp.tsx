"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface CountUpProps {
    value: number;
    suffix?: string;
    duration?: number;
}

const format = (n: number, suffix: string) => `${Math.round(n).toLocaleString("en-US")}${suffix}`;

/** Counts up from zero the first time the number scrolls into view. The real value is in the HTML from the start. */
export default function CountUp({ value, suffix = "", duration = 1.4 }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    useEffect(() => {
        const el = ref.current;
        if (!inView || !el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const controls = animate(0, value, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => {
                el.textContent = format(v, suffix);
            },
        });
        return () => {
            controls.stop();
            el.textContent = format(value, suffix);
        };
    }, [inView, value, suffix, duration]);

    return (
        <span ref={ref} className="tabular-nums">
            {format(value, suffix)}
        </span>
    );
}
