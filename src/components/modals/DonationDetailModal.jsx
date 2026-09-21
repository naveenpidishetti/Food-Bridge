import React, { useMemo } from "react";
import { X, AlertTriangle, Sparkles, ShieldCheck, MapPin, Building2, Phone, Home, Hash, Navigation } from "lucide-react";
import { T } from "../../constants/theme";
import { RECEIVERS_POOL } from "../../constants/data";
import { aiUrgency, aiSmartMatch } from "../../utils/aiServices";
import { fmtTime, fmtDateTime } from "../../utils/dateUtils";
import Badge from "../common/Badge";

export default function DonationDetailModal({ d, user, onClose, actions }) {
  const urg = aiUrgency(Math.max(1, Math.round((new Date(d.consumeBefore).getTime() - Date.now()) / 60000)));
  const matches = useMemo(() => aiSmartMatch({ ...d, urgencyLevel: urg.level }, RECEIVERS_POOL), [d.id, urg.level]);

  const TIMELINE_STAGES = [
    "Donation Created",
    "Claimed & Pinned by Receiver",
    "Delivery Partner Dispatched",
    "Food Picked Up from Donor",
    "In Live GPS Transit",
    "Safely Handed Over at Drop Point",
    "Meal Receipt Confirmed"
  ];
  const doneStages = d.timeline ? d.timeline.map((t) => t.stage) : [];
  if (d.status === "COMPLETED") doneStages.push("Meal Receipt Confirmed");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        zIndex: 90,
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
          maxWidth: 680,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 28,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `1px solid ${T.line}`,
          paddingBottom: 16
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Badge status={d.status} />
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: urg.color,
                background: urg.bg,
                padding: "4px 10px",
                borderRadius: 999
              }}>
                {urg.level} Urgency
              </span>
            </div>
            <h2 style={{ fontFamily: T.headline, fontSize: 24, fontWeight: 800, color: T.ink, margin: 0 }}>
              {d.foodName}
            </h2>
            <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 4 }}>
              Donated by <strong>{d.donorName}</strong> · {d.category} · {d.quantity} {d.unit}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: T.bgSubtle,
              border: "none",
              cursor: "pointer",
              width: 34,
              height: 34,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Urgency Alert Note */}
        <div style={{
          background: urg.bg,
          border: `1px solid ${urg.color}30`,
          borderRadius: 12,
          padding: 14,
          marginTop: 18,
          fontSize: 13.5,
          color: urg.color,
          fontWeight: 600,
          display: "flex",
          gap: 8,
          alignItems: "center"
        }}>
          <AlertTriangle size={17} style={{ flexShrink: 0 }} />
          <span>{urg.note}</span>
        </div>

        {/* Detailed Donor & Receiver Location Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginTop: 18,
          background: T.bgSubtle,
          padding: 18,
          borderRadius: 14
        }}>
          {/* Donor details */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: T.primary, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} /> DONOR PICKUP LOCATION
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 4 }}>{d.donorName || "Ramesh Rao"}</div>
            <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>
              <strong>Cell:</strong> {d.donorPhone || "+91 98480 12345"}
            </div>
            <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>
              <strong>Address:</strong> {d.pickupAddress}
            </div>
            <div style={{ fontSize: 11.5, color: T.amber, fontWeight: 700, marginTop: 4 }}>
              Pickup Window: {fmtTime(d.pickupStart)} – {fmtTime(d.pickupEnd)}
            </div>
          </div>

          {/* Receiver details */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: T.indigo, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
              <Building2 size={12} /> SHELTER DROP-OFF LOCATION
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 4 }}>
              {d.deliveryName || "Awaiting Receiver Claim"}
            </div>
            {d.receiverPhone && (
              <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>
                <strong>Cell:</strong> {d.receiverPhone}
              </div>
            )}
            {d.receiverDropPoint && (
              <div style={{ fontSize: 12, color: T.indigo, fontWeight: 600, marginTop: 2 }}>
                <strong>Drop Point:</strong> {d.receiverDropPoint}
              </div>
            )}
            <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>
              <strong>Address:</strong> {d.deliveryAddress || "Assigned upon claim"}
            </div>
          </div>
        </div>

        {/* Assigned Delivery Partner */}
        {d.volunteerName && (
          <div style={{ background: T.indigoLight, padding: "12px 16px", borderRadius: 12, marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.indigo, textTransform: "uppercase" }}>🛵 ASSIGNED DELIVERY PARTNER</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{d.volunteerName}</div>
              <div style={{ fontSize: 12, color: T.inkSoft }}>Contact: {d.volunteerPhone || "+91 99887 65432"}</div>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: T.indigo, background: "#ffffff", padding: "3px 9px", borderRadius: 999 }}>
              In Progress
            </span>
          </div>
        )}

        {/* AI Smart Match (for Donors) */}
        {d.status === "AVAILABLE" && (
          <div style={{ marginTop: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 14.5, color: T.ink, marginBottom: 12 }}>
              <Sparkles size={16} color={T.primary} />
              <span>AI Smart Matched Shelters in Hyderabad</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {matches.map((m, i) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: `1px solid ${i === 0 ? T.primary : T.line}`,
                    background: i === 0 ? T.primaryLight : "#ffffff",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: T.ink }}>
                      {m.name} {m.verified && <ShieldCheck size={13} style={{ display: "inline", color: T.primary }} />}
                    </div>
                    <div style={{ fontSize: 12, color: T.inkSoft }}>{m.distanceKm} km away in {m.street} · Capacity for {m.capacity} portions</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: T.primary }}>{m.score}% Fit</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Tracking Timeline */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 14.5, color: T.ink, marginBottom: 14 }}>
            Live Dispatch & Delivery Timeline
          </div>
          <div>
            {TIMELINE_STAGES.map((stage, i) => {
              const entry = d.timeline ? d.timeline.find((t) => t.stage === stage) : null;
              const done = doneStages.includes(stage);
              return (
                <div key={stage} style={{ display: "flex", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: done ? T.primary : "#ffffff",
                      border: `2.5px solid ${done ? T.primary : T.lineStrong}`,
                      boxShadow: done ? "0 0 8px rgba(5,150,105,0.4)" : "none",
                    }} />
                    {i < TIMELINE_STAGES.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 24, background: done ? T.primary : T.line }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 18 }}>
                    <div style={{ fontSize: 13.5, fontWeight: done ? 800 : 500, color: done ? T.ink : T.inkSoft }}>
                      {stage}
                    </div>
                    {entry && <div style={{ fontSize: 11.5, color: T.primary, fontWeight: 600 }}>{fmtDateTime(entry.at)}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {actions && (
          <div style={{
            display: "flex",
            gap: 10,
            marginTop: 10,
            borderTop: `1px solid ${T.line}`,
            paddingTop: 18,
            flexWrap: "wrap"
          }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
