
"use client";

import { useEffect, useRef } from "react";

export default function BackgroundAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let particles: any[] = [];
        let animationFrameId: number;
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        // Mouse state
        const mouse = { x: -1000, y: -1000 };

        const createParticle = () => {
            const x = Math.random() * w;
            const y = Math.random() * h;
            // Initial gentle drift
            const vx = (Math.random() - 0.5) * 0.5;
            const vy = (Math.random() - 0.5) * 0.5 - 0.2; // Slight upward bias
            const size = Math.random() * 2 + 1;
            // Techy colors: Cyan, Purple, White
            const colors = ["#6d28d9", "#db2777", "#ffffff", "#00ffff"];
            const color = colors[Math.floor(Math.random() * colors.length)];


            return {
                x, y, vx, vy,
                update: function () {
                    // 1. Mouse Repulsion
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 200) {
                        const force = (200 - dist) / 200;
                        const repulsionX = (dx / dist) * force * 2; // mild push
                        const repulsionY = (dy / dist) * force * 2;
                        this.vx += repulsionX;
                        this.vy += repulsionY;
                    }

                    // 2. Slow Upward/Random Drift (Anti-Gravity)
                    this.vy -= 0.005; // Constant gentle antigravity
                    this.vx += (Math.random() - 0.5) * 0.02; // Random Brownian motion

                    // 3. Limit Speed (Terminal Velocity)
                    const speedLimit = 2;
                    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    if (currentSpeed > speedLimit) {
                        this.vx = (this.vx / currentSpeed) * speedLimit;
                        this.vy = (this.vy / currentSpeed) * speedLimit;
                    }

                    // 4. Update Position
                    this.x += this.vx;
                    this.y += this.vy;

                    // 5. Wrap Around (Infinite Space)
                    if (this.x < -50) this.x = w + 50;
                    if (this.x > w + 50) this.x = -50;
                    if (this.y < -50) this.y = h + 50;
                    if (this.y > h + 50) this.y = -50;
                },
                draw: function () {
                    if (!ctx) return;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            };
        };

        const init = () => {
            particles = [];
            // Reduced particle count for better performance
            const particleCount = Math.min(Math.floor((w * h) / 25000), 50);
            for (let i = 0; i < particleCount; i++) {
                particles.push(createParticle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, w, h);

            // Update and Draw Particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw();

                // Soft Repulsion between particles (prevents clumping)
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Draw subtle connections
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 100, 255, ${0.1 * (1 - dist / 120)})`; // Very faint
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();

                        // Gentle particle-particle repulsion
                        if (dist < 50) {
                            const force = (50 - dist) / 500; // tiny push
                            const rx = (dx / dist) * force;
                            const ry = (dy / dist) * force;
                            p.vx += rx;
                            p.vy += ry;
                            p2.vx -= rx;
                            p2.vy -= ry;
                        }
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseout", handleMouseLeave);

        init();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseout", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-1 pointer-events-none opacity-40"
        />
    );
}
