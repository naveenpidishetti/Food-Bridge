import React, { useState, useEffect } from "react";
import { Mail, X, Leaf, Lock, ShieldCheck } from "lucide-react";
import { T } from "../../constants/theme";
import { fmtTime, fmtDateTime } from "../../utils/dateUtils";

export default function EmailCenterModal({ emails, isOpen, onClose, user }) {
  // STRICT USER EMAIL FILTERING: Show ONLY emails addressed to the logged-in user
  const userEmails = user
    ? emails.filter((e) => e.recipient?.toLowerCase().trim() === user.email?.toLowerCase().trim())
    : emails;

  const [selectedMail, setSelectedMail] = useState(userEmails[0] || null);

  useEffect(() => {
    if (userEmails.length > 0) {
      if (!selectedMail || !userEmails.find((e) => e.id === selectedMail.id)) {
        setSelectedMail(userEmails[0]);
      }
    } else {
      setSelectedMail(null);
    }
  }, [emails, user?.email]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        zIndex: 120,
        backdropFilter: "blur(5px)",
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
          background: "#ffffff",
          borderRadius: 20,
          maxWidth: 860,
          width: "100%",
          height: "82vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "16px 24px",
          background: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: T.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Mail size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span>Private Security Mail Inbox</span>
                <span style={{ fontSize: 11, background: "rgba(52, 211, 153, 0.2)", color: "#34D399", padding: "2px 8px", borderRadius: 999 }}>
                  <Lock size={10} style={{ display: "inline", marginRight: 3 }} /> Encrypted
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: "#94A3B8" }}>
                Active Session: <strong>{user?.email || "Signed In Account"}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ display: "grid", gridTemplateColumns: "310px 1fr", flex: 1, overflow: "hidden" }}>
          {/* Email List (strictly filtered for this user) */}
          <div style={{ borderRight: `1px solid ${T.line}`, background: T.bgSubtle, overflowY: "auto", padding: 12 }}>
            <div style={{
              fontSize: 11.5,
              fontWeight: 800,
              color: T.inkSoft,
              textTransform: "uppercase",
              padding: "6px 8px 10px",
              letterSpacing: "0.05em",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>Your Messages</span>
              <span style={{ color: T.primary }}>{userEmails.length}</span>
            </div>

            {userEmails.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: T.inkSoft, fontSize: 13 }}>
                <ShieldCheck size={28} color={T.primary} style={{ marginBottom: 6 }} />
                <div>No emails sent to <strong>{user?.email || "this account"}</strong> yet.</div>
                <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 4 }}>
                  Dispatched donation receipts, OTPs, and claim confirmations will appear here exclusively for you.
                </div>
              </div>
            ) : (
              userEmails.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMail(m)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    marginBottom: 8,
                    cursor: "pointer",
                    background: selectedMail?.id === m.id ? "#ffffff" : "transparent",
                    border: `1.5px solid ${selectedMail?.id === m.id ? T.primary : "transparent"}`,
                    boxShadow: selectedMail?.id === m.id ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{m.recipient}</span>
                    <span style={{ fontSize: 10.5, color: T.inkSoft }}>{fmtTime(m.at)}</span>
                  </div>
                  <div style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: T.ink,
                    marginBottom: 3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {m.subject}
                  </div>
                  <div style={{
                    fontSize: 11.5,
                    color: T.inkSoft,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {m.preview}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Email Content Detail */}
          <div style={{ padding: 24, overflowY: "auto", background: "#ffffff", display: "flex", flexDirection: "column" }}>
            {selectedMail ? (
              <div>
                <div style={{ borderBottom: `1px solid ${T.line}`, paddingBottom: 16, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: 999,
                      background: T.primaryLight,
                      color: T.primary
                    }}>
                      DELIVERED TO YOUR PRIVATE INBOX
                    </span>
                    <span style={{ fontSize: 12, color: T.inkSoft }}>{fmtDateTime(selectedMail.at)}</span>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: T.ink, margin: "0 0 10px", fontFamily: T.headline }}>
                    {selectedMail.subject}
                  </h2>
                  <div style={{ fontSize: 13, color: T.inkSoft, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div><strong>From:</strong> Food Bridge Security & Operations &lt;notifications@foodbridge.org&gt;</div>
                    <div><strong>To (Private):</strong> {selectedMail.recipient}</div>
                  </div>
                </div>

                <div style={{
                  border: `1px solid ${T.line}`,
                  borderRadius: 14,
                  padding: 24,
                  background: "#FAFAFA",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                }}>
                  {/* Email Banner */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    paddingBottom: 16,
                    borderBottom: `1px solid ${T.line}`,
                    marginBottom: 18
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: T.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Leaf size={18} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 18, color: T.ink, fontFamily: T.headline }}>
                      Food Bridge Hyderabad
                    </span>
                  </div>

                  <div style={{ fontSize: 14, lineHeight: 1.7, color: T.ink }}>
                    <p style={{ margin: "0 0 14px", fontWeight: 700 }}>Hello {user?.name || ""},</p>
                    <p style={{ margin: "0 0 14px" }}>{selectedMail.bodyText}</p>

                    {selectedMail.code && (
                      <div style={{
                        background: "#ffffff",
                        border: `2px dashed ${T.primary}`,
                        borderRadius: 12,
                        padding: "16px",
                        textAlign: "center",
                        margin: "20px 0",
                      }}>
                        <div style={{ fontSize: 12, color: T.inkSoft, fontWeight: 600 }}>YOUR ONE-TIME PRIVATE SECURITY OTP</div>
                        <div style={{
                          fontSize: 28,
                          fontWeight: 800,
                          letterSpacing: "0.25em",
                          color: T.primary,
                          margin: "6px 0",
                          fontFamily: "monospace"
                        }}>
                          {selectedMail.code}
                        </div>
                        <div style={{ fontSize: 11, color: T.inkSoft }}>Valid for 15 minutes. Never share this code.</div>
                      </div>
                    )}

                    <div style={{
                      background: T.primaryLight,
                      borderRadius: 10,
                      padding: 14,
                      margin: "16px 0",
                      fontSize: 12.5,
                      color: "#065F46"
                    }}>
                      <strong>Privacy Protected:</strong> This notification is visible only to your verified session ({selectedMail.recipient}).
                    </div>

                    <p style={{ margin: "20px 0 0", color: T.inkSoft, fontSize: 13 }}>
                      Warm regards,<br />
                      <strong>Food Bridge Security & Logistics Team (Telangana)</strong><br />
                      <a href="https://foodbridge.org" style={{ color: T.primary, textDecoration: "none" }}>foodbridge.org</a>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: T.inkSoft }}>
                Select an email from the left to read full details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
