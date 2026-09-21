# 🍲 Food Bridge — Connecting Surplus Food with Communities

> **A real-time surplus food rescue & redistribution platform for Greater Hyderabad & Telangana connecting Food Donors, Verified Receivers / Shelters, and Delivery Partners.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15.3-22B5BF?style=flat)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🌟 Overview

**Food Bridge** is an end-to-end food rescue ecosystem operating in **Hyderabad, Telangana**. It enables restaurants, caterers, bakeries, and households to list surplus edible food with complete donor pickup details. Verified shelters and orphanages in Hyderabad can claim and pin orders with designated drop-off points, while delivery partners navigate via real-time GPS tracking.

---

## ✨ Key Workflows & Features

### 1. 👥 Dedicated User Portals & Delivery Partner Console
- **👤 Community User (Donor & Receiver Access)**:
  - **🍲 Donor Hub**: 
    - Full donor profile display (Name, Cell No, House / Bldg Name, Street, Pin Code).
    - Breakdown of donated food types (Biryani, curries, bakery, fruits).
    - Mandatory location confirmation during donation creation.
  - **🏠 Receiver Hub**:
    - Real-time catalog of available food from donors in Hyderabad.
    - **Order Locking & Pinning**: Once a receiver claims food, the order is locked and pinned to that shelter, making it unavailable to other receivers.
    - Set specific drop-off details (Receiver Name, Cell No, Specific Dropping Point Landmark, House/Shelter Name, Street, Pin Code).
- **🛵 Delivery Partner Console**:
  - Accept pickup tasks across Hyderabad (Banjara Hills, Jubilee Hills, Madhapur, Hitec City, Secunderabad).
  - Step-by-step dispatch workflow (`Claimed` ➔ `Picked Up` ➔ `In Transit` ➔ `Delivered`).
  - Access donor pickup contacts and receiver drop-off contacts.

### 2. 🗺️ Hyderabad Real-Time Map & Route Dispatch
- Leaflet map centered on **Hyderabad, Telangana** (`17.4150, 78.4350`).
- Displays live GPS routes between donor pickup origins and shelter drop-off points.
- Animated live courier vehicle tracking.

---

## 🔐 Demo Accounts (Hyderabad, Telangana)

| Account Type | Email | Password | Details / Location |
| :--- | :--- | :--- | :--- |
| **👤 User (Donor & Receiver)** | `user@foodbridge.org` | `FoodBridge#2026` | Ramesh Rao (Banjara Hills, Rd No 10, Pin: 500034) |
| **👤 Receiver Shelter** | `receiver@foodbridge.org` | `FoodBridge#2026` | Anitha Reddy (Sneha Orphanage, Madhapur, Pin: 500081) |
| **🛵 Delivery Partner** | `delivery@foodbridge.org` | `FoodBridge#2026` | Kiran Kumar (Courier Partner, Hyderabad) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

---

<p align="center">
  Made with 💚 for zero-waste communities in Hyderabad, Telangana.
</p>
