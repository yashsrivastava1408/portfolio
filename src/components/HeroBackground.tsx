"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Left panel: drifting aurora glows over a scrolling perspective grid, with a few twinkling stars.
 * Perf notes: no CSS blur (glows are radial gradients), only transform/opacity are animated,
 * and every tween lives on one timeline that is paused while the hero is off-screen.
 */
export function AuroraGrid() {
    const root = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (reduced()) return;

            const tl = gsap.timeline();
            gsap.utils.toArray<HTMLElement>(".aurora-blob").forEach((el, i) => {
                tl.to(
                    el,
                    {
                        x: gsap.utils.random(-140, 140),
                        y: gsap.utils.random(-90, 90),
                        duration: gsap.utils.random(7, 11),
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                    },
                    i * -2,
                );
            });
            // one grid cell (64px) per loop = seamless scroll, done with transform only
            tl.fromTo(".aurora-grid", { y: -64 }, { y: 0, duration: 2.4, ease: "none", repeat: -1 }, 0);

            const io = new IntersectionObserver(([e]) => tl.paused(!e.isIntersecting));
            io.observe(root.current!);
            return () => io.disconnect();
        },
        { scope: root },
    );

    const stars = Array.from({ length: 14 }, (_, i) => ({
        left: (i * 37) % 100,
        top: (i * 53) % 78,
        size: 1 + (i % 3),
        delay: (i % 5) * 0.7,
    }));

    return (
        <div ref={root} className="absolute inset-0 overflow-hidden pointer-events-none bg-[#04050c]">
            <div
                className="aurora-blob absolute -top-40 -left-40 w-[720px] h-[720px] rounded-full will-change-transform"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.38), transparent 65%)" }}
            />
            <div
                className="aurora-blob absolute top-[15%] left-[20%] w-[680px] h-[680px] rounded-full will-change-transform"
                style={{ background: "radial-gradient(circle, rgba(79,70,229,0.42), transparent 65%)" }}
            />
            <div
                className="aurora-blob absolute -bottom-32 -left-20 w-[640px] h-[640px] rounded-full will-change-transform"
                style={{ background: "radial-gradient(circle, rgba(192,38,211,0.3), transparent 65%)" }}
            />

            {stars.map((s, i) => (
                <span
                    key={i}
                    className="hero-star absolute rounded-full bg-cyan-100"
                    style={{
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        width: s.size,
                        height: s.size,
                        animationDelay: `${s.delay}s`,
                    }}
                />
            ))}

            {/* perspective grid floor */}
            <div
                className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden"
                style={{ perspective: "500px", maskImage: "linear-gradient(to top, black 10%, transparent 95%)" }}
            >
                <div
                    className="absolute inset-x-[-50%] top-0 bottom-0 origin-bottom"
                    style={{ transform: "rotateX(62deg)" }}
                >
                    <div
                        className="aurora-grid absolute inset-x-0 top-0 -bottom-16 will-change-transform"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(34,211,238,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.35) 1px, transparent 1px)",
                            backgroundSize: "64px 64px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

/** Right panel: falling code rain drawn on a 2D canvas, fading its own trails. */
export function CodeRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const FONT = 16;
        const glyphs = "01{}[]()<>/;=+*#$%&λ∑∆".split("");
        let cols = 0;
        let drops: number[] = [];
        let raf = 0;
        let last = 0;
        let visible = true;

        const resize = () => {
            const dpr = 1; // rain is soft anyway; 1x keeps the fill cost low
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = "#050505";
            ctx.fillRect(0, 0, width, height);
            cols = Math.ceil(width / FONT);
            drops = Array.from({ length: cols }, () => Math.random() * -50);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(canvas);

        const draw = (t: number) => {
            raf = requestAnimationFrame(draw);
            if (!visible || t - last < 55) return; // ~22fps keeps it cheap
            last = t;
            const { width, height } = canvas.getBoundingClientRect();

            ctx.fillStyle = "rgba(5,5,5,0.12)"; // trail fade
            ctx.fillRect(0, 0, width, height);
            ctx.font = `${FONT}px ui-monospace, monospace`;

            for (let i = 0; i < cols; i++) {
                const y = drops[i] * FONT;
                const ch = glyphs[(Math.random() * glyphs.length) | 0];
                ctx.fillStyle = "rgba(235,225,255,0.95)"; // bright head
                ctx.fillText(ch, i * FONT, y);
                ctx.fillStyle = "rgba(139,92,246,0.7)"; // trail char just behind the head
                ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * FONT, y - FONT);

                if (y > height && Math.random() > 0.975) drops[i] = Math.random() * -20;
                drops[i] += 0.6 + (i % 5) * 0.12;
            }
        };

        if (reduced()) {
            draw(100);
            cancelAnimationFrame(raf);
        } else {
            raf = requestAnimationFrame(draw);
        }

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.38]"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 35%, black 100%)" }}
        />
    );
}
