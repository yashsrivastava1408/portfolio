
"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { useState } from "react";


// Helper to get icon URL
const getIconUrl = (skill: string) => {
    if (skill === "C/C++") return "https://cdn.simpleicons.org/cplusplus";
    if (skill === "Data Structures & Algorithms") return "https://cdn.simpleicons.org/leetcode";

    const cleanName = skill.toLowerCase().replace(".", "dot").replace("/", "");
    const map: Record<string, string> = {
        "java": "java",
        "python": "python",
        "react": "react",
        "nodejs": "nodedotjs",
        "nextjs": "nextdotjs",
        "aws": "amazonwebservices",
        "sql": "mysql",
        "django": "django",
        "flask": "flask",
        "git": "git",
        "linux": "linux",
        "mongodb": "mongodb",
        "postgresql": "postgresql"
    };

    if (map[cleanName]) return `https://cdn.simpleicons.org/${map[cleanName]}`;

    if (skill.includes("Docker")) return "https://cdn.simpleicons.org/docker";
    if (skill.includes("Jenkins")) return "https://cdn.simpleicons.org/jenkins";
    if (skill.includes("IoT")) return "https://cdn.simpleicons.org/arduino";
    if (skill.includes("HTML")) return "https://cdn.simpleicons.org/html5";
    if (skill.includes("JavaScript")) return "https://cdn.simpleicons.org/javascript";
    if (skill.includes("TypeScript")) return "https://cdn.simpleicons.org/typescript";

    return "";
};

const SkillPill = ({ skill }: { skill: { name: string, icon: string } }) => (
    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full mx-4 min-w-max hover:bg-white/10 transition-colors group">
        <div className="w-8 h-8 relative opacity-70 group-hover:opacity-100 transition-opacity">
            <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain invert" />
        </div>
        <span className="text-gray-300 font-medium whitespace-nowrap">{skill.name}</span>
    </div>
);

export default function Skills() {
    const [visualSkills] = useState<{ name: string, icon: string }[]>(() =>
        portfolioData.skills.map(skill => ({
            name: skill,
            icon: getIconUrl(skill)
        })).filter(s => s.icon !== "")
    );

    // Split skills into two rows used for marquee
    const half = Math.ceil(visualSkills.length / 2);
    const row1 = visualSkills.slice(0, half);
    const row2 = visualSkills.slice(half);

    return (
        <section id="skills" className="py-32 px-4 relative overflow-hidden bg-[#0A0A0A]">
            <div className="mb-20 text-center relative z-20">
                <h2 className="text-6xl md:text-7xl text-white font-heading tracking-tight">
                    The Secret <span className="font-cursive text-accent italic pr-2">Sauce</span>
                </h2>
                <p className="text-gray-500 mt-4 text-sm uppercase tracking-widest">
                    Technologies & Tools I Use
                </p>
            </div>

            <div className="flex flex-col gap-12 relative z-10 masking-gradient">
                {/* Row 1 - Left to Right */}
                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30
                        }}
                    >
                        {/* Duplicate for infinite loop */}
                        {[...row1, ...row1, ...row1, ...row1].map((skill, i) => (
                            <SkillPill key={`${skill.name}-1-${i}`} skill={skill} />
                        ))}
                    </motion.div>
                </div>

                {/* Row 2 - Right to Left */}
                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex"
                        animate={{ x: [-1000, 0] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 35
                        }}
                    >
                        {/* Duplicate for infinite loop */}
                        {[...row2, ...row2, ...row2, ...row2].map((skill, i) => (
                            <SkillPill key={`${skill.name}-2-${i}`} skill={skill} />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Masking Gradient CSS Helper */}
            <style jsx>{`
                .masking-gradient {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
             `}</style>
        </section>
    );
}
