/* eslint-disable react-hooks/immutability -- three.js uniforms/objects are mutated per-frame by design */
"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ProfileMesh() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        new THREE.TextureLoader().load("/profile-hero.jpg", (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            setTexture(t);
        });
    }, []);

    const uniforms = useMemo(() => ({
        uTexture: { value: null as THREE.Texture | null },
        uTime: { value: 0 },
        uBend: { value: 0 }, // We will animate this on scroll
    }), []);

    useEffect(() => {
        if (texture) {
            uniforms.uTexture.value = texture;
        }
    }, [texture, uniforms]);

    useFrame((state) => {
        if (!meshRef.current) return;
        // Subtle idle float
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.001;
        
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    useEffect(() => {
        if (!meshRef.current || !materialRef.current) return;

        // Initial Position
        gsap.set(meshRef.current.position, { x: 0, y: 0, z: 0 });
        gsap.set(meshRef.current.rotation, { x: 0, y: 0, z: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
            }
        });

        // 3D scrolling animation: The image flies forward, rotates, and bends
        tl.to(meshRef.current.position, {
            x: 4,          // Move right
            y: 2,          // Move up
            z: 3,          // Come extremely close to the camera
            ease: "power2.inOut"
        }, 0)
        .to(meshRef.current.rotation, {
            x: -Math.PI / 6,
            y: -Math.PI / 4,
            z: -Math.PI / 12,
            ease: "power2.inOut"
        }, 0)
        .to(materialRef.current.uniforms.uBend, {
            value: 1.5, // Bend the mesh vertices aggressively
            ease: "power1.inOut"
        }, 0);

    }, [texture]); // Run after texture loads

    const vertexShader = `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uBend;

        void main() {
            vUv = uv;
            vec3 pos = position;
            
            // 3D Modeling type distortion: Bend the image based on uBend
            // This curves the plane in 3D space like a piece of paper
            float wave = sin(pos.x * 2.0 + uTime) * 0.1 * uBend;
            pos.z += wave;
            
            // Curve the edges backward
            pos.z -= pow(abs(pos.x), 2.0) * 0.2 * uBend;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        
        void main() {
            vec4 tex = texture2D(uTexture, vUv);
            gl_FragColor = tex;
        }
    `;

    if (!texture) return null;

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <planeGeometry args={[3.2, 4, 32, 32]} />
            <shaderMaterial 
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                side={THREE.DoubleSide}
                transparent={true}
            />
        </mesh>
    );
}

export default function HeroGallery() {
    return (
        <div className="absolute inset-0 z-30 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }} dpr={[1, 1.5]}>
                <ambientLight intensity={1} />
                <ProfileMesh />
            </Canvas>
        </div>
    );
}
