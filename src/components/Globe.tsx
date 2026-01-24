
"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function Globe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;
        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                // approximate lat/long for UK, India, USA
                { location: [51.5074, -0.1278], size: 0.05 }, // London
                { location: [20.5937, 78.9629], size: 0.05 }, // India
                { location: [37.0902, -95.7129], size: 0.05 }, // USA
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-screen">
            <canvas
                ref={canvasRef}
                style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            />
        </div>
    );
}
