
import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

import ScrollProgress from "@/components/ScrollProgress";
import Analytics from "@/components/Analytics";
import { portfolioData } from "@/data/portfolio";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://yashsrivastava.dev/#person",
        name: portfolioData.personal.name,
        jobTitle: "Full Stack Developer & DevSecOps Enthusiast",
        url: "https://yashsrivastava.dev",
        email: portfolioData.personal.email,
        telephone: portfolioData.personal.phone,
        sameAs: portfolioData.personal.social.map(s => s.url),
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: portfolioData.education[0].institution,
        },
        knowsAbout: portfolioData.skills,
        description: portfolioData.personal.description,
        image: "https://yashsrivastava.dev/profile-hero.jpg",
      },
      {
        "@type": "WebSite",
        "@id": "https://yashsrivastava.dev/#website",
        url: "https://yashsrivastava.dev",
        name: "Yash Srivastava | Portfolio",
        description: metadata.description?.toString(),
        publisher: {
          "@id": "https://yashsrivastava.dev/#person",
        },
      },
      {
        "@type": "ProfilePage",
        "@id": "https://yashsrivastava.dev/#webpage",
        url: "https://yashsrivastava.dev",
        isPartOf: {
          "@id": "https://yashsrivastava.dev/#website",
        },
        about: {
          "@id": "https://yashsrivastava.dev/#person",
        },
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={clsx(
          inter.variable,
          playfair.variable,
          cormorant.variable,
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

