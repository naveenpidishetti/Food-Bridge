/* ---------------------------------------------------------------------- */
/* DESIGN TOKENS (Food Bridge Crisp White, Deep Black, Green & Blue)      */
/* ---------------------------------------------------------------------- */
export const T = {
  // Clean Crisp White & Neutral Palette
  bg: "#FFFFFF",
  bgSubtle: "#F8FAFC",
  panel: "#FFFFFF",
  panelGlass: "rgba(255, 255, 255, 0.96)",
  
  // Ultra Dark Black Text
  ink: "#0A0F1D",
  inkHeading: "#050811",
  inkSoft: "#475569",
  inkMuted: "#64748B",
  line: "#E2E8F0",
  lineStrong: "#CBD5E1",
  
  // USER Accent Color: Pure Emerald Green
  userPrimary: "#059669",
  userPrimaryHover: "#047857",
  userPrimaryLight: "#ECFDF5",
  userPrimaryBorder: "#A7F3D0",
  userGlow: "rgba(5, 150, 105, 0.2)",
  
  // DELIVERY PARTNER Accent Color: Royal Blue
  courierPrimary: "#2563EB",
  courierPrimaryHover: "#1D4ED8",
  courierPrimaryLight: "#EFF6FF",
  courierPrimaryBorder: "#BFDBFE",
  courierGlow: "rgba(37, 99, 235, 0.2)",
  
  // Base primary (defaults to User Green)
  primary: "#059669",
  primaryHover: "#047857",
  primaryLight: "#ECFDF5",
  primaryBorder: "#A7F3D0",
  
  // Accent Status Colors
  amber: "#D97706",
  amberLight: "#FEF3C7",
  rose: "#E11D48",
  roseLight: "#FFE4E6",
  sky: "#0284C7",
  skyLight: "#E0F2FE",
  indigo: "#4F46E5",
  indigoLight: "#EEF2FF",
  
  // Typography
  headline: "'Outfit', 'Plus Jakarta Sans', sans-serif",
  body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
};

export const STATUS_META = {
  AVAILABLE: { label: "Available for Pickup", color: T.userPrimary, bg: T.userPrimaryLight, border: "#A7F3D0" },
  CLAIMED: { label: "Claimed & Pinned", color: T.amber, bg: T.amberLight, border: "#FDE68A" },
  PICKED_UP: { label: "Picked Up by Courier", color: T.courierPrimary, bg: T.courierPrimaryLight, border: "#BFDBFE" },
  IN_TRANSIT: { label: "In Live GPS Transit", color: "#3B82F6", bg: "#DBEAFE", border: "#93C5FD" },
  DELIVERED: { label: "Delivered to Shelter", color: "#16A34A", bg: "#DCFCE7", border: "#86EFAC" },
  COMPLETED: { label: "Completed & Verified", color: "#0F766E", bg: "#CCFBF1", border: "#5EEAD4" },
};

export const CATEGORIES = [
  "Cooked Food",
  "Fruits",
  "Vegetables",
  "Bakery",
  "Packaged Food",
  "Groceries",
  "Dairy",
  "Beverages",
  "Other"
];

export const CATEGORY_KEYWORDS = {
  "Cooked Food": ["curry", "rice", "biryani", "dal", "soup", "pasta", "meal", "sabzi", "roti", "gravy", "noodles", "pulao"],
  "Bakery": ["bread", "cake", "pastry", "bun", "cookie", "muffin", "croissant", "toast", "loaf"],
  "Fruits": ["apple", "banana", "mango", "orange", "fruit", "berries", "grape", "watermelon"],
  "Vegetables": ["vegetable", "carrot", "potato", "tomato", "veg", "spinach", "onion", "greens"],
  "Packaged Food": ["packet", "chips", "snack", "packaged", "canned", "biscuit"],
  "Groceries": ["rice bag", "flour", "grain", "grocery", "pulses", "lentils", "atta"],
  "Dairy": ["milk", "paneer", "cheese", "yogurt", "curd", "butter"],
  "Beverages": ["juice", "tea", "drink", "water", "smoothie"],
};

export const PIE_COLORS = [T.userPrimary, T.courierPrimary, T.amber, T.rose, "#8B5CF6"];
