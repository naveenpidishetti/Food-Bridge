import React from "react";
import { Compass, Users, Building2, Truck, Package } from "lucide-react";
import { T } from "../constants/theme";
import Card from "../components/common/Card";
import StatCard from "../components/common/StatCard";
import Btn from "../components/common/Btn";
import Badge from "../components/common/Badge";

export default function AdminDashboard({ donations, users, setView }) {
  const th = { padding: "10px 12px", fontWeight: 700 };
  const td = { padding: "10px 12px" };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 24px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: T.headline, fontSize: 26, fontWeight: 800, color: T.ink, margin: 0 }}>
            Food Bridge Central Operations
          </h1>
          <p style={{ color: T.inkSoft, fontSize: 14, margin: "4px 0 0" }}>
            Network health, safety verification, and live dispatch oversight.
          </p>
        </div>
        <Btn icon={Compass} onClick={() => setView("map")}>Launch Dispatch Radar</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }} className="fb-stats-grid">
        <StatCard icon={Users} label="Registered Entities" value={users.length} color={T.primary} bg={T.primaryLight} />
        <StatCard icon={Building2} label="Verified Shelters" value="18 Centers" color={T.indigo} bg={T.indigoLight} />
        <StatCard icon={Truck} label="Courier Fleet" value="42 Volunteers" color={T.amber} bg={T.amberLight} />
        <StatCard icon={Package} label="Active Pipeline" value={donations.filter((d) => d.status !== "COMPLETED").length} color="#059669" bg="#DCFCE7" />
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14, color: T.ink }}>Live Donation Pipeline</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: T.inkSoft, borderBottom: `1px solid ${T.line}` }}>
                <th style={th}>Food Title</th>
                <th style={th}>Donor</th>
                <th style={th}>Receiver / Shelter</th>
                <th style={th}>Volunteer Courier</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                  <td style={td}><strong>{d.foodName}</strong> ({d.quantity} {d.unit})</td>
                  <td style={td}>{d.donorName}</td>
                  <td style={td}>{d.deliveryName || "—"}</td>
                  <td style={td}>{d.volunteerName || "—"}</td>
                  <td style={td}><Badge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
