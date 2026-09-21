import React, { useState } from "react";
import { Star, MessageSquare, X, CheckCircle2, User, Send, ThumbsUp, ShieldCheck } from "lucide-react";
import { T } from "../../constants/theme";
import Btn from "./Btn";

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    author: "Ramesh Rao",
    role: "Food Donor (Royal Caterers)",
    location: "Jubilee Hills, Hyderabad",
    rating: 5,
    recommend: "100% Highly Recommended",
    comment:
      "The AI food quality scanner gives our kitchen instant confidence! We easily listed 65 portions of fresh biryani, and courier Kiran picked it up within 25 minutes for Sneha Orphanage.",
    date: "Yesterday",
  },
  {
    id: "rev-2",
    author: "Anitha Reddy",
    role: "Verified Shelter Receiver (Sneha Home)",
    location: "Madhapur, Hyderabad",
    rating: 5,
    recommend: "Essential Community Lifeline",
    comment:
      "The order pinning feature is incredible. Once I confirmed our drop point, the shipment was locked specifically for our 70 children. Safe, hot, and transparent!",
    date: "2 days ago",
  },
  {
    id: "rev-3",
    author: "Kiran Kumar",
    role: "Delivery Partner",
    location: "Banjara Hills / Secunderabad",
    rating: 5,
    recommend: "Smooth GPS Navigation",
    comment:
      "The 3-point side GPS map makes pickups effortless. Contacting donor and receiver cell numbers with 1-click ensures seamless handovers every run.",
    date: "3 days ago",
  },
];

export default function ReviewsModal({ isOpen, onClose, user }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState(user?.name || "");
  const [comment, setComment] = useState("");
  const [roleType, setRoleType] = useState(user?.role === "DELIVERY_PARTNER" ? "Delivery Partner" : "Food Donor / Receiver");
  const [recommend, setRecommend] = useState("100% Recommended");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim() || !author.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      role: roleType,
      location: "Hyderabad, Telangana",
      rating,
      recommend,
      comment: comment.trim(),
      date: "Just now",
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment("");
    }, 2500);
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 15, 29, 0.65)",
        zIndex: 130,
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
          maxWidth: 780,
          width: "100%",
          maxHeight: "88vh",
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
              background: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(217,119,6,0.4)"
            }}>
              <Star size={20} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, fontFamily: T.headline }}>
                Community Ratings & Recommendations
              </div>
              <div style={{ fontSize: 11.5, color: "#94A3B8" }}>
                Real user experiences across Donors, Shelters & Delivery Couriers
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

        {/* Content Body */}
        <div style={{ padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Rating Summary Bar */}
          <div style={{
            background: T.bgSubtle,
            border: `1px solid ${T.line}`,
            borderRadius: 16,
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: T.ink, fontFamily: T.headline }}>
                4.9
              </div>
              <div>
                <div style={{ display: "flex", gap: 3, color: "#F59E0B", marginBottom: 3 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" />
                  ))}
                </div>
                <div style={{ fontSize: 12.5, color: T.inkSoft, fontWeight: 600 }}>
                  Based on 340+ verified rescues in Greater Hyderabad
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <span style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#065F46",
                background: T.userPrimaryLight,
                padding: "6px 12px",
                borderRadius: 999,
                border: `1px solid ${T.userPrimaryBorder}`
              }}>
                ✓ 99.4% On-Time Delivery
              </span>
              <span style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#1D4ED8",
                background: T.courierPrimaryLight,
                padding: "6px 12px",
                borderRadius: 999,
                border: `1px solid ${T.courierPrimaryBorder}`
              }}>
                🛡️ 100% Verified Quality
              </span>
            </div>
          </div>

          {/* ADD YOUR REVIEW FORM */}
          <div style={{
            background: "#FFFFFF",
            border: `1.5px solid ${T.line}`,
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)"
          }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: T.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <MessageSquare size={16} color={T.userPrimary} />
              <span>Share Your Rating & Experience</span>
            </div>

            {submitted ? (
              <div style={{ padding: 18, background: T.userPrimaryLight, borderRadius: 12, color: "#065F46", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={20} />
                <span>Thank you! Your verified recommendation has been added to our community wall.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Star Selector */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.inkSoft }}>Your Rating:</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                      >
                        <Star
                          size={24}
                          color="#F59E0B"
                          fill={(hoverRating || rating) >= star ? "#F59E0B" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: T.ink }}>
                    {rating} / 5 Stars
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft }}>Your Name</label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Ramesh Rao / Anitha Reddy"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: `1.5px solid ${T.line}`,
                        fontSize: 13,
                        marginTop: 4,
                        boxSizing: "border-box",
                        fontFamily: T.body,
                        outline: "none",
                        color: T.ink
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft }}>Your Role</label>
                    <select
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: `1.5px solid ${T.line}`,
                        fontSize: 13,
                        marginTop: 4,
                        boxSizing: "border-box",
                        fontFamily: T.body,
                        outline: "none",
                        color: T.ink
                      }}
                    >
                      <option value="Food Donor (Restaurant/Caterer)">Food Donor (Restaurant/Caterer)</option>
                      <option value="Verified Shelter Receiver">Verified Shelter Receiver</option>
                      <option value="Delivery Partner">Delivery Partner Courier</option>
                      <option value="Community Volunteer">Community Volunteer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft }}>Review & Recommendation</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about food quality, speed of courier, or how this helped your community..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: `1.5px solid ${T.line}`,
                      fontSize: 13,
                      marginTop: 4,
                      boxSizing: "border-box",
                      fontFamily: T.body,
                      outline: "none",
                      color: T.ink,
                      resize: "vertical"
                    }}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Btn type="submit" small icon={Send}>Post Community Review</Btn>
                </div>
              </form>
            )}
          </div>

          {/* REVIEWS LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: T.ink }}>
              Recent Verified Testimonials
            </div>

            {reviews.map((r) => (
              <div
                key={r.id}
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${T.line}`,
                  borderRadius: 16,
                  padding: 18,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: T.bgSubtle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.ink
                    }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: T.ink, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{r.author}</span>
                        <ShieldCheck size={14} color={T.userPrimary} />
                      </div>
                      <div style={{ fontSize: 11.5, color: T.inkSoft }}>
                        {r.role} · {r.location}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 2, color: "#F59E0B", justifyContent: "flex-end" }}>
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#F59E0B" />
                      ))}
                    </div>
                    <span style={{ fontSize: 10.5, color: T.inkMuted }}>{r.date}</span>
                  </div>
                </div>

                <p style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.55, margin: "8px 0 0" }}>
                  "{r.comment}"
                </p>

                {r.recommend && (
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: T.userPrimary, fontWeight: 700 }}>
                    <ThumbsUp size={12} />
                    <span>{r.recommend}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
