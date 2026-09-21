import React from "react";
import { Compass, Plus, Package, CheckCircle2, Utensils, Users, Phone, Home, MapPin, Hash, User, Building2, Heart } from "lucide-react";
import { T } from "../constants/theme";
import Card from "../components/common/Card";
import StatCard from "../components/common/StatCard";
import Btn from "../components/common/Btn";
import DonationCard from "../components/donations/DonationCard";

export default function DonorDashboard({ user, donations, setView, openDetail }) {
  // Show donations associated with this donor
  const mine = donations.filter(
    (d) => d.donorId === user?.email || d.donorName?.includes(user?.name) || d.donorId === "user@foodbridge.org"
  );
  const active = mine.filter((d) => d.status !== "COMPLETED" && d.status !== "DELIVERED");
  const completed = mine.filter((d) => d.status === "COMPLETED" || d.status === "DELIVERED");
  const totalMeals = mine.reduce((s, d) => s + (d.quantity || 0), 0);

  // Extract food types donated
  const foodTypes = [...new Set(mine.map((d) => d.category))];

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 24px 70px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.primary, boxShadow: `0 0 8px ${T.primary}` }} />
            <h1 style={{ fontFamily: T.headline, fontSize: 26, fontWeight: 800, color: T.ink, margin: 0 }}>
              Donor Control Hub — Hyderabad
            </h1>
          </div>
          <p style={{ color: T.inkSoft, fontSize: 14, margin: "4px 0 0" }}>
            Manage your surplus food donations, pickup locations, and track live volunteer dispatch.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn icon={Heart} variant="outline" onClick={() => setView("receiver")}>
            Switch to Receiver Hub
          </Btn>
          <Btn icon={Compass} variant="outline" onClick={() => setView("map")}>
            Live Map Radar
          </Btn>
          <Btn icon={Plus} onClick={() => setView("create")}>
            + Donate Surplus Food
          </Btn>
        </div>
      </div>

      {/* DONOR INFORMATION CARD (Required by User) */}
      <Card style={{
        marginBottom: 24,
        background: `linear-gradient(145deg, #0F172A 0%, #1E293B 100%)`,
        color: "#ffffff",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 10px 25px rgba(15,23,42,0.25)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${T.primary} 0%, #047857 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(5,150,105,0.4)"
            }}>
              <User size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: T.headline }}>
                {user?.name || "Ramesh Rao"}
              </div>
              <div style={{ fontSize: 12.5, color: "#94A3B8" }}>
                {user?.org || "Food Donor — Hyderabad"} · {user?.email || "user@foodbridge.org"}
              </div>
            </div>
          </div>
          <span style={{
            background: "rgba(52, 211, 153, 0.2)",
            color: "#34D399",
            padding: "4px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            border: "1px solid rgba(52, 211, 153, 0.3)"
          }}>
            VERIFIED DONOR IDENTITY
          </span>
        </div>

        {/* Detailed Donor Location & Contact Info */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          background: "rgba(255,255,255,0.05)",
          padding: 16,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
              <Phone size={12} color="#34D399" /> Cell Number
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2, color: "#F8FAFC" }}>
              {user?.cellNo || "+91 98480 12345"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
              <Home size={12} color="#34D399" /> House / Bldg Name
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2, color: "#F8FAFC" }}>
              {user?.houseName || "Flat 402, Sri Sai Nilayam"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} color="#34D399" /> Street & Area
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2, color: "#F8FAFC" }}>
              {user?.street || "Road No 10, Banjara Hills"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
              <Hash size={12} color="#34D399" /> Pin Code / State
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2, color: "#F8FAFC" }}>
              {user?.pincode || "500034"} · Hyderabad, Telangana
            </div>
          </div>
        </div>

        {/* Donated Food Categories Tags */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 700 }}>Donated Food Types:</span>
          {foodTypes.length > 0 ? (
            foodTypes.map((type) => (
              <span key={type} style={{
                background: "rgba(5, 150, 105, 0.3)",
                color: "#6EE7B7",
                padding: "3px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                border: "1px solid rgba(5, 150, 105, 0.4)"
              }}>
                🍲 {type}
              </span>
            ))
          ) : (
            <span style={{ fontSize: 12, color: "#CBD5E1" }}>Cooked Meals, Biryani & Bakery</span>
          )}
        </div>
      </Card>

      {/* Stats Counters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }} className="fb-stats-grid">
        <StatCard icon={Package} label="Active Donations" value={active.length} color={T.primary} bg={T.primaryLight} />
        <StatCard icon={CheckCircle2} label="Delivered to Shelters" value={completed.length} color={T.indigo} bg={T.indigoLight} />
        <StatCard icon={Utensils} label="Total Rescues" value={mine.length} color={T.amber} bg={T.amberLight} />
        <StatCard icon={Users} label="Portions Distributed" value={totalMeals} color="#059669" bg="#DCFCE7" />
      </div>

      {/* Donation Listings */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.ink }}>
          Your Published Food Listings & Dispatch Status
        </div>
        <span style={{ fontSize: 12.5, color: T.inkSoft, fontWeight: 600 }}>
          {mine.length} total food entries
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {mine.map((d) => (
          <DonationCard key={d.id} d={d} onOpen={openDetail} />
        ))}
        {mine.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: 36, textAlign: "center", background: "#fff", borderRadius: 16, border: `1px solid ${T.line}` }}>
            <Utensils size={32} color={T.primary} style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 16, color: T.ink }}>No donations listed yet.</div>
            <p style={{ color: T.inkSoft, fontSize: 13.5, margin: "6px 0 16px" }}>Post your excess meals or bakery goods to support nearby Hyderabad shelters.</p>
            <Btn icon={Plus} onClick={() => setView("create")}>Create First Donation</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
