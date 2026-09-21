/**
 * Food Bridge - Real-time Surplus Food Rescue & Redistribution
 * 
 * Modularized Architecture:
 * - Theme tokens: src/constants/theme.js
 * - Mock data & pools: src/constants/data.js
 * - Validation: src/utils/validation.js
 * - Date & AI Utilities: src/utils/dateUtils.js, src/utils/aiServices.js
 * - Common UI Components: src/components/common/
 * - Modals & Overlays: src/components/modals/
 * - Interactive Leaflet Map: src/components/map/InteractiveRescueMap.jsx
 * - Role Dashboards & Pages: src/pages/
 * - Application Core: src/App.jsx
 */

export { default } from "./src/App.jsx";
export * from "./src/constants/theme";
export * from "./src/constants/data";
export * from "./src/utils/validation";
export * from "./src/utils/dateUtils";
export * from "./src/utils/aiServices";
