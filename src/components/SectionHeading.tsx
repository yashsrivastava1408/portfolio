"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
    children: string;
    className?: string;
    accent?: string;
    accentClassName?: string;
}

/**
 * Animated section heading with word-by-word reveal.
 * Splits the text at a pipe `|` — everything after the pipe
 * is rendered as the italic cursive accent word.
 *
 * Usage: <SectionHeading accent="Work">Curated</SectionHeading>
 * or:    <SectionHeading>The Secret|Sauce</SectionHeading>
 */
export default function SectionHeading({
    children,
    className = "",
    accent,
    accentClassName = "font-cursive text-accent italic pr-2",
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
        <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: 0.08 },
                },
            }}
            className={`text-6xl md:text-8xl text-white font-heading tracking-tight ${className}`}
        >
            {mainWords.map((word, i) => (
                <motion.span
                    key={i}
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
                        },
                    }}
                    className="inline-block mr-[0.3em]"
                >
                    {word}
                </motion.span>
            ))}
            {accentWord && (
                <motion.span
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.9 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
                        },
                    }}
                    className={`inline-block ${accentClassName}`}
                >
                    {accentWord}
                </motion.span>
            )}
        </motion.h2>
    );
}
