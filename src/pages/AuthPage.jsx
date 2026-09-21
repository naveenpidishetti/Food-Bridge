import React, { useState } from "react";
import { RefreshCw, Send, AlertCircle, User, Truck, Phone, Home, MapPin, Hash, ShieldCheck, Sparkles } from "lucide-react";
import { T } from "../constants/theme";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "../constants/data";
import { isValidEmail, validateEmailWithFeedback } from "../utils/validation";
import Card from "../components/common/Card";
import Btn from "../components/common/Btn";
import BrandLogo from "../components/common/BrandLogo";
import FaceVerificationModal from "../components/auth/FaceVerificationModal";

export default function AuthPage({ onLogin, onSendEmail }) {
  const [authCategory, setAuthCategory] = useState("USER"); // "USER" (Donor/Receiver) or "DELIVERY_PARTNER"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cellNo, setCellNo] = useState("");
  const [houseName, setHouseName] = useState("");
  const [street, setStreet] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("Hyderabad, Telangana");
  const [org, setOrg] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Biometric Face & ID Verification Modal State for Delivery Partners
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [pendingCourierUser, setPendingCourierUser] = useState(null);

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1.5px solid ${T.line}`,
    fontSize: 14,
    marginTop: 6,
    boxSizing: "border-box",
    fontFamily: T.body,
    color: T.ink,
    background: "#FFFFFF",
    outline: "none",
    transition: "border-color 0.15s ease",
  };

  function processFinalLogin(userObj) {
    onSendEmail({
      recipient: userObj.email,
      subject: "🔐 Food Bridge: Sign-in confirmation & session access",
      preview: `Sign-in detected for ${userObj.name} at ${new Date().toLocaleTimeString()}`,
      bodyText: `Your Food Bridge account (${userObj.email}) was authenticated as ${userObj.role === "USER" ? "Community User (Donor & Receiver)" : "Verified Delivery Partner (Biometrics & ID Validated)"}. If this was you, no further action is needed.`,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
    });

    onLogin(userObj);
  }

  function handleFaceVerificationSuccess(verificationData) {
    setShowFaceModal(false);
    if (pendingCourierUser) {
      const verifiedUser = {
        ...pendingCourierUser,
        partnerId: verificationData?.partnerId || "TS-HYD-DL-89210",
        faceVerified: true,
        verifiedAt: new Date().toISOString(),
      };
      processFinalLogin(verifiedUser);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validation = validateEmailWithFeedback(email);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (mode === "login") {
        const existing = DEMO_ACCOUNTS.find(
          (a) =>
            a.email.toLowerCase() === email.trim().toLowerCase() ||
            (authCategory === "DELIVERY_PARTNER" && a.role === "DELIVERY_PARTNER")
        );

        const userObj = existing || {
          email: email.trim().toLowerCase(),
          role: authCategory,
          name: name.trim() || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          cellNo: cellNo.trim() || "+91 98480 12345",
          houseName: houseName.trim() || "House No 12, Lake View",
          street: street.trim() || "Road No 10, Banjara Hills",
          pincode: pincode.trim() || "500034",
          city: "Hyderabad, Telangana",
          org: org.trim() || (authCategory === "USER" ? "Food Bridge Community User" : "Food Bridge Express Courier"),
        };

        // If delivery partner, MANDATE face & ID verification step
        if (authCategory === "DELIVERY_PARTNER") {
          setPendingCourierUser(userObj);
          setShowFaceModal(true);
          return;
        }

        processFinalLogin(userObj);
      } else {
        // Sign up mode
        if (!name.trim()) {
          setError("Please enter your full name.");
          return;
        }
        if (!cellNo.trim() || cellNo.length < 10) {
          setError("Please enter a valid 10-digit mobile/cell number.");
          return;
        }

        const newUser = {
          email: email.trim().toLowerCase(),
          role: authCategory,
          name: name.trim(),
          cellNo: cellNo.trim(),
          houseName: houseName.trim() || "Main Residence",
          street: street.trim() || "Banjara Hills / Hitec City",
          pincode: pincode.trim() || "500081",
          city: "Hyderabad, Telangana",
          org: org.trim() || (authCategory === "USER" ? "Hyderabad Food Donor/Receiver" : "Express Couriers"),
        };

        if (authCategory === "DELIVERY_PARTNER") {
          setPendingCourierUser(newUser);
          setShowFaceModal(true);
          return;
        }

        processFinalLogin(newUser);
      }
    }, 400);
  }

  function handleDemoSelect(account) {
    setEmail(account.email);
    setPassword(DEMO_PASSWORD);
    setAuthCategory(account.role === "DELIVERY_PARTNER" ? "DELIVERY_PARTNER" : "USER");
    setName(account.name);
    setCellNo(account.cellNo || "+91 98480 12345");
    setHouseName(account.houseName || "Plot 402");
    setStreet(account.street || "Banjara Hills");
    setPincode(account.pincode || "500034");
    setError("");
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Top Brand & Title */}
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: 14 }}>
          <BrandLogo size="lg" />
        </div>
        <h1 style={{ fontFamily: T.headline, fontSize: 26, fontWeight: 900, color: T.ink, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          {mode === "login" ? "Sign In to Food Bridge" : "Create Food Bridge Account"}
        </h1>
        <p style={{ color: T.inkSoft, fontSize: 13.5, margin: 0 }}>
          Connecting Hyderabad donors, shelters & verified delivery partners
        </p>
      </div>

      {/* Role Category Selector (User vs Delivery Partner) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        background: T.bgSubtle,
        padding: 5,
        borderRadius: 14,
        marginBottom: 18,
        border: `1px solid ${T.line}`,
      }}>
        <button
          type="button"
          onClick={() => { setAuthCategory("USER"); setError(""); }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 800,
            cursor: "pointer",
            border: "none",
            background: authCategory === "USER" ? "#ffffff" : "transparent",
            color: authCategory === "USER" ? T.primary : T.inkSoft,
            boxShadow: authCategory === "USER" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <User size={17} />
          <span>User (Donor & Receiver)</span>
        </button>

        <button
          type="button"
          onClick={() => { setAuthCategory("DELIVERY_PARTNER"); setError(""); }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 800,
            cursor: "pointer",
            border: "none",
            background: authCategory === "DELIVERY_PARTNER" ? "#ffffff" : "transparent",
            color: authCategory === "DELIVERY_PARTNER" ? T.indigo : T.inkSoft,
            boxShadow: authCategory === "DELIVERY_PARTNER" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <Truck size={17} />
          <span>Delivery Partner</span>
        </button>
      </div>

      <Card>
        <div style={{
          background: authCategory === "USER" ? T.primaryLight : T.indigoLight,
          color: authCategory === "USER" ? "#065F46" : "#3730A3",
          padding: "10px 14px",
          borderRadius: 10,
          fontSize: 12.5,
          fontWeight: 700,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          {authCategory === "USER" ? (
            <span>🍲 Access both <strong>Donor Hub</strong> (to post surplus) & <strong>Receiver Hub</strong> (to claim meals).</span>
          ) : (
            <span>🛵 Access <strong>Delivery Courier Console</strong> for GPS pickup & drop-off runs in Hyderabad.</span>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Full Name / Organization</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Rao or Sneha Foundation"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 5 }}>
                  <Phone size={13} color={T.primary} /> Cell / Mobile Number
                </label>
                <input
                  value={cellNo}
                  onChange={(e) => setCellNo(e.target.value)}
                  placeholder="e.g. +91 98480 12345"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                    <Home size={12} color={T.primary} /> House / Bldg Name
                  </label>
                  <input
                    value={houseName}
                    onChange={(e) => setHouseName(e.target.value)}
                    placeholder="e.g. Flat 402, Sai Nilayam"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                    <Hash size={12} color={T.primary} /> Pin Code
                  </label>
                  <input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 500034"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={13} color={T.primary} /> Street & Area (Hyderabad, Telangana)
                </label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Road No 10, Banjara Hills / Madhapur"
                  style={inputStyle}
                  required
                />
              </div>
            </>
          )}

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Email Address</label>
              {email && (
                <span style={{ fontSize: 11, fontWeight: 700, color: isValidEmail(email) ? T.primary : T.rose }}>
                  {isValidEmail(email) ? "✓ Valid Email" : "✗ Incomplete format"}
                </span>
              )}
            </div>
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              type="email"
              placeholder={authCategory === "USER" ? "user@foodbridge.org" : "delivery@foodbridge.org"}
              style={{
                ...inputStyle,
                borderColor: error && !isValidEmail(email) ? T.rose : isValidEmail(email) ? T.primary : T.line,
              }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Password</label>
            <input
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              type="password"
              placeholder="Minimum 6 characters"
              style={inputStyle}
              required
            />
          </div>

          {error && (
            <div style={{
              fontSize: 12.8,
              color: T.rose,
              background: T.roseLight,
              padding: "10px 12px",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid #FECDD3",
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <Btn
            type="submit"
            full
            disabled={isSubmitting}
            variant={authCategory === "USER" ? "primary" : "indigo"}
            icon={isSubmitting ? RefreshCw : Send}
          >
            {isSubmitting
              ? "Verifying Session..."
              : mode === "login"
                ? `Sign In as ${authCategory === "USER" ? "User (Donor/Receiver)" : "Delivery Partner"}`
                : "Create Account & Dispatch Verification"}
          </Btn>
        </form>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13.5, color: T.inkSoft }}>
          {mode === "login" ? "New user in Hyderabad? " : "Already registered? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: T.primary, fontWeight: 800, cursor: "pointer", fontSize: 13.5 }}
          >
            {mode === "login" ? "Register here" : "Sign in to existing account"}
          </button>
        </div>
      </Card>

      {/* 1-Click Fast Demo Login Buttons */}
      <div style={{ marginTop: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: T.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            1-Click Demo Accounts (Hyderabad)
          </span>
          <span style={{ fontSize: 11, color: T.primary, fontWeight: 700 }}>Pass: {DEMO_PASSWORD}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => handleDemoSelect(a)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: 12,
                border: `1.5px solid ${email === a.email ? (a.role === "DELIVERY_PARTNER" ? T.indigo : T.primary) : T.line}`,
                background: email === a.email ? (a.role === "DELIVERY_PARTNER" ? T.indigoLight : T.primaryLight) : "#ffffff",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: T.ink }}>{a.name}</div>
                <div style={{ fontSize: 11.5, color: T.inkSoft }}>{a.email} · {a.street}</div>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                color: a.role === "DELIVERY_PARTNER" ? T.indigo : T.primary,
                background: "#ffffff",
                padding: "4px 9px",
                borderRadius: 999,
                border: `1px solid ${T.line}`,
              }}>
                {a.role === "DELIVERY_PARTNER" ? "🛵 Delivery Partner" : "👤 User (Donor/Receiver)"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Face & ID Verification Modal for Delivery Partners */}
      <FaceVerificationModal
        isOpen={showFaceModal}
        onClose={() => setShowFaceModal(false)}
        onVerifySuccess={handleFaceVerificationSuccess}
        courierData={pendingCourierUser}
      />
    </div>
  );
}
