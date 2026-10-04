"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function Globe() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        let phi = 0;
        let globe: ReturnType<typeof createGlobe> | null = null;

        // cobe renders every frame until destroyed, so only keep it alive while on screen.
        const start = () => {
            if (globe) return;
            globe = createGlobe(canvas, {
                devicePixelRatio: 1.5,
                width: 600 * 1.5,
                height: 600 * 1.5,
                phi,
                theta: 0,
                dark: 1,
                diffuse: 1.2,
                mapSamples: 8000,
                mapBrightness: 6,
                baseColor: [0.3, 0.3, 0.3],
                markerColor: [0.1, 0.8, 1],
                glowColor: [1, 1, 1],
                markers: [
                    { location: [51.5074, -0.1278], size: 0.05 }, // London
                    { location: [20.5937, 78.9629], size: 0.05 }, // India
                    { location: [37.0902, -95.7129], size: 0.05 }, // USA
                ],
                onRender: (state) => {
                    state.phi = phi;
                    phi += 0.01;
                },
            });
        };
        const stop = () => {
            globe?.destroy();
            globe = null;
        };

        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
            rootMargin: "100px",
        });
        io.observe(wrapper);

        return () => {
            io.disconnect();
            stop();
        };
    }, []);

    return (
        <div ref={wrapperRef} className="absolute inset-0 flex items-center justify-center opacity-80">
            <canvas
                ref={canvasRef}
                style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            />
        </div>
    );
}
