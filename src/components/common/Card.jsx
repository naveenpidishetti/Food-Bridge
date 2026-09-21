import React from "react";
import { T } from "../../constants/theme";

export default function Card({ children, style = {}, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: 16,
        padding: 22,
        boxShadow: "0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)",
        transition: "all 0.2s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
