"use client";

import { portfolioData } from "@/data/portfolio";
import Image from "next/image";
import { useRef } from "react";
import { useInView } from "framer-motion";
import SectionHeading from "./SectionHeading";

// Simple Icons slugs. Skills without a slug still show, with a dot instead of a logo.
const ICON_SLUGS: Record<string, string> = {
    "Python": "python",
    "TypeScript": "typescript",
    "JavaScript": "javascript",
    "C/C++": "cplusplus",
    "SQL": "mysql",
    "Node.js": "nodedotjs",
    "Express": "express",
    "FastAPI": "fastapi",
    "Flask": "flask",
    "React": "react",
    "Next.js": "nextdotjs",
    "LangGraph / RAG": "langgraph",
    "WebSockets": "socketdotio",
    "Qdrant Vector DB": "qdrant",
    "Data Structures & Algorithms": "leetcode",
    "PostgreSQL": "postgresql",
    "MySQL": "mysql",
    "MongoDB": "mongodb",
    "Redis": "redis",
    "Docker": "docker",
    "Kubernetes": "kubernetes",
    "GitHub Actions": "githubactions",
    "Jenkins": "jenkins",
    "Argo CD": "argo",
    "Prometheus": "prometheus",
    "Grafana": "grafana",
    "Linux": "linux",
    "Git": "git",
    "GitHub": "github",
    "GitLab": "gitlab",
};

type Skill = { name: string; icon: string | null };

const skills: Skill[] = portfolioData.skills.map((name) => ({
    name,
    icon: ICON_SLUGS[name] ? `https://cdn.simpleicons.org/${ICON_SLUGS[name]}/e5e7eb` : null,
}));

const SkillPill = ({ skill }: { skill: Skill }) => (
    <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.04] border border-white/10 rounded-full mx-3 min-w-max hover:bg-white/10 hover:border-cyan-300/40 transition-colors group">
        {skill.icon ? (
            <div className="w-6 h-6 relative opacity-70 group-hover:opacity-100 transition-opacity">
                <Image src={skill.icon} alt="" fill unoptimized loading="lazy" className="object-contain" />
            </div>
        ) : (
            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-cyan-300" />
        )}
        <span className="text-gray-300 font-medium whitespace-nowrap">{skill.name}</span>
    </div>
);

// Two identical copies side by side; the CSS animation slides the track by exactly
// one copy (-50%), so the loop has no visible jump and runs on the compositor.
const MarqueeRow = ({ items, reverse, duration }: { items: Skill[]; reverse?: boolean; duration: number }) => (
    <div className="flex overflow-hidden">
        <div
            className="skill-track flex w-max"
            style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
        >
            {[0, 1].map((copy) => (
                <div key={copy} className="flex" aria-hidden={copy === 1}>
                    {items.map((skill) => (
                        <SkillPill key={skill.name} skill={skill} />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export default function Skills() {
    // Split skills into two rows used for marquee
    const half = Math.ceil(skills.length / 2);
    const row1 = skills.slice(0, half);
    const row2 = skills.slice(half);

    // the marquee only moves while it is on screen
    const marqueeRef = useRef<HTMLDivElement>(null);
    const inView = useInView(marqueeRef, { margin: "200px" });

    return (
        <section id="skills" className="py-20 md:py-28 px-4 relative overflow-hidden">
            {/* Section Divider */}
            <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

            <div className="mb-12 md:mb-16 text-center relative z-20">
                <SectionHeading kicker="Stack" accent="Sauce">The Secret</SectionHeading>
                <p className="text-gray-500 mt-4 text-sm uppercase tracking-widest">
                    Technologies &amp; Tools I Use
                </p>
            </div>

            <div ref={marqueeRef} data-paused={!inView} className="skill-marquee flex flex-col gap-8 relative z-10">
                <MarqueeRow items={row1} duration={55} />
                <MarqueeRow items={row2} duration={65} reverse />
            </div>
        </section>
    );
}
