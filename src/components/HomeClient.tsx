"use client";

import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Skills from "@/components/Skills";
import LeetCode from "@/components/LeetCode";

import Experience from "@/components/Experience";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import ContactBento from "@/components/ContactBento";
import Footer from "@/components/Footer";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import PhotoGallery from "@/components/PhotoGallery";
import { useLenis } from "@/components/SmoothScroll";
import PauseOffscreenCanvas from "@/components/PauseOffscreenCanvas";
import Achievements from "@/components/Achievements";
import Testimonials from "@/components/Testimonials";
import type { GithubStats, LeetcodeStats } from "@/lib/stats";
import dynamic from "next/dynamic";

const loadDeskScene = () => import("@/components/DeskScene");
const DeskScene = dynamic(loadDeskScene, { ssr: false });

interface HomeClientProps {
  github: GithubStats | null;
  leetcode: LeetcodeStats;
}

export default function HomeClient({ github, leetcode }: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  // The hero plays its own intro on mount, so it is held back until the splash starts to lift.
  const [showHero, setShowHero] = useState(false);
  const lenis = useLenis();

  // Download the 3D scene while the splash is playing, so the reveal does not stutter.
  useEffect(() => {
    loadDeskScene();
  }, []);

  // No scrolling behind the splash.
  useEffect(() => {
    if (!isLoading) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [isLoading, lenis]);

  return (
    <main className="min-h-screen overflow-hidden selection:bg-primary/30 relative">
      {isLoading && (
        <SplashScreen
          onReveal={() => setShowHero(true)}
          finishLoading={() => setIsLoading(false)}
        />
      )}

      {/* The page is rendered from the start (good for SEO); the splash just sits on top. */}
      <Navbar />
      <BackgroundAnimation />
      {showHero ? <DeskScene /> : <div className="h-screen w-full bg-[#05060e]" aria-hidden />}
      {showHero && <PauseOffscreenCanvas selector="#hero" />}
      <Achievements leetcodeSolved={leetcode.totalSolved} />
      <About leetcodeSolved={leetcode.totalSolved} />
      <Skills />
      <LeetCode stats={leetcode} github={github} />
      <Experience />
      <Services />
      <Projects />
      <PhotoGallery />
      <Testimonials />
      <ContactBento />
      <Footer />
    </main>
  );
}
