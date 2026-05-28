/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Briefcase, BarChart3, GraduationCap, Layers, LogOut, User, 
  HelpCircle, RefreshCw, FolderSearch, AlertCircle, Sparkles, CheckSquare,
  Database, Bell, MessageSquare, Search, Award, TrendingUp, ChevronRight,
  ShieldAlert, ShieldCheck
} from "lucide-react";

import { JobApplication } from "./types";
import LoginScreen from "./components/LoginScreen";
import KanbanBoard from "./components/KanbanBoard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import InterviewPrepPanel from "./components/InterviewPrepPanel";
import ProjectExhibitsPanel from "./components/ProjectExhibitsPanel";
import ApplicationDetailDrawer from "./components/ApplicationDetailDrawer";
import SupabaseConsole from "./components/SupabaseConsole";
import { SkeletonDashboard, SkeletonKanban } from "./components/SkeletonScreen";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role?: "candidate" | "admin" } | null>(null);
  const [activeSpace, setActiveSpace] = useState<"kanban" | "analytics" | "supabase" | "prep" | "exhibits">("analytics");
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(false);
  const [error, setError] = useState("");

  // Listen for hash routing changes to make it fully multi-page!
  useEffect(() => {
    if (!currentUser) return;
    
    function handleHashChange() {
      const hash = window.location.hash;
      if (hash === "#/analytics") {
        setActiveSpace("analytics");
      } else if (hash === "#/applications") {
        setActiveSpace("kanban");
      } else if (hash === "#/database") {
        setActiveSpace("supabase");
      } else if (hash === "#/prep") {
        setActiveSpace("prep");
      } else if (hash === "#/resources") {
        setActiveSpace("exhibits");
      } else if (!hash || hash === "#/") {
        window.location.hash = "#/analytics";
        setActiveSpace("analytics");
      }
    }

    if (!window.location.hash) {
      window.location.hash = "#/analytics";
    }

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentUser]);

  function navigateTo(space: "analytics" | "kanban" | "supabase" | "prep" | "exhibits") {
    setSelectedApp(null);
    const hashes: Record<string, string> = {
      analytics: "#/analytics",
      kanban: "#/applications",
      supabase: "#/database",
      prep: "#/prep",
      exhibits: "#/resources"
    };
    window.location.hash = hashes[space] || "#/analytics";
  }

  // Check check-in sessions
  useEffect(() => {
    const saved = localStorage.getItem("tracker_candidate_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
      } catch (err) {
        localStorage.removeItem("tracker_candidate_user");
      }
    }
  }, []);

  // Set up skeleton loaders on active space switches
  useEffect(() => {
    if (!currentUser) return;
    setSkeletonLoading(true);
    const timer = setTimeout(() => {
      setSkeletonLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeSpace, currentUser]);

  // Sync applications
  useEffect(() => {
    if (!currentUser) return;

    async function loadApplications() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/applications", {
          headers: {
            "Authorization": `Bearer ${currentUser?.id}`
          }
        });
        if (!response.ok) {
          throw new Error("Unable to retrieve applications database.");
        }
        const data = await response.json();
        setApplications(data);

        // Keep detail panel application state synced on mutate
        if (selectedApp) {
          const updatedSelected = data.find((a: any) => a.id === selectedApp.id);
          if (updatedSelected) {
            setSelectedApp(updatedSelected);
          } else {
            setSelectedApp(null);
          }
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [currentUser, refreshTrigger]);

  function handleLoginSuccess(user: { id: string; name: string; email: string }) {
    setCurrentUser(user);
    localStorage.setItem("tracker_candidate_user", JSON.stringify(user));
  }

  function handleLogOut() {
    localStorage.removeItem("tracker_candidate_user");
    setCurrentUser(null);
    setSelectedApp(null);
    setActiveSpace("kanban");
    setApplications([]);
  }

  function triggerRefresh() {
    setRefreshTrigger(prev => prev + 1);
  }

  if (!currentUser) {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  // Calculate high quality stats for dashboard preview panels
  const totalTracked = applications.length;
  const interviewingCount = applications.filter(a => ["SCREEN", "TECH", "HM"].includes(a.stage)).length;
  const offerCount = applications.filter(a => a.stage === "OFFER").length;
  const appliedCount = applications.filter(a => a.stage === "APPLIED" || a.stage === "OA").length;

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-slate-800 flex font-sans antialiased overflow-hidden">
      
      {/* 1. Curve Royal Purple LEFT SIDEBAR (Exactly matching the Jobie mock in upload) */}
      <aside className="w-64 hidden xl:flex flex-col bg-[#4318FF] text-white shrink-0 relative overflow-hidden select-none">
        
        {/* Glow bubbles */}
        <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-50px] w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        
        {/* Sidebar Header Brand Logo */}
        <div className="p-7 flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4318FF] shadow-md font-extrabold text-xl tracking-tight">
            J
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold font-sans tracking-tight text-white">Jobie</span>
              <span className="bg-white/15 text-[9px] text-white/90 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-indigo-200 font-mono tracking-wider">CAREER TRACKER</p>
          </div>
        </div>

        {/* Divider separator */}
        <div className="h-[1px] bg-white/10 mx-6 mb-6" />

        {/* Menu Items */}
        <div className="flex-1 px-4 space-y-1 relative z-10 text-left">
          
          {[
            { id: "analytics", label: "Dashboard", icon: BarChart3 },
            { id: "kanban", label: "Active Applications", icon: Briefcase },
            ...(currentUser?.role === "admin" ? [{ id: "supabase", label: "Database Console", icon: Database }] : []),
            { id: "prep", label: "Interview Prep", icon: GraduationCap },
            { id: "exhibits", label: "Resources Center", icon: Layers }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSpace === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id as any);
                }}
                className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 relative ${
                  isActive 
                    ? "bg-white text-[#4318FF] shadow-lg shadow-indigo-900/20 translate-x-1" 
                    : "text-indigo-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#4318FF]" : "text-indigo-200"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-6 rounded bg-[#4318FF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Real-time Candidate Application Quick Metrics (Professional & Realistic representation) */}
        <div className="p-5 mx-4 mb-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-md relative z-10 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-emerald-300 font-mono tracking-wider">WORKSPACE METRICS</span>
          </div>
          <div className="space-y-1.5 text-xs text-indigo-100 font-sans mt-2">
            <div className="flex justify-between">
              <span className="opacity-80">Tracked:</span>
              <span className="font-bold text-white font-mono">{totalTracked} jobs</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Interviews:</span>
              <span className="font-bold text-white font-mono">{interviewingCount} stages</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Offers:</span>
              <span className="font-bold text-emerald-300 font-mono">{offerCount} secured</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-indigo-200 font-mono">
            <span>Status: <b>Live Realtime</b></span>
            <span>Ref: <b>PostgreSQL</b></span>
          </div>
        </div>

        {/* User profile actions */}
        <div className="p-4 bg-indigo-950/45 border-t border-white/10 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white uppercase border border-white/20">
              {currentUser.name.charAt(0) || "K"}
            </div>
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-white block truncate max-w-[120px]">{currentUser.name || "Karthik Durgam"}</span>
                <span className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold uppercase shrink-0 ${currentUser.role === "admin" ? "bg-amber-400 text-amber-950" : "bg-emerald-400 text-emerald-950"}`}>
                  {currentUser.role === "admin" ? "Admin" : "User"}
                </span>
              </div>
              <span className="text-[10px] text-indigo-150 font-mono block truncate w-32">{currentUser.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogOut}
            className="p-2 hover:bg-white/15 rounded-xl text-indigo-200 hover:text-rose-350 transition-all shadow"
            title="Log Out Securely"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* 2. Main Area Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Dynamic Navigation Top control bar */}
        <header className="bg-white border-b border-slate-100 py-3 px-4 sm:px-6 sticky top-0 z-20 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Title descriptor page */}
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="xl:hidden p-2 bg-[#4318FF] rounded-xl text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#4318FF] uppercase tracking-widest font-mono">
                  {activeSpace === "kanban" ? "RECRUITMENT TRACKER" : activeSpace === "analytics" ? "PERFORMANCE DASHBOARD" : activeSpace === "supabase" ? (currentUser?.role === "admin" ? "SQL DATABASE CONSOLE" : "SECURITY CONTROLS") : "INTERACTIVE PREPARATION"}
                </span>
                <h2 className="text-lg font-extrabold text-[#111C43] tracking-tight">
                  {activeSpace === "kanban" && "Applications Pipeline"}
                  {activeSpace === "analytics" && "Job Vacancy Trends"}
                  {activeSpace === "supabase" && (currentUser?.role === "admin" ? "PostgreSQL Sandbox Console" : "Database Access Restricted")}
                  {activeSpace === "prep" && "Interview Syllabus Prep"}
                  {activeSpace === "exhibits" && "System Resources & Center"}
                </h2>
              </div>
            </div>

            {/* Right Header Navigation options (Exact Mock as visual design) */}
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              
              {/* Mock search box */}
              <div className="relative hidden md:block">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-405">
                  <Search className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Searching candidate pipeline..."
                  disabled
                  className="bg-[#F4F7FE] border border-transparent rounded-2xl py-2 pl-9 pr-4 text-xs font-medium w-52 placeholder:text-slate-400 focus:outline-none focus:bg-white text-slate-800"
                />
              </div>

              {/* Status refresh buttons */}
              <div className="flex items-center gap-2">
                
                 {/* Mobile screen list switcher handles */}
                <div className="flex xl:hidden gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 justify-center">
                  {[
                    { id: "analytics", label: "Stats", icon: BarChart3 },
                    { id: "kanban", label: "Board", icon: Briefcase },
                    ...(currentUser?.role === "admin" ? [{ id: "supabase", label: "SQL", icon: Database }] : []),
                    { id: "prep", label: "Prep", icon: GraduationCap }
                  ].map((space) => (
                    <button
                      key={space.id}
                      onClick={() => navigateTo(space.id as any)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
                        activeSpace === space.id 
                          ? "bg-[#4318FF] text-white" 
                          : "text-slate-600 hover:text-black"
                      }`}
                    >
                      {space.label}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <span className="flex items-center gap-1 text-[10px] text-[#4318FF] font-mono bg-[#4318FF]/5 px-2.5 py-1.5 rounded-xl border border-[#4318FF]/10 font-bold">
                    <RefreshCw className="w-3 h-3 animate-spin" /> SYNCING
                  </span>
                ) : (
                  <button 
                    onClick={triggerRefresh}
                    className="hover:text-black flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-55/70 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all font-semibold"
                    title="Refresh connection state"
                  >
                    <RefreshCw className="w-3 h-3" /> STATE SYNCED
                  </button>
                )}

                {/* Mobile menu logout trigger */}
                <button
                  onClick={handleLogOut}
                  className="xl:hidden p-2 bg-slate-100 border border-slate-200 rounded-xl text-rose-600 shadow-sm"
                  title="Secure logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </header>

        {/* 3. Main content canvas area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative">
          
          {error && (
            <div className="bg-rose-50 border border-rose-105 rounded-2xl p-4 text-xs text-rose-700 flex items-start gap-2.5 mb-2 animate-fadeIn shadow-sm">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Sync warning:</span> {error}
              </div>
            </div>
          )}

          {/* SKELETON LOADING MODE (Smooth loading switcher requested) */}
          {skeletonLoading ? (
            activeSpace === "kanban" ? <SkeletonKanban /> : <SkeletonDashboard />
          ) : (
            <>
              {/* Display Screens depending on active space navigation key */}
              {activeSpace === "kanban" && (
                <div className="animate-fadeIn space-y-4 text-left">
                  <div className="bg-white/80 backdrop-blur-sm shadow-sm border border-slate-100 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#111C43] tracking-tight">Active Recruitment Pipeline</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Track your job applications, schedule interview steps, refine resume match ratings, and complete action lists.
                      </p>
                    </div>

                    <div className="flex bg-[#F4F7FE] p-1 rounded-xl border border-slate-100 text-[11px] font-mono shrink-0">
                      <span className="px-3 py-1 bg-white shadow-sm text-slate-800 rounded-lg font-bold">
                        {applications.length} Workflows Tracked
                      </span>
                    </div>
                  </div>

                  <KanbanBoard
                    applications={applications}
                    userId={currentUser.id}
                    onSelectApplication={(app) => setSelectedApp(app)}
                    onRefresh={triggerRefresh}
                  />
                </div>
              )}

              {activeSpace === "analytics" && (
                <div className="animate-fadeIn space-y-4 text-left font-sans">
                  
                  {/* Top Header Mock Banner */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#111C43] tracking-tight flex items-center gap-1.5">
                        <TrendingUp className="w-5 h-5 text-[#4318FF]" /> Academic Recruitment Progress Metrics
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        A real-time metrics visualizer showcasing recruitment velocity, conversion ratios, and success logs.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSkeletonLoading(true);
                        setRefreshTrigger(prev => prev + 1);
                      }}
                      className="text-xs font-sans font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-550" /> Refresh Live Metrics
                    </button>
                  </div>

                  <AnalyticsDashboard
                    userId={currentUser.id}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
              )}

              {activeSpace === "supabase" && currentUser?.role !== "admin" && (
                <div className="animate-fadeIn max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-rose-100 p-8 text-center shadow-lg relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-50 rounded-full blur-xl pointer-events-none" />
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500 border border-rose-100 shadow-inner">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  
                  <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest font-mono block text-center mb-1">
                    Authorization Boundary
                  </span>
                  <h3 className="text-xl font-extrabold text-[#111C43] tracking-tight text-center">
                    Administrator Authentication Required
                  </h3>
                  <p className="text-xs text-slate-550 leading-relaxed mt-3 max-w-md mx-auto text-center">
                    The SQL Sandbox console accesses physical tables, candidate schema columns, and core metadata keys. Live queries are restricted to accounts holding authorized Workspace Administrator credentials.
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#4318FF]/10 text-[#4318FF] rounded-xl flex items-center justify-center text-xs font-bold uppercase border border-indigo-100 shrink-0">
                        {currentUser?.name?.charAt(0) || "C"}
                      </div>
                      <div className="text-left font-sans">
                        <span className="text-[11px] font-bold text-slate-700 block leading-tight">{currentUser?.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono block">Role: <b className="text-rose-500 font-bold uppercase">{currentUser?.role || "candidate"}</b></span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigateTo("analytics")}
                      className="w-full sm:w-auto text-xs font-sans font-bold text-white bg-[#4318FF] hover:bg-indigo-700 active:bg-indigo-800 transition-all px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 cursor-pointer"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )}

              {activeSpace === "supabase" && currentUser?.role === "admin" && (
                <div className="animate-fadeIn text-left">
                  <SupabaseConsole userId={currentUser.id} />
                </div>
              )}

              {activeSpace === "prep" && (
                <div className="animate-fadeIn space-y-4 text-left">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-extrabold text-[#111C43] tracking-tight flex items-center gap-1.5">
                      <GraduationCap className="w-5 h-5 text-[#4318FF]" /> Recruitment Interview Preparation
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Review targeted preparation solutions for critical technical and behavioral interview categories.
                    </p>
                  </div>

                  <InterviewPrepPanel />
                </div>
              )}

              {activeSpace === "exhibits" && (
                <div className="animate-fadeIn space-y-4 text-left">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-extrabold text-[#111C43] tracking-tight flex items-center gap-1.5">
                      <Layers className="w-5 h-5 text-[#4318FF]" /> Project Blueprint & Resources
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Explore workspace architecture, directory structures, database schema models, and development timelines.
                    </p>
                  </div>

                  <ProjectExhibitsPanel />
                </div>
              )}
            </>
          )}

          {/* Selected Application detail drawer slider overlay */}
          {selectedApp && (
            <>
              {/* Clickable Backdrop to close slider overlay on backdrop click */}
              <div 
                onClick={() => setSelectedApp(null)}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 transition-all"
              />
              
              <ApplicationDetailDrawer
                application={selectedApp}
                userId={currentUser.id}
                onClose={() => setSelectedApp(null)}
                onUpdate={triggerRefresh}
              />
            </>
          )}

        </main>

        {/* Footer info banner */}
        <footer className="bg-white border-t border-slate-100 mt-auto py-5 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-400 font-sans">
            <p className="font-semibold text-slate-400">© 2026 Jobie workspace. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 font-medium text-slate-400">
              Synced with PostgreSQL • Secure Sandbox Active
            </p>
          </div>
        </footer>

      </div>

    </div>
  );
}
