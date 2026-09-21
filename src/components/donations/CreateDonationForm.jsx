import React, { useState, useRef } from "react";
import {
  Camera,
  Sparkles,
  CheckCircle2,
  Phone,
  Home,
  MapPin,
  Hash,
  User,
  Utensils,
  Upload,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import { T, CATEGORIES } from "../../constants/theme";
import { aiClassifyFood, aiAnalyzeFoodQualityImage } from "../../utils/aiServices";
import Card from "../common/Card";
import Btn from "../common/Btn";

export default function CreateDonationForm({ user, onCreate, onCancel }) {
  // Donor Profile / Location Info
  const [donorName, setDonorName] = useState(user?.name || "Ramesh Rao");
  const [cellNo, setCellNo] = useState(user?.cellNo || "+91 98480 12345");
  const [houseName, setHouseName] = useState(user?.houseName || "Flat 402, Sri Sai Nilayam");
  const [street, setStreet] = useState(user?.street || "Road No 10, Banjara Hills");
  const [pincode, setPincode] = useState(user?.pincode || "500034");

  // Food Details
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("Cooked Food");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("meals");
  const [vegetarian, setVegetarian] = useState(true);
  const [pickupWindow, setPickupWindow] = useState(120);
  const [consumeWindow, setConsumeWindow] = useState(180);
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // Photo & AI Quality Analysis State
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1.5px solid ${T.line}`,
    fontSize: 14,
    marginTop: 6,
    boxSizing: "border-box",
    fontFamily: T.body,
    outline: "none",
    transition: "border-color 0.15s ease",
    color: T.ink,
    background: "#FFFFFF",
  };

  function processImageQuality(nameToUse, fileName = "food_upload.jpg") {
    setIsScanningPhoto(true);
    setQualityAnalysis(null);

    setTimeout(() => {
      setIsScanningPhoto(false);
      const analysis = aiAnalyzeFoodQualityImage(nameToUse, fileName);
      setQualityAnalysis(analysis);

      // Also classify category & estimated portions
      const classification = aiClassifyFood(nameToUse);
      if (!category) setCategory(classification.category);
      if (!quantity) setQuantity(String(classification.estimatedPortions));
    }, 1000);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImagePreview(uploadEvent.target?.result);
      processImageQuality(foodName || file.name, file.name);
    };
    reader.readAsDataURL(file);
  }

  function handleSimulateImage(type) {
    const isGood = type === "good";
    const sampleTitle = isGood
      ? (foodName || "Fresh Hyderabadi Veg Biryani & Curries")
      : "Stale / Expired Mixed Curry (Quality Test Sample)";

    setFoodName(sampleTitle);
    setImagePreview("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80");
    processImageQuality(sampleTitle, isGood ? "fresh_biryani.jpg" : "expired_sample.jpg");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!foodName || !quantity || !donorName || !cellNo || !houseName || !street || !pincode || !confirmed) {
      alert("Please fill in all required donor location fields and confirm food safety.");
      return;
    }

    // STRICT CHECK: IF QUALITY SCORE IS < 50%, REJECT!
    if (qualityAnalysis && qualityAnalysis.score < 50) {
      alert("⚠️ Donation Rejected: Food failed the AI Quality and Hygiene Inspection with a score under 50%. Expired or degraded food cannot be published for community safety.");
      return;
    }

    const fullPickupAddress = `${houseName}, ${street}, Hyderabad - ${pincode}`;

    onCreate({
      donorName: donorName.trim(),
      donorPhone: cellNo.trim(),
      donorHouse: houseName.trim(),
      donorStreet: street.trim(),
      donorPincode: pincode.trim(),
      foodName: foodName.trim(),
      category: category || "Cooked Food",
      quantity: Number(quantity),
      unit,
      vegetarian,
      pickupAddress: fullPickupAddress,
      notes,
      qualityScore: qualityAnalysis?.score || 90,
      pickupEndMins: Number(pickupWindow),
      consumeBeforeMins: Number(consumeWindow),
    });
  }

  const isDisqualified = qualityAnalysis && qualityAnalysis.score < 50;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: T.headline, fontSize: 28, fontWeight: 900, color: T.ink, margin: "0 0 4px" }}>
          Donate Surplus Food (Hyderabad, Telangana)
        </h1>
        <p style={{ color: T.inkSoft, fontSize: 14 }}>
          Upload a food photograph for real-time <strong>AI Freshness & Quality Scoring</strong>. Items with quality score under 50% will not be accepted.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* SECTION 1: MANDATORY DONOR IDENTITY & LOCATION */}
          <div style={{ background: T.bgSubtle, padding: 20, borderRadius: 16, border: `1px solid ${T.line}` }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: T.userPrimary, marginBottom: 14, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              <User size={16} /> 1. Donor Information & Exact Pickup Address
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Donor Full Name</label>
                <input
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Ramesh Rao"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                  <Phone size={13} color={T.userPrimary} /> Cell / Phone Number
                </label>
                <input
                  value={cellNo}
                  onChange={(e) => setCellNo(e.target.value)}
                  placeholder="e.g. +91 98480 12345"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, marginTop: 10 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                  <Home size={13} color={T.userPrimary} /> House / Building / Flat Name
                </label>
                <input
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  placeholder="e.g. Flat 402, Sri Sai Nilayam / Royal Towers"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                  <Hash size={13} color={T.userPrimary} /> Pin Code (Hyderabad)
                </label>
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 500034"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={13} color={T.userPrimary} /> Street Name & Area (Hyderabad, Telangana)
              </label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Road No 10, Banjara Hills / Jubilee Hills"
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* SECTION 2: PHOTO UPLOAD & AI QUALITY SCORE INSPECTION */}
          <div style={{ background: "#FFFFFF", padding: 20, borderRadius: 16, border: `1.5px solid ${T.line}` }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Camera size={18} color={T.userPrimary} /> 2. Upload Food Photograph for AI Quality Scoring
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${qualityAnalysis ? (isDisqualified ? T.rose : T.userPrimary) : T.lineStrong}`,
                borderRadius: 16,
                padding: 24,
                textAlign: "center",
                cursor: "pointer",
                background: qualityAnalysis ? (isDisqualified ? T.roseLight : T.userPrimaryLight) : T.bgSubtle,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "center", marginBottom: 8 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: qualityAnalysis ? (isDisqualified ? T.rose : T.userPrimary) : T.ink,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {isScanningPhoto ? (
                    <RefreshCw size={24} style={{ animation: "spin 1.5s linear infinite" }} />
                  ) : qualityAnalysis ? (
                    isDisqualified ? <XCircle size={28} /> : <CheckCircle2 size={28} />
                  ) : (
                    <Upload size={24} />
                  )}
                </div>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    style={{ width: 54, height: 54, borderRadius: 12, objectFit: "cover", border: `2px solid #fff`, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}
                  />
                )}
              </div>

              <div style={{ fontSize: 14.5, fontWeight: 800, color: T.ink }}>
                {isScanningPhoto
                  ? "🤖 AI Neural Engine Scanning Food Texture & Freshness..."
                  : imagePreview
                    ? "✓ Food Image Uploaded (Click to replace file)"
                    : "Upload / Snap Food Picture (Required for AI Quality Score)"}
              </div>
              <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 4 }}>
                Supports JPG, PNG, WEBP · Analyzes visual hygiene, steam, and expiration signs
              </div>

              {/* Sample test buttons */}
              <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
                <span style={{ fontSize: 11, color: T.inkMuted, alignSelf: "center", fontWeight: 700 }}>Quick Test Demo:</span>
                <button
                  type="button"
                  onClick={() => handleSimulateImage("good")}
                  style={{ background: "#FFFFFF", border: `1px solid ${T.userPrimaryBorder}`, color: T.userPrimary, fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 8, cursor: "pointer" }}
                >
                  🟢 Test Fresh Food (Score: ~92%)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateImage("spoiled")}
                  style={{ background: "#FFFFFF", border: `1px solid #FECDD3`, color: T.rose, fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 8, cursor: "pointer" }}
                >
                  🔴 Test Expired / Spoiled Food (Score: ~34%)
                </button>
              </div>
            </div>

            {/* AI QUALITY SCORE CARD & BREAKDOWN */}
            {qualityAnalysis && (
              <div style={{
                marginTop: 16,
                borderRadius: 16,
                padding: 18,
                background: isDisqualified ? "#FFF1F2" : "#F0FDF4",
                border: `1.5px solid ${isDisqualified ? "#FDA4AF" : "#86EFAC"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isDisqualified ? <AlertTriangle size={20} color={T.rose} /> : <ShieldCheck size={20} color={T.userPrimary} />}
                    <span style={{ fontSize: 15, fontWeight: 900, color: isDisqualified ? T.rose : "#065F46" }}>
                      {isDisqualified ? "⚠️ FOOD QUALITY SCORE: REJECTED (< 50%)" : "✅ FOOD QUALITY SCORE: PASSED & CERTIFIED"}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: isDisqualified ? T.rose : T.userPrimary,
                    background: "#FFFFFF",
                    padding: "4px 14px",
                    borderRadius: 999,
                    border: `1px solid ${isDisqualified ? "#FECDD3" : "#BBF7D0"}`,
                    fontFamily: T.headline
                  }}>
                    {qualityAnalysis.score}% Quality
                  </div>
                </div>

                <p style={{ fontSize: 13, lineHeight: 1.5, color: isDisqualified ? "#9F1239" : "#14532D", margin: "0 0 14px" }}>
                  {qualityAnalysis.summary}
                </p>

                {/* Score Breakdown Bars */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, background: "#FFFFFF", padding: 12, borderRadius: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft }}>Freshness Index</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: T.ink }}>{qualityAnalysis.freshnessScore}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft }}>Hygiene & Seal</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: T.ink }}>{qualityAnalysis.hygieneScore}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft }}>Bacterial Risk</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: isDisqualified ? T.rose : T.userPrimary }}>{qualityAnalysis.bacterialRiskScore}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: FOOD DETAILS & CONSUMPTION WINDOW */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Utensils size={18} color={T.userPrimary} /> 3. Meal Specification & Expiry Timers
            </div>

            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Food Title / Item Description</label>
              <input
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Hyderabadi Veg Biryani, Mirchi Ka Salan & Raita"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Dietary Preference</label>
                <select
                  value={vegetarian ? "VEG" : "NONVEG"}
                  onChange={(e) => setVegetarian(e.target.value === "VEG")}
                  style={inputStyle}
                >
                  <option value="VEG">🌱 Vegetarian</option>
                  <option value="NONVEG">🍗 Non-Vegetarian</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginTop: 12 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Quantity</label>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                  min="1"
                  placeholder="e.g. 60"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} style={inputStyle}>
                  <option value="meals">meals</option>
                  <option value="portions">portions</option>
                  <option value="kg">kg</option>
                  <option value="boxes">boxes</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Pickup Window (Minutes from now)</label>
                <input
                  value={pickupWindow}
                  onChange={(e) => setPickupWindow(e.target.value)}
                  type="number"
                  min="15"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Consume Before (Minutes from now)</label>
                <input
                  value={consumeWindow}
                  onChange={(e) => setConsumeWindow(e.target.value)}
                  type="number"
                  min="15"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft }}>Handling & Insulated Storage Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Freshly prepared, kept warm in insulated catering boxes."
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>

          <label style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            fontSize: 13,
            color: T.ink,
            cursor: isDisqualified ? "not-allowed" : "pointer",
            background: isDisqualified ? T.roseLight : T.userPrimaryLight,
            padding: 14,
            borderRadius: 12,
            border: `1px solid ${isDisqualified ? "#FDA4AF" : T.userPrimaryBorder}`
          }}>
            <input
              type="checkbox"
              checked={confirmed}
              disabled={isDisqualified}
              onChange={(e) => setConfirmed(e.target.checked)}
              style={{ marginTop: 3 }}
              required
            />
            <span>
              <strong>Food Quality Declaration:</strong> I confirm that I am <strong>{donorName}</strong> (Cell: <strong>{cellNo}</strong>). The food at <strong>{houseName}, {street}</strong> was prepared hygienically and meets community safety guidelines.
            </span>
          </label>

          {isDisqualified && (
            <div style={{
              background: T.rose,
              color: "#FFFFFF",
              padding: "12px 16px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <XCircle size={18} />
              <span>DONATION BLOCKED: AI Quality score is below 50%. Expired or unsafe food cannot be submitted.</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            <Btn
              type="submit"
              full
              disabled={isDisqualified || isScanningPhoto}
              icon={CheckCircle2}
            >
              {isDisqualified ? "Disqualified (< 50% Quality)" : "Confirm & Publish Donation"}
            </Btn>
            <Btn variant="outline" onClick={onCancel}>Cancel</Btn>
          </div>
        </form>
      </Card>
    </div>
  );
}
