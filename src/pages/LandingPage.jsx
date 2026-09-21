import React from "react";
import {
  Sparkles,
  Package,
  Compass,
  Truck,
  Utensils,
  Heart,
  Users,
  Leaf,
  Building2,
  ArrowRight,
  MapPin
} from "lucide-react";
import { T } from "../constants/theme";
import Card from "../components/common/Card";
import Btn from "../components/common/Btn";
import StatCard from "../components/common/StatCard";

export default function LandingPage({ setView, stats, onOpenLiveMap }) {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 48, alignItems: "center" }} className="fb-hero-grid">
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: T.primaryLight,
              color: "#065F46",
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
              border: "1px solid rgba(5, 150, 105, 0.2)",
            }}>
              <Sparkles size={15} /> Real-Time Food Rescue & Live Route Tracking
            </div>
            <h1 style={{
              fontFamily: T.headline,
              fontSize: "clamp(36px, 5.2vw, 56px)",
              lineHeight: 1.08,
              color: T.ink,
              margin: "0 0 20px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}>
              Bridging surplus food with community kitchens in real time.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: T.inkSoft, maxWidth: 520, marginBottom: 32 }}>
              Food Bridge connects restaurants, caterers, and households with verified local shelters.
              Track live volunteer pickups, prevent food waste, and deliver fresh meals to people who need them.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Btn icon={Package} onClick={() => setView("auth")}>Donate Food</Btn>
              <Btn icon={Compass} variant="outline" onClick={() => setView("map")}>Explore Live Map</Btn>
              <Btn icon={Truck} variant="ghost" onClick={() => setView("auth")}>Join as Volunteer</Btn>
            </div>
          </div>

          {/* Flow Visualizer Card */}
          <Card style={{
            background: `linear-gradient(145deg, #0F172A 0%, #1E293B 100%)`,
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#ffffff",
            padding: 32,
            boxShadow: "0 20px 40px -10px rgba(15,23,42,0.3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 13, color: "#34D399", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                How Food Bridge Works
              </div>
              <span style={{ fontSize: 11, background: "rgba(52, 211, 153, 0.2)", color: "#34D399", padding: "3px 8px", borderRadius: 999, fontWeight: 700 }}>
                Live Chain
              </span>
            </div>

            {[
              ["1. Surplus Listed", Utensils, "Restaurants post excess food with AI expiry calculation."],
              ["2. Instant Match & Claim", Sparkles, "Nearby verified NGOs and shelters receive instant alerts."],
              ["3. Volunteer Pickup & Live Map", Truck, "Volunteers accept tasks with GPS-guided navigation."],
              ["4. Verified Delivery", Heart, "Delivered safely with meal counts & impact logged."],
            ].map(([title, Icon, desc], i, arr) => (
              <div key={title}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background: `linear-gradient(135deg, ${T.primary} 0%, #047857 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 10px rgba(5,150,105,0.4)",
                  }}>
                    <Icon size={19} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>{title}</div>
                    <div style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ height: 20, width: 2, background: "rgba(255,255,255,0.15)", marginLeft: 18, margin: "3px 0 3px 18px" }} />
                )}
              </div>
            ))}
          </Card>
        </div>

        {/* Live Counters */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 56 }} className="fb-stats-grid">
          <StatCard icon={Package} label="Food Donations" value={stats.donations} subtext="+18 today" color={T.primary} bg={T.primaryLight} />
          <StatCard icon={Utensils} label="Meals Rescued" value={stats.meals} subtext="+420 this week" color={T.amber} bg={T.amberLight} />
          <StatCard icon={Users} label="People Nourished" value={stats.people} subtext="Across 14 shelters" color={T.indigo} bg={T.indigoLight} />
          <StatCard icon={Leaf} label="CO₂ Waste Avoided" value={stats.waste} subtext="Certified eco-impact" color="#059669" bg="#DCFCE7" />
        </div>
      </section>

      {/* Role Ecosystem Section */}
      <section style={{
        background: T.bgSubtle,
        padding: "64px 24px",
        marginTop: 20,
        borderTop: `1px solid ${T.line}`,
        borderBottom: `1px solid ${T.line}`
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 40px" }}>
            <h2 style={{ fontFamily: T.headline, fontSize: 32, color: T.ink, fontWeight: 800, marginBottom: 10 }}>
              An ecosystem crafted for direct community impact
            </h2>
            <p style={{ color: T.inkSoft, fontSize: 15 }}>
              Food Bridge gives every stakeholder tailored tools to minimize waste and deliver fresh meals quickly.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="fb-role-grid">
            {[
              [Building2, "Food Donors", "Restaurants, hotels, catered events & households list food in under 60 seconds with AI categorization and pickup windows.", T.primary, T.primaryLight],
              [Heart, "Verified Receivers", "Shelters, orphanages, and community food kitchens claim available food that fits their intake capacity.", T.amber, T.amberLight],
              [Truck, "Volunteer Couriers", "Local volunteers accept live delivery tasks, follow live GPS routes, and confirm handoff securely.", T.indigo, T.indigoLight],
            ].map(([Icon, title, desc, col, bg]) => (
              <Card key={title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: col
                }}>
                  <Icon size={24} />
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, color: T.ink, fontFamily: T.headline }}>{title}</div>
                <div style={{ fontSize: 14, color: T.inkSoft, lineHeight: 1.6 }}>{desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 24px 80px", textAlign: "center" }}>
        <Card style={{
          background: `linear-gradient(135deg, ${T.primary} 0%, #065F46 100%)`,
          color: "#ffffff",
          padding: "48px 24px",
          borderRadius: 24,
          border: "none",
        }}>
          <h2 style={{ fontFamily: T.headline, fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            Ready to bridge surplus food to someone in need?
          </h2>
          <p style={{ color: "#D1FAE5", fontSize: 16, maxWidth: 500, margin: "0 auto 28px" }}>
            Sign in with your verified email or try an instant one-click demo account.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <Btn variant="dark" icon={ArrowRight} onClick={() => setView("auth")}>Get Started Now</Btn>
            <Btn
              variant="outline"
              style={{ color: "#fff", borderColor: "#fff", background: "rgba(255,255,255,0.1)" }}
              icon={MapPin}
              onClick={() => setView("map")}
            >
              View Live Delivery Map
            </Btn>
          </div>
        </Card>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .fb-hero-grid { grid-template-columns: 1fr !important; }
          .fb-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .fb-role-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
