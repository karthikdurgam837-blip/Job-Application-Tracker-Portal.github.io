/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { 
  Plus, Search, Briefcase, DollarSign, Calendar, MapPin, 
  Trash2, SlidersHorizontal, ArrowRight, ArrowLeft, ExternalLink,
  ChevronRight, Sparkles, FolderDown, ArrowUpRight 
} from "lucide-react";
import { JobApplication, ApplicationStage } from "../types";

interface KanbanProps {
  applications: JobApplication[];
  userId: string;
  onSelectApplication: (app: JobApplication) => void;
  onRefresh: () => void;
}

const STAGES = [
  { id: ApplicationStage.SAVED, label: "Saved Jobs", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { id: ApplicationStage.APPLIED, label: "Applied", color: "bg-indigo-505/10 text-indigo-400 border-indigo-500/20" },
  { id: ApplicationStage.OA, label: "Assessments (OA)", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { id: ApplicationStage.SCREEN, label: "HR Screens", color: "bg-cyan-505/10 text-cyan-400 border-cyan-500/20" },
  { id: ApplicationStage.TECH, label: "Technical Rds.", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { id: ApplicationStage.HM, label: "Hiring Manager", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  { id: ApplicationStage.OFFER, label: "Offers Secured", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse" },
  { id: ApplicationStage.REJECTED, label: "Rejections", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
];

export default function KanbanBoard({ applications, userId, onSelectApplication, onRefresh }: KanbanProps) {
  const [search, setSearch] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // New Application Form State
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [salaryNote, setSalaryNote] = useState("");
  const [stage, setStage] = useState<ApplicationStage>(ApplicationStage.SAVED);
  const [jdText, setJdText] = useState("");
  const [statusNote, setStatusNote] = useState("");

  const [formLoading, setFormLoading] = useState(false);

  // Paste / Drag quick parser helper
  const [bulkText, setBulkText] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  // Filter application cards
  const filteredApps = applications.filter(app => {
    const query = search.toLowerCase();
    const skillsQuery = skillsFilter.toLowerCase();
    
    const matchesGeneral = 
      app.companyName.toLowerCase().includes(query) ||
      app.roleTitle.toLowerCase().includes(query) ||
      (app.location || "").toLowerCase().includes(query) ||
      (app.source || "").toLowerCase().includes(query);

    const matchesSkills = 
      skillsQuery === "" || 
      app.skills.some(s => s.toLowerCase().includes(skillsQuery));

    return matchesGeneral && matchesSkills;
  });

  // Action: Add new application
  async function handleAddApp(e: FormEvent) {
    e.preventDefault();
    if (!companyName || !roleTitle) return;

    setFormLoading(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({
          companyName,
          roleTitle,
          location,
          source,
          url,
          salaryNote,
          stage,
          jdText,
          statusNote: statusNote || `Created with initial stage focus to: ${stage}.`
        })
      });

      if (response.ok) {
        // Reset
        setCompanyName("");
        setRoleTitle("");
        setLocation("");
        setSource("");
        setUrl("");
        setSalaryNote("");
        setStage(ApplicationStage.SAVED);
        setJdText("");
        setStatusNote("");
        setShowAddForm(false);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFormLoading(false);
    }
  }

  // Action: Paste / Quick Text JD Parser
  async function handleQuickImport(e: FormEvent) {
    e.preventDefault();
    if (!bulkText.trim()) return;

    setBulkLoading(true);
    try {
      const response = await fetch("/api/applications/pasted-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ jdText: bulkText })
      });

      if (response.ok) {
        setBulkText("");
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBulkLoading(false);
    }
  }

  // Action: Shift Stage Status Fast
  async function handleShiftStage(appId: string, currentStage: ApplicationStage, direction: "forward" | "backward") {
    const currentIndex = STAGES.findIndex(s => s.id === currentStage);
    let nextIndex = currentIndex + (direction === "forward" ? 1 : -1);
    
    if (nextIndex < 0 || nextIndex >= STAGES.length) return; // boundary check
    
    const targetStage = STAGES[nextIndex].id;

    try {
      const response = await fetch(`/api/applications/${appId}/stage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ 
          stage: targetStage,
          note: `Quick pipeline shift ${direction} in tracker columns grid.`
        })
      });
      if (response.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Action: Quick Delete Job Application
  async function handleDeleteApp(appId: string) {
    if (!window.confirm("Delete this application registry from the tracker? This action is irreversible.")) return;

    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${userId}`
        }
      });
      if (response.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Search & Option Launcher Controls Panel */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/80 flex flex-col lg:flex-row gap-4 justify-between items-center shadow shadow-slate-900/10">
        
        {/* Search controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search companies, job roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="relative flex-1 sm:w-48">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by Skill tags..."
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-550 font-mono"
            />
          </div>
        </div>

        {/* Buttons launchers */}
        <div className="flex gap-2 w-full lg:w-auto justify-end">
          
          {/* CSV Download Stream */}
          <a
            href="/api/applications-csv"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-700 border border-slate-655 hover:bg-slate-600 text-slate-200 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            title="Download pipeline data as CSV spreadsheet"
          >
            <FolderDown className="w-3.5 h-3.5" /> Export CSV
          </a>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 hover:bg-indigo-505 text-white font-semibold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Application
          </button>
        </div>

      </div>

      {/* Quick application additions section */}
      {showAddForm && (
        <div className="grid md:grid-cols-3 gap-6 bg-slate-800 border border-slate-700 p-5 rounded-2xl animate-fadeIn shadow-lg">
          
          {/* Option A: Comprehensive Add Form */}
          <div className="md:col-span-2 space-y-3.5 border-r border-slate-750 pr-6">
            <div className="pb-1 border-b border-slate-700">
              <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">Comprehensive Job Registry Form</h3>
              <p className="text-[10px] text-slate-400 font-sans">Catalog full organizational contexts, salary, and job descriptions.</p>
            </div>

            <form onSubmit={handleAddApp} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Company Name *</label>
                  <input
                    type="text" required placeholder="Google" value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Role / Job Title *</label>
                  <input
                    type="text" required placeholder="Software Engineer Intern" value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-0.5">Location</label>
                  <input
                    type="text" placeholder="Seattle / Remote" value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-0.5">Referral Source</label>
                  <input
                    type="text" placeholder="LinkedIn, Referral" value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-0.5">Monthly Compensation</label>
                  <input
                    type="text" placeholder="e.g. $120k / yr" value={salaryNote}
                    onChange={(e) => setSalaryNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-0.5">Careers Link URL</label>
                  <input
                    type="url" placeholder="https://" value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none text-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-0.5">Initial Stage Focus</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none h-[34px]"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-0.5">Raw Job Description Text (For AI matchmaking later)</label>
                <textarea
                  rows={2} placeholder="Paste requirements, skills, guidelines..." value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button" onClick={() => setShowAddForm(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold text-xs px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={formLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2 rounded-lg flex items-center gap-1 shadow"
                >
                  {formLoading ? "Saving to Registry..." : "Catalog Opportunity"}
                </button>
              </div>
            </form>
          </div>

          {/* Option B: Pasted Job Description Heuristic Add Tool */}
          <div className="md:col-span-1 space-y-3.5 pl-2 flex flex-col justify-between">
            <div>
              <div className="pb-1 border-b border-slate-700">
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Paste & Quick Auto-Fill
                </h3>
                <p className="text-[10px] text-slate-400 font-sans">Paste the full job text. The backend parser extracts company/title details instantly!</p>
              </div>

              <form onSubmit={handleQuickImport} className="space-y-3 mt-3">
                <textarea
                  rows={7}
                  placeholder="Paste LinkedIn page content, raw emails, or copy-pasted details here directly..."
                  required
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-[11px] text-slate-300 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />

                <button
                  type="submit"
                  disabled={bulkLoading || !bulkText.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-colors"
                >
                  {bulkLoading ? "Analyzing text structure..." : "Instant Import Extraction"}
                </button>
              </form>
            </div>

            <p className="text-[9px] text-slate-500 font-mono text-center leading-relaxed border-t border-slate-700/50 pt-3">
              This parser reviews lines for tags like "About Us", extracts well-known companies, and searches first few headers for role matches.
            </p>
          </div>

        </div>
      )}

      {/* Main Kanban Pipeline View Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colApps = filteredApps.filter(app => app.stage === col.id);

          return (
            <div 
              key={col.id} 
              className="bg-slate-805/30 border border-slate-750 p-3.5 rounded-2xl flex flex-col gap-3 min-h-[400px] max-h-[620px] overflow-y-auto shrink-0 w-full"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center bg-slate-900/45 px-3 py-2 rounded-xl border border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.color.split(" ")[0]}`} />
                  {col.label}
                </span>
                <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md font-mono text-[10px] text-slate-400 font-bold shadow-inner">
                  {colApps.length}
                </span>
              </div>

              {/* Application Cards List */}
              <div className="space-y-3 overflow-y-auto flex-1 px-0.5">
                {colApps.length > 0 ? (
                  colApps.map((app) => (
                    <div 
                      key={app.id} 
                      onClick={() => onSelectApplication(app)}
                      className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-500 cursor-pointer p-4 rounded-xl flex flex-col justify-between gap-3 text-left shadow-sm hover:shadow relative overflow-hidden group transition-all"
                    >
                      {/* Interactive subtle scale indicators */}
                      <div className="absolute top-0 right-0 h-1.5 w-1.5 bg-indigo-505 opacity-0 group-hover:opacity-100 rounded-bl transition-opacity" />

                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-mono text-slate-400 font-semibold truncate max-w-[130px]" title={app.companyName}>
                            {app.companyName}
                          </p>

                          {/* Fit Score Badge overlay */}
                          {(app.matchScore || 0) > 0 && (
                            <span 
                              className={`font-mono text-[9px] px-1.5 py-0.5 rounded-md border font-bold ${
                                app.matchScore! >= 80 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                              }`}
                              title={`Gemini resume match percentage fitting: ${app.matchScore}%`}
                            >
                              {app.matchScore}% match
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-white leading-snug group-hover:text-indigo-305 font-sans" title={app.roleTitle}>
                          {app.roleTitle}
                        </h4>
                      </div>

                      {/* Info badges lists */}
                      <div className="text-[10px] space-y-1 pt-2 border-t border-slate-700/60 font-mono text-slate-400">
                        {app.location && (
                          <div className="flex items-center gap-1 font-sans text-slate-350">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate max-w-[150px]">{app.location}</span>
                          </div>
                        )}
                        {app.salaryNote && (
                          <div className="flex items-center gap-1 text-slate-300">
                            <DollarSign className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">{app.salaryNote}</span>
                          </div>
                        )}
                      </div>

                      {/* Display first 2 skill identifiers */}
                      {app.skills && app.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {app.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="text-[9px] font-mono bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300 border border-slate-750 w-max shrink-0">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Card Interaction Quick Actions Row */}
                      <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-750/50">
                        <div className="flex gap-1">
                          {currentIndexOfStage(app.stage) > 0 && (
                            <button
                              type="button"
                              title="Demote pipeline back"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShiftStage(app.id, app.stage, "backward");
                              }}
                              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded border border-transparent hover:border-slate-600 transition-all"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {currentIndexOfStage(app.stage) < STAGES.length - 1 && (
                            <button
                              type="button"
                              title="Promote pipeline next"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShiftStage(app.id, app.stage, "forward");
                              }}
                              className="p-1 text-slate-400 hover:text-white hover:bg-emerald-400 hover:bg-slate-700 rounded border border-transparent hover:border-slate-600 transition-all"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex gap-1.5 items-center">
                          {/* Outer link portal */}
                          {app.url && (
                            <a
                              href={app.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"
                              title="Open original vacancy page"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            title="Delete application metadata"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteApp(app.id);
                            }}
                            className="p-1 text-slate-550 hover:text-rose-450 hover:bg-rose-950/10 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="h-28 flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-750 text-slate-500 text-center font-mono text-[11px]">
                    <Briefcase className="w-6 h-6 mb-1 opacity-20" />
                    <span>0 roles tracked</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

function currentIndexOfStage(stage: ApplicationStage): number {
  const index = STAGES.findIndex(s => s.id === stage);
  return index === -1 ? 0 : index;
}
