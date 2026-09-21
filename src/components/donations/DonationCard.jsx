import React from "react";
import { MapPin, Navigation, Clock, AlertTriangle, Phone, User } from "lucide-react";
import { T } from "../../constants/theme";
import { aiUrgency } from "../../utils/aiServices";
import { fmtTime } from "../../utils/dateUtils";
import Card from "../common/Card";
import Badge from "../common/Badge";

export default function DonationCard({ d, onOpen, footer, showDonorContact = true }) {
  const consumeDiff = Math.max(1, Math.round((new Date(d.consumeBefore).getTime() - Date.now()) / 60000));
  const urg = aiUrgency(consumeDiff);

  const getEmoji = (cat) => {
    switch (cat) {
      case "Bakery": return "🥖";
      case "Fruits": return "🍎";
      case "Vegetables": return "🥕";
      case "Dairy": return "🥛";
      case "Beverages": return "🧃";
      case "Groceries": return "🌾";
      case "Packaged Food": return "🥫";
      default: return "🍲";
    }
  };

  return (
    <Card
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      onClick={() => onOpen(d)}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: T.primaryLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}>
            {getEmoji(d.category)}
          </div>
          <Badge status={d.status} />
        </div>

        <div style={{ fontWeight: 800, fontSize: 16, color: T.ink, marginBottom: 4, fontFamily: T.headline }}>
          {d.foodName}
        </div>
        <div style={{ fontSize: 12.8, color: T.inkSoft, marginBottom: 12 }}>
          {d.category} · <strong>{d.quantity} {d.unit}</strong> · {d.vegetarian ? "🌱 Veg" : "🍗 Non-veg"}
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 7,
          fontSize: 12.5,
          color: T.inkSoft,
          background: T.bgSubtle,
          padding: 10,
          borderRadius: 10,
          marginBottom: 12
        }}>
          {/* Donor Contact & Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: T.ink }}>
            <User size={14} color={T.primary} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <strong>Donor:</strong> {d.donorName || "Ramesh Rao"}
            </span>
          </div>

          {/* Donor Cell / Phone Number (MANDATORY REQUIREMENT) */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#065F46", fontWeight: 700, background: T.primaryLight, padding: "4px 8px", borderRadius: 6 }}>
            <Phone size={13} color={T.primary} style={{ flexShrink: 0 }} />
            <span>Cell No: {d.donorPhone || "+91 98480 12345"}</span>
          </div>

          {/* Pickup Address */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: T.ink }}>
            <MapPin size={14} color={T.primary} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <strong>Pickup:</strong> {d.pickupAddress}
            </span>
          </div>

          {/* Drop-off Address if assigned */}
          {d.deliveryName && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: T.indigo }}>
              <Navigation size={14} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <strong>Drop-off:</strong> {d.deliveryName} {d.receiverPhone ? `(${d.receiverPhone})` : ""}
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Clock size={14} color={T.inkSoft} style={{ flexShrink: 0 }} />
            <span>Pickup by {fmtTime(d.pickupEnd)}</span>
          </div>
        </div>
      </div>

      <div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          borderRadius: 8,
          background: urg.bg,
          color: urg.color,
          fontSize: 12,
          fontWeight: 700,
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <AlertTriangle size={13} /> {urg.level} Urgency
          </span>
          <span>{fmtTime(d.consumeBefore)}</span>
        </div>

        {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
      </div>
    </Card>
  );
}
