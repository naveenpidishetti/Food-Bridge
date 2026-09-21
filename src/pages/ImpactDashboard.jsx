import React from "react";
import { Leaf, Utensils, CheckCircle2, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import { T, PIE_COLORS } from "../constants/theme";
import { MONTHLY_DATA, CATEGORY_SPLIT } from "../constants/data";
import Card from "../components/common/Card";
import StatCard from "../components/common/StatCard";

export default function ImpactDashboard() {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 24px 70px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: T.headline, fontSize: 28, fontWeight: 800, color: T.ink, margin: "0 0 4px" }}>
          Community Impact Network
        </h1>
        <p style={{ color: T.inkSoft, fontSize: 14 }}>
          Live metrics tracking food rescued, meals served, and verified partner achievements.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }} className="fb-stats-grid">
        <StatCard icon={Leaf} label="Food Saved" value="1,850 kg" subtext="Zero landfill waste" color={T.primary} bg={T.primaryLight} />
        <StatCard icon={Utensils} label="Meals Provided" value="5,920" subtext="Direct to families" color={T.amber} bg={T.amberLight} />
        <StatCard icon={CheckCircle2} label="Successful Deliveries" value="480" subtext="99.4% on-time rate" color={T.indigo} bg={T.indigoLight} />
        <StatCard icon={Users} label="People Supported" value="3,150" subtext="Across 18 centers" color="#059669" bg="#DCFCE7" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }} className="fb-charts-grid">
        <Card>
          <div style={{ fontWeight: 800, fontSize: 15, color: T.ink, marginBottom: 16 }}>
            Rescued Meals & Deliveries (Monthly Trend)
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid stroke={T.line} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={{ stroke: T.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${T.line}`, fontSize: 12.5 }} />
              <Bar dataKey="meals" fill={T.primary} radius={[6, 6, 0, 0]} name="Meals Delivered" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontWeight: 800, fontSize: 15, color: T.ink, marginBottom: 16 }}>
            Top Donated Categories
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={CATEGORY_SPLIT} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {CATEGORY_SPLIT.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${T.line}`, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: T.ink, marginBottom: 16 }}>
          Monthly Cumulative Donation Growth
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={MONTHLY_DATA}>
            <CartesianGrid stroke={T.line} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={{ stroke: T.line }} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${T.line}`, fontSize: 12.5 }} />
            <Line type="monotone" dataKey="donations" stroke={T.amber} strokeWidth={3.5} dot={{ r: 5 }} name="Total Donations" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <style>{`
        @media (max-width: 860px) {
          .fb-charts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
