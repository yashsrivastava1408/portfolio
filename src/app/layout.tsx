
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

import ScrollProgress from "@/components/ScrollProgress";
import Analytics from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-theta-lyart-35.vercel.app'),
  title: "Yash Srivastava | Full Stack Developer & DevSecOps Enthusiast",
  description: "Third-year B.Tech Computer Science student building systems end-to-end. DevOps Intern with expertise in CI/CD, Docker, Kubernetes, and cloud-native workflows. Seeking SDE, DevOps, or Cloud roles.",
  keywords: ["Full Stack Developer", "DevSecOps", "DevOps", "Software Engineer", "React", "Next.js", "Docker", "Kubernetes", "CI/CD", "Cloud", "Portfolio"],
  authors: [{ name: "Yash Srivastava", url: "https://github.com/yashsrivastava1408" }],
  creator: "Yash Srivastava",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yashsrivastava.dev",
    siteName: "Yash Srivastava Portfolio",
    title: "Yash Srivastava | Full Stack Developer & DevSecOps Enthusiast",
    description: "Build scalable systems. Deploy with confidence. Third-year CSE student with hands-on DevOps experience.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yash Srivastava Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Srivastava | Portfolio",
    description: "Full Stack Developer & DevSecOps Enthusiast. Building scalable systems end-to-end.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={clsx(
          inter.variable,
          playfair.variable,
          "antialiased bg-background text-foreground"
        )}
      >
        <CustomCursor />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}

