
"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Mail, Phone } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="py-20 px-4 bg-gradient-to-t from-black to-transparent">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center bg-secondary/20 border border-white/5 rounded-3xl p-12 backdrop-blur-lg"
            >
                <h2 className="text-4xl font-bold font-heading text-primary mb-6">Get In Touch</h2>
                <p className="text-lg text-muted-foreground mb-12">
                    I&apos;m currently looking for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
                </p>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
                    <a href={`mailto:${portfolioData.personal.email}`} className="flex items-center gap-3 text-lg hover:text-primary transition-colors">
                        <Mail className="w-6 h-6" />
                        {portfolioData.personal.email}
                    </a>
                    <a href={`tel:${portfolioData.personal.phone}`} className="flex items-center gap-3 text-lg hover:text-primary transition-colors">
                        <Phone className="w-6 h-6" />
                        {portfolioData.personal.phone}
                    </a>
                </div>

                <div className="flex justify-center gap-6">
                    {portfolioData.personal.social.map((social) => (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            className="p-4 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary transition-all hover:scale-110"
                            title={social.name}
                        >
                            <social.icon className="w-6 h-6" />
                        </a>
                    ))}
                </div>

                <footer className="mt-16 pt-8 border-t border-white/5 text-sm text-gray-500">
                    <p>&copy; 2025 {portfolioData.personal.name}. All rights reserved.</p>
                </footer>
            </motion.div>
        </section>
    );
}
