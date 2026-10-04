/* eslint-disable react-hooks/immutability -- three.js objects are mutated per-frame by design */
"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Download, Mail } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { AbstractShape } from "./Crazy3DModel";
import { AuroraGrid, CodeRain } from "./HeroBackground";

gsap.registerPlugin(ScrollTrigger);

const RING_PHOTOS = [
    "/profile-hero.jpg",
    "/gallery/hackelite-26.jpg",
    "/gallery/sih-urbanpulse.png",
    "/profile.jpg",
    "/gallery/xenkrypt-team.jpg",
    "/gallery/codemavens-punya.png",
    "/gallery/rack-server.png",
];

const SKIN = "#b87b57";
const SUIT = "#0c0d14";
const PANTS = "#14151d";

const CAPTIONS = [
    { kicker: "01 — Hello", title: "Meet Yash", body: "Full-stack developer & DevSecOps engineer. Pull up a chair — this is where it happens." },
    { kicker: "02 — Focus", title: "Built with intent", body: "System design, clean APIs and secure pipelines. Every line is shipped with a reason." },
    { kicker: "03 — Flow", title: "Always shipping", body: "From idea to cloud-native production — typing, testing, deploying, repeat." },
    { kicker: "04 — Behind the screen", title: "Code, all day", body: "React, Node, Docker, Kubernetes, CI/CD. A look over the shoulder." },
    { kicker: "05 — Moments", title: "Hackathons & teams", body: "Wins, late nights and the people I build with. Scroll on to see the work." },
];

/* ─────────────── helpers ─────────────── */

const _dir = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

/** Stretch a unit-height cylinder so it spans from a to b. */
function span(mesh: THREE.Object3D | null, a: THREE.Vector3, b: THREE.Vector3) {
    if (!mesh) return;
    _dir.subVectors(b, a);
    const len = _dir.length();
    mesh.position.copy(a).addScaledVector(_dir, 0.5);
    mesh.quaternion.setFromUnitVectors(UP, _dir.normalize());
    mesh.scale.set(1, len, 1);
}

/* ─────────────── laptop screen (live "code" canvas) ─────────────── */

const CODE = [
    "import { ship } from '@yash/craft';",
    "",
    "const stack = ['React', 'Node', 'Docker', 'K8s'];",
    "",
    "async function deploy(app) {",
    "  await scan(app, { sast: true, deps: true });",
    "  const image = await build(app);",
    "  await push(image, 'registry.prod');",
    "  return rollout(image, { zeroDowntime: true });",
    "}",
    "",
    "// DevSecOps: security is a feature",
    "export default async function main() {",
    "  for (const app of stack) {",
    "    const url = await deploy(app);",
    "    console.log(`live -> ${url}`);",
    "  }",
    "  return 'Shipped. Coffee time.';",
    "}",
];

function colorFor(token: string) {
    if (/^(import|from|const|async|await|function|return|export|default|for|of)$/.test(token)) return "#c792ea";
    if (/^'.*'$|^`.*`$/.test(token)) return "#c3e88d";
    if (/^\/\//.test(token)) return "#5c6b8a";
    if (/^\d+$/.test(token)) return "#f78c6c";
    if (/^(true|false)$/.test(token)) return "#ff5370";
    return "#d6e2ff";
}

function useScreenTexture() {
    return useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext("2d")!;
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;

        let last = -1;
        const draw = (time: number) => {
            const step = Math.floor(time * 6);
            if (step === last) return;
            last = step;
            ctx.fillStyle = "#090d1c";
            ctx.fillRect(0, 0, 640, 400);
            // title bar
            ctx.fillStyle = "#121933";
            ctx.fillRect(0, 0, 640, 30);
            ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
                ctx.fillStyle = c;
                ctx.beginPath();
                ctx.arc(18 + i * 20, 15, 6, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.fillStyle = "#8da2d6";
            ctx.font = "13px monospace";
            ctx.fillText("deploy.ts — yash-portfolio", 240, 20);

            ctx.font = "17px monospace";
            const typed = Math.floor(time * 18);
            const total = CODE.reduce((n, l) => n + l.length + 1, 0);
            let budget = typed % (total + 60);
            const visibleLines = 14;
            let y = 56;
            // scroll once the typed text fills the window
            const lineStart = Math.max(0, Math.floor(Math.min(budget, total) / 34) - 9) % CODE.length;
            for (let i = 0; i < visibleLines; i++) {
                const line = CODE[(lineStart + i) % CODE.length];
                ctx.fillStyle = "#3a4666";
                ctx.fillText(String(lineStart + i + 1).padStart(2, " "), 12, y);
                let x = 46;
                const tokens = line.match(/(\/\/.*|'[^']*'|`[^`]*`|\w+|\s+|.)/g) ?? [];
                for (const tk of tokens) {
                    if (budget <= 0) break;
                    const shown = tk.slice(0, budget);
                    budget -= tk.length;
                    ctx.fillStyle = colorFor(tk);
                    ctx.fillText(shown, x, y);
                    x += ctx.measureText(tk).width;
                }
                y += 24;
                if (budget <= 0) {
                    if (Math.floor(time * 2) % 2 === 0) {
                        ctx.fillStyle = "#7dd3fc";
                        ctx.fillRect(x + 2, y - 42, 9, 20);
                    }
                    break;
                }
            }
            tex.needsUpdate = true;
        };
        draw(0);
        return { tex, draw };
    }, []);
}

/* ─────────────── the developer (procedural, seated) ─────────────── */

function Developer() {
    const screen = useScreenTexture();

    const rig = useRef<THREE.Group>(null);
    const head = useRef<THREE.Group>(null);
    const bones = useRef<THREE.Mesh[]>([]);
    const joints = useRef<THREE.Mesh[]>([]);
    const handL = useRef<THREE.Mesh>(null);
    const handR = useRef<THREE.Mesh>(null);
    const mug = useRef<THREE.Group>(null);
    const glow = useRef<THREE.Mesh>(null);
    const eyes = useRef<THREE.Group[]>([]);
    const irises = useRef<THREE.Group[]>([]);
    const torso = useRef<THREE.Group>(null);
    const pointer = useThree((s) => s.pointer);

    const P = useMemo(
        () => ({
            shL: new THREE.Vector3(-0.26, 1.04, 0.05),
            shR: new THREE.Vector3(0.26, 1.04, 0.05),
            elL: new THREE.Vector3(-0.33, 0.84, 0.2),
            elR: new THREE.Vector3(0.33, 0.84, 0.2),
            haL: new THREE.Vector3(-0.12, 0.83, 0.62),
            haR: new THREE.Vector3(0.12, 0.83, 0.62),
            hipL: new THREE.Vector3(-0.12, 0.63, 0.0),
            hipR: new THREE.Vector3(0.12, 0.63, 0.0),
            knL: new THREE.Vector3(-0.15, 0.65, 0.46),
            knR: new THREE.Vector3(0.15, 0.65, 0.46),
            anL: new THREE.Vector3(-0.15, 0.13, 0.52),
            anR: new THREE.Vector3(0.15, 0.13, 0.52),
        }),
        [],
    );

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        screen.draw(t);

        // typing: hands tap alternately, elbows follow
        const a = Math.sin(t * 11);
        const b = Math.sin(t * 11 + 2.2);
        P.haL.set(-0.12 + Math.sin(t * 2.3) * 0.03, 0.83 + Math.max(0, a) * 0.018, 0.62 + Math.sin(t * 1.7) * 0.02);
        P.haR.set(0.12 + Math.cos(t * 2.1) * 0.03, 0.83 + Math.max(0, b) * 0.018, 0.62 + Math.cos(t * 1.9) * 0.02);
        P.elL.y = 0.84 + a * 0.004;
        P.elR.y = 0.84 + b * 0.004;

        const B = bones.current;
        span(B[0], P.shL, P.elL);
        span(B[1], P.elL, P.haL);
        span(B[2], P.shR, P.elR);
        span(B[3], P.elR, P.haR);
        span(B[4], P.hipL, P.knL);
        span(B[5], P.knL, P.anL);
        span(B[6], P.hipR, P.knR);
        span(B[7], P.knR, P.anR);
        joints.current[0]?.position.copy(P.elL);
        joints.current[1]?.position.copy(P.elR);
        joints.current[2]?.position.copy(P.knL);
        joints.current[3]?.position.copy(P.knR);
        handL.current?.position.copy(P.haL);
        handR.current?.position.copy(P.haR);

        // breathing + idle swivel + head follows the pointer
        if (rig.current) {
            rig.current.rotation.y = Math.sin(t * 0.35) * 0.1;
            rig.current.position.y = Math.sin(t * 1.6) * 0.004;
        }
        if (head.current) {
            const tx = pointer.x * 0.55;
            const ty = -pointer.y * 0.3 + 0.12;
            head.current.rotation.y += (tx - head.current.rotation.y) * 0.06;
            head.current.rotation.x += (ty - head.current.rotation.x) * 0.06;
        }
        if (mug.current) mug.current.rotation.y = t * 0.2;
        if (glow.current) (glow.current.material as THREE.MeshStandardMaterial).emissive.setHSL((0.75 + Math.sin(t * 0.3) * 0.12) % 1, 0.85, 0.55);

        // blink every ~3.5s, irises glance toward the pointer
        const phase = t % 3.5;
        const blink = phase > 3.3 ? 1 - Math.sin(((phase - 3.3) / 0.2) * Math.PI) * 0.92 : 1;
        eyes.current.forEach((e) => e && (e.scale.y += (blink - e.scale.y) * 0.5));
        irises.current.forEach((e) => {
            if (!e) return;
            e.position.x += (pointer.x * 0.05 - e.position.x) * 0.1;
            e.position.y += (pointer.y * 0.035 - e.position.y) * 0.1;
        });
        if (torso.current) torso.current.scale.set(1 + Math.sin(t * 1.6) * 0.008, 1 + Math.sin(t * 1.6) * 0.012, 1);
    });

    const bone = (i: number, r: number, color: string) => (
        <mesh ref={(m) => { if (m) bones.current[i] = m; }} castShadow>
            <cylinderGeometry args={[r, r, 1, 28]} />
            <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
    );
    const joint = (i: number, r: number, color: string) => (
        <mesh ref={(m) => { if (m) joints.current[i] = m; }} castShadow>
            <sphereGeometry args={[r, 32, 32]} />
            <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
    );

    return (
        <group>
            {/* ── room: floor, desk, laptop, props ── */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[14, 64]} />
                <meshStandardMaterial color="#0b0c18" roughness={0.35} metalness={0.4} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
                <ringGeometry args={[2.35, 2.4, 96]} />
                <meshBasicMaterial color="#a855f7" transparent opacity={0.55} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
                <ringGeometry args={[3.3, 3.32, 96]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
            </mesh>

            <Neon />
            {/* rug + plant */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.3]} receiveShadow>
                <circleGeometry args={[1.7, 64]} />
                <meshStandardMaterial color="#1b1233" roughness={0.95} />
            </mesh>
            <group position={[-1.5, 0, 0.35]} scale={0.65}>
                <mesh position={[0, 0.2, 0]} castShadow>
                    <cylinderGeometry args={[0.17, 0.12, 0.4, 32]} />
                    <meshStandardMaterial color="#e9e4f5" roughness={0.5} />
                </mesh>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <mesh
                        key={i}
                        position={[Math.cos(i * 0.9) * 0.14, 0.62 + (i % 3) * 0.1, Math.sin(i * 0.9) * 0.14]}
                        rotation={[Math.sin(i * 0.9) * 0.5, 0, -Math.cos(i * 0.9) * 0.5]}
                        scale={[0.09, 0.3, 0.035]}
                        castShadow
                    >
                        <sphereGeometry args={[1, 24, 16]} />
                        <meshStandardMaterial color={i % 2 ? "#16a34a" : "#22c55e"} roughness={0.6} />
                    </mesh>
                ))}
            </group>

            {/* desk */}
            <group position={[0, 0, 0.75]}>
                <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.9, 0.05, 0.8]} />
                    <meshStandardMaterial color="#2a1c14" roughness={0.45} />
                </mesh>
                {[-0.88, 0.88].map((x) => (
                    <mesh key={x} position={[x, 0.39, 0]} castShadow>
                        <boxGeometry args={[0.05, 0.78, 0.7]} />
                        <meshStandardMaterial color="#14141c" metalness={0.6} roughness={0.35} />
                    </mesh>
                ))}
                <mesh ref={glow} position={[0, 0.745, 0.405]}>
                    <boxGeometry args={[1.8, 0.012, 0.012]} />
                    <meshStandardMaterial color="#000" emissive="#a855f7" emissiveIntensity={3} toneMapped={false} />
                </mesh>
                {/* laptop */}
                <group position={[0, 0.805, 0]}>
                    <mesh position={[0, 0.0125, 0]} castShadow>
                        <boxGeometry args={[0.62, 0.025, 0.4]} />
                        <meshStandardMaterial color="#8a8d99" metalness={0.9} roughness={0.3} />
                    </mesh>
                    <mesh position={[0, 0.0262, -0.02]}>
                        <boxGeometry args={[0.52, 0.003, 0.2]} />
                        <meshStandardMaterial color="#15161d" roughness={0.9} />
                    </mesh>
                    <group position={[0, 0.025, 0.2]} rotation={[0.28, 0, 0]}>
                        <mesh position={[0, 0.2, 0.006]} castShadow>
                            <boxGeometry args={[0.62, 0.4, 0.012]} />
                            <meshStandardMaterial color="#8a8d99" metalness={0.9} roughness={0.3} />
                        </mesh>
                        <mesh position={[0, 0.2, -0.0005]} rotation={[0, Math.PI, 0]}>
                            <planeGeometry args={[0.58, 0.36]} />
                            <meshBasicMaterial map={screen.tex} toneMapped={false} />
                        </mesh>
                        {/* glowing logo on the back of the lid */}
                        <mesh position={[0, 0.2, 0.0125]}>
                            <circleGeometry args={[0.03, 24]} />
                            <meshBasicMaterial color="#c4b5fd" toneMapped={false} />
                        </mesh>
                    </group>
                </group>
                {/* mug + lamp */}
                <group ref={mug} position={[0.7, 0.805, 0.1]}>
                    <mesh position={[0, 0.05, 0]} castShadow>
                        <cylinderGeometry args={[0.045, 0.04, 0.1, 20]} />
                        <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
                    </mesh>
                    <mesh position={[0.05, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.025, 0.007, 8, 16]} />
                        <meshStandardMaterial color="#f5f5f5" />
                    </mesh>
                </group>
                <group position={[-0.7, 0.805, 0.1]}>
                    <mesh position={[0, 0.01, 0]}>
                        <cylinderGeometry args={[0.08, 0.09, 0.02, 24]} />
                        <meshStandardMaterial color="#1a1a22" metalness={0.7} roughness={0.3} />
                    </mesh>
                    <mesh position={[0, 0.2, 0]}>
                        <cylinderGeometry args={[0.008, 0.008, 0.4, 8]} />
                        <meshStandardMaterial color="#1a1a22" metalness={0.7} roughness={0.3} />
                    </mesh>
                    <mesh position={[0.05, 0.4, 0]} rotation={[0, 0, -0.5]}>
                        <coneGeometry args={[0.06, 0.1, 20, 1, true]} />
                        <meshStandardMaterial color="#f59e0b" side={THREE.DoubleSide} emissive="#f59e0b" emissiveIntensity={0.6} />
                    </mesh>
                    <pointLight position={[0.06, 0.36, 0]} color="#ffb259" intensity={1.2} distance={2.5} />
                </group>
            </group>

            {/* ── chair + developer ── */}
            <group ref={rig}>
                {/* chair */}
                <mesh position={[0, 0.3, -0.02]} castShadow>
                    <cylinderGeometry args={[0.04, 0.05, 0.4, 12]} />
                    <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
                </mesh>
                {[0, 1, 2, 3, 4].map((i) => (
                    <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
                        <mesh position={[0, 0.06, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                            <boxGeometry args={[0.05, 0.4, 0.035]} />
                            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
                        </mesh>
                        <mesh position={[0, 0.03, 0.39]} castShadow>
                            <sphereGeometry args={[0.035, 12, 12]} />
                            <meshStandardMaterial color="#111" />
                        </mesh>
                    </group>
                ))}
                <mesh position={[0, 0.52, -0.02]} castShadow receiveShadow>
                    <boxGeometry args={[0.56, 0.09, 0.54]} />
                    <meshStandardMaterial color="#5b21b6" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.92, -0.32]} rotation={[-0.08, 0, 0]} castShadow>
                    <boxGeometry args={[0.52, 0.75, 0.07]} />
                    <meshStandardMaterial color="#6d28d9" roughness={0.6} />
                </mesh>
                {[-0.31, 0.31].map((x) => (
                    <group key={x}>
                        <mesh position={[x, 0.72, -0.08]} castShadow>
                            <boxGeometry args={[0.04, 0.03, 0.34]} />
                            <meshStandardMaterial color="#222" />
                        </mesh>
                        <mesh position={[x, 0.62, -0.2]} castShadow>
                            <boxGeometry args={[0.03, 0.2, 0.03]} />
                            <meshStandardMaterial color="#222" />
                        </mesh>
                    </group>
                ))}

                {/* pelvis + torso */}
                <mesh position={[0, 0.62, 0]} scale={[1.25, 0.7, 0.9]} castShadow>
                    <sphereGeometry args={[0.2, 24, 24]} />
                    <meshStandardMaterial color={PANTS} roughness={0.8} />
                </mesh>
                <group ref={torso} position={[0, 0.62, 0]} rotation={[0.07, 0, 0]}>
                    <mesh position={[0, 0.3, 0]} scale={[1.2, 1, 0.82]} castShadow>
                        <capsuleGeometry args={[0.17, 0.3, 10, 24]} />
                        <meshStandardMaterial color={SUIT} roughness={0.75} />
                    </mesh>
                    {/* shirt + tie */}
                    <mesh position={[0, 0.4, 0.137]}>
                        <boxGeometry args={[0.09, 0.3, 0.01]} />
                        <meshStandardMaterial color="#f4f4f6" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.37, 0.145]}>
                        <boxGeometry args={[0.045, 0.27, 0.012]} />
                        <meshStandardMaterial color="#14224a" roughness={0.6} />
                    </mesh>
                </group>
                {[P.shL, P.shR].map((s, i) => (
                    <mesh key={i} position={s} castShadow>
                        <sphereGeometry args={[0.085, 16, 16]} />
                        <meshStandardMaterial color={SUIT} roughness={0.75} />
                    </mesh>
                ))}

                {/* limbs */}
                {bone(0, 0.065, SUIT)}
                {bone(1, 0.052, SUIT)}
                {bone(2, 0.065, SUIT)}
                {bone(3, 0.052, SUIT)}
                {bone(4, 0.095, PANTS)}
                {bone(5, 0.07, PANTS)}
                {bone(6, 0.095, PANTS)}
                {bone(7, 0.07, PANTS)}
                {joint(0, 0.058, SUIT)}
                {joint(1, 0.058, SUIT)}
                {joint(2, 0.09, PANTS)}
                {joint(3, 0.09, PANTS)}
                <mesh ref={handL} castShadow>
                    <sphereGeometry args={[0.048, 14, 14]} />
                    <meshStandardMaterial color={SKIN} roughness={0.6} />
                </mesh>
                <mesh ref={handR} castShadow>
                    <sphereGeometry args={[0.048, 14, 14]} />
                    <meshStandardMaterial color={SKIN} roughness={0.6} />
                </mesh>
                {[-0.15, 0.15].map((x) => (
                    <mesh key={x} position={[x, 0.07, 0.58]} castShadow>
                        <boxGeometry args={[0.11, 0.08, 0.26]} />
                        <meshStandardMaterial color="#f5f5f5" roughness={0.5} />
                    </mesh>
                ))}

                {/* neck + collar */}
                <mesh position={[0, 1.17, 0.04]} castShadow>
                    <cylinderGeometry args={[0.055, 0.065, 0.12, 28]} />
                    <meshStandardMaterial color={SKIN} roughness={0.55} />
                </mesh>
                <mesh position={[0, 1.12, 0.045]} rotation={[Math.PI / 2 - 0.1, 0, 0]}>
                    <torusGeometry args={[0.075, 0.017, 12, 32]} />
                    <meshStandardMaterial color="#f4f4f6" roughness={0.7} />
                </mesh>

                {/* head */}
                <group ref={head} position={[0, 1.37, 0.05]}>
                    <group scale={[0.145, 0.185, 0.155]}>
                        <mesh castShadow>
                            <sphereGeometry args={[1, 64, 64]} />
                            <meshStandardMaterial color={SKIN} roughness={0.55} />
                        </mesh>
                        {/* hair: cap + swept quiff + back */}
                        <mesh scale={1.045} rotation={[-0.3, 0, 0]} castShadow>
                            <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, 0.98]} />
                            <meshStandardMaterial color="#09080b" roughness={0.65} />
                        </mesh>
                        <mesh position={[0.05, 0.62, 0.42]} rotation={[0.5, 0, -0.08]} scale={[0.9, 0.42, 0.7]}>
                            <sphereGeometry args={[1, 32, 20]} />
                            <meshStandardMaterial color="#09080b" roughness={0.65} />
                        </mesh>
                        {/* ears */}
                        {[-1, 1].map((sd) => (
                            <mesh key={sd} position={[sd * 0.97, -0.04, 0.02]} scale={[0.17, 0.3, 0.2]}>
                                <sphereGeometry args={[1, 24, 24]} />
                                <meshStandardMaterial color={SKIN} roughness={0.55} />
                            </mesh>
                        ))}
                        {/* headphones */}
                        <mesh position={[0, 0.02, 0]} rotation={[0, 0, 0]}>
                            <torusGeometry args={[1.1, 0.07, 16, 64, Math.PI]} />
                            <meshStandardMaterial color="#12121c" metalness={0.6} roughness={0.3} />
                        </mesh>
                        {[-1, 1].map((sd) => (
                            <group key={sd} position={[sd * 1.08, -0.02, 0.02]} rotation={[0, 0, Math.PI / 2]}>
                                <mesh scale={[1, 1, 0.9]}>
                                    <cylinderGeometry args={[0.36, 0.36, 0.3, 40]} />
                                    <meshStandardMaterial color="#14141f" metalness={0.5} roughness={0.35} />
                                </mesh>
                                <mesh position={[0, -sd * 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
                                    <torusGeometry args={[0.25, 0.028, 12, 48]} />
                                    <meshStandardMaterial color="#000" emissive={sd > 0 ? "#22d3ee" : "#a855f7"} emissiveIntensity={3} toneMapped={false} />
                                </mesh>
                            </group>
                        ))}
                        {/* eyes */}
                        {[-1, 1].map((sd, i) => (
                            <group key={sd} position={[sd * 0.36, 0.1, 0.9]} rotation={[0, sd * 0.38, 0]}>
                                <group ref={(g) => { if (g) eyes.current[i] = g; }}>
                                    <mesh scale={[1, 0.8, 0.5]}>
                                        <sphereGeometry args={[0.15, 32, 32]} />
                                        <meshStandardMaterial color="#fbfbfd" roughness={0.2} />
                                    </mesh>
                                    <group ref={(g) => { if (g) irises.current[i] = g; }}>
                                        <mesh position={[0, 0, 0.055]} scale={[1, 1, 0.35]}>
                                            <sphereGeometry args={[0.085, 32, 32]} />
                                            <meshStandardMaterial color="#4a2a17" roughness={0.3} />
                                        </mesh>
                                        <mesh position={[0, 0, 0.075]} scale={[1, 1, 0.3]}>
                                            <sphereGeometry args={[0.045, 24, 24]} />
                                            <meshBasicMaterial color="#030305" />
                                        </mesh>
                                        <mesh position={[0.03, 0.035, 0.088]}>
                                            <sphereGeometry args={[0.014, 12, 12]} />
                                            <meshBasicMaterial color="#ffffff" toneMapped={false} />
                                        </mesh>
                                    </group>
                                </group>
                                {/* eyebrow */}
                                <mesh position={[sd * 0.01, 0.2, 0.0]} rotation={[0, 0, sd * -0.12]} scale={[1, 0.28, 0.5]}>
                                    <capsuleGeometry args={[0.07, 0.17, 8, 16]} />
                                    <meshStandardMaterial color="#0a0809" roughness={0.9} />
                                </mesh>
                            </group>
                        ))}
                        {/* nose */}
                        <mesh position={[0, -0.12, 0.99]} scale={[0.75, 1, 0.8]}>
                            <sphereGeometry args={[0.11, 24, 24]} />
                            <meshStandardMaterial color={SKIN} roughness={0.5} />
                        </mesh>
                        {/* beard: chin + sideburns */}
                        <mesh scale={1.03}>
                            <sphereGeometry args={[1, 48, 32, Math.PI / 2 - 1.0, 2.0, 2.2, 0.85]} />
                            <meshStandardMaterial color="#120d0b" roughness={0.95} />
                        </mesh>
                        {/* mustache + smile */}
                        <mesh position={[0, -0.27, 0.935]} rotation={[0.25, 0, 0]}>
                            <torusGeometry args={[0.17, 0.035, 10, 28, Math.PI]} />
                            <meshStandardMaterial color="#0d0908" roughness={0.9} />
                        </mesh>
                        <mesh position={[0, -0.36, 0.935]} rotation={[0.25, 0, Math.PI]}>
                            <torusGeometry args={[0.13, 0.016, 10, 28, Math.PI * 0.85]} />
                            <meshStandardMaterial color="#8a4b45" roughness={0.5} />
                        </mesh>
                    </group>
                </group>
            </group>

            {/* screen glow onto the developer's face */}
            <pointLight position={[0, 1.25, 0.75]} color="#7dd3fc" intensity={1.4} distance={2.2} />
        </group>
    );
}

/* ─────────────── floating photo ring ─────────────── */

function PhotoFrame({ tex, angle, radius, y }: { tex: THREE.Texture; angle: number; radius: number; y: number }) {
    const ref = useRef<THREE.Group>(null);
    const img = tex.image as { width: number; height: number };
    const aspect = img.width / img.height;
    const h = 2.6;
    const w = Math.min(h * aspect, 3.8);
    const hh = w / aspect > 3.2 ? 3.2 : w / aspect;

    useEffect(() => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.needsUpdate = true;
    }, [tex]);

    useEffect(() => {
        ref.current?.lookAt(0, y, 0);
    }, [y]);

    useFrame((state) => {
        if (ref.current) ref.current.position.y = y + Math.sin(state.clock.elapsedTime * 0.8 + angle * 3) * 0.12;
    });

    return (
        <group ref={ref} position={[Math.sin(angle) * radius, y, Math.cos(angle) * radius]}>
            <mesh position={[0, 0, -0.04]}>
                <boxGeometry args={[w + 0.14, hh + 0.14, 0.06]} />
                <meshStandardMaterial color="#f5f3ff" roughness={0.3} metalness={0.2} emissive="#a855f7" emissiveIntensity={0.25} />
            </mesh>
            <mesh>
                <planeGeometry args={[w, hh]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
            </mesh>
        </group>
    );
}

function PhotoRing({ progress }: { progress: React.MutableRefObject<number> }) {
    const textures = useLoader(THREE.TextureLoader, RING_PHOTOS);
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.elapsedTime * 0.05 + progress.current * Math.PI * 1.2;
        }
    });

    return (
        <group ref={group}>
            {textures.map((tex, i) => (
                <PhotoFrame key={RING_PHOTOS[i]} tex={tex} angle={(i / textures.length) * Math.PI * 2} radius={8.2} y={3.1} />
            ))}
        </group>
    );
}

/** Soft glow on anything emissive, so neon, lamp and headphones feel lit. */
function Bloom() {
    const { gl, scene, camera, size } = useThree();
    const composer = useMemo(() => {
        const rt = new THREE.WebGLRenderTarget(size.width, size.height, { type: THREE.HalfFloatType, samples: 4 });
        const c = new EffectComposer(gl, rt);
        c.addPass(new RenderPass(scene, camera));
        c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.7, 0.65, 0.97));
        c.addPass(new OutputPass());
        return c;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gl, scene, camera]);
    useEffect(() => {
        composer.setPixelRatio(gl.getPixelRatio());
        composer.setSize(size.width, size.height);
    }, [composer, gl, size]);
    useEffect(() => () => composer.dispose(), [composer]);
    useFrame((_, dt) => composer.render(dt), 1);
    return null;
}

/** The first page's wireframe orb, now a halo behind the developer that collapses as you scroll. */
function HeroOrb({ progress }: { progress: React.MutableRefObject<number> }) {
    const g = useRef<THREE.Group>(null);
    useFrame(() => {
        if (!g.current) return;
        const k = 1 - THREE.MathUtils.smoothstep(progress.current, 0.02, 0.2);
        g.current.visible = k > 0.01;
        g.current.scale.setScalar(Math.max(k, 0.001) * 0.72);
    });
    return (
        <group ref={g} position={[0, 1.5, -1.7]}>
            <AbstractShape />
        </group>
    );
}

function Neon() {
    const grid = useMemo(() => {
        const gr = new THREE.GridHelper(40, 80, "#7c3aed", "#241545");
        const m = gr.material as THREE.LineBasicMaterial;
        m.transparent = true;
        m.opacity = 0.35;
        gr.position.y = 0.004;
        return gr;
    }, []);
    const shapes = useRef<THREE.Group>(null);
    useFrame((s) => {
        const t = s.clock.elapsedTime;
        shapes.current?.children.forEach((c, i) => {
            c.rotation.x = t * (0.2 + i * 0.05);
            c.rotation.y = t * (0.25 + i * 0.04);
            c.position.y = 1.3 + (i % 3) * 0.7 + Math.sin(t * 0.7 + i) * 0.15;
        });
    });
    const arch = (r: number, color: string, w: number) => (
        <mesh position={[0, 0, 0]}>
            <torusGeometry args={[r, w, 16, 120, Math.PI]} />
            <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={3.2} toneMapped={false} />
        </mesh>
    );
    const spots: [number, number, number][] = [[-3.4, 0, -1.2], [3.5, 0, -1.6], [-4.2, 0, 1.5], [4.4, 0, 1.2], [-2.2, 0, -3.2], [2.4, 0, -3.4]];
    return (
        <group>
            <primitive object={grid} />
            <group position={[0, 0, -2.3]}>
                {arch(2.3, "#a855f7", 0.028)}
                {arch(2.0, "#22d3ee", 0.018)}
                {[-2.3, 2.3, -2.0, 2.0].map((x) => (
                    <mesh key={x} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.12, 24]} />
                        <meshBasicMaterial color={Math.abs(x) > 2.1 ? "#a855f7" : "#22d3ee"} toneMapped={false} />
                    </mesh>
                ))}
            </group>
            <group ref={shapes}>
                {spots.map((p, i) => (
                    <mesh key={i} position={p}>
                        {i % 3 === 0 ? <octahedronGeometry args={[0.28]} /> : i % 3 === 1 ? <icosahedronGeometry args={[0.26]} /> : <torusGeometry args={[0.24, 0.07, 12, 32]} />}
                        <meshStandardMaterial color="#0b0b18" emissive={i % 2 ? "#22d3ee" : "#a855f7"} emissiveIntensity={1.6} wireframe toneMapped={false} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

const TECH = ["React", "Node.js", "Docker", "Kubernetes", "AWS", "Next.js", "TypeScript", "CI/CD"];

function TechOrbit({ progress }: { progress: React.MutableRefObject<number> }) {
    const group = useRef<THREE.Group>(null);
    const sprites = useMemo(
        () =>
            TECH.map((label, i) => {
                const c = document.createElement("canvas");
                c.width = 320;
                c.height = 96;
                const g = c.getContext("2d")!;
                g.fillStyle = "rgba(15,12,35,0.75)";
                g.beginPath();
                g.roundRect(4, 4, 312, 88, 44);
                g.fill();
                g.strokeStyle = i % 2 ? "#22d3ee" : "#c084fc";
                g.lineWidth = 3;
                g.stroke();
                g.fillStyle = "#fff";
                g.font = "600 40px sans-serif";
                g.textAlign = "center";
                g.textBaseline = "middle";
                g.fillText(label, 160, 50);
                const tex = new THREE.CanvasTexture(c);
                tex.colorSpace = THREE.SRGBColorSpace;
                return tex;
            }),
        [],
    );
    useFrame((s) => {
        if (!group.current) return;
        group.current.rotation.y = s.clock.elapsedTime * 0.12;
        // only show the halo on the wide shots, so it never blocks the close-ups
        const p = progress.current;
        const o = THREE.MathUtils.smoothstep(p, 0.82, 0.95);
        group.current.children.forEach((c) => ((c as THREE.Sprite).material.opacity = o));
    });
    return (
        <group ref={group}>
            {sprites.map((tex, i) => {
                const a = (i / sprites.length) * Math.PI * 2;
                return (
                    <sprite key={i} position={[Math.cos(a) * 1.5, 2.05 + Math.sin(a * 2) * 0.12, Math.sin(a) * 1.5]} scale={[0.62, 0.19, 1]}>
                        <spriteMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
                    </sprite>
                );
            })}
        </group>
    );
}

function Dust() {
    const ref = useRef<THREE.Points>(null);
    const positions = useMemo(() => {
        const arr = new Float32Array(600 * 3);
        let seed = 7;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
        for (let i = 0; i < 600; i++) {
            const r = 2 + rnd() * 8;
            const a = rnd() * Math.PI * 2;
            arr[i * 3] = Math.cos(a) * r;
            arr[i * 3 + 1] = rnd() * 6;
            arr[i * 3 + 2] = Math.sin(a) * r;
        }
        return arr;
    }, []);
    const dot = useMemo(() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d")!;
        const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, "#fff");
        gr.addColorStop(1, "#000");
        g.fillStyle = gr;
        g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }, []);
    useFrame((s) => {
        if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.02;
    });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.06} color="#c4b5fd" map={dot} alphaMap={dot} transparent opacity={0.8} depthWrite={false} sizeAttenuation />
        </points>
    );
}

/* ─────────────── scroll-driven camera ─────────────── */

const CAM_POS = [
    [0, 1.55, 4.4],
    [3.8, 2.4, 4.6],
    [0.5, 1.58, 2.2],
    [3.0, 1.25, 0.5],
    [-2.3, 1.9, -0.6],
    [0, 2.3, 4.9],
].map(([x, y, z]) => new THREE.Vector3(x, y, z));
const CAM_TARGET = [
    [0, 1.2, 0.2],
    [0, 1.0, 0.3],
    [0, 1.3, 0.0],
    [0, 1.0, 0.45],
    [0, 1.05, 0.9],
    [0, 1.3, 0.0],
].map(([x, y, z]) => new THREE.Vector3(x, y, z));
const posCurve = new THREE.CatmullRomCurve3(CAM_POS, false, "catmullrom", 0.4);
const targetCurve = new THREE.CatmullRomCurve3(CAM_TARGET, false, "catmullrom", 0.4);

function CameraRig({ progress, view }: { progress: React.MutableRefObject<number>; view: React.MutableRefObject<number> }) {
    const { camera, pointer } = useThree();
    const smooth = useRef(0);
    const look = useMemo(() => new THREE.Vector3(), []);
    const pos = useMemo(() => new THREE.Vector3(), []);

    const size = useThree((s) => s.size);
    const shift = useRef(-1);
    useEffect(() => {
        shift.current = -1; // force re-apply on resize
        return () => camera.clearViewOffset();
    }, [camera, size]);

    useFrame((_, dt) => {
        smooth.current = THREE.MathUtils.damp(smooth.current, progress.current, 3.5, dt);
        const t = THREE.MathUtils.clamp(smooth.current, 0, 1);
        posCurve.getPoint(t, pos);
        targetCurve.getPoint(t, look);
        // on desktop, nudge the scene right as the hero opens so the captions on the left stay clear
        const sh = size.width >= 768 ? Math.round(view.current * 1000) / 1000 : 0;
        if (sh !== shift.current) {
            shift.current = sh;
            if (sh === 0) camera.clearViewOffset();
            else camera.setViewOffset(size.width, size.height, -size.width * 0.14 * sh, 0, size.width, size.height);
        }
        camera.position.set(pos.x + pointer.x * 0.25, pos.y + pointer.y * 0.15, pos.z);
        camera.lookAt(look);
    });
    return null;
}

/* ─────────────── section ─────────────── */

export default function DeskScene() {
    const root = useRef<HTMLElement>(null);
    const progress = useRef(0);
    const view = useRef(0);

    useGSAP(
        () => {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const mobile = window.innerWidth < 768;
            const caps = gsap.utils.toArray<HTMLElement>(".desk-caption");
            const count = caps.length;
            gsap.set(caps, { opacity: 0, y: 40 });

            // intro: the split hero builds itself on load
            if (!reduce) {
                gsap.from(".hero-title", { yPercent: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 });
                gsap.from(".hero-copy", { y: 20, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.7 });
                gsap.from(".hero-center > *", { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 1.0 });
                gsap.from(".hero-line", { scaleY: 0, transformOrigin: "top", duration: 1, ease: "power3.out", delay: 0.4 });
            }

            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: root.current,
                    start: "top top",
                    end: reduce ? "+=100%" : `+=${(count + 1) * 90}%`,
                    scrub: 1.2,
                    pin: true,
                    anticipatePin: 1,
                },
            });
            // unit 0..1 : the hero splits open and the camera drifts into the scene
            const out = mobile ? { yPercent: -110 } : { xPercent: -105 };
            const outR = mobile ? { yPercent: 110 } : { xPercent: 105 };
            tl.to(".hero-panel-left", { ...out, duration: 0.9, ease: "power3.in" }, 0.05);
            tl.to(".hero-panel-right", { ...outR, duration: 0.9, ease: "power3.in" }, 0.05);
            tl.to(".hero-center", { opacity: 0, y: 30, duration: 0.4 }, 0);
            tl.to(".hero-line", { opacity: 0, duration: 0.3 }, 0);
            tl.to(progress, { current: 0.2, duration: 1, ease: "power1.inOut" }, 0);
            tl.to(view, { current: 1, duration: 1, ease: "power1.inOut" }, 0);
            // unit 1..(count+1) : the story
            tl.to(progress, { current: 1, duration: count }, 1);
            tl.to(".desk-bar", { scaleX: 1, duration: count + 1, transformOrigin: "left" }, 0);
            caps.forEach((c, i) => {
                tl.to(c, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, i + 1.05);
                if (i < count - 1) tl.to(c, { opacity: 0, y: -40, duration: 0.2, ease: "power2.in" }, i + 1.8);
            });
            tl.fromTo(".desk-hint", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.9);
            tl.to(".desk-hint", { opacity: 0, duration: 0.2 }, 1.7);
        },
        { scope: root },
    );

    const [first, second] = portfolioData.personal.title.split("|").map((x) => x.trim());

    return (
        <section
            id="hero"
            ref={root}
            className="relative h-screen w-full overflow-hidden bg-[#05060e]"
            aria-label="Yash Srivastava — hero and 3D scene of him working at his desk"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(109,40,217,0.25),transparent_60%)]" />

            <Canvas
                shadows
                dpr={[1, 1.75]}
                camera={{ fov: 42, near: 0.1, far: 60, position: [0, 1.55, 4.4] }}
                gl={{ antialias: true }}
                className="!absolute inset-0"
            >
                <color attach="background" args={["#05060e"]} />
                <fog attach="fog" args={["#05060e", 9, 20]} />
                <hemisphereLight args={["#8b9cff", "#1a0f2e", 0.7]} />
                <directionalLight
                    position={[4, 6, 4]}
                    intensity={1.6}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                    shadow-camera-left={-4}
                    shadow-camera-right={4}
                    shadow-camera-top={4}
                    shadow-camera-bottom={-4}
                    shadow-bias={-0.0005}
                />
                <pointLight position={[-4, 2.5, -2]} color="#a855f7" intensity={30} distance={14} />
                <pointLight position={[4, 1.5, -3]} color="#22d3ee" intensity={20} distance={12} />
                <Suspense fallback={null}>
                    <Developer />
                    <PhotoRing progress={progress} />
                </Suspense>
                <HeroOrb progress={progress} />
                <Dust />
                <TechOrbit progress={progress} />
                <CameraRig progress={progress} view={view} />
                <Bloom />
            </Canvas>

            {/* ── hero: the old first page, now a split curtain over the scene ── */}
            <div className="pointer-events-none absolute inset-0 z-10">
                <div
                    className="hero-panel-left absolute overflow-hidden flex items-center md:justify-end justify-center inset-x-0 top-0 h-[34%] md:inset-y-0 md:left-0 md:right-auto md:h-full md:w-1/2 md:pr-[20vw] text-white"
                    style={{ background: "linear-gradient(to right, #04050c 22%, rgba(4,5,12,0.5) 48%, rgba(4,5,12,0) 78%)" }}
                >
                    <div className="absolute inset-0 opacity-70 [mask-image:linear-gradient(to_right,black_30%,transparent_85%)] max-md:[mask-image:linear-gradient(to_bottom,black_40%,transparent)]"><AuroraGrid /></div>
                    <div className="relative text-center md:text-right pt-16 md:pt-0">
                        <h1 className="hero-title text-[11vw] md:text-[4.6vw] leading-none font-heading font-black tracking-tighter mb-3 text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                            DEVSECOPS
                        </h1>
                        <p className="hero-copy hidden md:block text-cyan-100/80 max-w-[17rem] ml-auto font-serif italic text-base leading-relaxed">
                            {first}
                        </p>
                    </div>
                </div>

                <div
                    className="hero-panel-right absolute overflow-hidden flex items-center justify-center md:justify-start inset-x-0 bottom-0 h-[34%] md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-1/2 md:pl-[20vw] text-white"
                    style={{ background: "linear-gradient(to left, #050505 22%, rgba(5,5,5,0.5) 48%, rgba(5,5,5,0) 78%)" }}
                >
                    <div className="absolute inset-0 opacity-70 [mask-image:linear-gradient(to_left,black_30%,transparent_85%)] max-md:[mask-image:linear-gradient(to_top,black_40%,transparent)]"><CodeRain /></div>
                    <div className="relative text-center md:text-left pb-24 md:pb-0">
                        <h1 className="hero-title text-[10vw] md:text-[4.6vw] leading-none font-mono font-bold tracking-tighter mb-3 text-white drop-shadow-[0_0_30px_rgba(167,139,250,0.35)]">
                            FULL-STACK
                        </h1>
                        <p className="hero-copy hidden md:block text-gray-400 max-w-[17rem] font-mono text-xs leading-relaxed">
                            {second}
                        </p>
                    </div>
                </div>

                <div className="hero-line absolute left-1/2 top-0 h-[17vh] w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-white/70" />

                <div className="hero-center absolute inset-x-0 bottom-0 pb-8 flex flex-col items-center gap-4 z-20">
                    <span className="px-5 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs md:text-sm text-gray-300 backdrop-blur-md flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Available for opportunities
                    </span>
                    <div className="bg-black/80 text-white px-6 py-2 rounded-full border border-white/20 font-bold tracking-[0.3em] text-xs md:text-sm shadow-2xl backdrop-blur">
                        YASH SRIVASTAVA
                    </div>
                    <div className="pointer-events-auto flex gap-3">
                        <a
                            href={portfolioData.personal.resume}
                            target="_blank"
                            className="group px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm flex items-center gap-2 shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.45)] transition-shadow"
                        >
                            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                            Resume
                        </a>
                        <a
                            href="#contact"
                            className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center gap-2 backdrop-blur transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            Contact
                        </a>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-gray-500">
                        Scroll
                        <div className="w-px h-6 bg-gradient-to-b from-purple-500 to-transparent" />
                    </div>
                </div>
            </div>

            {/* captions */}
            <div className="pointer-events-none absolute inset-0 flex items-end md:items-center px-6 md:px-16 pb-24 md:pb-0">
                <div className="relative w-full max-w-md">
                    {CAPTIONS.map((c, i) => (
                        <div key={c.title} className={`desk-caption desk-caption-${i} absolute bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-0 right-0`}>
                            <p className="text-xs uppercase tracking-[0.3em] text-purple-300 mb-3">{c.kicker}</p>
                            <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                                {c.title}
                            </h2>
                            <p className="text-gray-300/90 leading-relaxed text-base md:text-lg">{c.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* progress + hint */}
            <div className="pointer-events-none absolute bottom-8 left-6 right-6 md:left-16 md:right-16 flex items-center gap-4">
                <span className="desk-hint opacity-0 text-[10px] uppercase tracking-[0.3em] text-gray-400">Scroll to explore · move mouse to look</span>
                <div className="h-px flex-1 bg-white/10 overflow-hidden">
                    <div className="desk-bar h-full origin-left scale-x-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300" />
                </div>
            </div>
        </section>
    );
}
