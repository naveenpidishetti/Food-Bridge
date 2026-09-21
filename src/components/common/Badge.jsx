import React from "react";
import { STATUS_META, T } from "../../constants/theme";

export default function Badge({ status }) {
  const m = STATUS_META[status] || STATUS_META.AVAILABLE;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 12px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      color: m.color,
      background: m.bg,
      border: `1px solid ${m.border}`,
      letterSpacing: "0.01em"
    }}>
      <span style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: m.color,
        boxShadow: `0 0 6px ${m.color}`
      }} />
      {m.label}
    </span>
  );
}
