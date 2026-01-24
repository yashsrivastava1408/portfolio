
"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Link } from "react-scroll";

export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const links = ["About", "Skills", "Projects", "Contact"];

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4"
        >
            <div className="flex items-center gap-8 px-8 py-3 rounded-full bg-secondary/30 backdrop-blur-md border border-white/10 shadow-lg shadow-primary/5">
                <a href="#" className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    YS
                </a>
                <div className="hidden md:flex gap-6">
                    {links.map((link) => (
                        <Link
                            key={link}
                            to={link.toLowerCase()}
                            smooth={true}
                            duration={500}
                            className="text-sm font-medium text-muted-foreground hover:text-white cursor-pointer transition-colors"
                        >
                            {link}
                        </Link>
                    ))}
                </div>
                <a
                    href="mailto:yashsrivastava1408@gmail.com"
                    className="px-4 py-2 text-xs font-semibold bg-primary text-white rounded-full hover:bg-primary/90 transition-transform hover:scale-105"
                >
                    Hire Me
                </a>
            </div>
        </motion.nav>
    );
}
