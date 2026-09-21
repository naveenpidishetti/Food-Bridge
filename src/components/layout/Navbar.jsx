import React from "react";
import { Mail, Bell, LogOut, User, Menu, X, Truck, Heart, Utensils, Compass, BarChart3, Bot, Star, PhoneCall } from "lucide-react";
import { T } from "../../constants/theme";
import { fmtTime } from "../../utils/dateUtils";
import Btn from "../common/Btn";
import BrandLogo from "../common/BrandLogo";

export default function Navbar({
  user,
  view,
  setView,
  notifications,
  showNotif,
  setShowNotif,
  onLogout,
  mobileOpen,
  setMobileOpen,
  sentEmails,
  onOpenEmailCenter,
  onOpenAiHelp,
  onOpenReviews,
}) {
  let navItems = [
    { id: "landing", label: "Home", icon: Heart },
    { id: "map", label: "Hyderabad Live Map", icon: Compass },
    { id: "impact", label: "Impact Network", icon: BarChart3 },
  ];

  if (user) {
    if (user.role === "DELIVERY_PARTNER") {
      navItems = [
        { id: "delivery", label: "🛵 Delivery Console", icon: Truck },
        { id: "map", label: "🗺️ GPS Route Radar", icon: Compass },
        { id: "impact", label: "📊 Impact Network", icon: BarChart3 },
      ];
    } else {
      // General User has both Donor & Receiver hubs
      navItems = [
        { id: "donor", label: "🍲 Donor Hub", icon: Utensils },
        { id: "receiver", label: "🏠 Receiver Hub", icon: Heart },
        { id: "map", label: "🗺️ Hyderabad Live Map", icon: Compass },
        { id: "impact", label: "📊 Impact Network", icon: BarChart3 },
      ];
    }
  }

  const unread = notifications.filter((n) => !n.read).length;

  // Filter sent emails ONLY for the current user's email address
  const userEmails = user
    ? sentEmails.filter((e) => e.recipient?.toLowerCase().trim() === user.email?.toLowerCase().trim())
    : sentEmails;

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: "rgba(255, 255, 255, 0.98)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${T.line}`,
      boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    }}>
      <div style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Brand Bridge Logo */}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setView(user ? (user.role === "DELIVERY_PARTNER" ? "delivery" : "donor") : "landing")}
        >
          <BrandLogo size="sm" />
        </div>

        {/* Navigation Links (Desktop) */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }} className="fb-desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                background: view === item.id ? (user?.role === "DELIVERY_PARTNER" ? T.indigoLight : T.primaryLight) : "transparent",
                border: "none",
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 700,
                color: view === item.id ? (user?.role === "DELIVERY_PARTNER" ? T.indigo : "#065F46") : T.inkSoft,
                cursor: "pointer",
                fontFamily: T.body,
                transition: "all 0.15s ease",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* AI Help Assistant Trigger */}
          <button
            onClick={onOpenAiHelp}
            title="AI Help Assistant & 24/7 Helpline"
            style={{
              background: "#F0FDF4",
              border: `1.5px solid #BBF7D0`,
              cursor: "pointer",
              padding: "7px 12px",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              fontWeight: 800,
              color: "#166534",
              transition: "all 0.15s ease",
            }}
          >
            <Bot size={16} color="#15803D" />
            <span className="fb-desktop-nav">AI Help</span>
          </button>

          {/* User Reviews & Ratings Trigger */}
          <button
            onClick={onOpenReviews}
            title="User Reviews & Star Ratings"
            style={{
              background: "#FFFBEB",
              border: `1.5px solid #FDE68A`,
              cursor: "pointer",
              padding: "7px 12px",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              fontWeight: 800,
              color: "#B45309",
              transition: "all 0.15s ease",
            }}
          >
            <Star size={15} color="#D97706" fill="#FBBF24" />
            <span className="fb-desktop-nav">Reviews</span>
          </button>

          {/* Private Email Inbox Button */}
          <button
            onClick={onOpenEmailCenter}
            title={user ? `Private Inbox for ${user.email}` : "View Inbox"}
            style={{
              background: T.bgSubtle,
              border: `1px solid ${T.line}`,
              cursor: "pointer",
              position: "relative",
              padding: "7px 11px",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              fontWeight: 700,
              color: T.ink,
            }}
          >
            <Mail size={16} color={user?.role === "DELIVERY_PARTNER" ? T.indigo : T.primary} />
            <span className="fb-desktop-nav">Mails</span>
            {userEmails.length > 0 && (
              <span style={{
                background: user?.role === "DELIVERY_PARTNER" ? T.indigo : T.primary,
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "1px 6px",
                borderRadius: 999,
              }}>
                {userEmails.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {user && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                style={{
                  background: T.bgSubtle,
                  border: `1px solid ${T.line}`,
                  cursor: "pointer",
                  position: "relative",
                  padding: "8px 10px",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Bell size={18} color={T.ink} />
                {unread > 0 && (
                  <span style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 999,
                    background: T.rose,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3px",
                  }}>
                    {unread}
                  </span>
                )}
              </button>
              {showNotif && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: 44,
                  width: 340,
                  background: "#fff",
                  border: `1px solid ${T.line}`,
                  borderRadius: 16,
                  boxShadow: "0 18px 40px rgba(15,23,42,0.15)",
                  padding: 12,
                  maxHeight: 380,
                  overflowY: "auto",
                  zIndex: 60,
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 8px 10px",
                    borderBottom: `1px solid ${T.line}`
                  }}>
                    <span style={{ fontWeight: 800, fontSize: 13.5, color: T.ink }}>Live Notifications</span>
                    <span style={{ fontSize: 11, color: T.primary, fontWeight: 700 }}>{unread} unread</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 18, fontSize: 13, color: T.inkSoft, textAlign: "center" }}>No activity yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} style={{
                        padding: "10px",
                        borderRadius: 10,
                        fontSize: 13,
                        color: T.ink,
                        background: n.read ? "transparent" : T.primaryLight,
                        margin: "6px 0",
                      }}>
                        <div>{n.text}</div>
                        <div style={{ fontSize: 11, color: T.inkSoft, marginTop: 4 }}>{fmtTime(n.at)}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Profile & Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="fb-desktop-nav">
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: T.ink }}>{user.name}</div>
                <div style={{ fontSize: 11, color: user.role === "DELIVERY_PARTNER" ? T.indigo : T.primary, fontWeight: 700 }}>
                  {user.role === "DELIVERY_PARTNER" ? "🛵 Delivery Partner" : "👤 User (Donor/Receiver)"}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Log out"
                style={{
                  background: T.roseLight,
                  border: `1px solid #FECDD3`,
                  cursor: "pointer",
                  padding: "7px 10px",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.rose,
                }}
              >
                <LogOut size={14} />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <Btn small onClick={() => setView("auth")} icon={User}>Sign in</Btn>
          )}

          <button
            className="fb-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: T.bgSubtle,
              border: `1px solid ${T.line}`,
              borderRadius: 8,
              padding: 6,
              cursor: "pointer",
              display: "none"
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fb-mobile-menu" style={{
          borderTop: `1px solid ${T.line}`,
          padding: "14px 24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: "#fff"
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setMobileOpen(false); }}
              style={{
                textAlign: "left",
                background: view === item.id ? T.primaryLight : "none",
                border: "none",
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 14.5,
                fontWeight: 700,
                color: view === item.id ? T.primary : T.ink
              }}
            >
              {item.label}
            </button>
          ))}
          {user && (
            <button
              onClick={onLogout}
              style={{
                textAlign: "left",
                background: T.roseLight,
                border: "none",
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 14.5,
                fontWeight: 700,
                color: T.rose
              }}
            >
              Log out ({user.name})
            </button>
          )}
        </div>
      )}
    </header>
  );
}
