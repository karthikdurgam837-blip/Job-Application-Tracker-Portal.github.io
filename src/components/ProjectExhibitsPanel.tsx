/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Terminal, ShieldCheck, Cpu, Code2, Layers, BookOpen, 
  ChevronRight, CalendarCheck2, Star, Check 
} from "lucide-react";

export default function ProjectExhibitsPanel() {
  const [activeTab, setActiveTab] = useState<"explanation" | "tech" | "architecture" | "folders" | "build">("explanation");

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl p-6 font-sans">
      <div className="border-b border-slate-700 pb-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">System Architecture & Resources</h2>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Interactive developer blueprint, architectural flow diagrams, database schema catalog, and workspace details.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700/50 pb-3">
        {[
          { id: "explanation", label: "System Overview" },
          { id: "tech", label: "Tech Stack Blueprint" },
          { id: "architecture", label: "System Architecture" },
          { id: "folders", label: "Repository Structure" },
          { id: "build", label: "Lifecycle Milestones" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === t.id
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "explanation" && (
        <div className="space-y-4 text-sm text-slate-300 animate-fadeIn">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono mb-2">
                Simple Non-Technical Explanation
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                A <strong>Job Application Tracker Portal</strong> is like a smart digital assistant for job hunters. Instead of writing company details, salaries, and phone numbers in messy notebooks or static spreadsheets, you log in to this clean digital registry. You can see which jobs are in progress (Applied, Interview, Offer, Rejected), checklist what needs to be solved next, and check if your resume matches what the job demands.
              </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest font-mono mb-2">
                Technical Software Explanation
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                It is a production-grade <strong>three-tier client-server system</strong>. The user-interface is a responsive single page app (SPA) capturing stateful records. The backend middleware authenticates candidates via Stateless JWT tokens and implements secure REST CRUD APIs. A file-based persistent JSON Database on disk handles structured storage, coupled with an AI matching engine powered by server-side <strong>Google Gemini API</strong> for semantic key terms parsing and automated ATS evaluation.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Why is this useful?
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono font-bold mt-0.5">✔ Job Seekers:</span>
                Never miss a coding test, follow-up, or interview schedule. Everything is in one board.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono font-bold mt-0.5">✔ Talent Teams:</span>
                Aggregate candidate profiles, interview conversion velocities, and analytics.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono font-bold mt-0.5">✔ Candidates:</span>
                Optimize resumes for target vacancies using Google Gemini’s keyword assistant.
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "tech" && (
        <div className="space-y-4 text-xs animate-fadeIn text-slate-300">
          <p className="text-slate-400 mb-2 font-mono text-[11px]">
            Comparison matrix of engineering stacks for career companion applications:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Simple */}
            <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/40 relative">
              <span className="absolute -top-2.5 right-3 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold border border-blue-500/20">
                Option A - Basic
              </span>
              <h4 className="text-sm font-bold text-white mb-1.5 font-sans">Client-Side Storage Only</h4>
              <p className="text-slate-400 mb-3 text-[11px]">Best for static pages. Hard to scale, lacks server security.</p>
              <ul className="space-y-1 font-mono text-slate-400">
                <li>• React SPA UI (Vite)</li>
                <li>• Tailwind CSS Styling</li>
                <li>• No backend architecture</li>
                <li>• LocalStorage database</li>
                <li>• No Google AI modules</li>
              </ul>
            </div>

            {/* Selected */}
            <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/40 relative ring-1 ring-indigo-500/30">
              <span className="absolute -top-2.5 right-3 bg-indigo-500 text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                Selected (MERN Framework)
              </span>
              <h4 className="text-sm font-bold text-indigo-300 mb-1.5 font-sans">Full Stack Node & REST</h4>
              <p className="text-indigo-200/75 mb-3 text-[11px]">Industry standard. Decoupled, production-ready fullstack schema.</p>
              <ul className="space-y-1 font-mono text-indigo-300">
                <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-400" /> React State Hook UI</li>
                <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-400" /> Node / Express Server</li>
                <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-400" /> Persistent JSON DB on Server</li>
                <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-400" /> Stateless Bearer Auth</li>
                <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-400" /> server-side @google/genai</li>
              </ul>
            </div>

            {/* Advanced */}
            <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/40 relative">
              <span className="absolute -top-2.5 right-3 bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold border border-purple-500/20">
                Option C - Complex
              </span>
              <h4 className="text-sm font-bold text-white mb-1.5 font-sans">Distributed Orchestration</h4>
              <p className="text-slate-400 mb-3 text-[11px]">Highly complex system with messaging queues and microservices.</p>
              <ul className="space-y-1 font-mono text-slate-400">
                <li>• Next.js Framework</li>
                <li>• SQLite / PostgreSQL RDS</li>
                <li>• Redis + BullMQ jobs scheduler</li>
                <li>• Python FastAPI scraper</li>
                <li>• MinIO S3 Object storage</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "architecture" && (
        <div className="space-y-4 animate-fadeIn text-slate-300">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/60 flex flex-col items-center">
            <h4 className="text-xs font-mono uppercase text-indigo-400 mb-3 self-start">Interactive Architectural Blueprint</h4>
            
            {/* SVG Visual Flow Diagram */}
            <svg viewBox="0 0 720 280" className="w-full max-w-2xl bg-slate-950 p-4 rounded-lg border border-slate-800">
              {/* Client Box */}
              <rect x="20" y="80" width="160" height="120" rx="8" fill="#1e1e38" stroke="#6366f1" strokeWidth="2" />
              <text x="100" y="115" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13" fontFamily="sans-serif">Candidate SPA UI</text>
              <text x="100" y="135" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">React • Tailwind CSS</text>
              <text x="100" y="155" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">Recharts Rendering</text>
              <text x="100" y="175" textAnchor="middle" fill="#818cf8" fontSize="10" fontFamily="monospace">Bearer user auth token</text>

              {/* Client to API Arrows */}
              <line x1="180" y1="120" x2="300" y2="120" stroke="#6366f1" strokeWidth="2" strokeDasharray="3" />
              <polygon points="300,120 292,116 292,124" fill="#6366f1" />
              <text x="240" y="110" textAnchor="middle" fill="#818cf8" fontSize="10" fontFamily="monospace">CRUD JSON/REST</text>

              <line x1="300" y1="160" x2="180" y2="160" stroke="#10b981" strokeWidth="2" />
              <polygon points="180,160 188,156 188,164" fill="#10b981" />
              <text x="240" y="180" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace">JSON response</text>

              {/* Server Express Box */}
              <rect x="300" y="40" width="180" height="200" rx="8" fill="#112240" stroke="#0ea5e9" strokeWidth="2" />
              <text x="390" y="75" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13" fontFamily="sans-serif">Express Backend</text>
              <text x="390" y="95" textAnchor="middle" fill="#01ebff" fontSize="10" fontFamily="monospace">Node.js Middleware</text>
              {/* Server Details */}
              <rect x="315" y="115" width="150" height="30" rx="4" fill="#172a45" stroke="#38bdf8" strokeWidth="1" />
              <text x="390" y="133" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">JWT Session Auth</text>
              
              <rect x="315" y="155" width="150" height="30" rx="4" fill="#172a45" stroke="#38bdf8" strokeWidth="1" />
              <text x="390" y="173" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">CSV/ICS Generators</text>

              <rect x="315" y="195" width="150" height="30" rx="4" fill="#172a45" stroke="#38bdf8" strokeWidth="1" />
              <text x="390" y="213" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">Vite Dev Proxy Module</text>

              {/* Express to DB Arrow */}
              <line x1="390" y1="240" x2="390" y2="260" stroke="#34d399" strokeWidth="1" />
              <path d="M 480 120 L 540 80" stroke="#818cf8" strokeWidth="2" strokeDasharray="2" />
              <polygon points="540,80 531,82 535,88" fill="#818cf8" />
              <text x="515" y="90" textAnchor="middle" fill="#e0e7ff" fontSize="9" fontFamily="monospace">Google SDK API</text>

              <path d="M 480 160 L 540 190" stroke="#34d399" strokeWidth="2" />
              <polygon points="540,190 531,189 536,183" fill="#34d399" />
              <text x="510" y="170" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontFamily="monospace">Direct Sync write</text>

              {/* Database Cylinder */}
              <path d="M 540 180 C 540 170, 640 170, 640 180 L 640 230 C 640 240, 540 240, 540 230 Z" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
              <path d="M 540 180 C 540 190, 640 190, 640 180" fill="none" stroke="#10b981" strokeWidth="2" />
              <text x="590" y="210" textAnchor="middle" fill="#34d399" fontWeight="bold" fontSize="11" fontFamily="sans-serif">JSON Local DB</text>
              <text x="590" y="225" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">/data/db.json</text>

              {/* Gemini AI Box */}
              <rect x="540" y="40" width="100" height="70" rx="6" fill="#311042" stroke="#a21caf" strokeWidth="2" />
              <text x="590" y="70" textAnchor="middle" fill="#f472b6" fontWeight="bold" fontSize="11" fontFamily="sans-serif">Gemini AI</text>
              <text x="590" y="85" textAnchor="middle" fill="#f472b6" fontSize="9" fontFamily="monospace">3.5-flash</text>
              <text x="590" y="98" textAnchor="middle" fill="#d946ef" fontSize="8" fontFamily="monospace">User resume tailor</text>
            </svg>

            <div className="mt-4 self-start text-[11px] leading-relaxed text-slate-400 font-mono">
              <span className="text-white font-bold">Flow description:</span> On adding/updating, Client dispatches structured candidate requests. The endpoint filters JWT identifiers & loads/saves records to structural db.json. On running tailoring audits, Node calls Google GenAI, parses JSON replies safely, and returns detailed matching telemetry back into the state view.
            </div>
          </div>
        </div>
      )}

      {activeTab === "folders" && (
        <div className="space-y-4 animate-fadeIn text-slate-300">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/60 font-mono text-xs">
            <h4 className="text-sm font-bold text-white mb-2 pb-1 border-b border-slate-800">Complete Structured Project Tree</h4>
            <div className="space-y-1">
              <div className="text-emerald-400">📄 package.json <span className="text-slate-500 font-sans text-[11px]">— coupled fullstack scripts + dependencies</span></div>
              <div className="text-emerald-400">📄 server.ts <span className="text-slate-500 font-sans text-[11px]">— REST APIs, Authentication, Gemini client & data server</span></div>
              <div className="text-emerald-400">📁 data/</div>
              <div className="text-slate-400">└── 📄 db.json <span className="text-slate-500 font-sans text-[11px]">— file-based relational on-disk simulation datastore</span></div>
              <div className="text-indigo-400">📁 src/</div>
              <div className="text-slate-300">├── 📄 main.tsx <span className="text-slate-500 font-sans text-[11px]">— DOM node mounting injection</span></div>
              <div className="text-slate-300">├── 📄 index.css <span className="text-slate-500 font-sans text-[11px]">— global Tailwind compiler import directive</span></div>
              <div className="text-slate-300">├── 📄 types.ts <span className="text-slate-500 font-sans text-[11px]">— Shared student TypeScript interfaces and stages</span></div>
              <div className="text-indigo-400">└── 📁 components/</div>
              <div className="text-slate-300">    ├── 📄 LoginScreen.tsx <span className="text-slate-500 font-sans text-[11px]">— secure onboarding & sandbox bypass</span></div>
              <div className="text-slate-300">    ├── 📄 ProjectExhibitsPanel.tsx <span className="text-slate-500 font-sans text-[11px]">— Coursework details & layout charts (You are here)</span></div>
              <div className="text-slate-300">    ├── 📄 InterviewPrepPanel.tsx <span className="text-slate-500 font-sans text-[11px]">— 10 mock Q&A with real speaking tools</span></div>
              <div className="text-slate-300">    ├── 📄 KanbanBoard.tsx <span className="text-slate-500 font-sans text-[11px]">— stages pipelines grid drag & drop</span></div>
              <div className="text-slate-300">    ├── 📄 AnalyticsDashboard.tsx <span className="text-slate-500 font-sans text-[11px]">— analytics conversion metrics, timeline graphs</span></div>
              <div className="text-slate-300">    └── 📄 ApplicationDetailDrawer.tsx <span className="text-slate-500 font-sans text-[11px]">— smart resumes matcher, tasks ICS, contacts, notes planner</span></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "build" && (
        <div className="space-y-4 animate-fadeIn text-slate-300">
          <h4 className="text-xs font-mono uppercase text-indigo-400">Development Lifecycle Milestones</h4>
          <div className="relative border-l border-slate-700 pl-4 ml-2 space-y-4 text-xs">
            <div className="relative">
              <span className="absolute -left-[21px] top-1 bg-indigo-600 rounded-full w-2.5 h-2.5 ring-4 ring-slate-800" />
              <div className="font-bold text-white">Day 1: Base Client Scaffolding & Configs</div>
              <p className="text-slate-400 text-[11px]">Installed Tailwind, created metadata, designed TypeScript contracts on types.ts, set up login layouts.</p>
              <span className="text-[10px] font-mono bg-indigo-505/10 text-indigo-400 px-1 rounded block mt-1 w-max">git commit: "chore: init client models"</span>
            </div>
            
            <div className="relative">
              <span className="absolute -left-[21px] top-1 bg-indigo-600 rounded-full w-2.5 h-2.5 ring-4 ring-slate-800" />
              <div className="font-bold text-white">Day 2: Express Server Setup</div>
              <p className="text-slate-400 text-[11px]">Coded server.ts middleware, local on-disk structural json file datastore, and stateless Bearer authorization middleware.</p>
              <span className="text-[10px] font-mono bg-indigo-505/10 text-indigo-400 px-1 rounded block mt-1 w-max">git commit: "feat: initialize backend engine"</span>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-1 bg-indigo-600 rounded-full w-2.5 h-2.5 ring-4 ring-slate-800" />
              <div className="font-bold text-white">Day 3: Application Grid pipelines & filter layouts</div>
              <p className="text-slate-400 text-[11px]">Constructed status column board. Connected add application API parameters and responsive filtering controls.</p>
              <span className="text-[10px] font-mono bg-indigo-505/10 text-indigo-400 px-1 rounded block mt-1 w-max">git commit: "feat: render status columns workspace"</span>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-1 bg-indigo-600 rounded-full w-2.5 h-2.5 ring-4 ring-slate-800" />
              <div className="font-bold text-white">Day 4: Gemini resume tailor integrations</div>
              <p className="text-slate-400 text-[11px]">Coded the LLM prompt. Integrated @google/genai module inside the server to evaluate resume fitness and output missing keywords.</p>
              <span className="text-[10px] font-mono bg-indigo-505/10 text-indigo-400 px-1 rounded block mt-1 w-max">git commit: "feat: implement gemini ats check"</span>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-1 bg-indigo-600 rounded-full w-2.5 h-2.5 ring-4 ring-slate-800" />
              <div className="font-bold text-white">Day 5: Tasks Checklists, Calendars & Reports</div>
              <p className="text-slate-400 text-[11px]">Created custom dynamic SVG metrics charts. Integrated calendar export endpoint returning standard compiled .ics files.</p>
              <span className="text-[10px] font-mono bg-indigo-505/10 text-indigo-400 px-1 rounded block mt-1 w-max">git commit: "feat: construct analytics reports"</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
