import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
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
                    fontSize: 104,
                    fontWeight: 800,
                    letterSpacing: -2,
                    color: "#ffffff",
                    borderRadius: 36,
                    backgroundImage: "linear-gradient(135deg, #6d28d9, #db2777)",
                }}
            >
                YS
            </div>
        ),
        size,
    );
}
