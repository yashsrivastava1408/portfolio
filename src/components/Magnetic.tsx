"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
    children: React.ReactNode;
    /** How far the element follows the cursor, as a share of the distance from its centre. */
    strength?: number;
    className?: string;
}

/** Wrap a button or link so it leans slightly toward the cursor and springs back when the cursor leaves. */
export default function Magnetic({ children, strength = 0.3, className = "" }: MagneticProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const spring = { stiffness: 220, damping: 16, mass: 0.4 };
    const sx = useSpring(x, spring);
    const sy = useSpring(y, spring);

    return (
        <motion.div
            style={{ x: sx, y: sy }}
            className={`inline-block ${className}`}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
                y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
            }}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
        >
            {children}
        </motion.div>
    );
}
