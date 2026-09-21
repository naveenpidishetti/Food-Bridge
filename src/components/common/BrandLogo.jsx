import React from "react";
import { T } from "../../constants/theme";

export default function BrandLogo({ size = "default", onClick }) {
  const isLarge = size === "large";
  const iconDim = isLarge ? 52 : 40;

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 12, cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      {/* Dynamic Bridge & Caring Hands Icon */}
      <div
        style={{
          width: iconDim,
          height: iconDim,
          borderRadius: isLarge ? 16 : 12,
          background: `linear-gradient(135deg, ${T.userPrimary} 0%, #047857 50%, ${T.courierPrimary} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(5, 150, 105, 0.35)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <svg
          width={isLarge ? 32 : 24}
          height={isLarge ? 32 : 24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bridge Arch */}
          <path
            d="M2 17C4.5 10.5 8 8 12 8C16 8 19.5 10.5 22 17"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Bridge Pillars */}
          <path d="M6 14V19M18 14V19M12 9V19" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          {/* Connecting Heart over Bridge */}
          <path
            d="M12 4.5C11 3 9.5 3 8.5 4C7.5 5 8 7 12 9C16 7 16.5 5 15.5 4C14.5 3 13 3 12 4.5Z"
            fill="#FDE047"
          />
        </svg>
      </div>

      <div>
        <div
          style={{
            fontFamily: T.headline,
            fontSize: isLarge ? 28 : 22,
            fontWeight: 900,
            color: T.ink,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Food<span style={{ color: T.userPrimary }}>Bridge</span>
        </div>
        <div
          style={{
            fontSize: isLarge ? 12 : 10.5,
            fontWeight: 800,
            color: T.courierPrimary,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: 1,
          }}
        >
          Connecting Communities in Need
        </div>
      </div>
    </div>
  );
}
