# 🏛️ 7 RVPU Institute Chatbot System — Master Project Record & Tracker

> **Notice**: This file is the single source of truth for the RVPU multi-campus chatbot project. It is persistently stored in the workspace root to ensure complete state continuity across sessions, model changes, or context resets.

---

## 📌 1. Project Overview & Architecture

- **Client / Organization**: Rashtreeya Sikshana Samithi Trust (RSST) / RV Educational Institutions (RVEI)
- **Goal**: Develop and deploy high-performance, branded AI chatbots across all 7 RV Pre-University (PU) Colleges, complete with:
  1. Automated/Curated website content scrapers & knowledge bases.
  2. Front-end chatbot widgets embedded on college WordPress websites.
  3. **Dual-Write Architecture**: Telemetry & leads sent simultaneously to:
     - College WordPress REST API (MySQL)
     - Centralized Node.js / MongoDB Vercel Command Center Dashboard.
  4. Real-time analytics, lead tracking, conversation monitoring, and instant alerts.

---

## 📊 2. Institute Status Matrix

| # | Institute Name | Short Code | Official Website | Folder Name | Scraper / Raw Data | Knowledge Base | Chatbot Widget | Dual-Write Dashboard | Current Status |
|---|----------------|------------|------------------|-------------|:------------------:|:--------------:|:--------------:|:--------------------:|:--------------:|
| 1 | **RV PU College North** | RVPU North | `https://north.rvpucollege.edu.in/` | `rvpu-north-chatbot` | ✅ Complete | 🔄 Ready to build | ⏳ Pending | ⏳ Scaffolded | Scraped & Verified |
| 2 | **RV PU College South** | RVPU South | `https://south.rvpucollege.edu.in/` | `rvpu-south-chatbot` | ✅ Complete | 🔄 Ready to build | ⏳ Pending | ⏳ Scaffolded | Scraped & Verified |
| 3 | **RV PU College Electronic City** | RVPU E-City | `https://ecity.rvpucollege.edu.in/` | `rvpu-ecity-chatbot` | ✅ Complete | 🔄 Ready to build | ⏳ Pending | ⏳ Scaffolded | Scraped & Verified |
| 4 | **RV PU College Harohalli** | RVPU Harohalli | `https://hrh.rvpucollege.edu.in/` | `rvpu-harohalli-chatbot` | 🔄 In Progress | ⏳ Pending | ⏳ Pending | ⏳ Scaffolded | Active in Browser |
| 5 | **SSMRV PU College (Jayanagar)** | SSMRV PU | `https://ssmrvpu.edu.in/new_ssmrvpu/` | `ssmrvpu-chatbot` | 🔄 In Progress | ⏳ Pending | ⏳ Pending | ⏳ Scaffolded | Active in Browser |
| 6 | **RV PU College Mysore** | RVPU Mysore | `https://mysore.rvpucollege.edu.in/` | `rvpu-mysore-chatbot` | ⏳ Queued | ⏳ Pending | ⏳ Pending | ⏳ Scaffolded | Queued |
| 7 | **NMKRV PU College (Women)** | NMKRV PU | `https://nmkrvpuc.edu.in/` | `nmkrvpu-chatbot` | ⏳ Queued | ⏳ Pending | ⏳ Pending | ⏳ Scaffolded | Queued |

---

## 🛠️ 3. Detailed Progress by Institute

### 1. RV PU College North (`rvpu-north-chatbot`)
- **Status**: Scraped & Structured
- **Data File**: `rvpu-north-chatbot/raw-data/scraped-data.json`
- **Extracted Details**:
  - Campus: DPS Bengaluru North Campus, Sathnur Village, Bagalur Post, Off Bellary Road, Bengaluru – 562149
  - Contact: `+91-8073318582`, `info.rvpun@rvei.edu.in`
  - Principal: Mr. Kumar S.
  - Streams: Science (PCMB, PCMC), Commerce (BAMS, BAME, SEBA)
  - Brand Palette: Primary `#E30613`, Accent `#46B3CA`, Dark `#1F2430`
  - Admissions & Examination requirements documented.

### 2. RV PU College South (`rvpu-south-chatbot`)
- **Status**: Scraped & Structured
- **Data File**: `rvpu-south-chatbot/raw-data/scraped-data.json`
- **Extracted Details**:
  - Campus: DPS Bengaluru South Campus, Kanakapura Road, Konanakunte, Bengaluru – 560062
  - Contact: `+91-9606924466`, `+91-8050178394`, `info.rvpus@rvei.edu.in`
  - Principal: Mr. A.S. Venkatesan
  - Streams: Science (PCMB, PCMC), Commerce (BAMS, BAME, SEBA)
  - Admissions, documents, leadership team, and board rules documented.

### 3. RV PU College Electronic City (`rvpu-ecity-chatbot`)
- **Status**: Scraped & Structured
- **Data File**: `rvpu-ecity-chatbot/raw-data/scraped-data.json`
- **Extracted Details**:
  - Campus: Electronic City Phase 1, Bettadasanapura, Bengaluru
  - Streams: Science (PCMB, PCMC), Commerce combinations
  - Contact, leadership, facilities & admissions data captured.

### 4. RV PU College Harohalli (`rvpu-harohalli-chatbot`)
- **Status**: Active in Browser (`https://hrh.rvpucollege.edu.in/`)
- **Next Action**: Run scraper / extract structured institutional data (courses, combinations, eligibility, address, contact, fees, leadership) into `raw-data/scraped-data.json`.

### 5. SSMRV PU College (`ssmrvpu-chatbot`)
- **Status**: Active in Browser (`https://ssmrvpu.edu.in/new_ssmrvpu/`)
- **Next Action**: Scrape & parse pages into `raw-data/scraped-data.json`.

### 6. RV PU College Mysore (`rvpu-mysore-chatbot`)
- **Status**: Queued for scraping.

### 7. NMKRV PU College for Women (`nmkrvpu-chatbot`)
- **Status**: Queued for scraping.

---

## 🏛️ 4. System Architecture & Standards

### A. Dual-Write Telemetry Pattern
```
             ┌─────────────────────────┐
             │ RVPU Front-End Chatbot  │
             │     (telemetry.js)      │
             └───────────┬─────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
┌───────────────┐                 ┌───────────────┐
│ WordPress API │                 │ Vercel Backend│
│ (MySQL DB)    │                 │ (MongoDB Atlas│
│ /wp-json/v1/..│                 │ /api/telemetry│
└───────────────┘                 └───────────────┘
```
- **Key Normalization Rule**:
  - Node.js/Mongoose returns `createdAt` and `leadData`.
  - WordPress returns `timestamp` and `data`.
  - API responses in Node.js backend (`/api/dashboard/leads` & `/api/dashboard/interactions`) are normalized to output `timestamp` and `data` so the shared UI dashboard works seamlessly across both sources.

### B. UI/UX Standards (Command Center)
- **Aesthetic**: Deep dark command center (`#030712`), mesh subtle gradients, glassmorphism cards (`backdrop-filter: blur(12px)`).
- **Indicators**: Animated green pulse status for active nodes, streamlined metric cards, live lead tables with search & export.

---

## 📝 5. Activity Changelog

- **[Phase 1] Project Initialization**:
  - Initialized root project with `package.json` and scripts for all 7 institutes.
  - Established folder layout (`assets/`, `dashboard/`, `raw-data/`, `scraper/`) across all 7 chatbots.
- **[Phase 2] Data Scraping & Ingestion**:
  - `rvpu-north-chatbot`: Ingested verified college data into `raw-data/scraped-data.json`.
  - `rvpu-south-chatbot`: Ingested verified college data into `raw-data/scraped-data.json`.
  - `rvpu-ecity-chatbot`: Ingested verified college data into `raw-data/scraped-data.json`.
- **[Phase 3] Master Record Setup**:
  - Created `PROJECT_RECORD.md` to permanently preserve project status, architecture, and step-by-step progress.

---

## 🎯 6. Immediate Next Steps Roadmap

1. **Step 1**: Complete data extraction for **Harohalli** (`rvpu-harohalli-chatbot/raw-data/scraped-data.json`).
2. **Step 2**: Complete data extraction for **SSMRV PU** (`ssmrvpu-chatbot/raw-data/scraped-data.json`).
3. **Step 3**: Complete data extraction for **Mysore** and **NMKRV PU**.
4. **Step 4**: Build unified Chatbot Widget template with Dual-Write telemetry & college-specific color branding.
5. **Step 5**: Build and link the Node.js / MongoDB Vercel Command Center Dashboard.
