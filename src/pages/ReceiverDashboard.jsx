import React, { useState } from "react";
import {
  Compass,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  Filter,
  Heart,
  Phone,
  Home,
  MapPin,
  Hash,
  User,
  Navigation,
  Lock,
  Pin,
  X,
  AlertCircle
} from "lucide-react";
import { T, CATEGORIES } from "../constants/theme";
import StatCard from "../components/common/StatCard";
import Card from "../components/common/Card";
import Btn from "../components/common/Btn";
import DonationCard from "../components/donations/DonationCard";
import Badge from "../components/common/Badge";

export default function ReceiverDashboard({ user, donations, openDetail, claimDonation, setView }) {
  const [catFilter, setCatFilter] = useState("ALL");
  const [vegOnly, setVegOnly] = useState(false);

  // Claim Modal State
  const [claimingDonation, setClaimingDonation] = useState(null);
  const [receiverName, setReceiverName] = useState(user?.name || "Anitha Reddy");
  const [cellNo, setCellNo] = useState(user?.cellNo || "+91 94401 56789");
  const [dropPoint, setDropPoint] = useState(user?.dropPoint || "Main Receiving Counter / Gate 1");
  const [houseName, setHouseName] = useState(user?.houseName || "Plot 45, Sneha Seva Nilayam");
  const [street, setStreet] = useState(user?.street || "Hitec City Main Road, Madhapur");
  const [pincode, setPincode] = useState(user?.pincode || "500081");

  // Filter ONLY available (unclaimed) donations
  const available = donations.filter((d) => d.status === "AVAILABLE");

  // Orders claimed and pinned specifically by this receiver
  const myClaimed = donations.filter(
    (d) =>
      (d.receiverId === user?.email ||
        d.receiverName === user?.name ||
        d.receiverPhone === user?.cellNo ||
        d.receiverId === "receiver@foodbridge.org") &&
      d.status !== "AVAILABLE"
  );

  const filteredAvailable = available.filter(
    (d) => (catFilter === "ALL" || d.category === catFilter) && (!vegOnly || d.vegetarian)
  );

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: `1.5px solid ${T.line}`,
    fontSize: 13.5,
    marginTop: 5,
    boxSizing: "border-box",
    fontFamily: T.body,
    outline: "none",
  };

  function handleOpenClaimModal(d, e) {
    if (e) e.stopPropagation();
    setClaimingDonation(d);
  }

  function handleConfirmClaim(e) {
    e.preventDefault();
    if (!receiverName || !cellNo || !dropPoint || !houseName || !street || !pincode) {
      alert("Please fill in all delivery point and receiver contact fields.");
      return;
    }

    const receiverPayload = {
      name: receiverName.trim(),
      email: user?.email || "receiver@foodbridge.org",
      phone: cellNo.trim(),
      dropPoint: dropPoint.trim(),
      houseName: houseName.trim(),
      street: street.trim(),
      pincode: pincode.trim(),
      fullAddress: `${houseName.trim()}, ${dropPoint.trim()}, ${street.trim()}, Hyderabad - ${pincode.trim()}`,
    };

    claimDonation(claimingDonation.id, receiverPayload);
    setClaimingDonation(null);
  }

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 24px 70px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.amber, boxShadow: `0 0 8px ${T.amber}` }} />
            <h1 style={{ fontFamily: T.headline, fontSize: 26, fontWeight: 800, color: T.ink, margin: 0 }}>
              Receiver Hub — Hyderabad & Telangana
            </h1>
          </div>
          <p style={{ color: T.inkSoft, fontSize: 14, margin: "4px 0 0" }}>
            Browse available food donations with verified donor cell numbers. Once claimed, orders are locked & pinned to your shelter.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn icon={User} variant="outline" onClick={() => setView("donor")}>
            Switch to Donor Hub
          </Btn>
          <Btn icon={Compass} onClick={() => setView("map")}>
            View Live Hyderabad Delivery Map
          </Btn>
        </div>
      </div>

      {/* Receiver Quick Profile Bar */}
      <Card style={{ marginBottom: 22, background: "#ffffff", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.amberLight, display: "flex", alignItems: "center", justifyContent: "center", color: T.amber }}>
            <Heart size={20} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>
              Receiver Entity: {user?.name || "Anitha Reddy — Sneha Foundation"}
            </div>
            <div style={{ fontSize: 12, color: T.inkSoft }}>
              Drop-off Point: {user?.houseName || "Plot 45, Sneha Nilayam"}, {user?.street || "Madhapur"}, Hyderabad · <strong>Cell: {user?.cellNo || "+91 94401 56789"}</strong>
            </div>
          </div>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 700, background: T.primaryLight, color: "#065F46", padding: "4px 10px", borderRadius: 999 }}>
          ✓ Verified Shelter
        </span>
      </Card>

      {/* Stats Counters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }} className="fb-stats-grid">
        <StatCard icon={Package} label="Available from Donors" value={filteredAvailable.length} color={T.primary} bg={T.primaryLight} />
        <StatCard icon={Pin} label="Your Pinned / Claimed Orders" value={myClaimed.length} color={T.amber} bg={T.amberLight} />
        <StatCard icon={Truck} label="In Live Courier Transit" value={myClaimed.filter((d) => d.status === "IN_TRANSIT" || d.status === "PICKED_UP").length} color={T.indigo} bg={T.indigoLight} />
        <StatCard icon={CheckCircle2} label="Delivered Meals" value={myClaimed.filter((d) => d.status === "DELIVERED" || d.status === "COMPLETED").length} color="#059669" bg="#DCFCE7" />
      </div>

      {/* Filter Bar */}
      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 18,
        background: "#ffffff",
        padding: "12px 16px",
        borderRadius: 12,
        border: `1px solid ${T.line}`
      }}>
        <Filter size={16} color={T.inkSoft} />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ ...inputStyle, width: "auto", marginTop: 0 }}>
          <option value="ALL">All Food Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: T.ink, cursor: "pointer" }}>
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
          🌱 Vegetarian Only
        </label>
      </div>

      {/* SECTION 1: AVAILABLE DONOR FOOD READY TO BE CLAIMED */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: T.ink }}>
            Available Food from Donors (Hyderabad)
          </div>
          <div style={{ fontSize: 12.5, color: T.inkSoft }}>
            Donor cell numbers are visible on each listing. Claiming an item will lock and pin it to your shelter.
          </div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.primary, background: T.primaryLight, padding: "3px 9px", borderRadius: 999 }}>
          {filteredAvailable.length} available
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16, marginBottom: 40 }}>
        {filteredAvailable.map((d) => (
          <DonationCard
            key={d.id}
            d={d}
            onOpen={openDetail}
            showDonorContact={true}
            footer={
              <Btn
                small
                full
                icon={Heart}
                onClick={(e) => handleOpenClaimModal(d, e)}
              >
                Claim & Set Delivery Location
              </Btn>
            }
          />
        ))}

        {filteredAvailable.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: 30, textAlign: "center", background: "#fff", borderRadius: 16, border: `1px solid ${T.line}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>No new surplus food currently available in this category.</div>
            <p style={{ color: T.inkSoft, fontSize: 13, marginTop: 4 }}>Check back soon as restaurants in Hyderabad post fresh excess batches throughout the day.</p>
          </div>
        )}
      </div>

      {/* SECTION 2: PINNED & CLAIMED SHIPMENTS (Locked to this Receiver) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Pin size={18} color={T.indigo} />
        <div style={{ fontWeight: 800, fontSize: 18, color: T.ink }}>
          Your Pinned & Claimed Shipments (Locked to Your Shelter)
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
        {myClaimed.map((d) => (
          <Card key={d.id} onClick={() => openDetail(d)} style={{ cursor: "pointer", border: `1.5px solid #C7D2FE`, background: "#FAFAFE" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, background: T.indigoLight, color: T.indigo, padding: "3px 8px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}>
                <Lock size={11} /> PINNED ORDER
              </span>
              <Badge status={d.status} />
            </div>

            <div style={{ fontWeight: 800, fontSize: 16, color: T.ink, marginBottom: 4 }}>
              {d.foodName}
            </div>
            <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 12 }}>
              {d.category} · <strong>{d.quantity} {d.unit}</strong>
            </div>

            <div style={{ background: "#ffffff", padding: 10, borderRadius: 10, fontSize: 12, border: `1px solid ${T.line}`, display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              <div>
                <strong>Donor:</strong> {d.donorName || "Ramesh Rao"} (<strong>Cell: {d.donorPhone || "+91 98480 12345"}</strong>)
              </div>
              <div>
                <strong>Your Drop-off:</strong> {d.receiverDropPoint || d.deliveryAddress || "Sneha Home Gate"}
              </div>
              {d.volunteerName && (
                <div style={{ color: T.indigo, fontWeight: 700 }}>
                  🚚 <strong>Assigned Delivery Partner:</strong> {d.volunteerName} (Cell: {d.volunteerPhone || "+91 99887 65432"})
                </div>
              )}
            </div>

            <Btn small full variant="outline" icon={Navigation}>
              Track Live Delivery
            </Btn>
          </Card>
        ))}

        {myClaimed.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center", background: "#fff", borderRadius: 14, color: T.inkSoft, fontSize: 13.5, border: `1px solid ${T.line}` }}>
            You have not claimed any active food shipments yet. Select an available donation above.
          </div>
        )}
      </div>

      {/* CLAIM & SET RECEIVER LOCATION MODAL */}
      {claimingDonation && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 110,
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setClaimingDonation(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: 20,
              maxWidth: 620,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 26,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${T.line}`, paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: T.primary, background: T.primaryLight, padding: "3px 8px", borderRadius: 999 }}>
                  CONFIRM FOOD RESCUE & PIN ORDER
                </span>
                <h2 style={{ fontFamily: T.headline, fontSize: 22, fontWeight: 800, color: T.ink, margin: "6px 0 0" }}>
                  Claim: {claimingDonation.foodName}
                </h2>
                <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 4, background: T.bgSubtle, padding: "6px 10px", borderRadius: 8 }}>
                  🍲 <strong>{claimingDonation.quantity} {claimingDonation.unit}</strong> · Donor: <strong>{claimingDonation.donorName || "Ramesh Rao"}</strong> · <span style={{ color: "#065F46", fontWeight: 700 }}>Cell: {claimingDonation.donorPhone || "+91 98480 12345"}</span>
                </div>
              </div>
              <button
                onClick={() => setClaimingDonation(null)}
                style={{ background: T.bgSubtle, border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmClaim} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: T.amberLight, padding: "10px 14px", borderRadius: 10, fontSize: 12.5, color: "#B45309", fontWeight: 700, display: "flex", gap: 8, alignItems: "center" }}>
                <Lock size={15} style={{ flexShrink: 0 }} />
                <span>Once confirmed, this order is locked to your shelter in Hyderabad. No other receiver will be able to pick it.</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft }}>Receiver / Shelter Contact Person</label>
                  <input
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="e.g. Anitha Reddy"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                    <Phone size={12} color={T.primary} /> Your Cell / Contact Number
                  </label>
                  <input
                    value={cellNo}
                    onChange={(e) => setCellNo(e.target.value)}
                    placeholder="e.g. +91 94401 56789"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                  <Navigation size={12} color={T.indigo} /> Exact Dropping Point / Handover Spot
                </label>
                <input
                  value={dropPoint}
                  onChange={(e) => setDropPoint(e.target.value)}
                  placeholder="e.g. Sneha Home Gate 1, Near Pillar 104 / Kitchen Counter"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                    <Home size={12} color={T.primary} /> House / Shelter / Building Name
                  </label>
                  <input
                    value={houseName}
                    onChange={(e) => setHouseName(e.target.value)}
                    placeholder="e.g. Plot 45, Sneha Seva Nilayam"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                    <Hash size={12} color={T.primary} /> Pin Code (Hyderabad)
                  </label>
                  <input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 500081"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={12} color={T.primary} /> Street Address & Area (Telangana)
                </label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Hitec City Main Road, Madhapur / Banjara Hills"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <Btn type="submit" full icon={CheckCircle2}>
                  Lock, Pin & Request Delivery Partner
                </Btn>
                <Btn variant="outline" onClick={() => setClaimingDonation(null)}>
                  Cancel
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
