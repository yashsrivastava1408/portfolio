import { ImageResponse } from "next/og";
import { portfolioData } from "@/data/portfolio";

export const alt = "Yash Srivastava | Full Stack Developer & DevSecOps Enthusiast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The card people see when the site link is shared (LinkedIn, WhatsApp, X).
export default function OpengraphImage() {
    const [first, second] = portfolioData.personal.title.split("|").map((x) => x.trim());

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 72,
                    color: "#ffffff",
                    backgroundColor: "#07060f",
                    backgroundImage:
                        "radial-gradient(circle at 15% 20%, rgba(109,40,217,0.55), transparent 55%), radial-gradient(circle at 90% 90%, rgba(219,39,119,0.45), transparent 55%)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", fontSize: 26, letterSpacing: 8, color: "#c4b5fd" }}>
                    PORTFOLIO
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", fontSize: 104, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
                        {portfolioData.personal.name}
                    </div>
                    <div style={{ display: "flex", marginTop: 28, fontSize: 40, color: "#e5e7eb" }}>
                        {first}
                        <span style={{ margin: "0 18px", color: "#db2777" }}>/</span>
                        {second}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9ca3af" }}>
                    <span>github.com/{portfolioData.personal.github}</span>
                    <span>Docker · Kubernetes · CI/CD · LangGraph</span>
                </div>
            </div>
        ),
        size,
    );
}
