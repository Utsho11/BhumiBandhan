# BhumiBandhan (ভূমি-বন্ধন)
> **Smart Land Tech Protocol for Unified Land Verification & E-Governance in Bangladesh**  
> *স্মার্ট ই-গভর্ন্যান্সের জন্য সমন্বিত ডিজিটাল ভূমি রেকর্ড, যাচাইকরণ ও ডিজিটাইজেশন সিস্টেম*

Developed for **LandTech 2026 — LandTech Innovation Hackathon**, organized by the **Department of CSE & CSE-TECH**, supported by the **Department of Law**, Daffodil International University (DIU).

---

## 🏆 Project Overview

**BhumiBandhan** solves the fundamental institutional divide in Bangladesh land administration between the **Sub-Registry Offices (Ministry of Law)** and the **AC Land & Union Land Offices (Ministry of Land)**.

By introducing a **14-Digit Geo-ULPIN (Unique Land Parcel Identification Number)**, **Cryptographic Deed Fingerprinting**, and an automated **"Check Before You Buy" (কেনার আগে যাচাই)** risk intelligence engine, BhumiBandhan eliminates land fraud, double-selling, and multi-bank mortgage scams while streamlining e-Mutation.

### 🌟 Key Highlights
- **Bangla-First Civic Interface:** Designed for high accessibility for citizens, rural landholders, and land officers. English available via instant toggle.
- **"কেনার আগে যাচাই" (Check Before You Buy):** Instant 0–100% Land Trust Score auditing Khatian chains, government Khas status, bank liens, and active court disputes.
- **Baya Deed Chain Tracker:** Resolves historical ownership lines across **CS $\to$ SA $\to$ RS $\to$ BS** surveys with automated 16-Ana (*আনা-গণ্ডা-কড়া-ক্রান্তি*) share balancing.
- **Anti-Double Selling Shield:** Locks parcel shares during registration-to-mutation transit, preventing duplicate transfers.
- **Bank Collateral & Digital Lien Registry:** Centralized lien management to stop duplicate mortgaging of the same property across banks.
- **Tamper-Evident QR Verification:** Offline-verifiable digital QR codes generated with cryptographic SHA-256 deed signatures.
- **Dual Portal Architecture:** Dedicated Citizen Portal and Administrative Officer Dashboard (AC Land, Sub-Registrar, Bank Inspector).

---

## 🎨 Civic Design System (Bangladesh Colors)

BhumiBandhan strictly adheres to the official Bangladesh Civic Theme:
- **Primary Brand (Deep Civic Emerald):** `#064E3B` (`hover: #04382A`, `container: #0D5C3A`)
- **Accent Red (National Crimson):** `#DC2626` (`hover: #B91C1C`, `surface: #FEF2F2`, `border: #FCA5A5`)
- **Status Success:** `#059669` | **Status Warning:** `#D97706` | **Status Info:** `#0284C7`
- **Surfaces:** Main `#F8FAFC`, Card `#FFFFFF`, Subtle `#F1F5F9`, Dark Surface `#064E3B`

---

## 🏗️ Tech Stack & Folder Structure

```
BhumiBandhan/
├── docs/                   # Hackathon Concept Note & Technical Documentation
├── frontend/               # Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Shadcn UI
│   ├── app/                # Next.js App routes (Citizen, Check-Before-You-Buy, Mutation, Admin, etc.)
│   ├── components/         # Reusable UI components & layouts
│   ├── context/            # Language context (Bangla primary / English secondary)
│   ├── lib/                # Utility helpers & API client
│   └── types/              # TypeScript interface definitions
├── server/                 # Express.js REST API with TypeScript (tsx)
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/    # Parcels, Verification, Mutation, BayaChain, Liens, Auth
│   │   │   ├── middlewares/# Auth, Error handler, Rate limiting, Validation
│   │   │   └── routes/     # Centralized router
│   │   ├── data/           # Synthetic Bangladesh Land Dataset (anonymized dummy records)
│   │   └── server.ts       # Server entry point
├── package.json            # Root workspace script runner (concurrently)
└── README.md               # Project guide and documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on Node v22)
- npm (v9.0.0 or higher)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Utsho11/BhumiBandhan.git
cd BhumiBandhan
npm run postinstall
```

### Running Locally
Run both the frontend and backend concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend Express Server (Runs on http://localhost:5000)
npm run server

# Terminal 2: Frontend Next.js Client (Runs on http://localhost:3000)
npm run client
```

---

## 🛡️ Data Privacy & Ethical Compliance
In strict compliance with **Section 10 of the LandTech 2026 Rule Book**:
- **No real NID numbers, phone numbers, or actual citizen records are used.**
- All sample khatians, dags, and deed numbers are fully synthetic dummy data modeled accurately after Bangladeshi land records.
- All cryptographic tests run strictly within the local application boundary.

---

## 👥 Hackathon Team & Acknowledgments
- **Team Name:** Porcha Builder DIU
- **Affiliation:** Department of Computer Science & Engineering, Daffodil International University (DIU)
- **Supported by:** Department of Law, Daffodil International University
