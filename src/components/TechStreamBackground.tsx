"use client";

import { useEffect, useRef } from "react";

export default function TechStreamBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let streams: Stream[] = [];

        // Configuration
        const COLUMN_WIDTH = 20;
        const SPEED_BASE = 2;
        const STREAM_DENSITY = 0.6; // Chance of a column having a stream

        interface Stream {
            x: number;
            y: number;
            speed: number;
            length: number;
            chars: string[];
            opacity: number;
        }

        const charSet = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStreams();
        };

        const initStreams = () => {
            streams = [];
            const cols = Math.ceil(canvas.width / COLUMN_WIDTH);

            for (let i = 0; i < cols; i++) {
                if (Math.random() < STREAM_DENSITY) {
                    createStream(i * COLUMN_WIDTH);
                }
            }
        };

        const createStream = (x: number) => {
            const length = 10 + Math.random() * 20;
            streams.push({
                x,
                y: -(Math.random() * canvas.height), // Start above screen
                speed: SPEED_BASE + Math.random() * 3,
                length,
                chars: Array.from({ length }, () => charSet.charAt(Math.floor(Math.random() * charSet.length))),
                opacity: 0.1 + Math.random() * 0.4
            });
        };

        const draw = () => {
            if (!ctx) return;

            // Fade out effect for "trailing" feel
            ctx.fillStyle = "rgba(5, 5, 5, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = "14px monospace";
            ctx.textAlign = "center";

            streams.forEach((stream) => {
                stream.y += stream.speed;

                // Reset if off screen
                if (stream.y - stream.length * 20 > canvas.height) {
                    stream.y = -(Math.random() * 200);
                    stream.speed = SPEED_BASE + Math.random() * 3;
                }

                // Draw characters
                stream.chars.forEach((char, i) => {
                    const charY = stream.y - i * 20;

                    // Only draw if visible
                    if (charY > -20 && charY < canvas.height + 20) {
                        // Head characters are brighter
                        const isHead = i === 0;


                        if (isHead) {
                            ctx.fillStyle = "#ffffff"; // Bright white head
                            ctx.shadowBlur = 15;
                            ctx.shadowColor = "#ffffff";
                        } else {
                            ctx.shadowBlur = 0;
                            // Gradient color based on position in stream
                            // Cyan/Blue theme
                            ctx.fillStyle = `rgba(34, 211, 238, ${stream.opacity - (i / stream.length) * 0.3})`;
                        }

                        // Occasionally glitch a character
                        if (Math.random() > 0.98) {
                            stream.chars[i] = charSet.charAt(Math.floor(Math.random() * charSet.length));
                        }

                        ctx.fillText(char, stream.x, charY);
                    }
                });
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resize);
        resize();
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {/* Gradient Overlay to blend with section */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10" />

            <canvas
                ref={canvasRef}
                className="w-full h-full opacity-30"
            />
        </div>
    );
}
