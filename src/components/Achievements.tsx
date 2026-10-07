"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

export default function Achievements({ leetcodeSolved }: { leetcodeSolved: number }) {
    const items = [
        ...portfolioData.achievements,
        { value: `${leetcodeSolved}`, title: "LeetCode solved", detail: "Data structures & algorithms" },
    ];

    return (
        <section id="achievements" aria-label="Achievements" className="px-4 pt-20 max-w-7xl mx-auto">
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-white/10 bg-white/10">
                {items.map((item, index) => (
                    <motion.li
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
                        className="bg-[#0A0A0A] p-5 md:p-8"
                    >
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 whitespace-nowrap">
                            {item.value}
                        </p>
                        <p className="text-white font-semibold mt-3">{item.title}</p>
                        <p className="text-gray-500 text-sm mt-1">{item.detail}</p>
                    </motion.li>
                ))}
            </ul>
        </section>
    );
}
