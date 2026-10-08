"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The developer's head, sculpted in code: one skin mesh with the brow, nose, lips and chin
 * pushed out of a sphere, a painted skin texture (stubble, brows, lips, blush), eyes with
 * real lids that blink, and a hair shell that follows the skull.
 * Everything is in "head units": the head is a sphere of radius 1 looking down +z.
 */

const SKIN: [number, number, number] = [184, 123, 87]; // #b87b57, same as the hands and neck
const LIP: [number, number, number] = [143, 78, 70];
const HAIR: [number, number, number] = [16, 12, 12];

const sstep = THREE.MathUtils.smoothstep;
const bump = (x: number, y: number, cx: number, cy: number, sx: number, sy: number) =>
    Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));
/** The same bump on both sides of the face. */
const pair = (x: number, y: number, cx: number, cy: number, sx: number, sy: number) =>
    bump(x, y, cx, cy, sx, sy) + bump(x, y, -cx, cy, sx, sy);

/** Skull shape shared by skin and hair: the jaw narrows, the back of the head is a little fuller. */
function skull(v: THREE.Vector3) {
    const t = Math.max(0, -v.y);
    v.x *= 1 - 0.4 * Math.pow(t, 1.6);
    v.z *= v.z > 0 ? 1 - 0.08 * t * t : 1.05 * (1 - 0.22 * Math.pow(t, 1.5));
}

/** How far the face is pushed out (or in) at a point of the front of the sphere. */
function relief(x: number, y: number, z: number) {
    let d = 0;
    d -= 0.05 * sstep(z, 0.72, 1); // a flatter face plane
    d -= 0.075 * pair(x, y, 0.36, 0.1, 0.17, 0.11); // eye sockets
    d += 0.05 * pair(x, y, 0.33, 0.28, 0.25, 0.07); // brow ridge
    d += 0.09 * bump(x, y, 0, 0.04, 0.065, 0.22); // nose bridge
    d += 0.16 * bump(x, y, 0, -0.17, 0.095, 0.085); // nose tip
    d += 0.05 * pair(x, y, 0.1, -0.21, 0.055, 0.05); // nostril wings
    d += 0.035 * pair(x, y, 0.52, -0.12, 0.2, 0.16); // cheekbones
    d += 0.05 * bump(x, y, 0, -0.43, 0.27, 0.13); // mouth area
    d += 0.03 * bump(x, y, 0, -0.385, 0.16, 0.035); // upper lip
    d += 0.035 * bump(x, y, 0, -0.475, 0.13, 0.04); // lower lip
    d -= 0.02 * bump(x, y, 0, -0.43, 0.2, 0.018); // line between the lips
    d -= 0.02 * bump(x, y, 0, -0.6, 0.15, 0.05); // dip under the lower lip
    d += 0.07 * bump(x, y, 0, -0.8, 0.22, 0.15); // chin
    return d * sstep(z, 0.05, 0.45);
}

/** Height (y) where the hair starts, for an angle away from straight ahead (0 = front, π = back). */
function hairline(angle: number) {
    const front = 0.72 - 0.13 * sstep(angle, 0.5, 0.95);
    const side = THREE.MathUtils.lerp(front, 0.05, sstep(angle, 0.95, 1.4));
    return THREE.MathUtils.lerp(side, -0.5, sstep(angle, 1.5, 2.4));
}

// Spheres are built with their seam at the back of the head, so the face sits in the middle of the texture.
const SEAM_AT_BACK = Math.PI * 1.5;

/** Give both copies of each seam vertex the same normal, so no crease shows. */
function weldSeam(geo: THREE.BufferGeometry, columns: number) {
    const n = geo.attributes.normal as THREE.BufferAttribute;
    for (let i = 0; i < n.count; i += columns + 1) {
        const j = i + columns;
        const x = n.getX(i) + n.getX(j);
        const y = n.getY(i) + n.getY(j);
        const z = n.getZ(i) + n.getZ(j);
        const len = Math.hypot(x, y, z) || 1;
        n.setXYZ(i, x / len, y / len, z / len);
        n.setXYZ(j, x / len, y / len, z / len);
    }
}

function makeSkinGeometry() {
    const geo = new THREE.SphereGeometry(1, 96, 72, SEAM_AT_BACK);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const d = relief(v.x, v.y, v.z);
        skull(v);
        v.z += d;
        pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    weldSeam(geo, 96);
    return geo;
}

function makeHairGeometry() {
    const geo = new THREE.SphereGeometry(1, 72, 48, SEAM_AT_BACK, Math.PI * 2, 0, 2.2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const { x, y, z } = v;
        const a = Math.atan2(x, z);
        // a slightly uneven edge, so the hairline is not a ruled line
        const line = hairline(Math.abs(a)) + 0.01 * Math.sin(a * 23) * Math.sin(a * 7 + 1);
        // 0 at the hairline, 1 a little way into the hair: the shell thickens away from its edge
        const depth = sstep(y, line, line + 0.08);
        const quiff = 0.2 * bump(a, y, 0.15, 0.8, 0.8, 0.22) * sstep(z, 0, 0.5);
        const clumps = 0.012 * Math.sin(a * 18 + y * 7) * Math.sin(y * 13 + a * 3);
        const lift = 0.045 + 0.04 * sstep(y, 0.2, 0.9) + quiff + clumps;
        skull(v);
        // below the hairline the shell tucks well under the skin (deeper than the eye sockets)
        v.multiplyScalar(y > line ? 1 + depth * lift : 0.78);
        pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    weldSeam(geo, 72);
    return geo;
}

/** Colour and bump maps for the skin, painted pixel by pixel in the same coordinates as the sculpt. */
function makeSkinTextures() {
    const W = 1024;
    const H = 1024;
    const color = document.createElement("canvas");
    const height = document.createElement("canvas");
    color.width = height.width = W;
    color.height = height.height = H;
    const cctx = color.getContext("2d")!;
    const hctx = height.getContext("2d")!;
    const cimg = cctx.createImageData(W, H);
    const himg = hctx.createImageData(W, H);

    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    for (let py = 0; py < H; py++) {
        const theta = ((py + 0.5) / H) * Math.PI;
        const y = Math.cos(theta);
        const s = Math.sin(theta);
        for (let px = 0; px < W; px++) {
            const a = ((px + 0.5) / W - 0.5) * Math.PI * 2;
            const angle = Math.abs(a);
            const x = Math.sin(a) * s;
            const z = Math.cos(a) * s;
            const grain = rnd();

            let shade = 0; // darker skin: sockets, nostrils, the line of the mouth
            let flush = 0; // redder skin: cheeks, nose tip
            let lip = 0;
            let brow = 0;
            let beard = 0;

            if (z > -0.2) {
                const ax = Math.abs(x);
                flush = 0.16 * pair(x, y, 0.5, -0.16, 0.2, 0.15) + 0.12 * bump(x, y, 0, -0.17, 0.1, 0.08);
                shade = 0.3 * pair(x, y, 0.36, 0.11, 0.15, 0.07) + 0.55 * pair(x, y, 0.075, -0.245, 0.028, 0.02);

                // eyebrows: an arched stroke that thins toward the temple
                if (z > 0 && ax > 0.13 && ax < 0.6) {
                    const k = (ax - 0.13) / 0.47;
                    const mid = 0.265 + 0.045 * Math.sin(k * Math.PI * 0.8);
                    const thick = 0.052 * (1 - 0.5 * k);
                    brow = (1 - sstep(Math.abs(y - mid), thick * 0.45, thick)) * sstep(k, 0, 0.12) * (1 - sstep(k, 0.85, 1));
                }

                // lips: a cupid's bow on top, a fuller curve below
                if (z > 0 && ax < 0.21) {
                    const top = -0.425 + 0.05 * (1 - (x / 0.21) ** 2) * (1 - 0.3 * Math.exp(-((x / 0.035) ** 2)));
                    const bottom = -0.425 - 0.07 * (1 - (x / 0.18) ** 2);
                    lip = sstep(y, bottom - 0.01, bottom + 0.01) * (1 - sstep(y, top - 0.01, top + 0.01));
                    shade += 0.7 * (1 - sstep(Math.abs(y + 0.425), 0.004, 0.012)) * (1 - sstep(ax, 0.17, 0.21));
                }

                // beard: along the jaw, up the sideburns, plus moustache, mouth corners and soul patch
                const top = -0.47 + 0.27 * sstep(angle, 0.3, 0.7) + 0.4 * sstep(angle, 1.0, 1.35);
                beard = (1 - sstep(y, top - 0.05, top + 0.04)) * (1 - sstep(angle, 1.45, 1.7));
                if (z > 0) {
                    const moustache = (1 - sstep(Math.abs(y + 0.325), 0.02, 0.05)) * (1 - sstep(ax, 0.2, 0.28));
                    const corners = pair(x, y, 0.25, -0.45, 0.045, 0.1);
                    const patch = 0.8 * bump(x, y, 0, -0.575, 0.06, 0.035);
                    beard = Math.max(beard, moustache, corners, patch);
                }
                beard *= 1 - lip;
            }

            // under the hair the scalp is dark, so no bare skin shows through the shell
            const line = hairline(angle);
            const scalp = sstep(y, line - 0.02, line + 0.06);
            // short beard hair is speckled: denser in the middle of the beard, sparse at its edge
            const stubble = beard * (0.72 + 0.28 * grain);
            const hair = Math.min(1, Math.max(scalp, brow * (0.75 + 0.25 * grain), stubble));

            const light = (0.97 + 0.06 * grain) * (1 - 0.5 * Math.min(1, shade));
            let r = SKIN[0] * light + 26 * flush;
            let g = SKIN[1] * light - 6 * flush;
            let b = SKIN[2] * light - 4 * flush;
            const lipMix = lip * 0.85;
            r += (LIP[0] * light - r) * lipMix;
            g += (LIP[1] * light - g) * lipMix;
            b += (LIP[2] * light - b) * lipMix;
            const hairMix = hair * 0.93;
            r += (HAIR[0] - r) * hairMix;
            g += (HAIR[1] - g) * hairMix;
            b += (HAIR[2] - b) * hairMix;

            const i = (py * W + px) * 4;
            cimg.data[i] = r;
            cimg.data[i + 1] = g;
            cimg.data[i + 2] = b;
            cimg.data[i + 3] = 255;
            // pores everywhere, rougher where there is hair, smooth lips
            const h = 128 + (grain - 0.5) * (30 + 90 * hair) * (1 - 0.7 * lip);
            himg.data[i] = himg.data[i + 1] = himg.data[i + 2] = h;
            himg.data[i + 3] = 255;
        }
    }
    cctx.putImageData(cimg, 0, 0);
    hctx.putImageData(himg, 0, 0);

    const map = new THREE.CanvasTexture(color);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    const bumpMap = new THREE.CanvasTexture(height);
    return { map, bumpMap };
}

/** Fine strands running from the crown down, used as a bump map on the hair. */
function makeHairTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#808080";
    g.fillRect(0, 0, 512, 512);
    let seed = 5;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 1800; i++) {
        const x = rnd() * 512;
        const y = rnd() * 512;
        g.strokeStyle = rnd() > 0.5 ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";
        g.lineWidth = 0.6 + rnd() * 1.2;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + (rnd() - 0.5) * 14, y + 40 + rnd() * 120);
        g.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
}

/** Iris seen from the pole of a sphere cap: pupil at the top of the image, dark rim at the bottom. */
function makeIrisTexture() {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, "#020203");
    grad.addColorStop(0.38, "#020203");
    grad.addColorStop(0.44, "#3a1f10");
    grad.addColorStop(0.7, "#6b3f1f");
    grad.addColorStop(0.9, "#3a2010");
    grad.addColorStop(1, "#0c0705");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    let seed = 3;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    // fibres running from the pupil to the rim
    for (let x = 0; x < 128; x++) {
        g.fillStyle = rnd() > 0.5 ? `rgba(255,190,120,${rnd() * 0.22})` : `rgba(0,0,0,${rnd() * 0.3})`;
        g.fillRect(x, 54, 1, 62);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

const EYE_R = 0.165;
// How far each lid reaches from its pole, in radians. A quarter turn (π/2) would be the middle of the eye.
const UPPER_LID = 1.22;
const LOWER_LID = 1.12;
// How far the upper lid turns to close the eye.
const BLINK_TURN = 0.82;

export default function DeveloperHead() {
    const pointer = useThree((s) => s.pointer);
    const lids = useRef<THREE.Group[]>([]);
    const gazes = useRef<THREE.Group[]>([]);

    const skinGeo = useMemo(() => makeSkinGeometry(), []);
    const hairGeo = useMemo(() => makeHairGeometry(), []);
    const skin = useMemo(() => makeSkinTextures(), []);
    const hairTex = useMemo(() => makeHairTexture(), []);
    const irisTex = useMemo(() => makeIrisTexture(), []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // a quick blink every ~3.5s
        const phase = t % 3.5;
        const closed = phase > 3.3 ? Math.sin(((phase - 3.3) / 0.2) * Math.PI) : 0;
        lids.current.forEach((lid) => {
            if (lid) lid.rotation.x += (closed * BLINK_TURN - lid.rotation.x) * 0.6;
        });
        // the eyes glance toward the pointer, with tiny darting movements so they never look frozen
        const dart = Math.sin(t * 0.9) * Math.sin(t * 2.3) * 0.03;
        gazes.current.forEach((gaze) => {
            if (!gaze) return;
            gaze.rotation.y += (pointer.x * 0.38 + dart - gaze.rotation.y) * 0.12;
            gaze.rotation.x += (-pointer.y * 0.24 - gaze.rotation.x) * 0.12;
        });
    });

    return (
        <>
            {/* skin */}
            <mesh geometry={skinGeo} castShadow>
                <meshPhysicalMaterial
                    map={skin.map}
                    bumpMap={skin.bumpMap}
                    bumpScale={0.7}
                    roughness={0.52}
                    sheen={0.25}
                    sheenRoughness={0.5}
                    sheenColor="#ff9c78"
                />
            </mesh>

            {/* hair */}
            <mesh geometry={hairGeo} castShadow>
                <meshStandardMaterial color="#0d0a0c" roughness={0.5} bumpMap={hairTex} bumpScale={0.9} />
            </mesh>

            {/* ears */}
            {[-1, 1].map((sd) => (
                <group key={sd} position={[sd * 0.96, -0.02, 0.0]} rotation={[0, sd * 0.35, 0]}>
                    <mesh scale={[0.13, 0.27, 0.19]}>
                        <sphereGeometry args={[1, 24, 24]} />
                        <meshStandardMaterial color="#b0734f" roughness={0.55} />
                    </mesh>
                    <mesh position={[sd * 0.07, 0.02, 0.03]} scale={[0.06, 0.17, 0.11]}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshStandardMaterial color="#8f5a3e" roughness={0.6} />
                    </mesh>
                </group>
            ))}

            {/* headphones */}
            <mesh position={[0, 0.0, 0]}>
                <torusGeometry args={[1.16, 0.065, 16, 64, Math.PI]} />
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

            {/* eyes: a ball set into the socket, an iris that turns with the gaze, and two lids */}
            {[-1, 1].map((sd, i) => (
                <group key={sd} position={[sd * 0.36, 0.1, 0.73]} rotation={[0, sd * 0.14, 0]}>
                    <mesh>
                        <sphereGeometry args={[EYE_R, 32, 32]} />
                        <meshStandardMaterial color="#ece6e0" roughness={0.15} />
                    </mesh>
                    <group ref={(g) => { if (g) gazes.current[i] = g; }}>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <sphereGeometry args={[EYE_R * 1.012, 40, 12, 0, Math.PI * 2, 0, 0.47]} />
                            <meshStandardMaterial map={irisTex} roughness={0.12} />
                        </mesh>
                        {/* catch-light */}
                        <mesh position={[0.024, 0.03, EYE_R * 1.012]}>
                            <sphereGeometry args={[0.012, 10, 10]} />
                            <meshBasicMaterial color="#ffffff" toneMapped={false} />
                        </mesh>
                    </group>
                    <group ref={(g) => { if (g) lids.current[i] = g; }}>
                        <mesh>
                            <sphereGeometry args={[EYE_R * 1.08, 32, 16, 0, Math.PI * 2, 0, UPPER_LID]} />
                            <meshStandardMaterial color="#a96e4c" roughness={0.6} />
                        </mesh>
                        {/* lash line along the edge of the lid */}
                        <mesh position={[0, EYE_R * 1.08 * Math.cos(UPPER_LID), 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[EYE_R * 1.08 * Math.sin(UPPER_LID), 0.0065, 6, 48]} />
                            <meshStandardMaterial color="#0a0606" roughness={0.8} />
                        </mesh>
                    </group>
                    <mesh>
                        <sphereGeometry args={[EYE_R * 1.07, 32, 12, 0, Math.PI * 2, Math.PI - LOWER_LID, LOWER_LID]} />
                        <meshStandardMaterial color="#a96e4c" roughness={0.6} />
                    </mesh>
                </group>
            ))}
        </>
    );
}
