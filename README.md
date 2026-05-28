# Job Application Tracker Portal 💼📈

A modern, high-fidelity, full-stack application portal designed for students and job seekers to organize, schedule, and optimize active recruitment cycles. 

Featuring interactive Kanban status columns, dynamic conversion funnels, and scheduled checklists, it is supercharged with a server-side **Google Gemini ATS Smart Resume Analyzer** which identifies skill gaps and structures tailoring directives dynamically.

---

## 🚀 1. Project Explanation & Problem Statement

### The Problem
During job application season, candidates and placement students apply to dozens of roles across LinkedIn, careers websites, and referral portals. Juggling these leads to:
* **Disorganized records:** Deadlines slippings, interview dates forgot, and lack of follow-up.
* **Resume disconnect:** ATS (Automated Applicant Tracking Systems) reject standard resumes because candidates fail to match critical job description keywords.
* **Blindspot metrics:** No clear understanding of pipeline conversion rate (e.g., Application → Intern Screen → Technical Interview → Selection Offer).

### The Solution: Job Application Tracker Portal
An industry-aligned, structured portfolio tracking grid. It teaches candidate discipline by centralizing recruiters' contact directories, checklist milestones, call logs, and resume iterations, with live analytics.

---

## 🛠 2. Tech Stack Setup (Coupled Architecture)

* **Frontend:** React 19 Client SPA built with Vite and Tailwind CSS.
* **Server Middleware:** Node.js + Express.js APIs configured for Stateless Bearer Session tokens.
* **Database Datastore:** Self-contained, file-based relational simulation storage saved to `data/db.json` on disk.
* **AI Engine:** `@google/genai` coupled server-side with `gemini-3.5-flash` for intelligent keywords tailoring.
* **Build Bundler:** `esbuild` for CJS production compiling.

---

## 📂 3. Repository Folder Structure

```
Job-Application-Tracker-Portal/
│
├── data/
│   └── db.json                 # Core persistent relational datastore
│
├── src/
│   ├── components/
│   │   ├── AnalyticsDashboard.tsx      # SVG timeline and funnel visualizers
│   │   ├── ApplicationDetailDrawer.tsx # Smart resume tailor, contacts, tasks
│   │   ├── InterviewPrepPanel.tsx      # 10 Questions with speaking simulators
│   │   ├── KanbanBoard.tsx             # Interactive drag-stage pipeline grid
│   │   ├── LoginScreen.tsx             # Candidate login & session onboarding
│   │   └── ProjectExhibitsPanel.tsx    # Interactive architecture blueprints
│   │
│   ├── App.tsx                 # Core app workspace manager navigation
│   ├── index.css               # Tailwind compiler directives
│   ├── main.tsx                # Client virtual DOM registration entry
│   └── types.ts                # Candidate model interfaces & enum contracts
│
├── server.ts                   # Backend Express Routing, Auth Middleware & Gemini Controller
├── package.json                # Bundling scripts and framework dependencies
└── README.md                   # Full Portfolio Documentation Brief
```

---

## 🗺 4. Technical System Architecture

```
                       ┌────────────────────────────────┐
                       │      Candidate React SPA       │
                       │     (Vite + Tailwind CSS)      │
                       └───────────────┬────────────────┘
                                       │ Bearer Header token (stateless auth)
                                       ▼
                       ┌────────────────────────────────┐
                       │     Express Backend Server     │
                       │      (Port 3000 Node.js)       │
                       └──────┬─────────────────┬───────┘
                              │                 │
              Direct Write    │                 │  SDK Call
             (Synchronized)   ▼                 ▼
          ┌──────────────────────┐   ┌──────────────────────┐
          │  Local File Database │   │   Google Gemini AI   │
          │    (data/db.json)    │   │  (gemini-3.5-flash)  │
          └──────────────────────┘   └──────────────────────┘
```

---

## 📡 5. Centralized API Routing Blueprint

### Authentication Endpoints
* `POST /api/auth/register` - Create record credentials.
* `POST /api/auth/login` - Verify password, return stateless bearer ID token.

### Job Applications Pipeline Endpoints
* `GET /api/applications` - Fetch active user job application grids.
* `POST /api/applications` - Catalog new job details.
* `PUT /api/applications/:id` - Full registry update.
* `PATCH /api/applications/:id/stage` - Quick adjust columns.
* `DELETE /api/applications/:id` - Complete opportunity eradication.

### Details & Helpers Endpoints
* `POST /api/applications/:id/tailor` - Server-side Gemini tailoring evaluator.
* `POST /api/applications/:id/tasks` - Add checklist.
* `PATCH /api/applications/:id/tasks/:taskId` - Complete checkbox.
* `POST /api/applications/:id/contacts` - Save referral info.
* `POST /api/applications/:id/notes` - Write call logs.
* `GET /api/applications/ics-export/:appId/:taskId` - Create iCalendar `.ics` file formatting.
* `GET /api/applications-csv` - Export structured dataset to CSV.
* `POST /api/applications/pasted-import` - Paste job description parser helper.

---

## 🏃 6. How To Launch Local Server

### 1. Configure Secrets Environment
Store your key in a `.env` file at root level:
```env
GEMINI_API_KEY="YOUR_ACTUAL_GOOGLE_STUDIO_SECRETS_KEY"
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Launch Live Dev Server
```bash
npm run dev
```
Open browser tabs to `http://localhost:3000` to interact with our portal.

---

## 💡 7. Practice Virtual Simulation Guides

1. **One-Click Sandbox Login**: On the landing page, click `One-Click Sandbox Demo Mode` to instantly authenticate as `karthikdurgam837@gmail.com`. This populates the DB with Google, Stripe, Meta, and Netflix mock applications.
2. **Move Board Pipeline**: Click target arrow buttons on application cards to advance items forward (e.g. Meta from *OA* to *Technical Interview*), observe status change on the grid.
3. **ATS Fit Analytics**: Double-click Stripe, paste a resume, and click **Tailor Resume with Gemini**. The matching percentage and recommendations list will update immediately.
4. **Download ICS Calendar Reminders**: Choose **Tasks Checklist**, create an interview milestone, and click the calendar icon to download a `.ics` file. Import it directly into Google Calendar or Outlook!
5. **CSV Database Export**: Choose **Export CSV** at the top right to analyze your dataset in Excel spreadsheets.
