/* eslint-disable react-hooks/immutability -- three.js uniforms/objects are mutated per-frame by design */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FACE_HEIGHT = 4.4; // world units
const CROP = { x: 50, y: 70, w: 472, h: 590 }; // head + shoulders of profile-hero.jpg

const vertexShader = /* glsl */ `
    uniform float uProgress;
    uniform float uDisperse;
    uniform float uTime;
    uniform float uSize;
    uniform float uPixelRatio;
    uniform vec2 uMouse;

    attribute vec3 aScatter;
    attribute vec3 aColor;
    attribute float aSeed;
    attribute float aLum;
    attribute float aSide;

    varying vec3 vColor;
    varying float vLum;
    varying float vSide;
    varying float vAssembled;

    void main() {
        // Each particle starts assembling at a slightly different moment
        float p = clamp((uProgress - aSeed * 0.45) / 0.55, 0.0, 1.0);
        p = 1.0 - pow(1.0 - p, 3.0);

        vec3 pos = mix(aScatter, position, p);

        // idle breathing
        pos.z += sin(uTime * 0.8 + position.y * 2.0 + aSeed * 6.283) * 0.03 * p;
        pos.xy += vec2(sin(uTime * 0.6 + aSeed * 20.0), cos(uTime * 0.5 + aSeed * 17.0)) * 0.012 * p;

        // cursor repel
        vec2 d = pos.xy - uMouse;
        float f = smoothstep(0.9, 0.0, length(d));
        pos.xy += normalize(d + 1e-4) * f * 0.35 * p;
        pos.z += f * 0.4 * p;

        // scroll disperse
        pos = mix(pos, aScatter * 0.8, uDisperse);

        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = uSize * uPixelRatio * (0.6 + aLum * 0.9) * (10.0 / -mv.z);
        gl_Position = projectionMatrix * mv;

        vColor = aColor;
        vLum = aLum;
        vSide = aSide;
        vAssembled = max(p * (1.0 - uDisperse), 0.0);
    }
`;

const fragmentShader = /* glsl */ `
    varying vec3 vColor;
    varying float vLum;
    varying float vSide;
    varying float vAssembled;

    void main() {
        vec2 c = gl_PointCoord - 0.5;
        float r = length(c);
        if (r > 0.5) discard;
        float soft = smoothstep(0.5, 0.15, r);

        // Both halves glow additively: left = cyan "design", right = violet/pink "code".
        vec3 cyan = mix(vec3(0.35, 0.85, 1.0), vColor, 0.35) * (0.7 + vLum * 0.7);
        vec3 violet = mix(vec3(0.72, 0.45, 1.0), vColor, 0.35) * (0.7 + vLum * 0.7);
        vec3 flying = vec3(0.6, 0.45, 1.0);
        vec3 settled = mix(violet, cyan, 1.0 - vSide);
        vec3 col = mix(flying, settled, vAssembled);

        float alpha = soft * (0.25 + vLum * 0.75);
        gl_FragColor = vec4(col, alpha);
    }
`;

interface FaceData {
    position: Float32Array;
    scatter: Float32Array;
    color: Float32Array;
    seed: Float32Array;
    lum: Float32Array;
    side: Float32Array;
}

function sampleFace(img: HTMLImageElement, step: number): FaceData {
    const canvas = document.createElement("canvas");
    canvas.width = CROP.w;
    canvas.height = CROP.h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, CROP.x, CROP.y, CROP.w, CROP.h, 0, 0, CROP.w, CROP.h);
    const { data } = ctx.getImageData(0, 0, CROP.w, CROP.h);

    const W = FACE_HEIGHT * (CROP.w / CROP.h);
    const pos: number[] = [];
    const scatter: number[] = [];
    const color: number[] = [];
    const seed: number[] = [];
    const lum: number[] = [];
    const side: number[] = [];

    for (let y = 0; y < CROP.h; y += step) {
        for (let x = 0; x < CROP.w; x += step) {
            const i = (y * CROP.w + x) * 4;
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;
            const l = 0.299 * r + 0.587 * g + 0.114 * b;
            if (l < 0.08) continue; // skip the black backdrop

            const u = x / CROP.w - 0.5;
            const v = y / CROP.h;
            // Fake depth: the head is a dome, brighter pixels sit slightly forward.
            const dome = Math.exp(-((u * u) / 0.05 + ((v - 0.38) * (v - 0.38)) / 0.06));
            const z = (0.25 * l + 0.9 * dome) - 0.3;

            const px = u * W + (Math.random() - 0.5) * 0.01;
            const py = (0.5 - v) * FACE_HEIGHT + (Math.random() - 0.5) * 0.01;

            pos.push(px, py, z);
            scatter.push(
                (Math.random() - 0.5) * 16,
                (Math.random() - 0.5) * 10,
                Math.random() * 10 - 6,
            );
            color.push(r, g, b);
            seed.push(Math.random());
            lum.push(l);
            side.push(px < 0 ? 0 : 1);
        }
    }

    return {
        position: new Float32Array(pos),
        scatter: new Float32Array(scatter),
        color: new Float32Array(color),
        seed: new Float32Array(seed),
        lum: new Float32Array(lum),
        side: new Float32Array(side),
    };
}

function Particles({ data, reducedMotion }: { data: FaceData; reducedMotion: boolean }) {
    const group = useRef<THREE.Group>(null);
    const material = useRef<THREE.ShaderMaterial>(null);
    const mouse = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    const geometry = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(data.position, 3));
        g.setAttribute("aScatter", new THREE.BufferAttribute(data.scatter, 3));
        g.setAttribute("aColor", new THREE.BufferAttribute(data.color, 3));
        g.setAttribute("aSeed", new THREE.BufferAttribute(data.seed, 1));
        g.setAttribute("aLum", new THREE.BufferAttribute(data.lum, 1));
        g.setAttribute("aSide", new THREE.BufferAttribute(data.side, 1));
        return g;
    }, [data]);

    const uniforms = useMemo(
        () => ({
            uProgress: { value: 0 },
            uDisperse: { value: 0 },
            uTime: { value: 0 },
            uSize: { value: 2.9 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
            uMouse: { value: new THREE.Vector2(999, 999) },
        }),
        [],
    );

    useEffect(() => {
        const u = material.current!.uniforms;
        const onMove = (e: PointerEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener("pointermove", onMove);

        const tween = gsap.to(u.uProgress, {
            value: 1,
            duration: reducedMotion ? 0 : 3.2,
            delay: reducedMotion ? 0 : 0.2,
            ease: "power2.out",
        });

        const st = ScrollTrigger.create({
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                u.uDisperse.value = self.progress;
            },
        });

        return () => {
            window.removeEventListener("pointermove", onMove);
            tween.kill();
            st.kill();
        };
    }, [reducedMotion]);

    useFrame((state) => {
        const u = material.current?.uniforms;
        if (!u) return;
        u.uTime.value = state.clock.elapsedTime;
        if (reducedMotion) return;

        // world-space cursor for the repel effect
        u.uMouse.value.set(
            mouse.current.x * (viewport.width / 2),
            mouse.current.y * (viewport.height / 2),
        );

        // gentle head turn — real parallax because particles have depth
        if (group.current) {
            group.current.rotation.y += (mouse.current.x * 0.3 - group.current.rotation.y) * 0.05;
            group.current.rotation.x += (-mouse.current.y * 0.15 - group.current.rotation.x) * 0.05;
        }
    });

    return (
        <group ref={group}>
            <points geometry={geometry} frustumCulled={false}>
                <shaderMaterial
                    ref={material}
                    uniforms={uniforms}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
}

export default function ParticleFace() {
    const [data, setData] = useState<FaceData | null>(null);
    const [reducedMotion] = useState(
        () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    useEffect(() => {
        if (window.innerWidth < 768) return; // mobile keeps the plain photo layout
        const img = new Image();
        img.onload = () => {
            const step = window.innerWidth < 1280 ? 4 : 3;
            setData(sampleFace(img, step));
        };
        img.src = "/profile-hero.jpg";
    }, []);

    // Stop the render loop entirely once the hero has scrolled out of view.
    const wrapper = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(true);
    useEffect(() => {
        const el = wrapper.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, [data]);

    if (!data) return null;

    return (
        <div ref={wrapper} className="w-full h-full">
        <Canvas
            frameloop={inView ? "always" : "never"}
            dpr={[1, 1.5]}
            camera={{ fov: 35, position: [0, 0, 10] }}
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            style={{ pointerEvents: "none" }}
        >
            <Particles data={data} reducedMotion={reducedMotion} />
        </Canvas>
        </div>
    );
}
