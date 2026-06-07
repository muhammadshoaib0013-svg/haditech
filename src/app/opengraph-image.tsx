import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/data";

// next/og route config
export const runtime = "edge";
export const alt = `${siteConfig.brandName} — SaaS Development Studio`;
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(139,92,246,0.06) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(139,92,246,0.06) 60px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Purple glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.05) 60%, transparent 100%)",
          }}
        />

        {/* Cyan glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(6,182,212,0.04) 65%, transparent 100%)",
          }}
        />

        {/* Badge pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.4)",
            borderRadius: 999,
            padding: "8px 20px",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#8b5cf6",
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#a78bfa",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            SaaS Development Studio
          </span>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 24,
            background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #67e8f9 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {siteConfig.brandName}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            maxWidth: 740,
            lineHeight: 1.5,
            marginBottom: 56,
          }}
        >
          {siteConfig.tagline}
        </div>

        {/* Bottom row — URL + tech pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* URL */}
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.02em",
            }}
          >
            {siteConfig.siteUrl.replace(/^https?:\/\//, "")}
          </span>

          {/* Tech pills */}
          <div style={{ display: "flex", gap: 12 }}>
            {["Next.js 14", "TypeScript", "AI Agents", "SaaS"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
