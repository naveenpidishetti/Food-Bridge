import React, { useState, useMemo, useEffect, useRef } from "react";
import { Eye, MapPin, Building2, Pause, Play, Navigation, Phone, Home, Hash } from "lucide-react";
import L from "leaflet";
import { T, STATUS_META } from "../../constants/theme";
import { fmtTime } from "../../utils/dateUtils";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Btn from "../common/Btn";

export default function InteractiveRescueMap({ donations, onOpenDetail, user }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routePolylineRef = useRef(null);
  const courierMarkerRef = useRef(null);

  const [filter, setFilter] = useState("ALL");
  const [activeTrackingDonation, setActiveTrackingDonation] = useState(
    donations.find((d) => d.status === "IN_TRANSIT" || d.status === "PICKED_UP") || donations[0]
  );
  const [isSimulatingLiveMove, setIsSimulatingLiveMove] = useState(true);
  const [courierStep, setCourierStep] = useState(0.65);

  const filteredDonations = useMemo(() => {
    if (filter === "ALL") return donations;
    return donations.filter((d) => d.status === filter);
  }, [donations, filter]);

  // Real-time Courier movement simulation
  useEffect(() => {
    let interval = null;
    if (isSimulatingLiveMove && activeTrackingDonation) {
      interval = setInterval(() => {
        setCourierStep((prev) => {
          const next = prev + 0.025;
          return next > 0.98 ? 0.05 : next;
        });
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulatingLiveMove, activeTrackingDonation]);

  // Leaflet Map Initialization centered on Hyderabad, Telangana
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Hyderabad center coordinates: [17.4150, 78.4350]
      const map = L.map(mapContainerRef.current, {
        center: [17.4150, 78.4350],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    if (courierMarkerRef.current) {
      courierMarkerRef.current.remove();
      courierMarkerRef.current = null;
    }

    // Helper custom HTML icons
    const createPickupIcon = (title, status) => {
      const color = STATUS_META[status]?.color || T.primary;
      return L.divIcon({
        className: "custom-pickup-pin",
        html: `
          <div style="position:relative; transform: translate(-50%, -100%);">
            <div style="background:${color}; color:#fff; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.3); border:2.5px solid #fff;">
              🍲
            </div>
            <div style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid ${color};"></div>
          </div>
        `,
        iconSize: [34, 40],
        iconAnchor: [17, 40],
      });
    };

    const createDeliveryIcon = () => {
      return L.divIcon({
        className: "custom-delivery-pin",
        html: `
          <div style="position:relative; transform: translate(-50%, -100%);">
            <div style="background:#4F46E5; color:#fff; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(79,70,229,0.4); border:2.5px solid #fff;">
              🏢
            </div>
            <div style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid #4F46E5;"></div>
          </div>
        `,
        iconSize: [34, 40],
        iconAnchor: [17, 40],
      });
    };

    const createCourierIcon = () => {
      return L.divIcon({
        className: "custom-courier-pin",
        html: `
          <div style="background:#0F172A; color:#fff; border-radius:12px; padding:5px 8px; font-weight:800; font-size:11px; display:flex; align-items:center; gap:5px; box-shadow:0 4px 14px rgba(0,0,0,0.4); border:2px solid #34D399;">
            🛵 <span style="color:#34D399;">HYD LIVE</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });
    };

    // Add Markers for Filtered Donations
    filteredDonations.forEach((d) => {
      // 1. Pickup Marker (Donor Origin)
      if (d.pickupLat && d.pickupLng) {
        const pickupMarker = L.marker([d.pickupLat, d.pickupLng], {
          icon: createPickupIcon(d.foodName, d.status),
        }).addTo(map);

        pickupMarker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px;">
            <div style="font-size:10px; font-weight:800; color:#059669; text-transform:uppercase;">🟢 DONOR PICKUP LOCATION</div>
            <div style="font-weight:800; font-size:14px; margin:3px 0; color:#0F172A;">${d.foodName}</div>
            <div style="font-size:12px; color:#64748B;">${d.quantity} ${d.unit} · ${d.category}</div>
            <div style="font-size:11.5px; margin:6px 0; color:#334155;">
              <strong>Donor:</strong> ${d.donorName || "Ramesh Rao"}<br/>
              <strong>Cell:</strong> ${d.donorPhone || "+91 98480 12345"}<br/>
              <strong>Address:</strong> ${d.pickupAddress}
            </div>
            <div style="font-size:11px; color:#D97706; font-weight:700;">Pickup before: ${fmtTime(d.pickupEnd)}</div>
          </div>
        `);

        pickupMarker.on("click", () => {
          setActiveTrackingDonation(d);
        });

        markersRef.current.push(pickupMarker);
      }

      // 2. Delivery Marker (Receiver Drop-off Destination)
      if (d.deliveryLat && d.deliveryLng && d.status !== "AVAILABLE") {
        const delMarker = L.marker([d.deliveryLat, d.deliveryLng], {
          icon: createDeliveryIcon(),
        }).addTo(map);

        delMarker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px;">
            <div style="font-size:10px; font-weight:800; color:#4F46E5; text-transform:uppercase;">🟣 SHELTER DROP-OFF LOCATION</div>
            <div style="font-weight:800; font-size:14px; margin:3px 0; color:#0F172A;">${d.deliveryName || "Shelter Home"}</div>
            <div style="font-size:11.5px; margin:6px 0; color:#334155;">
              <strong>Contact:</strong> ${d.receiverPhone || "+91 94401 56789"}<br/>
              <strong>Drop Point:</strong> ${d.receiverDropPoint || "Main Gate"}<br/>
              <strong>Address:</strong> ${d.deliveryAddress}
            </div>
            <div style="font-size:11.5px; color:#64748B;">Receiving: ${d.foodName} (${d.quantity} ${d.unit})</div>
          </div>
        `);

        delMarker.on("click", () => {
          setActiveTrackingDonation(d);
        });

        markersRef.current.push(delMarker);
      }
    });

    // Draw Active Route & Animated Courier
    if (activeTrackingDonation && activeTrackingDonation.pickupLat && activeTrackingDonation.deliveryLat) {
      const p1 = [activeTrackingDonation.pickupLat, activeTrackingDonation.pickupLng];
      const p2 = [activeTrackingDonation.deliveryLat, activeTrackingDonation.deliveryLng];

      // Route line
      const polyline = L.polyline([p1, p2], {
        color: "#4F46E5",
        weight: 4,
        opacity: 0.85,
        dashArray: "8, 8",
      }).addTo(map);
      routePolylineRef.current = polyline;

      // Calculate courier live position
      const courierLat = p1[0] + (p2[0] - p1[0]) * courierStep;
      const courierLng = p1[1] + (p2[1] - p1[1]) * courierStep;

      const courier = L.marker([courierLat, courierLng], {
        icon: createCourierIcon(),
        zIndexOffset: 1000,
      }).addTo(map);

      courier.bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;">
          <div style="font-size:10.5px; font-weight:800; color:#059669;">LIVE DELIVERY COURIER</div>
          <div style="font-weight:800; font-size:13px; color:#0F172A;">Partner: ${activeTrackingDonation.volunteerName || "Kiran Kumar"}</div>
          <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Contact: ${activeTrackingDonation.volunteerPhone || "+91 99887 65432"}</div>
          <div style="font-size:11.5px; color:#4F46E5; margin-top:2px;">En route to ${activeTrackingDonation.deliveryName}</div>
        </div>
      `);

      courierMarkerRef.current = courier;
    }
  }, [filteredDonations, activeTrackingDonation, courierStep]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 24px 70px" }}>
      {/* Header & Filter Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
            <h1 style={{ fontFamily: T.headline, fontSize: 26, fontWeight: 800, color: T.ink, margin: 0 }}>
              Hyderabad Real-Time Food Rescue Map
            </h1>
          </div>
          <p style={{ color: T.inkSoft, fontSize: 13.5, margin: "4px 0 0" }}>
            Live GPS route tracking across Banjara Hills, Jubilee Hills, Madhapur, Hitec City, and Secunderabad (Telangana).
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["ALL", "IN_TRANSIT", "PICKED_UP", "AVAILABLE", "CLAIMED", "DELIVERED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                border: `1.5px solid ${filter === s ? T.primary : T.line}`,
                background: filter === s ? T.primaryLight : "#ffffff",
                color: filter === s ? "#065F46" : T.inkSoft,
                transition: "all 0.15s ease",
              }}
            >
              {s === "ALL" ? "All Rescues" : STATUS_META[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Map + Active Tracking Sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 370px", gap: 20 }} className="fb-map-grid">
        {/* Leaflet Map Canvas */}
        <div style={{
          position: "relative",
          height: 580,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${T.line}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
        }}>
          <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

          {/* Map Floating Legend */}
          <div style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(6px)",
            borderRadius: 14,
            padding: "10px 16px",
            border: `1px solid ${T.line}`,
            fontSize: 12,
            display: "flex",
            gap: 14,
            zIndex: 1000,
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: T.primary }}>
              <span style={{ fontSize: 14 }}>🍲</span> Donor Origin (Hyderabad)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: T.indigo }}>
              <span style={{ fontSize: 14 }}>🏢</span> Shelter Drop Point
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: T.ink }}>
              <span style={{ fontSize: 14 }}>🛵</span> Live Delivery Partner
            </div>
          </div>

          {/* Simulator Control */}
          <button
            onClick={() => setIsSimulatingLiveMove(!isSimulatingLiveMove)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "#ffffff",
              border: `1px solid ${T.line}`,
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 12.5,
              fontWeight: 700,
              color: T.ink,
              cursor: "pointer",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {isSimulatingLiveMove ? <Pause size={14} color={T.rose} /> : <Play size={14} color={T.primary} />}
            <span>{isSimulatingLiveMove ? "Live GPS Active" : "Resume GPS Feed"}</span>
          </button>
        </div>

        {/* Selected Live Delivery Telemetry */}
        <Card style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 580, overflowY: "auto" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: T.indigo, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Active Route Telemetry
              </span>
              {activeTrackingDonation && <Badge status={activeTrackingDonation.status} />}
            </div>

            {activeTrackingDonation ? (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: T.ink, margin: "0 0 6px", fontFamily: T.headline }}>
                  {activeTrackingDonation.foodName}
                </h3>
                <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 16 }}>
                  {activeTrackingDonation.category} · {activeTrackingDonation.quantity} {activeTrackingDonation.unit}
                </div>

                {/* Progress Bar */}
                <div style={{ background: T.bgSubtle, padding: 14, borderRadius: 12, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                    <span style={{ color: T.ink }}>Transit to Drop Point</span>
                    <span style={{ color: T.indigo }}>{Math.round(courierStep * 100)}%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 999, background: T.line, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${courierStep * 100}%`,
                      background: `linear-gradient(90deg, ${T.primary} 0%, ${T.indigo} 100%)`,
                      borderRadius: 999,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.inkSoft, marginTop: 8 }}>
                    <span>ETA: ~12 mins</span>
                    <span>Speed: 32 km/h</span>
                    <span>Dist: {activeTrackingDonation.distanceKm || "3.5"} km</span>
                  </div>
                </div>

                {/* Donor & Receiver Locations */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Donor */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: T.primaryLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: T.primary
                    }}>
                      <MapPin size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: T.primary, textTransform: "uppercase" }}>DONOR LOCATION (ORIGIN)</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{activeTrackingDonation.donorName || "Ramesh Rao"}</div>
                      <div style={{ fontSize: 11.5, color: T.inkSoft }}>{activeTrackingDonation.donorPhone || "+91 98480 12345"}</div>
                      <div style={{ fontSize: 11.5, color: T.inkSoft }}>{activeTrackingDonation.pickupAddress}</div>
                    </div>
                  </div>

                  <div style={{ height: 14, width: 2, background: T.line, marginLeft: 13 }} />

                  {/* Receiver */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: T.indigoLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: T.indigo
                    }}>
                      <Building2 size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: T.indigo, textTransform: "uppercase" }}>SHELTER DROP POINT (DESTINATION)</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{activeTrackingDonation.deliveryName || "Awaiting Receiver Claim"}</div>
                      {activeTrackingDonation.receiverPhone && (
                        <div style={{ fontSize: 11.5, color: T.inkSoft }}>Contact: {activeTrackingDonation.receiverPhone}</div>
                      )}
                      {activeTrackingDonation.receiverDropPoint && (
                        <div style={{ fontSize: 11.5, color: T.indigo, fontWeight: 600 }}>Spot: {activeTrackingDonation.receiverDropPoint}</div>
                      )}
                      <div style={{ fontSize: 11.5, color: T.inkSoft }}>{activeTrackingDonation.deliveryAddress || "Assigned upon claim"}</div>
                    </div>
                  </div>
                </div>

                {activeTrackingDonation.volunteerName && (
                  <div style={{ background: T.bgSubtle, padding: 12, borderRadius: 10, marginTop: 14, fontSize: 12, color: T.ink }}>
                    <strong>Assigned Delivery Partner:</strong> {activeTrackingDonation.volunteerName}
                    <div style={{ fontSize: 11, color: T.inkSoft, marginTop: 2 }}>Contact: {activeTrackingDonation.volunteerPhone || "+91 99887 65432"}</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: T.inkSoft, fontSize: 13, textAlign: "center", padding: 30 }}>
                Select a marker on the map to inspect live routing.
              </div>
            )}
          </div>

          {activeTrackingDonation && (
            <div style={{ marginTop: 14 }}>
              <Btn full small icon={Eye} onClick={() => onOpenDetail(activeTrackingDonation)}>
                Inspect Full Order Details
              </Btn>
            </div>
          )}
        </Card>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .fb-map-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
