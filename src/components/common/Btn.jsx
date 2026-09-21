import React from "react";
import { T } from "../../constants/theme";

export default function Btn({
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  small,
  full,
  type = "button",
  disabled,
  style = {}
}) {
  const styles = {
    primary: {
      background: `linear-gradient(135deg, ${T.primary} 0%, #047857 100%)`,
      color: "#ffffff",
      border: "none",
      boxShadow: "0 2px 8px rgba(5, 150, 105, 0.28)",
    },
    outline: {
      background: "#ffffff",
      color: T.primary,
      border: `1.5px solid ${T.primary}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
    },
    ghost: {
      background: T.primaryLight,
      color: "#065F46",
      border: "1px solid rgba(5, 150, 105, 0.2)",
    },
    dark: {
      background: `linear-gradient(135deg, ${T.ink} 0%, #1E293B 100%)`,
      color: "#ffffff",
      border: "none",
    },
    danger: {
      background: `linear-gradient(135deg, ${T.rose} 0%, #BE123C 100%)`,
      color: "#ffffff",
      border: "none",
    },
    amber: {
      background: `linear-gradient(135deg, ${T.amber} 0%, #B45309 100%)`,
      color: "#ffffff",
      border: "none",
    },
    indigo: {
      background: `linear-gradient(135deg, ${T.indigo} 0%, #3730A3 100%)`,
      color: "#ffffff",
      border: "none",
      boxShadow: "0 2px 8px rgba(79, 70, 229, 0.28)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: small ? "8px 14px" : "11px 20px",
        borderRadius: 10,
        fontSize: small ? 13 : 14.5,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        width: full ? "100%" : "auto",
        transition: "all .18s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: T.body,
        outline: "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.filter = "brightness(1.06)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.filter = "none";
      }}
    >
      {Icon && <Icon size={small ? 15 : 18} />}
      {children}
    </button>
  );
}
