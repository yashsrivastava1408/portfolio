

"use client";

import Navbar from "@/components/Navbar";
import About from "@/components/About";
import DesignerCoder from "@/components/DesignerCoder";
import Skills from "@/components/Skills";
import LeetCode from "@/components/LeetCode";

import Experience from "@/components/Experience";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import ContactBento from "@/components/ContactBento";
import Footer from "@/components/Footer";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import SplashScreen from "@/components/SplashScreen";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PhotoGallery from "@/components/PhotoGallery";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="min-h-screen overflow-hidden selection:bg-primary/30 relative">
      <AnimatePresence mode="wait">
        {isLoading && (
          <SplashScreen finishLoading={() => setIsLoading(false)} />
        )}
      </AnimatePresence>


      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Navbar />
          <BackgroundAnimation />
          <DesignerCoder />
          <About />
          <Skills />
          <LeetCode />
          <Experience />
          <Services />
          <Projects />
          <PhotoGallery />
          <ContactBento />
          <Footer />
        </motion.div>
      )}
    </main>
  );
}
