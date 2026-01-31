"use client";

import { useEffect, useRef } from "react";

export default function ServerRoomBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let lights: Light[] = [];

        // Configuration

        const SPACING_X = 50; // Horizontal spacing
        const SPACING_Y = 20; // Vertical spacing (rack unit height)

        interface Light {
            x: number;
            y: number;
            color: string;
            state: 'off' | 'on' | 'blink';
            blinkSpeed: number;
            lastBlink: number;
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initLights();
        };

        const initLights = () => {
            lights = [];

            // Calculate how many columns/rows fit
            const cols = Math.ceil(canvas.width / SPACING_X);
            const rows = Math.ceil(canvas.height / SPACING_Y);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    // Randomly decide if this "slot" has a light
                    if (Math.random() > 0.3) {
                        // Pick a color: mostly green/blue, rare amber/red
                        const rand = Math.random();
                        let color = '#22c55e'; // Green
                        if (rand > 0.95) color = '#ef4444'; // Red
                        else if (rand > 0.85) color = '#eab308'; // Amber
                        else if (rand > 0.6) color = '#3b82f6'; // Blue

                        lights.push({
                            x: i * SPACING_X + (Math.random() * 10), // slight jitter
                            y: j * SPACING_Y + (Math.random() * 5),
                            color,
                            state: Math.random() > 0.5 ? 'on' : 'blink',
                            blinkSpeed: 100 + Math.random() * 800,
                            lastBlink: 0
                        });
                    }
                }
            }
        };

        const draw = (time: number) => {
            if (!ctx) return;
            // Clear with a fade trail for "scanline" feel? No, clean clear.
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw faint rack lines (optional, for structure)
            ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i += SPACING_X) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
            }
            ctx.stroke();

            // Draw lights
            lights.forEach(light => {
                let opacity = 0.2; // Default dim state

                if (light.state === 'on') {
                    opacity = 0.4; // Steady glow
                } else if (light.state === 'blink') {
                    // Blink logic
                    const isBlinking = Math.sin(time / light.blinkSpeed) > 0;
                    opacity = isBlinking ? 0.8 : 0.1;
                }

                // Random subtle flicker for all
                opacity += (Math.random() - 0.5) * 0.05;

                ctx.fillStyle = light.color;
                ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

                // Draw small rect
                ctx.fillRect(light.x, light.y, 4, 4);

                // Glow effect
                if (opacity > 0.6) {
                    ctx.shadowColor = light.color;
                    ctx.shadowBlur = 10;
                    ctx.fillRect(light.x, light.y, 4, 4);
                    ctx.shadowBlur = 0;
                }
            });

            ctx.globalAlpha = 1;

            // Vignette overlay
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width
            );
            gradient.addColorStop(0, "rgba(0,0,0,0)");
            gradient.addColorStop(1, "rgba(0,0,0,0.8)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationFrameId = requestAnimationFrame((t) => draw(t));
        };

        window.addEventListener("resize", resize);
        resize();
        draw(0);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none"
        />
    );
}
