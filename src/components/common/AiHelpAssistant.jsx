import React, { useState } from "react";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Phone,
  HelpCircle,
  ShieldAlert,
  Headphones,
  CheckCircle2,
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import { T } from "../../constants/theme";
import Btn from "./Btn";

const FAQ_KNOWLEDGE = [
  {
    q: "How does the AI Food Quality Score work?",
    a: "When you upload a food photo, our AI analyzes freshness texture, steam, packaging seal, and expiry risk. If the score is below 50%, the donation is automatically disqualified to protect community health."
  },
  {
    q: "How do I claim food as a shelter receiver?",
    a: "Go to the Receiver Hub, choose an available donation, and click 'Claim & Set Delivery Location'. Set your specific dropping point and cell number. Once confirmed, the order is locked and pinned exclusively to your shelter."
  },
  {
    q: "Why can Delivery Partners only take 1 order at a time?",
    a: "To ensure fast, safe, temperature-controlled delivery without meal spoilage, couriers can only hold 1 active delivery route at a time. Once handed over, the courier can accept the next route."
  },
  {
    q: "What are the food safety standards in Hyderabad?",
    a: "All cooked food must be hygienically prepared within 4 hours, packed in insulated containers, and transported by verified couriers before consumption expiry."
  }
];

export default function AiHelpAssistant({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState("ai"); // 'ai' | 'support' | 'ticket'
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "ai",
      text: `Hello ${user?.name ? user.name.split(" ")[0] : "there"}! 👋 I am your FoodBridge AI Smart Assistant. How can I help you today with food donations, claims, delivery routes, or safety guidelines?`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketBody, setTicketBody] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  function handleSend(textToSend) {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // Generate intelligent contextual response
    setTimeout(() => {
      const lower = q.toLowerCase();
      let reply = "I am here to help! You can donate surplus food in the Donor Hub, claim meals in the Receiver Hub, or accept delivery routes in the Delivery Console.";

      if (lower.includes("quality") || lower.includes("score") || lower.includes("photo") || lower.includes("50")) {
        reply = "📸 AI Quality Analyzer inspects your food photo. If quality is ≥ 50%, it is certified and published. If it's below 50% or detected as stale/expired, the system automatically rejects it for safety.";
      } else if (lower.includes("claim") || lower.includes("pin") || lower.includes("receiver")) {
        reply = "🏠 In the Receiver Hub, pick any available food item, enter your dropping point, contact number, and PIN. The order will be pinned exclusively to your shelter so no other entity can take it.";
      } else if (lower.includes("delivery") || lower.includes("courier") || lower.includes("map") || lower.includes("partner")) {
        reply = "🛵 Delivery partners get an interactive 3-Point GPS Side Map from courier position ➔ donor pickup ➔ shelter drop-off point. Remember, delivery partners can only carry 1 active delivery at a time!";
      } else if (lower.includes("contact") || lower.includes("phone") || lower.includes("helpline") || lower.includes("problem")) {
        reply = "📞 You can reach our 24/7 Hyderabad Food Safety Emergency Desk directly at +91 040-2345-6789 or WhatsApp +91 98480 99887.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 600);
  }

  function handleTicketSubmit(e) {
    e.preventDefault();
    if (!ticketSubject || !ticketBody) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketSubject("");
      setTicketBody("");
      setActiveTab("ai");
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `✅ Support Ticket #${Math.floor(100000 + Math.random() * 900000)} registered successfully! Our Hyderabad safety team has been notified.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 2000);
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 15, 29, 0.65)",
        zIndex: 140,
        backdropFilter: "blur(6px)",
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
          background: "#FFFFFF",
          borderRadius: 24,
          maxWidth: 680,
          width: "100%",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          border: `1px solid ${T.line}`,
        }}
      >
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          background: `linear-gradient(135deg, #0A0F1D 0%, #1E293B 100%)`,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${T.userPrimary} 0%, #047857 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(5,150,105,0.4)"
            }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, fontFamily: T.headline }}>
                FoodBridge AI Support & Customer Desk
              </div>
              <div style={{ fontSize: 11.5, color: "#94A3B8" }}>
                24/7 Intelligent Assistance & Hyderabad Safety Escalation
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          background: T.bgSubtle,
          borderBottom: `1px solid ${T.line}`,
          padding: "8px 16px",
          gap: 8,
        }}>
          {[
            ["ai", "🤖 Smart AI Assistant", Sparkles],
            ["support", "📞 Customer Care Hotline", Headphones],
            ["ticket", "🎫 Raise Problem Ticket", ShieldAlert],
          ].map(([tabId, label, Icon]) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              style={{
                background: activeTab === tabId ? "#FFFFFF" : "transparent",
                border: `1px solid ${activeTab === tabId ? T.line : "transparent"}`,
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: 700,
                color: activeTab === tabId ? T.ink : T.inkSoft,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: activeTab === tabId ? "0 2px 6px rgba(0,0,0,0.04)" : "none",
              }}
            >
              <Icon size={14} color={activeTab === tabId ? T.userPrimary : T.inkMuted} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: SMART AI ASSISTANT CHAT */}
        {activeTab === "ai" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Messages Scroll Area */}
            <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: m.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: 16,
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    background: m.sender === "user"
                      ? `linear-gradient(135deg, ${T.userPrimary} 0%, #047857 100%)`
                      : T.bgSubtle,
                    color: m.sender === "user" ? "#FFFFFF" : T.ink,
                    border: m.sender === "user" ? "none" : `1px solid ${T.line}`,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: 10.5, color: T.inkMuted, marginTop: 4, padding: "0 4px" }}>
                    {m.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Suggested Prompts */}
            <div style={{ padding: "8px 16px", background: "#FAFAFA", borderTop: `1px solid ${T.line}`, display: "flex", gap: 8, overflowX: "auto" }}>
              {FAQ_KNOWLEDGE.map((faq) => (
                <button
                  key={faq.q}
                  onClick={() => handleSend(faq.q)}
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${T.line}`,
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: T.ink,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronRight size={12} color={T.userPrimary} />
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <div style={{ padding: "14px 18px", borderTop: `1px solid ${T.line}`, background: "#FFFFFF", display: "flex", gap: 10 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask AI Assistant anything about donations, routes, or help..."
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  borderRadius: 12,
                  border: `1.5px solid ${T.line}`,
                  fontSize: 13.5,
                  outline: "none",
                  fontFamily: T.body,
                  color: T.ink
                }}
              />
              <Btn icon={Send} onClick={() => handleSend()}>Send</Btn>
            </div>
          </div>
        )}

        {/* TAB 2: 24/7 CUSTOMER CARE & HELPLINES */}
        {activeTab === "support" && (
          <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: T.ink, margin: "0 0 6px", fontFamily: T.headline }}>
                Direct Customer Support & Food Safety Desk
              </h3>
              <p style={{ color: T.inkSoft, fontSize: 13.5 }}>
                If you face any urgent pickup issues, app errors, or food condition questions, reach our dedicated Hyderabad escalation lines.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{
                background: T.userPrimaryLight,
                border: `1px solid ${T.userPrimaryBorder}`,
                borderRadius: 16,
                padding: 20,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.userPrimary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 12 }}>
                  <Phone size={18} />
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: T.userPrimary, textTransform: "uppercase" }}>
                  TOLL-FREE EMERGENCY HELPLINE
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.ink, marginTop: 4 }}>
                  +91 040-2345-6789
                </div>
                <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 4 }}>
                  Available 24 hours / 7 days for donors, shelters, and couriers.
                </div>
              </div>

              <div style={{
                background: T.courierPrimaryLight,
                border: `1px solid ${T.courierPrimaryBorder}`,
                borderRadius: 16,
                padding: 20,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.courierPrimary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 12 }}>
                  <MessageSquare size={18} />
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: T.courierPrimary, textTransform: "uppercase" }}>
                  WHATSAPP DISPATCH ASSISTANT
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.ink, marginTop: 4 }}>
                  +91 98480 99887
                </div>
                <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 4 }}>
                  Instant WhatsApp GPS tracking and emergency photo upload.
                </div>
              </div>
            </div>

            {/* Safety & Operational Hub Info */}
            <div style={{ background: T.bgSubtle, padding: 18, borderRadius: 14, border: `1px solid ${T.line}` }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: T.ink, marginBottom: 8 }}>
                🏢 Central Operations Hub — Hyderabad
              </div>
              <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.6 }}>
                <strong>Location:</strong> Cyber Gateway Complex, Level 4, Hitec City, Hyderabad - 500081<br />
                <strong>Email:</strong> support@foodbridge.org · safety@foodbridge.org<br />
                <strong>Operating Zone:</strong> Greater Hyderabad Municipal Corporation (GHMC) & Telangana State
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROBLEM TICKET SYSTEM */}
        {activeTab === "ticket" && (
          <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: T.ink, margin: "0 0 6px", fontFamily: T.headline }}>
                Report an Issue or Safety Escalation
              </h3>
              <p style={{ color: T.inkSoft, fontSize: 13.5 }}>
                Submit your problem or feedback directly to our customer resolution team.
              </p>
            </div>

            {ticketSent ? (
              <div style={{ padding: 40, textAlign: "center", background: T.userPrimaryLight, borderRadius: 16, border: `1px solid ${T.userPrimaryBorder}` }}>
                <CheckCircle2 size={44} color={T.userPrimary} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: T.ink }}>Ticket Submitted Successfully!</div>
                <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 4 }}>
                  Our Hyderabad dispatch team will contact your registered phone number shortly.
                </div>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Subject / Issue Category</label>
                  <input
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Courier delay, food packaging question, or address correction"
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 10,
                      border: `1.5px solid ${T.line}`,
                      fontSize: 14,
                      marginTop: 6,
                      boxSizing: "border-box",
                      fontFamily: T.body,
                      outline: "none",
                      color: T.ink
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Problem Details</label>
                  <textarea
                    value={ticketBody}
                    onChange={(e) => setTicketBody(e.target.value)}
                    placeholder="Describe what happened in detail so we can resolve it immediately..."
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 10,
                      border: `1.5px solid ${T.line}`,
                      fontSize: 14,
                      marginTop: 6,
                      boxSizing: "border-box",
                      fontFamily: T.body,
                      outline: "none",
                      color: T.ink,
                      resize: "vertical"
                    }}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <Btn type="submit" full icon={Send}>Submit Problem Ticket</Btn>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
