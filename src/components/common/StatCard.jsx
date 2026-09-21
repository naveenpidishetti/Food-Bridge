import React from "react";
import { T } from "../../constants/theme";
import Card from "./Card";

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color = T.primary,
  bg = T.primaryLight
}) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
        }}>
          {Icon && <Icon size={22} />}
        </div>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: T.inkSoft,
          background: T.bgSubtle,
          padding: "2px 8px",
          borderRadius: 999
        }}>
          LIVE
        </span>
      </div>
      <div>
        <div style={{
          fontSize: 28,
          fontWeight: 800,
          color: T.ink,
          fontFamily: T.headline,
          letterSpacing: "-0.02em"
        }}>
          {value}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.inkSoft, marginTop: 2 }}>
          {label}
        </div>
        {subtext && (
          <div style={{ fontSize: 11.5, color: color, fontWeight: 700, marginTop: 4 }}>
            {subtext}
          </div>
        )}
      </div>
    </Card>
  );
}
