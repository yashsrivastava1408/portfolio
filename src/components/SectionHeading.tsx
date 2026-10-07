"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
    children: string;
    className?: string;
    /** Small label above the title, in the same style as the hero captions. */
    kicker?: string;
    accent?: string;
    accentClassName?: string;
}

const reveal = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as const },
    },
};

/**
 * The one heading style used by every section: a small kicker, a bold white title,
 * and an italic accent word in the hero's purple → pink → cyan glow.
 * Words reveal one by one as the heading scrolls into view.
 *
 * Usage: <SectionHeading kicker="Work" accent="Work">Curated</SectionHeading>
 * or:    <SectionHeading>The Secret|Sauce</SectionHeading>
 */
export default function SectionHeading({
    children,
    className = "",
    kicker,
    accent,
    accentClassName = "italic text-glow pr-3",
}: SectionHeadingProps) {
    let mainWords: string[];
    let accentWord: string | undefined = accent;

    if (children.includes("|")) {
        const [main, acc] = children.split("|");
        mainWords = main.trim().split(" ");
        accentWord = acc.trim();
    } else {
        mainWords = children.split(" ");
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: 0.08 },
                },
            }}
        >
            {kicker && (
                <motion.p variants={reveal} className="text-xs uppercase tracking-[0.3em] text-purple-300 mb-4">
                    {kicker}
                </motion.p>
            )}
            <h2 className={`text-5xl md:text-7xl text-white font-heading font-bold tracking-tight leading-[1.05] ${className}`}>
                {mainWords.map((word, i) => (
                    <motion.span key={i} variants={reveal} className="inline-block mr-[0.25em]">
                        {word}
                    </motion.span>
                ))}
                {accentWord && (
                    <motion.span variants={reveal} className={`inline-block ${accentClassName}`}>
                        {accentWord}
                    </motion.span>
                )}
            </h2>
        </motion.div>
    );
}
