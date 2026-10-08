"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { portfolioData } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// "July 2026 – Present" → { year: 2026, month: 6 }
const startOf = (period: string) => ({
    year: Number(period.match(/\d{4}/)?.[0] ?? 0),
    month: Math.max(0, MONTHS.indexOf(period.trim().slice(0, 3).toLowerCase())),
});

// Oldest first, so scrolling down moves forward in time.
const ROLES = portfolioData.experience
    .map((exp) => {
        const { year, month } = startOf(exp.period);
        return { ...exp, year, month, quarter: Math.floor(month / 3) };
    })
    .sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month));

const COUNT = ROLES.length;
const FIRST_YEAR = ROLES[0].year;
const YEARS = Array.from({ length: ROLES[COUNT - 1].year - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);
// Where each role sits on the timeline, counted in quarters from the first year.
const QUARTER_POS = ROLES.map((r) => (r.year - FIRST_YEAR) * 4 + r.quarter);

// Scroll distance per role and the rest at the end, in viewport heights.
const STEP_VH = 1;
const TAIL_VH = 0.6;
// Each role rests for this share of its step before the wheel turns to the next one.
const HOLD = 0.25;
// Degrees between neighbours on each ring.
const DOT_STEP = 15;
const YEAR_STEP = 30;
const TEXT_STEP = 20;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => n * n * (3 - 2 * n);

function wheelAt(raw: number) {
    const from = Math.min(Math.floor(raw), COUNT - 2);
    const t = smooth(clamp01((raw - from - HOLD) / (1 - HOLD)));
    const quarters = QUARTER_POS[from] + (QUARTER_POS[from + 1] - QUARTER_POS[from]) * t;
    const year = Math.floor(quarters / 4);
    // The year ring only turns while the quarter ring goes from Q4 round to Q1.
    return { pos: from + t, quarters, years: year + smooth(clamp01(quarters - year * 4 - 3)) };
}

// A damped spring: the ring is pulled toward where the scroll says it should be,
// so it lags a little, overshoots a little and settles. Lower damping = more bounce.
type Spring = { x: number; v: number; k: number; c: number };
const spring = (k: number, c: number): Spring => ({ x: 0, v: 0, k, c });

// Lighter rings react fast, the big outer band is heavy and trails behind.
const makeSprings = () => ({
    pos: spring(260, 16),
    quarters: spring(180, 12),
    years: spring(140, 11),
    planet: spring(60, 7),
});
// Fixed small steps keep the springs stable when a frame runs long.
const SPRING_STEP = 1 / 120;
// How far the pointer needle is knocked aside per role-per-second of wheel speed, and its limit.
const NEEDLE_KICK = 5;
const NEEDLE_MAX = 12;

type Layout = "wide" | "narrow" | "static";

// Side-by-side on desktops and on phones or tablets held sideways; stacked otherwise.
const WIDE_QUERY = "(min-width: 1024px), (orientation: landscape) and (min-width: 600px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeLayout(onChange: () => void) {
    const lists = [window.matchMedia(WIDE_QUERY), window.matchMedia(REDUCED_QUERY)];
    lists.forEach((list) => list.addEventListener("change", onChange));
    return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

function getLayout(): Layout {
    if (window.matchMedia(REDUCED_QUERY).matches) return "static";
    return window.matchMedia(WIDE_QUERY).matches ? "wide" : "narrow";
}

const rotate = (el: HTMLElement | SVGElement | null, deg: number) => {
    if (el) el.style.transform = `rotate(${deg}deg)`;
};

function RoleText({ role, wide = false }: { role: (typeof ROLES)[number]; wide?: boolean }) {
    return (
        <>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/70 mb-[0.75em]">
                <span className="h-0.5 w-5 rounded-full bg-accent" aria-hidden />
                {role.period}
            </p>
            <h3
                className={`font-bold text-white leading-tight ${
                    wide ? "text-[clamp(1.25rem,min(2.6vw,5svh),2.6rem)]" : "text-2xl md:text-3xl"
                }`}
            >
                {role.role}
            </h3>
            <p
                className={`mt-1 italic text-glow inline-block pr-2 ${
                    wide ? "mb-[0.6em] text-[clamp(0.9rem,min(1.3vw,2.6svh),1.125rem)]" : "mb-4 text-base"
                }`}
            >
                {role.company}
            </p>
            <p
                className={`text-gray-300 font-light leading-relaxed ${
                    wide ? "text-[clamp(0.72rem,min(1.4vw,2.3svh),1.125rem)]" : "text-sm md:text-base"
                }`}
            >
                {role.description}
            </p>
        </>
    );
}

export default function Experience() {
    const layout = useSyncExternalStore(subscribeLayout, getLayout, () => "wide" as Layout);
    const [active, setActive] = useState(0);

    const stage = useRef<HTMLDivElement>(null);
    const planet = useRef<SVGSVGElement>(null);
    const needle = useRef<SVGSVGElement>(null);
    const dots = useRef<HTMLDivElement>(null);
    const years = useRef<HTMLDivElement>(null);
    const quarters = useRef<HTMLDivElement>(null);
    const textRing = useRef<HTMLDivElement>(null);
    const yearItems = useRef<(HTMLDivElement | null)[]>([]);
    const quarterItems = useRef<(HTMLSpanElement | null)[]>([]);

    const wide = layout === "wide";

    useGSAP(
        () => {
            if (layout === "static" || COUNT < 2) return;

            const step = () => window.innerHeight * STEP_VH;
            const distance = () => (COUNT - 1) * step() + window.innerHeight * TAIL_VH;

            const springs = makeSprings();
            const target = { pos: 0, quarters: 0, years: 0 };
            let running = false;

            const draw = () => {
                const pos = springs.pos.x;
                const q = springs.quarters.x;
                const y = springs.years.x;

                rotate(planet.current, springs.planet.x * 8);
                rotate(dots.current, -pos * DOT_STEP);
                rotate(years.current, -y * YEAR_STEP);
                rotate(quarters.current, -q * 90);
                rotate(textRing.current, -pos * TEXT_STEP);
                // The passing wheel drags the needle with it; it swings back as the wheel slows.
                rotate(needle.current, Math.max(-NEEDLE_MAX, Math.min(NEEDLE_MAX, -springs.pos.v * NEEDLE_KICK)));

                yearItems.current.forEach((el, i) => {
                    if (el) el.dataset.active = String(Math.abs(i - y) < 0.5);
                });
                quarterItems.current.forEach((el, i) => {
                    if (!el) return;
                    // 1 when this quarter is under the pointer, 0 when it is a quarter-turn away.
                    const near = clamp01(1 - Math.abs(((((i - q + 2) % 4) + 4) % 4) - 2));
                    el.style.opacity = String(0.35 + 0.65 * near);
                    el.dataset.active = String(near > 0.5);
                    // Keep the label upright while its ring turns.
                    el.style.transform = `rotate(${(q - i) * 90 - (wide ? 0 : 90)}deg)`;
                });
            };

            const goals = () => [
                [springs.pos, target.pos],
                [springs.quarters, target.quarters],
                [springs.years, target.years],
                [springs.planet, target.pos],
            ] as const;

            // Runs only while something is still moving, then takes itself off the ticker.
            const tick = (_time: number, deltaMs: number) => {
                let left = Math.min(deltaMs / 1000, 0.05);
                while (left > 0) {
                    const dt = Math.min(SPRING_STEP, left);
                    for (const [s, goal] of goals()) {
                        s.v += (-s.k * (s.x - goal) - s.c * s.v) * dt;
                        s.x += s.v * dt;
                    }
                    left -= dt;
                }
                if (goals().every(([s, goal]) => Math.abs(s.x - goal) < 0.0005 && Math.abs(s.v) < 0.005)) {
                    for (const [s, goal] of goals()) {
                        s.x = goal;
                        s.v = 0;
                    }
                    gsap.ticker.remove(tick);
                    running = false;
                }
                draw();
            };

            // jump = true places the wheel without any motion (first paint, resize).
            const render = (progress: number, jump = false) => {
                Object.assign(target, wheelAt(Math.min((progress * distance()) / step(), COUNT - 1)));

                if (jump) {
                    for (const [s, goal] of goals()) {
                        s.x = goal;
                        s.v = 0;
                    }
                    draw();
                } else if (!running) {
                    running = true;
                    gsap.ticker.add(tick);
                }

                // The text switches on the scroll itself, not on the spring, so it never feels late.
                const next = Math.round(target.pos);
                setActive((prev) => (prev === next ? prev : next));
            };

            ScrollTrigger.create({
                trigger: stage.current,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                // The hero pins itself later (after the splash); it has to be measured first.
                refreshPriority: -1,
                onUpdate: (self) => render(self.progress),
                onRefresh: (self) => render(self.progress, true),
            });
            render(0, true);

            // Sections above can change height after load (the hero pin, late images).
            // Measure again when that happens, or the wheel would start at the wrong place.
            let lastHeight = document.body.offsetHeight;
            let timer: ReturnType<typeof setTimeout>;
            const observer = new ResizeObserver(() => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if (Math.abs(document.body.offsetHeight - lastHeight) < 1) return;
                    ScrollTrigger.refresh();
                    lastHeight = document.body.offsetHeight;
                }, 200);
            });
            observer.observe(document.body);

            return () => {
                gsap.ticker.remove(tick);
                clearTimeout(timer);
                observer.disconnect();
            };
        },
        { dependencies: [layout], revertOnUpdate: true },
    );

    return (
        <section id="experience" className="relative pt-20 md:pt-28">
            {/* Section Divider */}
            <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

            <div className="mb-12 md:mb-16 px-4 text-center relative z-20">
                <SectionHeading kicker="Experience" accent="Worked">Where I&apos;ve</SectionHeading>
                <p className="text-gray-500 mt-4 text-sm uppercase tracking-widest">
                    {COUNT} roles, {FIRST_YEAR} to today
                </p>
            </div>

            {layout === "static" ? (
                // Reduced motion: no pinning, just the roles in order.
                <ol className="max-w-3xl mx-auto px-4 pb-20 space-y-6">
                    {ROLES.map((role) => (
                        <li key={role.company} className="glow-card rounded-2xl p-6 md:p-8">
                            <RoleText role={role} />
                        </li>
                    ))}
                </ol>
            ) : (
                // The page scroll drives the wheel: the stage stays pinned while the roles go by.
                // GSAP wraps the pinned stage in its own spacer, so React keeps hold of this outer div instead.
                <div className="mb-20 md:mb-28">
                    <div ref={stage} className="relative h-[100svh] w-full overflow-clip">
                        <div
                            className={
                                wide
                                    ? "absolute z-10 top-[55%] left-[clamp(3.5rem,6vw,10rem)]"
                                    : "absolute z-10 top-[clamp(4.5rem,calc(20svh-60px),15rem)] left-1/2 rotate-90"
                            }
                            style={
                                {
                                    "--year-r": wide
                                        ? "clamp(110px, min(16vw, 36svh), 360px)"
                                        : "clamp(100px, 17svh, 190px)",
                                    "--quarter-r": "calc(var(--year-r) * 0.55)",
                                } as React.CSSProperties
                            }
                        >
                            {/* Outer wheel: a wide band, the pointer and one dot per role */}
                            <div
                                className={`pointer-events-none absolute top-0 left-0 aspect-square -translate-x-1/2 -translate-y-1/2 ${
                                    wide ? "w-[clamp(480px,min(90vw,190svh),1500px)]" : "w-[clamp(430px,73svh,760px)]"
                                }`}
                                aria-hidden
                            >
                                <svg ref={planet} viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full opacity-70 will-change-transform">
                                    <defs>
                                        <linearGradient id="exp-band" x1="0" x2="1">
                                            <stop offset="0" stopColor="#1b1530" />
                                            <stop offset="1" stopColor="#2b2147" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="500" cy="500" r="330" stroke="url(#exp-band)" strokeWidth="80" fill="none" />
                                    <circle
                                        cx="500"
                                        cy="500"
                                        r="250"
                                        stroke="#c084fc"
                                        strokeWidth="2"
                                        strokeDasharray="2 14"
                                        fill="none"
                                        opacity="0.35"
                                    />
                                </svg>
                                <svg ref={needle} viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full will-change-transform">
                                    <line
                                        x1="792"
                                        y1="500"
                                        x2="868"
                                        y2="500"
                                        stroke="var(--color-accent)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        className="opacity-80 drop-shadow-[0_0_8px_var(--color-accent)]"
                                    />
                                </svg>
                                <div ref={dots} className="absolute inset-0 will-change-transform">
                                    {ROLES.map((role, i) => (
                                        <div
                                            key={role.company}
                                            className="absolute inset-0"
                                            style={{ transform: `rotate(${i * DOT_STEP}deg)` }}
                                        >
                                            <div
                                                className={`absolute top-1/2 left-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                                                    i === active
                                                        ? "h-3 w-3 bg-accent shadow-[0_0_12px_var(--color-accent)]"
                                                        : "h-2 w-2 bg-zinc-600"
                                                }`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hub: the logo of the company in view */}
                            <div
                                className={`absolute top-0 left-0 z-20 size-[clamp(56px,calc(var(--quarter-r)*0.9),88px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-[0_0_40px_rgb(219_39_119/0.15)] ${
                                    wide ? "" : "-rotate-90"
                                }`}
                                aria-hidden
                            >
                                {ROLES.map((role, i) =>
                                    role.logo ? (
                                        <Image
                                            key={role.company}
                                            src={role.logo}
                                            alt=""
                                            fill
                                            sizes="88px"
                                            className={`object-contain p-[14%] transition-opacity duration-500 ${
                                                i === active ? "opacity-100" : "opacity-0"
                                            }`}
                                        />
                                    ) : null,
                                )}
                            </div>

                            {/* Ring tracks */}
                            <div
                                className="pointer-events-none absolute top-0 left-0 h-[calc(var(--quarter-r)*2)] w-[calc(var(--quarter-r)*2)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20"
                                aria-hidden
                            />
                            <div
                                className="pointer-events-none absolute top-0 left-0 h-[calc(var(--year-r)*2)] w-[calc(var(--year-r)*2)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                                aria-hidden
                            />

                            {/* Quarter ring: one full turn per year */}
                            <div ref={quarters} className="absolute top-0 left-0 z-30 will-change-transform" aria-hidden>
                                {[0, 1, 2, 3].map((q) => (
                                    <div
                                        key={q}
                                        className="absolute top-1/2 left-1/2 flex items-center justify-center"
                                        style={{
                                            transform: `translate(-50%, -50%) rotate(${q * 90}deg) translateX(var(--quarter-r))`,
                                        }}
                                    >
                                        <span
                                            ref={(el) => {
                                                quarterItems.current[q] = el;
                                            }}
                                            className="block select-none text-xs lg:text-[13px] font-semibold tracking-[0.12em] text-zinc-500 transition-colors duration-300 data-[active=true]:text-accent data-[active=true]:[text-shadow:0_0_12px_var(--color-accent)]"
                                        >
                                            Q{q + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Year ring */}
                            <div ref={years} className="absolute top-0 left-0 z-30 will-change-transform" aria-hidden>
                                {YEARS.map((year, i) => (
                                    <div
                                        key={year}
                                        ref={(el) => {
                                            yearItems.current[i] = el;
                                        }}
                                        className="group absolute top-1/2 left-1/2 flex items-center"
                                        style={{
                                            transform: `translate(-50%, -50%) rotate(${i * YEAR_STEP}deg) translateX(var(--year-r))`,
                                        }}
                                    >
                                        <span className="select-none text-sm lg:text-base font-bold tracking-[0.2em] text-zinc-600 transition-colors duration-300 group-data-[active=true]:text-white">
                                            {year}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Wide screens: the text rides its own ring and swings in beside the wheel */}
                            {wide && (
                                <div ref={textRing} className="absolute top-0 left-[1vw] z-10 will-change-transform">
                                    {ROLES.map((role, i) => (
                                        <div
                                            key={role.company}
                                            className="absolute top-1/2 left-1/2"
                                            style={{
                                                transform: `translate(-50%, -50%) rotate(${i * TEXT_STEP}deg) translateX(clamp(380px, 65vw, 1100px))`,
                                            }}
                                        >
                                            <div
                                                className={`w-[clamp(300px,44vw,640px)] pl-[clamp(0.75rem,2.2vw,2rem)] transition-opacity duration-500 ${
                                                    i === active ? "opacity-100" : "opacity-0"
                                                }`}
                                            >
                                                <RoleText role={role} wide />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {wide ? (
                            <p className="absolute bottom-[clamp(0.75rem,4svh,2.5rem)] right-[clamp(1rem,3vw,2.5rem)] z-20 font-heading text-sm tracking-[0.3em] text-white/40" aria-hidden>
                                <span className="text-white">0{active + 1}</span> / 0{COUNT}
                            </p>
                        ) : (
                            // Small screens: the wheel sits on top and the roles cross-fade below it.
                            <div className="absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background via-80% to-transparent px-6 pt-16 pb-[5vh]">
                                <div className="mx-auto grid max-w-xl">
                                    {ROLES.map((role, i) => (
                                        <div
                                            key={role.company}
                                            className={`[grid-area:1/1] self-end transition-opacity duration-500 ${
                                                i === active ? "opacity-100" : "opacity-0 pointer-events-none"
                                            }`}
                                        >
                                            <RoleText role={role} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
