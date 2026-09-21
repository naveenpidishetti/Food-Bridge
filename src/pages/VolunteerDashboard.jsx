import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  Package,
  Truck,
  CheckCircle2,
  Navigation,
  Phone,
  MapPin,
  Building2,
  User,
  Minimize2,
  Maximize2,
  X,
  Play,
  Pause,
  AlertTriangle,
  Lock,
  ChevronRight,
  Eye
} from "lucide-react";
import L from "leaflet";
import { T, STATUS_META } from "../constants/theme";
import StatCard from "../components/common/StatCard";
import Card from "../components/common/Card";
import Btn from "../components/common/Btn";
import Badge from "../components/common/Badge";

export default function VolunteerDashboard({ user, donations, openDetail, updateStatus, setView }) {
  // Check active tasks assigned to this delivery partner
  const myActiveList = donations.filter(
    (d) =>
      (d.volunteerName === user?.name ||
        d.volunteerId === user?.email ||
        d.volunteerId === "delivery@foodbridge.org") &&
      !["DELIVERED", "COMPLETED"].includes(d.status)
  );

  const hasActiveOrder = myActiveList.length > 0;
  const activeOrder = myActiveList[0] || null;

  // Unassigned available tasks waiting for courier
  const availableTasks = donations.filter((d) => d.status === "CLAIMED" && !d.volunteerId);

  // Completed delivery runs
  const completed = donations.filter(
    (d) =>
      (d.volunteerName === user?.name ||
        d.volunteerId === user?.email ||
        d.volunteerId === "delivery@foodbridge.org") &&
      ["DELIVERED", "COMPLETED"].includes(d.status)
  );

  // Side Map Panel View Modes: 'side' | 'minimized' | 'fullscreen' | 'closed'
  const [sideMapMode, setSideMapMode] = useState(hasActiveOrder ? "side" : "closed");
  const [trackingDonation, setTrackingDonation] = useState(activeOrder || null);
  const [courierSimStep, setCourierSimStep] = useState(0.45);
  const [isLiveGpsActive, setIsLiveGpsActive] = useState(true);

  // Auto-open side map when an order becomes active
  useEffect(() => {
    if (activeOrder) {
      setTrackingDonation(activeOrder);
      if (sideMapMode === "closed") setSideMapMode("side");
    }
  }, [activeOrder?.id, activeOrder?.status]);

  // Animated courier movement simulation along 3 points
  useEffect(() => {
    let timer = null;
    if (isLiveGpsActive && trackingDonation) {
      timer = setInterval(() => {
        setCourierSimStep((prev) => {
          const next = prev + 0.02;
          return next > 0.98 ? 0.05 : next;
        });
      }, 1100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLiveGpsActive, trackingDonation]);

  // Leaflet side map reference
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapElementsRef = useRef({ markers: [], polylines: [] });

  useEffect(() => {
    if (sideMapMode === "minimized" || sideMapMode === "closed" || !mapContainerRef.current) return;

    // Delivery Partner base GPS in Hyderabad (e.g. Punjagutta / Banjara Hills)
    const partnerBaseLat = 17.4280;
    const partnerBaseLng = 78.4480;

    const pickupLat = trackingDonation?.pickupLat || 17.4319;
    const pickupLng = trackingDonation?.pickupLng || 78.4073;

    const dropLat = trackingDonation?.deliveryLat || 17.4483;
    const dropLng = trackingDonation?.deliveryLng || 78.3808;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [17.4350, 78.4200],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    setTimeout(() => map.invalidateSize(), 200);

    // Clear previous items
    mapElementsRef.current.markers.forEach((m) => m.remove());
    mapElementsRef.current.polylines.forEach((p) => p.remove());
    mapElementsRef.current = { markers: [], polylines: [] };

    // Custom Icon Creators
    const createPartnerIcon = () =>
      L.divIcon({
        className: "custom-partner-pin",
        html: `
          <div style="background:#0F172A; color:#fff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.4); border:2.5px solid #34D399; font-size:18px;">
            🛵
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

    const createPickupIcon = () =>
      L.divIcon({
        className: "custom-pickup-pin",
        html: `
          <div style="background:#059669; color:#fff; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(5,150,105,0.4); border:2.5px solid #fff; font-size:17px;">
            🍲
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

    const createDropIcon = () =>
      L.divIcon({
        className: "custom-drop-pin",
        html: `
          <div style="background:#4F46E5; color:#fff; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(79,70,229,0.4); border:2.5px solid #fff; font-size:17px;">
            🏢
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

    const createLiveCourierIcon = () =>
      L.divIcon({
        className: "custom-live-courier-pin",
        html: `
          <div style="background:#0F172A; color:#34D399; border-radius:20px; padding:4px 10px; font-weight:800; font-size:11px; display:flex; align-items:center; gap:6px; box-shadow:0 4px 16px rgba(0,0,0,0.45); border:2px solid #34D399; white-space:nowrap;">
            🛵 <span>LIVE EN ROUTE</span>
          </div>
        `,
        iconSize: [110, 28],
        iconAnchor: [55, 14],
      });

    // 1. Partner Current Location Marker
    const partnerMarker = L.marker([partnerBaseLat, partnerBaseLng], { icon: createPartnerIcon() }).addTo(map);
    partnerMarker.bindPopup(`<b>Your GPS Location</b><br/>Punjagutta Crossroads, Hyderabad`);
    mapElementsRef.current.markers.push(partnerMarker);

    // 2. Donor Pickup Marker
    const pickupMarker = L.marker([pickupLat, pickupLng], { icon: createPickupIcon() }).addTo(map);
    pickupMarker.bindPopup(`
      <b>1. Donor Pickup Spot</b><br/>
      ${trackingDonation?.donorName || "Ramesh Rao"}<br/>
      Cell: ${trackingDonation?.donorPhone || "+91 98480 12345"}<br/>
      ${trackingDonation?.pickupAddress}
    `);
    mapElementsRef.current.markers.push(pickupMarker);

    // 3. Shelter Drop-off Marker
    const dropMarker = L.marker([dropLat, dropLng], { icon: createDropIcon() }).addTo(map);
    dropMarker.bindPopup(`
      <b>2. Shelter Drop-off Point</b><br/>
      ${trackingDonation?.deliveryName || "Sneha Shelter"}<br/>
      Cell: ${trackingDonation?.receiverPhone || "+91 94401 56789"}<br/>
      Spot: ${trackingDonation?.receiverDropPoint || "Main Gate"}<br/>
      ${trackingDonation?.deliveryAddress}
    `);
    mapElementsRef.current.markers.push(dropMarker);

    // Draw 3-point Polyline (Partner -> Pickup -> Drop-off)
    const line1 = L.polyline([[partnerBaseLat, partnerBaseLng], [pickupLat, pickupLng]], {
      color: "#059669",
      weight: 4,
      dashArray: "6, 6",
      opacity: 0.8,
    }).addTo(map);
    mapElementsRef.current.polylines.push(line1);

    const line2 = L.polyline([[pickupLat, pickupLng], [dropLat, dropLng]], {
      color: "#4F46E5",
      weight: 4,
      dashArray: "6, 6",
      opacity: 0.8,
    }).addTo(map);
    mapElementsRef.current.polylines.push(line2);

    // Calculate Animated Courier Position along 3-point path
    let curLat, curLng;
    if (courierSimStep < 0.5) {
      const step1 = courierSimStep / 0.5;
      curLat = partnerBaseLat + (pickupLat - partnerBaseLat) * step1;
      curLng = partnerBaseLng + (pickupLng - partnerBaseLng) * step1;
    } else {
      const step2 = (courierSimStep - 0.5) / 0.5;
      curLat = pickupLat + (dropLat - pickupLat) * step2;
      curLng = pickupLng + (dropLng - pickupLng) * step2;
    }

    const liveCourierMarker = L.marker([curLat, curLng], { icon: createLiveCourierIcon(), zIndexOffset: 1200 }).addTo(map);
    mapElementsRef.current.markers.push(liveCourierMarker);

    // Fit map bounds
    const bounds = L.latLngBounds([
      [partnerBaseLat, partnerBaseLng],
      [pickupLat, pickupLng],
      [dropLat, dropLng],
    ]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [sideMapMode, trackingDonation, courierSimStep]);

  // Clean up Leaflet on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  function handleAcceptOrder(order) {
    if (hasActiveOrder) {
      alert("You already have an active delivery route in progress! Complete your current order before accepting another one.");
      return;
    }
    updateStatus(order.id, "CLAIMED", user, true);
    setTrackingDonation(order);
    setSideMapMode("side");
  }

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 24px 70px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.indigo, boxShadow: `0 0 8px ${T.indigo}` }} />
            <h1 style={{ fontFamily: T.headline, fontSize: 26, fontWeight: 800, color: T.ink, margin: 0 }}>
              Delivery Partner Console — Hyderabad
            </h1>
          </div>
          <p style={{ color: T.inkSoft, fontSize: 14, margin: "4px 0 0" }}>
            Logged in as <strong>{user?.name || "Kiran Kumar"}</strong> ({user?.cellNo || "+91 99887 65432"}) · Status: <span style={{ color: T.primary, fontWeight: 700 }}>Online & Ready</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {activeOrder && (
            <Btn
              icon={Compass}
              variant={sideMapMode !== "closed" ? "primary" : "outline"}
              onClick={() => setSideMapMode(sideMapMode === "closed" ? "side" : "closed")}
            >
              {sideMapMode !== "closed" ? "Active Map Open" : "Open Side Route Map"}
            </Btn>
          )}
          <Btn icon={Compass} variant="outline" onClick={() => setView("map")}>
            Full Hyderabad Radar
          </Btn>
        </div>
      </div>

      {/* 1 ACTIVE ORDER NOTICE / RESTRICTION BANNER */}
      {hasActiveOrder ? (
        <div style={{
          background: `linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)`,
          color: "#ffffff",
          padding: "16px 20px",
          borderRadius: 16,
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          boxShadow: "0 10px 25px rgba(49, 46, 129, 0.25)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Truck size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>
                1 Active Delivery Run in Progress ({activeOrder.foodName})
              </div>
              <div style={{ fontSize: 12.5, color: "#C7D2FE" }}>
                🔒 <strong>1-Order Limit Active:</strong> You cannot accept another order until you complete and hand over this shipment.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => { setTrackingDonation(activeOrder); setSideMapMode("side"); }}
              style={{
                background: "#ffffff",
                color: "#312E81",
                border: "none",
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              View Route on Side Map
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: T.primaryLight,
          color: "#065F46",
          padding: "12px 18px",
          borderRadius: 12,
          marginBottom: 24,
          fontSize: 13.5,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: `1px solid rgba(5, 150, 105, 0.25)`
        }}>
          <CheckCircle2 size={18} />
          <span>You are available for a new delivery run. Select any unassigned pickup task below to lock in your route.</span>
        </div>
      )}

      {/* Metric Counters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }} className="fb-stats-grid">
        <StatCard icon={Package} label="Pending Delivery Runs" value={availableTasks.length} color={T.amber} bg={T.amberLight} />
        <StatCard icon={Truck} label="Your Active Run" value={myActiveList.length} color={T.primary} bg={T.primaryLight} />
        <StatCard icon={CheckCircle2} label="Delivered Rescues" value={completed.length} color={T.indigo} bg={T.indigoLight} />
        <StatCard icon={Navigation} label="Distance Logged" value={`${(completed.length * 4.8 + 12.4).toFixed(1)} km`} color="#059669" bg="#DCFCE7" />
      </div>

      {/* MAIN CONTAINER: TASKS LIST + SIDE MAP PANEL */}
      <div style={{
        display: "grid",
        gridTemplateColumns: sideMapMode === "side" ? "1fr 480px" : "1fr",
        gap: 24,
        alignItems: "start",
        position: "relative",
      }} className="fb-delivery-console-grid">

        {/* LEFT COLUMN: ORDER CARDS & TASK MANAGEMENT */}
        <div>
          {/* SECTION 1: YOUR ACTIVE RUN */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: T.ink }}>
              Your Active Pickup & Delivery Task
            </div>
            {activeOrder && <Badge status={activeOrder.status} />}
          </div>

          {activeOrder ? (
            <Card style={{
              marginBottom: 32,
              border: `2px solid ${T.indigo}`,
              background: "#FFFFFF",
              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.12)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: T.ink, margin: "0 0 4px", fontFamily: T.headline }}>
                    {activeOrder.foodName}
                  </h3>
                  <div style={{ fontSize: 13, color: T.inkSoft }}>
                    {activeOrder.category} · <strong>{activeOrder.quantity} {activeOrder.unit}</strong> · {activeOrder.vegetarian ? "🌱 Veg" : "🍗 Non-veg"}
                  </div>
                </div>
                <button
                  onClick={() => { setTrackingDonation(activeOrder); setSideMapMode("side"); }}
                  style={{
                    background: T.indigoLight,
                    border: "none",
                    color: T.indigo,
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Compass size={14} /> Focus on Map
                </button>
              </div>

              {/* 2-Step Location Information Grid */}
              <div style={{ background: T.bgSubtle, padding: 16, borderRadius: 14, display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {/* 1. Donor Pickup */}
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.primary }}>
                    <MapPin size={17} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: T.primary, textTransform: "uppercase" }}>
                      STEP 1: DONOR PICKUP LOCATION
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 2 }}>
                      {activeOrder.donorName || "Ramesh Rao"}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#065F46", fontWeight: 700, marginTop: 2 }}>
                      <Phone size={12} style={{ display: "inline", marginRight: 4 }} />
                      Cell: {activeOrder.donorPhone || "+91 98480 12345"}
                    </div>
                    <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>
                      {activeOrder.pickupAddress}
                    </div>
                  </div>
                </div>

                <div style={{ height: 16, width: 2, background: T.line, marginLeft: 15 }} />

                {/* 2. Shelter Drop-off */}
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.indigoLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.indigo }}>
                    <Building2 size={17} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: T.indigo, textTransform: "uppercase" }}>
                      STEP 2: SHELTER DROP-OFF DESTINATION
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 2 }}>
                      {activeOrder.deliveryName || "Sneha Orphanage Home"}
                    </div>
                    <div style={{ fontSize: 12.5, color: T.indigo, fontWeight: 700, marginTop: 2 }}>
                      <Phone size={12} style={{ display: "inline", marginRight: 4 }} />
                      Cell: {activeOrder.receiverPhone || "+91 94401 56789"}
                    </div>
                    <div style={{ fontSize: 12.5, color: T.ink, fontWeight: 600, marginTop: 2 }}>
                      Specific Spot: <strong>{activeOrder.receiverDropPoint || "Main Gate Counter"}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>
                      {activeOrder.deliveryAddress}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Advancement Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeOrder.status === "CLAIMED" && (
                  <Btn full icon={Package} onClick={() => updateStatus(activeOrder.id, "PICKED_UP", user)}>
                    Confirm Food Picked Up from Donor
                  </Btn>
                )}
                {activeOrder.status === "PICKED_UP" && (
                  <Btn full icon={Truck} variant="indigo" onClick={() => updateStatus(activeOrder.id, "IN_TRANSIT", user)}>
                    Start Live GPS Delivery Run to Shelter
                  </Btn>
                )}
                {activeOrder.status === "IN_TRANSIT" && (
                  <Btn full icon={CheckCircle2} onClick={() => updateStatus(activeOrder.id, "DELIVERED", user)}>
                    Confirm Safe Handover at Shelter Drop Point
                  </Btn>
                )}
                <Btn full variant="ghost" icon={Eye} onClick={() => openDetail(activeOrder)}>
                  Inspect Full Order Details & Timeline
                </Btn>
              </div>
            </Card>
          ) : (
            <Card style={{ padding: 24, textAlign: "center", marginBottom: 32, background: "#FAFAFE", border: `1.5px dashed ${T.line}` }}>
              <Truck size={36} color={T.indigo} style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 700, fontSize: 16, color: T.ink }}>No active delivery run assigned.</div>
              <p style={{ color: T.inkSoft, fontSize: 13.5, margin: "6px 0 0" }}>
                Browse the available unassigned orders below and accept a delivery route.
              </p>
            </Card>
          )}

          {/* SECTION 2: AVAILABLE UNASSIGNED PICKUP TASKS IN HYDERABAD */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: T.ink }}>
                Available Pickup Tasks in Hyderabad
              </div>
              <div style={{ fontSize: 12.5, color: T.inkSoft }}>
                {hasActiveOrder
                  ? "🔒 You must finish your active order before accepting another task."
                  : "Click 'Accept Delivery Route' to lock in a new delivery run."}
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.amber, background: T.amberLight, padding: "3px 9px", borderRadius: 999 }}>
              {availableTasks.length} waiting
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {availableTasks.map((d) => (
              <Card key={d.id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: hasActiveOrder ? 0.65 : 1 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, background: T.amberLight, color: T.amber, padding: "3px 8px", borderRadius: 999 }}>
                      WAITING FOR COURIER
                    </span>
                    <Badge status={d.status} />
                  </div>

                  <div style={{ fontWeight: 800, fontSize: 16, color: T.ink, marginBottom: 4 }}>
                    {d.foodName}
                  </div>
                  <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 12 }}>
                    {d.quantity} {d.unit} · {d.category}
                  </div>

                  <div style={{ background: T.bgSubtle, padding: 10, borderRadius: 10, fontSize: 12, display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    <div>
                      <strong>Donor:</strong> {d.donorName || "Ramesh Rao"} (<strong>Cell: {d.donorPhone || "+91 98480 12345"}</strong>)<br/>
                      <span style={{ color: T.inkSoft }}>{d.pickupAddress}</span>
                    </div>
                    <div style={{ borderTop: `1px dashed ${T.line}`, paddingTop: 6 }}>
                      <strong>To:</strong> {d.deliveryName || "Shelter"} (<strong>Cell: {d.receiverPhone || "+91 94401 56789"}</strong>)<br/>
                      <span style={{ color: T.inkSoft }}>Spot: {d.receiverDropPoint || "Main Gate"} — {d.deliveryAddress}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {hasActiveOrder ? (
                    <button
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 10,
                        border: "none",
                        background: T.bgSubtle,
                        color: T.inkMuted,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6
                      }}
                    >
                      <Lock size={14} /> Finish Active Delivery First
                    </button>
                  ) : (
                    <Btn small full icon={Truck} onClick={() => handleAcceptOrder(d)}>
                      Accept Delivery Route
                    </Btn>
                  )}
                </div>
              </Card>
            ))}

            {availableTasks.length === 0 && (
              <div style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center", background: "#fff", borderRadius: 14, color: T.inkSoft, fontSize: 13.5, border: `1px solid ${T.line}` }}>
                No unassigned pickup routes waiting right now. All claimed food in Hyderabad has couriers assigned!
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE SIDE MAP (OR FULLSCREEN MODAL) */}
        {sideMapMode === "side" && (
          <div style={{
            position: "sticky",
            top: 80,
            background: "#ffffff",
            borderRadius: 20,
            border: `1px solid ${T.line}`,
            overflow: "hidden",
            boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 120px)",
          }}>
            {/* Side Map Top Bar */}
            <div style={{
              padding: "12px 18px",
              background: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`,
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 8px #34D399" }} />
                <span style={{ fontSize: 13.5, fontWeight: 800 }}>Active 3-Point GPS Route (Hyderabad)</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* Fullscreen Button */}
                <button
                  onClick={() => setSideMapMode("fullscreen")}
                  title="Expand to Full Screen"
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Maximize2 size={15} />
                </button>

                {/* Minimize Button */}
                <button
                  onClick={() => setSideMapMode("minimized")}
                  title="Minimize Map Panel"
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Minimize2 size={15} />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setSideMapMode("closed")}
                  title="Close Map"
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* 3-Point Route Status Header */}
            <div style={{ background: T.bgSubtle, padding: "10px 16px", borderBottom: `1px solid ${T.line}`, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, color: T.ink }}>
                <span>🛵 Partner GPS ➔ 🍲 Donor ➔ 🏢 Drop Point</span>
                <span style={{ color: T.primary }}>{Math.round(courierSimStep * 100)}% route</span>
              </div>
            </div>

            {/* Leaflet Map Canvas */}
            <div style={{ flex: 1, position: "relative" }}>
              <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

              {/* Pause/Resume Live Feed */}
              <button
                onClick={() => setIsLiveGpsActive(!isLiveGpsActive)}
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  background: "#ffffff",
                  border: `1px solid ${T.line}`,
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: T.ink,
                  cursor: "pointer",
                  zIndex: 1000,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {isLiveGpsActive ? <Pause size={12} color={T.rose} /> : <Play size={12} color={T.primary} />}
                <span>{isLiveGpsActive ? "Pause GPS" : "Resume GPS"}</span>
              </button>
            </div>

            {/* Bottom Quick Contact Bar */}
            {trackingDonation && (
              <div style={{ padding: "12px 16px", background: "#ffffff", borderTop: `1px solid ${T.line}`, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 800, color: T.ink }}>{trackingDonation.donorName} ➔ {trackingDonation.deliveryName}</div>
                    <div style={{ color: T.inkSoft, fontSize: 11.5 }}>
                      Donor Cell: <strong>{trackingDonation.donorPhone || "+91 98480 12345"}</strong> · Receiver Cell: <strong>{trackingDonation.receiverPhone || "+91 94401 56789"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MINIMIZED FLOATING BOTTOM DOCK */}
      {sideMapMode === "minimized" && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 100,
          background: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`,
          color: "#ffffff",
          padding: "12px 18px",
          borderRadius: 14,
          boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 8px #34D399" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>🛵 Active GPS Route Minimized</div>
            <div style={{ fontSize: 11.5, color: "#94A3B8" }}>
              {trackingDonation?.foodName || "Tracking Active Task"}
            </div>
          </div>
          <button
            onClick={() => setSideMapMode("side")}
            style={{
              background: T.primaryLight,
              color: "#065F46",
              border: "none",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Restore Side Map
          </button>
          <button
            onClick={() => setSideMapMode("fullscreen")}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Full Screen
          </button>
        </div>
      )}

      {/* FULLSCREEN MODAL MAP */}
      {sideMapMode === "fullscreen" && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.85)",
          zIndex: 120,
          display: "flex",
          flexDirection: "column",
          padding: 24,
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: 20,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
          }}>
            {/* Fullscreen Header */}
            <div style={{
              padding: "16px 24px",
              background: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`,
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>
                  🛵 Full Screen Live Delivery Radar: {trackingDonation?.foodName}
                </div>
                <div style={{ fontSize: 12.5, color: "#94A3B8" }}>
                  Active 3-Point GPS Navigation (Courier Position ➔ Donor Pickup ➔ Shelter Drop-off)
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setSideMapMode("side")}
                  style={{
                    background: T.primaryLight,
                    color: "#065F46",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  Return to Side View
                </button>
                <button
                  onClick={() => setSideMapMode("closed")}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#fff",
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div style={{ flex: 1, position: "relative" }}>
              <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .fb-delivery-console-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
