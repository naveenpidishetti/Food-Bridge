import React, { useState, useEffect } from "react";
import { Camera, CheckCircle2, ShieldCheck, AlertCircle, X, RefreshCw, UserCheck, Lock } from "lucide-react";
import { T } from "../../constants/theme";
import Btn from "../common/Btn";

export default function FaceVerificationModal({ isOpen, onClose, onVerifySuccess, courierData }) {
  const [scanStage, setScanStage] = useState("ready"); // 'ready' | 'scanning' | 'success' | 'failed'
  const [partnerId, setPartnerId] = useState(courierData?.partnerId || "TS-HYD-DL-89210");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval = null;
    if (scanStage === "scanning") {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStage("success");
            return 100;
          }
          return prev + 15;
        });
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [scanStage]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 15, 29, 0.8)",
        zIndex: 150,
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: 24,
          maxWidth: 520,
          width: "100%",
          padding: 28,
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
          border: `1px solid ${T.line}`,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.courierPrimary }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: T.courierPrimary, textTransform: "uppercase" }}>
              Mandatory Courier Authentication
            </span>
          </div>
          <button onClick={onClose} style={{ background: T.bgSubtle, border: "none", width: 30, height: 30, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        <h2 style={{ fontFamily: T.headline, fontSize: 22, fontWeight: 800, color: T.ink, margin: "0 0 6px" }}>
          Biometric Face & ID Verification
        </h2>
        <p style={{ color: T.inkSoft, fontSize: 13, marginBottom: 20 }}>
          For safety & food security in Telangana, all delivery partners must verify facial liveness and unique courier ID before taking routes.
        </p>

        {/* Unique Courier Identity Input */}
        <div style={{ textAlign: "left", marginBottom: 18, background: T.bgSubtle, padding: 14, borderRadius: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={14} color={T.courierPrimary} /> Unique Courier Identity (Govt / Badge ID)
          </label>
          <input
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
            placeholder="e.g. TS-HYD-DL-89210 or Aadhaar/Badge No"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: `1.5px solid ${T.line}`,
              fontSize: 13.5,
              fontWeight: 700,
              marginTop: 6,
              boxSizing: "border-box",
              fontFamily: T.body,
              color: T.ink,
              outline: "none"
            }}
            required
          />
        </div>

        {/* Simulated Camera Scanner Viewport */}
        <div style={{
          position: "relative",
          height: 240,
          background: `linear-gradient(135deg, #0A0F1D 0%, #1E293B 100%)`,
          borderRadius: 20,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          border: `2px solid ${scanStage === "success" ? "#10B981" : T.courierPrimary}`,
          marginBottom: 20
        }}>
          {/* Facial Targeting Reticle Box */}
          <div style={{
            width: 140,
            height: 160,
            borderRadius: 70,
            border: `2.5px dashed ${scanStage === "success" ? "#10B981" : scanStage === "scanning" ? "#60A5FA" : "rgba(255,255,255,0.4)"}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            animation: scanStage === "scanning" ? "pulse 1.5s infinite" : "none",
          }}>
            {scanStage === "ready" && <Camera size={36} color="#94A3B8" />}
            {scanStage === "scanning" && (
              <>
                <RefreshCw size={36} color="#60A5FA" style={{ animation: "spin 1.5s linear infinite" }} />
                <span style={{ fontSize: 11, color: "#93C5FD", marginTop: 8, fontWeight: 700 }}>
                  Scanning Geometry... {progress}%
                </span>
              </>
            )}
            {scanStage === "success" && <CheckCircle2 size={44} color="#34D399" />}
          </div>

          {/* Bottom status text */}
          <div style={{ position: "absolute", bottom: 12, fontSize: 11.5, color: "#94A3B8", fontWeight: 600 }}>
            {scanStage === "ready" && "Position face inside frame & click 'Start Facial Scan'"}
            {scanStage === "scanning" && "Verifying Telangana facial biometrics..."}
            {scanStage === "success" && "✓ Biometric identity matched with Government registry"}
          </div>
        </div>

        {/* Action Controls */}
        {scanStage === "ready" && (
          <Btn full variant="indigo" icon={Camera} onClick={() => setScanStage("scanning")}>
            Start Biometric Facial Scan
          </Btn>
        )}

        {scanStage === "scanning" && (
          <div style={{ fontSize: 13, color: T.courierPrimary, fontWeight: 700, padding: 10 }}>
            Please look directly into camera...
          </div>
        )}

        {scanStage === "success" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: T.userPrimaryLight, padding: 10, borderRadius: 10, color: "#065F46", fontSize: 12.5, fontWeight: 700 }}>
              ✓ Partner ID ({partnerId}) & Live Face Photo Authenticated!
            </div>
            <Btn full icon={UserCheck} onClick={() => onVerifySuccess(partnerId)}>
              Unlock Delivery Partner Console
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
