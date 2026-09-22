# 🏛️ 7 RVPU Institute Chatbot System — Master Project Record & Tracker

> **Notice**: This file is the single source of truth for the RVPU multi-campus chatbot project. It is persistently stored in the workspace root to ensure complete state continuity across sessions, model changes, or context resets.

---

## 📌 1. Project Overview & Architecture

- **Client / Organization**: Rashtreeya Sikshana Samithi Trust (RSST) / RV Educational Institutions (RVEI)
- **Goal**: Develop and deploy 7 high-performance, institute-specific branded AI chatbots across all 7 RV Pre-University (PU) Colleges:
  1. Full institutional data extraction & knowledge bases.
  2. Front-end chatbot widgets embedded on college WordPress websites.
  3. **Dual-Write Architecture**: Telemetry & leads sent simultaneously to:
     - College WordPress REST API (MySQL)
     - Centralized Node.js / MongoDB Vercel Command Center Dashboard.
  4. Real-time analytics, lead tracking, conversation monitoring, keyword quick buttons, and website navigation.

---

## 📊 2. Institute Status Matrix (Phase 1: 100% Complete)

| # | Institute Name | Short Code | Official Website | Folder Name | Scraper / Raw Data | Screen Recording Artifact | Knowledge Base | Chatbot Widget | Dual-Write Dashboard | Current Status |
|---|----------------|------------|------------------|-------------|:------------------:|:-------------------------:|:--------------:|:--------------:|:--------------------:|:--------------:|
| 1 | **RV PU College North** | RVPU North | `https://north.rvpucollege.edu.in/` | `rvpu-north-chatbot` | ✅ 100% | Captured | 🔄 Phase 2 | ⏳ Phase 3 | ⏳ Phase 5 | Ready for Phase 2 |
| 2 | **RV PU College South** | RVPU South | `https://south.rvpucollege.edu.in/` | `rvpu-south-chatbot` | ✅ 100% | Captured | 🔄 Phase 2 | ⏳ Phase 3 | ⏳ Phase 5 | Ready for Phase 2 |
| 3 | **RV PU College Electronic City** | RVPU E-City | `https://ecity.rvpucollege.edu.in/` | `rvpu-ecity-chatbot` | ✅ 100% | Captured | 🔄 Phase 2 | ⏳ Phase 3 | ⏳ Phase 5 | Ready for Phase 2 |
| 4 | **RV PU College Harohalli** | RVPU Harohalli | `https://hrh.rvpucollege.edu.in/` | `rvpu-harohalli-chatbot` | ✅ 100% | `harohalli_scrape` | 🔄 Phase 2 | ⏳ Phase 3 | ⏳ Phase 5 | Ready for Phase 2 |
| 5 | **SSMRV PU College (Jayanagar)** | SSMRV PU | `https://ssmrvpu.edu.in/new_ssmrvpu/` | `ssmrvpu-chatbot` | ✅ 100% | `harohalli_scrape` (Multi-tab) | 🔄 Phase 2 | ⏳ Phase 3 | ⏳ Phase 5 | Ready for Phase 2 |
| 6 | **RV PU College Mysuru** | RVPU Mysore | `https://mys.rvpucollege.edu.in/` | `rvpu-mysore-chatbot` | ✅ 100% | `mysore_scrape` | 🔄 Phase 2 | ⏳ Phase 3 | ⏳ Phase 5 | Ready for Phase 2 |
| 7 | **NMKRV PU College (Jayanagar)** | NMKRV PU | `https://www.nmkrvpu.edu.in/new_nmkrvpu/` | `nmkrvpu-chatbot` | ✅ 100% | `nmkrvpu_scrape` | 🔄 Phase 2 | ⏳ Phase 3 | ⏳ Phase 5 | Ready for Phase 2 |

---

## 🛠️ 3. Detailed Institutional Profiles & Extracted Data Summary

### 1. RV PU College North (`rvpu-north-chatbot`)
- **Campus**: DPS Bengaluru North Campus, Sathnur Village, Bagalur Post, Off Bellary Road, Bengaluru – 562149
- **Contact**: `+91-8073318582`, `info.rvpun@rvei.edu.in`
- **Principal**: Mr. Kumar S.
- **Streams**: Science (PCMB, PCMC), Commerce (BAMS, BAME, SEBA)
- **Palette**: Crimson Red (`#E30613`), Teal Accent (`#46B3CA`), Dark (`#1F2430`)
- **Data File**: `rvpu-north-chatbot/raw-data/scraped-data.json`

### 2. RV PU College South (`rvpu-south-chatbot`)
- **Campus**: DPS Bengaluru South Campus, 11th KM, Bikaspura Main Road, Kanakapura Road, Konanakunte, Bengaluru – 560062
- **Contact**: `+91-9606924466`, `+91-8050178394`, `info.rvpus@rvei.edu.in`
- **Principal**: Mr. A.S. Venkatesan
- **Streams**: Science (PCMB, PCMC), Commerce (BAMS, BAME, SEBA)
- **Palette**: Classic RV Red (`#E30613`), Cyan/Blue (`#46B3CA`)
- **Data File**: `rvpu-south-chatbot/raw-data/scraped-data.json`

### 3. RV PU College Electronic City (`rvpu-ecity-chatbot`)
- **Campus**: DPS E-City Campus, Survey No. 33, Bettadasanapura, Begur Hobli, Bengaluru – 560100
- **Contact**: `+91-90350 29237`, `info.rvpue@rvei.edu.in`
- **Principal**: Mr. Suman G.V.
- **Streams**: Science (PCMB, PCMC), Commerce (BAMS, BAME, SEBA)
- **Faculty**: 14 teaching staff documented across all subjects
- **Palette**: Navy / Crimson Red accent
- **Data File**: `rvpu-ecity-chatbot/raw-data/scraped-data.json`

### 4. RV PU College Harohalli (`rvpu-harohalli-chatbot`)
- **Campus**: Green Bell High Campus, #134/5, Medmaranahalli, Bade Sab Doddi Road, Harohalli Hobli, Kanakapura Taluk, Ramanagara District – 562109
- **Contact**: `+91-8317346585`, `+91-90359 74183`, `info.rvpuh@rvei.edu.in`
- **Principal**: Mr. Umesh K.N.
- **Streams**: Science (PCMB, PCMC), Commerce (BAMS, BAME, SEBA)
- **Faculty**: 14 teaching faculty members + administration staff
- **Palette**: Deep Navy (`#1B365D`), Gold/Mustard Accent (`#D89B27`), Charcoal (`#1C1C1C`)
- **Data File**: `rvpu-harohalli-chatbot/raw-data/scraped-data.json`
- **Recording**: `harohalli_scrape`

### 5. SSMRV Pre-University College (`ssmrvpu-chatbot`)
- **Campus**: 36th Cross, 4th 'T' Block, Jayanagar, Bengaluru – 560041
- **Contact**: `080-2244 3625`, `080-2244 3620`, `ssmrvpu@gmail.com`
- **Principal**: Dr. S. Anil Kumar (M.Com, M.Phil, Ph.D)
- **Streams**: Science (PCMB, PCMC), Commerce (SEBA, CEBA, MEBA, PEBA)
- **Special Coaching**: Integrated NEET, JEE Main/Advanced, KCET, CA/CS Foundation
- **Palette**: Deep Crimson Maroon (`#7A0000`), Metallic Gold (`#D4A017`), Pure White
- **Data File**: `ssmrvpu-chatbot/raw-data/scraped-data.json`

### 6. RV PU College Mysuru (`rvpu-mysore-chatbot`)
- **Campus**: DPS Mysuru Campus, Survey No. 119/1, Bannur Road, Bugathagalli, Mysuru – 570028
- **Contact**: `+91-9035974182`, `info.rvpum@rvei.edu.in`
- **Principal**: Mr. Ashwin Raj (Principal In-Charge)
- **Streams**: Science (PCMB, PCMC), Commerce (BAMS, BAME, SEBA)
- **Faculty**: 16 teaching faculty members + administration team
- **Palette**: RV Crimson Red (`#E30613`), Cyan Accent (`#46B3CA`), Charcoal (`#1F2430`)
- **Data File**: `rvpu-mysore-chatbot/raw-data/scraped-data.json`
- **Recording**: `mysore_scrape`

### 7. NMKRV Pre-University College (`nmkrvpu-chatbot`)
- **Campus**: Jayanagar, Bengaluru (RSST Campus) / Sathnur Village, Bengaluru
- **Contact**: `080 69018950`, `info.nmkrvpu@rvei.edu.in`
- **Principal**: Mrs. Sheela Prakash S.N.
- **Streams**: Science (PCMB, PCMC), Commerce (BAMS, BAME, SEBA)
- **Admissions Portal**: `https://admissions.rvlearninghub.com/`
- **Palette**: Warm Orange/Amber (`#EE9B54`), Bright Gold (`#F5C155`), Cream/Off-White (`#F8F6F0`)
- **Data File**: `nmkrvpu-chatbot/raw-data/scraped-data.json`
- **Recording**: `nmkrvpu_scrape`

---

## 🏛️ 4. Master Architectural Blueprint

### A. Dual-Write Telemetry Flow
```
               ┌───────────────────────────────┐
               │    RVPU Front-End Chatbot     │
               │         (telemetry.js)        │
               └───────────────┬───────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   ┌─────────────────┐                  ┌───────────────────┐
   │  WordPress API  │                  │  Vercel Backend   │
   │   (MySQL DB)    │                  │  (MongoDB Atlas)  │
   │  /wp-json/v1/.. │                  │  /api/telemetry   │
   └─────────────────┘                  └───────────────────┘
```

### B. Core Principles & Algorithms
1. **Key Normalization**: MongoDB returns `createdAt`/`leadData`, WordPress returns `timestamp`/`data`. All backend endpoints normalize into `timestamp` and `data`.
2. **Intent Scoring & Matching**:
   - Tokenization, stop-word removal, n-gram stemming.
   - Weighted cosine/TF-IDF similarity with priority boosts on institutional keywords (combinations, admissions, cutoff, fees, contact, principal).
3. **Interactive Quick-Action Chips**:
   - Dynamic buttons rendered below bot messages (`Courses & Streams`, `Admission Process`, `Eligibility & Cutoffs`, `Campus Facilities`, `Contact & Location`, `Direct Navigation`).
4. **Website Page Navigation**:
   - Chatbot intercepts navigation requests (e.g. *"take me to admission page"*, *"open facilities"*, *"go to courses"*) and provides instant one-click direct deep-links or automatic browser redirect.

---

## 📝 5. Changelog & Commits

- **[Commit 1 - df19155]**: Initialized Git repo, established 7 chatbot directories, captured North, South, E-City data.
- **[Commit 2 - Phase 1 Completion]**:
  - Captured & structured complete institutional dataset for **Harohalli** (`rvpu-harohalli-chatbot/raw-data/scraped-data.json`) with screen recording `harohalli_scrape`.
  - Captured & structured complete institutional dataset for **SSMRV PU** (`ssmrvpu-chatbot/raw-data/scraped-data.json`).
  - Captured & structured complete institutional dataset for **Mysuru** (`rvpu-mysore-chatbot/raw-data/scraped-data.json`) with screen recording `mysore_scrape`.
  - Captured & structured complete institutional dataset for **NMKRV PU** (`nmkrvpu-chatbot/raw-data/scraped-data.json`) with screen recording `nmkrvpu_scrape`.
  - Updated `PROJECT_RECORD.md` with complete Phase 1 records.

---

## 🎯 6. Phase Execution Roadmap

- [x] **Phase 1**: Separate folder for each institute, browse/screen record all pages, extract complete data into `scraped-data.json`.
- [ ] **Phase 2**: Process data, extract and store keywords, build RVCE-style matching algorithm and knowledge bases for all 7 institutes.
- [ ] **Phase 3**: Custom branded UI widgets matching exact website color schemes for each college.
- [ ] **Phase 4**: Universal Q&A coverage (answers every possible student/parent query) + direct website page navigation.
- [ ] **Phase 5**: Independent Command Center Dashboards for all 7 colleges (Dual-write telemetry, leads, interactions).
- [ ] **Phase 6**: Production deployment readiness, end-to-end testing & validation.
