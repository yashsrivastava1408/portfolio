"use client";

import Image from "next/image";

export default function DesignerCoder() {
    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center">
            <div className="flex flex-col md:flex-row w-full h-full relative">

                {/* Left Side: DevSecOps */}
                <div className="relative flex-1 group h-full overflow-hidden bg-white text-black flex items-center justify-center md:justify-end md:pr-20 z-10 transition-all duration-500 hover:flex-[1.5]">
                    <div className="text-right z-20 mt-20 md:mt-0">
                        <h2 className="text-6xl md:text-9xl font-heading font-black tracking-tighter mb-4 text-[#1a1a1a]">
                            DEVSECOPS
                        </h2>
                        <p className="text-gray-500 max-w-xs ml-auto font-serif italic text-lg leading-relaxed">
                            Engineer focused on system design, problem solving, and building reliable, scalable solutions.
                        </p>
                    </div>

                    {/* Background Art Effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50" />
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl mix-blend-multiply" />
                        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl mix-blend-multiply" />
                    </div>
                </div>

                {/* Center Image Split */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[70vh] z-30 pointer-events-none hidden md:block">
                    <div className="relative w-full h-full">

                        {/* Left Half */}
                        <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden bg-transparent">
                            <div className="relative w-[500px] h-full -left-0">
                                <Image
                                    src="/profile-hero.jpg"
                                    alt="Profile Art"
                                    fill
                                    className="object-cover object-top grayscale contrast-125 brightness-110"
                                />
                                <div className="absolute inset-0 bg-yellow-500/10 mix-blend-color" />
                            </div>
                        </div>

                        {/* Right Half */}
                        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden bg-transparent">
                            <div className="relative w-[500px] h-full -left-[250px]">
                                <Image
                                    src="/profile-hero.jpg"
                                    alt="Profile Code"
                                    fill
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_2px)] bg-[size:100%_4px] opacity-30" />
                            </div>
                        </div>

                        {/* Split Line */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white z-40">
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white px-6 py-2 rounded-full border border-white/20 font-bold tracking-widest text-sm shadow-2xl">
                                YASH SRIVASTAVA
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Full Stack */}
                <div className="relative flex-1 group h-full overflow-hidden bg-[#050505] text-white flex items-center justify-center md:justify-start md:pl-20 z-10 transition-all duration-500 hover:flex-[1.5]">
                    <div className="text-left z-20 w-fit relative mt-20 md:mt-0">
                        <h2 className="text-6xl md:text-9xl font-mono font-bold tracking-tighter mb-4 text-white">
                            FULL-STACK
                        </h2>
                        <p className="text-gray-400 max-w-xs font-mono text-sm leading-relaxed">
                            Software engineer with experience in DevOps, backend systems, and cloud-native applications.
                        </p>

                        <div className="absolute -z-10 -top-20 -right-40 text-gray-800/10 text-[200px] font-black select-none pointer-events-none">
                            {"{}"}
                        </div>
                    </div>

                    {/* Background Code Effect */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                        <pre className="text-[10px] text-green-500/30 font-mono p-4">
                            {`function createMagic() {
  const aesthetic = true;
  const performance = 100;
  return aesthetic && performance;
}

while(alive) {
  code();
  design();
}`}
                        </pre>
                    </div>
                </div>

            </div>
        </section>
    );
}