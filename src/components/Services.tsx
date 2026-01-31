
"use client";


import { Code2, Server, BrainCircuit, ArrowUpRight } from "lucide-react";

const services = [
    {
        title: "Full-Stack Engineering",
        description: "Building scalable, high-performance web applications with Next.js, React, and Node.js. I focus on creating pixel-perfect, interactive experiences that perform seamlessly across all devices.",
        icon: Code2,
        gradient: "from-blue-500 to-indigo-500",
        tags: ["Next.js 15", "React", "TypeScript", "Tailwind"]
    },
    {
        title: "DevSecOps & Cloud",
        description: "Automating secure CI/CD pipelines, managing Kubernetes clusters, and architecting resilient cloud infrastructure. I ensure your code deploys safely, securely, and efficiently using AWS and Docker.",
        icon: Server,
        gradient: "from-emerald-500 to-cyan-500",
        tags: ["AWS", "Docker", "Kubernetes", "GitHub Actions"]
    },
    {
        title: "AI & System Architecture",
        description: "Integrating AI models (LLMs) into applications and designing robust backend architectures. From real-time chat systems to AI-driven insights, I build intelligent systems that solve complex problems.",
        icon: BrainCircuit,
        gradient: "from-purple-500 to-pink-500",
        tags: ["System Design", "LLMs", "Microservices", "Python"]
    }
];

export default function Services() {
    return (
        <section className="py-32 px-4 relative max-w-7xl mx-auto">
            <div className="mb-20 text-center relative z-20">
                <h2 className="text-6xl md:text-8xl text-white font-heading tracking-tight mb-4">
                    What I <span className="font-cursive text-accent italic pr-2">Do</span>
                </h2>
                <p className="text-gray-500 text-sm uppercase tracking-widest max-w-lg mx-auto">
                    Bridging the gap between creative design and robust engineering
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {services.map((service, index) => (
                    <div key={index} className="group relative h-[500px] perspective-1000">
                        <div className="relative w-full h-full transition-all duration-500 group-hover:-translate-y-4">

                            {/* Background Gradient Blob */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl -z-10`} />

                            <div className="h-full w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative backdrop-blur-sm group-hover:border-white/20 transition-colors">

                                {/* Top Content */}
                                <div>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} p-3 mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                        <service.icon className="w-full h-full text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Bottom Tags */}
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {service.tags.map(tag => (
                                            <span key={tag} className="text-xs font-mono bg-white/5 border border-white/5 rounded-full px-3 py-1 text-gray-500 group-hover:text-white group-hover:border-white/10 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 group-hover:text-white transition-colors group-hover:gap-4 duration-300">
                                        See Projects <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Hover Overlay Line */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
