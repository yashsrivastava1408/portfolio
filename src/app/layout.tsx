
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Yash Srivastava | Portfolio",
  description: "Full Stack Developer & IoT Engineer Portfolio",
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
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

