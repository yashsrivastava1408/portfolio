import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 300,
                    fontWeight: 800,
                    letterSpacing: -6,
                    color: "#ffffff",
                    borderRadius: 112,
                    backgroundImage: "linear-gradient(135deg, #6d28d9, #db2777)",
                }}
            >
                YS
            </div>
        ),
        size,
    );
}
