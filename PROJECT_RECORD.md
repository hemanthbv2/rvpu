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
  4. Real-time analytics, lead tracking, conversation monitoring, keyword quick buttons, and direct website navigation.

---

## 📊 2. Institute Status Matrix

| # | Institute Name | Short Code | Official Website | Folder Name | Phase 1: Data Extraction | Phase 2: KB & Matching Engine | Phase 3: Branded UI Widget | Phase 5: Dual-Write Dashboard | Current Status |
|---|----------------|------------|------------------|-------------|:------------------------:|:-----------------------------:|:--------------------------:|:-----------------------------:|:--------------:|
| 1 | **RV PU College North** | RVPU North | `https://north.rvpucollege.edu.in/` | `rvpu-north-chatbot` | ✅ 100% | ✅ 100% (143 Keywords) | ✅ Complete | ✅ Port 3001 | ✅ Production Ready |
| 2 | **RV PU College South** | RVPU South | `https://south.rvpucollege.edu.in/` | `rvpu-south-chatbot` | ✅ 100% | ✅ 100% (143 Keywords) | ✅ Complete | ✅ Port 3002 | ✅ Production Ready |
| 3 | **RV PU College Electronic City** | RVPU E-City | `https://ecity.rvpucollege.edu.in/` | `rvpu-ecity-chatbot` | ✅ 100% | ✅ 100% (143 Keywords) | ✅ Complete | ✅ Port 3003 | ✅ Production Ready |
| 4 | **RV PU College Harohalli** | RVPU Harohalli | `https://hrh.rvpucollege.edu.in/` | `rvpu-harohalli-chatbot` | ✅ 100% | ✅ 100% (143 Keywords) | ✅ Complete | ✅ Port 3004 | ✅ Production Ready |
| 5 | **SSMRV PU College (Jayanagar)** | SSMRV PU | `https://ssmrvpu.edu.in/new_ssmrvpu/` | `ssmrvpu-chatbot` | ✅ 100% | ✅ 100% (143 Keywords) | ✅ Complete | ✅ Port 3006 | ✅ Production Ready |
| 6 | **RV PU College Mysuru** | RVPU Mysore | `https://mys.rvpucollege.edu.in/` | `rvpu-mysore-chatbot` | ✅ 100% | ✅ 100% (143 Keywords) | ✅ Complete | ✅ Port 3005 | ✅ Production Ready |
| 7 | **NMKRV PU College (Jayanagar)** | NMKRV PU | `https://www.nmkrvpu.edu.in/new_nmkrvpu/` | `nmkrvpu-chatbot` | ✅ 100% | ✅ 100% (143 Keywords) | ✅ Complete | ✅ Port 3007 | ✅ Production Ready |

---

## 🛠️ 3. Phase 2 Deliverables: Knowledge Base & RVCE Matching Engine

Every single institute folder now possesses:
1. `assets/knowledge-base.json`:
   - 12 comprehensive intent categories (General, Academics, Science Combinations, Commerce Combinations, Languages, Admissions Process, Required Documents, Cutoffs/Eligibility, Leadership/Principal, Facilities, Contact/Timings, Direct Website Navigation).
   - Instant quick-action chips for follow-up questions.
   - Deep links directly into college-specific pages.
2. `assets/keywords.json`:
   - 140+ curated indexed keywords with intent weights.
3. `assets/chatbot-engine.js`:
   - NLP tokenizer with stop-word filtration.
   - Phrase & exact substring matching bonus (5x multiplier).
   - Token & fuzzy prefix matching.
   - Direct website navigation interception (e.g. *"take me to admission page"*, *"open courses"*).
   - Dual-write telemetry ready hooks.

---

## 🎨 4. Extracted Color Palettes for Phase 3 UI Theming

| Institute | Primary Color | Secondary / Dark | Accent Color | Light / Card Background |
|---|:---:|:---:|:---:|:---:|
| **RVPU North** | `#E30613` (Crimson) | `#1F2430` | `#46B3CA` (Cyan) | `#F9FAFB` |
| **RVPU South** | `#E30613` (Crimson) | `#1E1E1E` | `#46B3CA` (Cyan) | `#F4F4F4` |
| **RVPU E-City** | `#E30613` (Crimson) | `#1A1A1A` | `#46B3CA` (Cyan) | `#F8F9FA` |
| **RVPU Harohalli** | `#1B365D` (Navy Blue) | `#1C1C1C` | `#D89B27` (Gold/Mustard) | `#F9FAFB` |
| **SSMRV PU** | `#7A0000` (Deep Maroon) | `#1A1A1A` | `#D4A017` (Gold) | `#FFFFFF` |
| **RVPU Mysore** | `#E30613` (Crimson) | `#1F2430` | `#46B3CA` (Cyan) | `#F9FAFB` |
| **NMKRV PU** | `#EE9B54` (Amber/Orange) | `#1E1E1E` | `#F5C155` (Gold) | `#F8F6F0` |

---

## 📝 5. Changelog & Commits

- **[Commit 1 - df19155]**: Initialized Git repo, established 7 chatbot directories, captured North, South, E-City data.
- **[Commit 2 - 5f1ceb2]**: Completed Phase 1 data extraction and screen recordings for all 7 RVPU institutes.
- **[Commit 3 - 570e77b]**:
  - Built automated generator `build-phase2.js` compiling knowledge bases, keywords, and RVCE matching engines.
  - Generated `assets/knowledge-base.json`, `assets/keywords.json`, and `assets/chatbot-engine.js` across all 7 institutes.
  - Added automated test suite `test-engines.js` verifying intent recognition, quick chips, and navigation routing.
- **[Commit 4 - Phase 3-6 Completion]**:
  - **Phase 3**: Built `build-phase3.js` generating `chatbot-widget.css`, `chatbot-widget.js`, and `index.html` for all 7 institutes with website color theming.
  - **Phase 4**: Created `test-phase4.js` — 217/217 queries matched across 7 institutes (100% intent coverage, 0 fallbacks).
  - **Phase 5**: Built `build-phase5.js` generating standalone `dashboard/server.js` + Command Center UIs (HTML/CSS/JS) for all 7 institutes on ports 3001-3007.
  - **Phase 6**: Created `test-phase6-final.js` — 770/770 production readiness checks passed (100.00% pass rate).
  - Enriched scraped data: Added faculty data for RVPU North (15 staff), SSMRV PU (19 staff + principal), and NMKRV PU. Updated page URLs.

---

## 🎯 6. Phase Execution Roadmap

- [x] **Phase 1**: Separate folder for each institute, browse/screen record all pages, extract complete data into `scraped-data.json`.
- [x] **Phase 2**: Process data, extract and store keywords, build RVCE-style matching algorithm and knowledge bases for all 7 institutes.
- [x] **Phase 3**: Custom branded UI widgets matching exact website color schemes for each college.
- [x] **Phase 4**: Universal Q&A coverage testing + interactive website navigation features. (217/217 = 100%)
- [x] **Phase 5**: Independent Command Center Dashboards for all 7 colleges (Dual-write telemetry, leads, interactions).
- [x] **Phase 6**: Production deployment readiness, end-to-end testing & validation. (770/770 = 100%)
