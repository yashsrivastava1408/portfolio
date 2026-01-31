
"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-scroll";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
            setMobileMenuOpen(false); // Close menu on scroll down
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
            className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4"
        >
            <div className="flex flex-col items-center w-full max-w-2xl">
                {/* Main Bar */}
                <div className="flex items-center justify-between w-full px-6 py-3 rounded-full bg-secondary/80 backdrop-blur-md border border-white/10 shadow-lg shadow-primary/5 relative z-50">
                    <a href="#" className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        YS
                    </a>

                    {/* Desktop Menu */}
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

                    <div className="flex items-center gap-4">
                        <a
                            href="mailto:yashsrivastava1408@gmail.com"
                            className="hidden md:block px-4 py-2 text-xs font-semibold bg-primary text-white rounded-full hover:bg-primary/90 transition-transform hover:scale-105"
                        >
                            Hire Me
                        </a>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="block md:hidden text-white p-1"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-20 left-0 right-0 mx-4 p-4 rounded-3xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 flex flex-col gap-4 shadow-2xl md:hidden"
                        >
                            {links.map((link) => (
                                <Link
                                    key={link}
                                    to={link.toLowerCase()}
                                    smooth={true}
                                    duration={500}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-medium text-center text-gray-300 hover:text-white py-2 border-b border-white/5 last:border-none"
                                >
                                    {link}
                                </Link>
                            ))}
                            <a
                                href="mailto:yashsrivastava1408@gmail.com"
                                className="block w-full text-center px-4 py-3 mt-2 text-sm font-bold bg-primary text-white rounded-full"
                            >
                                Hire Me
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
