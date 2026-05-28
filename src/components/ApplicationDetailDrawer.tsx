/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent, DragEvent, ChangeEvent } from "react";
import { 
  X, Sparkles, Plus, CheckSquare, Square, Trash2, Calendar, 
  User, Mail, Phone, FileText, UploadCloud, StickyNote, Download,
  Play, RefreshCw, Layers, CheckCircle 
} from "lucide-react";
import { JobApplication, Task, Contact, Note, Document } from "../types";

interface DrawerProps {
  application: JobApplication;
  userId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ApplicationDetailDrawer({ application, userId, onClose, onUpdate }: DrawerProps) {
  const [activeTab, setActiveTab] = useState<"tailor" | "tasks" | "contacts" | "notes" | "docs">("tailor");
  
  // Tailoring states
  const [resumeText, setResumeText] = useState("");
  const [tailorLoading, setTailorLoading] = useState(false);
  const [tailorResult, setTailorResult] = useState<any>(null);

  // New item forms
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");
  
  const [newContactName, setNewContactName] = useState("");
  const [newContactTitle, setNewContactTitle] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactNotes, setNewContactNotes] = useState("");

  const [newNoteContent, setNewNoteContent] = useState("");

  // Document attachments
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill some practice candidate background for better UX
  useEffect(() => {
    setResumeText(`Karthik Durgam
karthikdurgam837@gmail.com | Github: github.com/karthikdurgam837

TECHNICAL SKILLS:
- Languages: JavaScript, TypeScript, Python, HTML/CSS, SQL
- Frameworks: React.js, Express.js, Node.js (MERN Stack Developer)
- Databases: Modern MongoDB, relational Postgres SQL
- Tools: Git, GitHub version control, REST APIs, JSON data structures

PROJECTS:
- Job Application Tracker Portal: Built standard Express + Vite React full stack tool to log and organize candidate recruitment funnels. Integrated server-side Google Gemini AI APIs for smart resume ATS keywords tailoring assessments, with calendar rfc5545 .ics stream triggers.`);
  }, []);

  // Handler: Tailor Resume with Gemini
  async function handleTailorResume() {
    if (!resumeText.trim()) return;
    setTailorLoading(true);
    try {
      const response = await fetch(`/api/applications/${application.id}/tailor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ resumeText })
      });
      const data = await response.json();
      setTailorResult(data);
      onUpdate(); // Refresh parent view
    } catch (err) {
      console.error(err);
    } finally {
      setTailorLoading(false);
    }
  }

  // Handler: Add Task
  async function handleAddTask(e: FormEvent) {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDue) return;

    try {
      const response = await fetch(`/api/applications/${application.id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ title: newTaskTitle, dueAt: newTaskDue })
      });
      if (response.ok) {
        setNewTaskTitle("");
        setNewTaskDue("");
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handler: Toggle Task Checklist
  async function handleToggleTask(task: Task) {
    try {
      const response = await fetch(`/api/applications/${application.id}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ done: !task.done })
      });
      if (response.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handler: Delete Task
  async function handleDeleteTask(taskId: string) {
    try {
      await fetch(`/api/applications/${application.id}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${userId}`
        }
      });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  }

  // Handler: Add Contact
  async function handleAddContact(e: FormEvent) {
    e.preventDefault();
    if (!newContactName) return;

    try {
      const response = await fetch(`/api/applications/${application.id}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({
          name: newContactName,
          title: newContactTitle,
          email: newContactEmail,
          phone: newContactPhone,
          notes: newContactNotes
        })
      });
      if (response.ok) {
        setNewContactName("");
        setNewContactTitle("");
        setNewContactEmail("");
        setNewContactPhone("");
        setNewContactNotes("");
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handler: Add Note
  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    try {
      const response = await fetch(`/api/applications/${application.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ content: newNoteContent })
      });
      if (response.ok) {
        setNewNoteContent("");
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handler: Document Selection Upload simulation
  async function simulateDocUpload(filename: string, size: string) {
    try {
      const response = await fetch(`/api/applications/${application.id}/docs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({
          kind: filename.toLowerCase().includes("cover") ? "cover" : "resume",
          filename: filename,
          contentSize: size
        })
      });
      if (response.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const friendlySize = (file.size / 1024).toFixed(1) + " KB";
      simulateDocUpload(file.name, friendlySize);
    }
  }

  function handleManualFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const friendlySize = (file.size / 1024).toFixed(1) + " KB";
      simulateDocUpload(file.name, friendlySize);
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col justify-between font-sans text-slate-100">
      
      {/* Header Panel */}
      <div className="p-4 border-b border-slate-700 bg-slate-950/40">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono tracking-widest bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-indigo-400 font-bold uppercase">
              GRID DETAILS PANEL
            </span>
            <h2 className="text-lg font-extrabold text-white mt-2 font-sans">
              {application.roleTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              at <span className="text-white font-semibold">{application.companyName}</span> • {application.location || "Dynamic / Remote"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status indicator bar */}
        <div className="mt-3 bg-slate-900/60 p-2 rounded-xl text-xs border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-400 font-mono">Stage: <span className="text-indigo-400 font-bold uppercase">{application.stage}</span></span>
          <span className="text-slate-500 font-sans text-[11px] truncate max-w-[200px]" title={application.statusNote}>
            {application.statusNote || "Initial log added."}
          </span>
        </div>
      </div>

      {/* Tabs navigation panel */}
      <div className="flex border-b border-slate-700/80 bg-slate-950/20 px-2">
        {[
          { id: "tailor", label: "Smart ATS Tailoring", icon: Sparkles },
          { id: "tasks", label: "Tasks Checklist", icon: CheckSquare },
          { id: "contacts", label: "Contacts", icon: User },
          { id: "notes", label: "Prep Notes", icon: StickyNote },
          { id: "docs", label: "Documents", icon: FileText }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-mono border-b-2 font-medium transition-all ${
                activeTab === t.id
                  ? "border-indigo-500 text-indigo-400 bg-slate-800/10"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main tab display scrolling */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-805">
        
        {/* ATS Resume Tailor */}
        {activeTab === "tailor" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
              <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold mb-1">
                Optimized Resume Keywords Matching
              </h3>
              <p className="text-[11px] text-slate-400">
                Pasted resume is analyzed dynamically against this Job Description text using real server-side LLM processing to identify technical gaps.
              </p>
            </div>

            {/* ATS Match score meter */}
            {((application.matchScore || 0) > 0 || tailorResult) && (
              <div className="bg-indigo-950/15 border border-indigo-550/20 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-indigo-300">COMPUTED FIT SCORE:</span>
                  <span className="text-lg font-mono font-extrabold text-indigo-400">
                    {tailorResult ? tailorResult.matchScore : application.matchScore}%
                  </span>
                </div>
                
                {/* Score bar */}
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800/80">
                  <div 
                    className="bg-gradient-to-r from-indigo-505 to-emerald-400 h-full transition-all duration-500"
                    style={{ width: `${tailorResult ? tailorResult.matchScore : application.matchScore}%` }}
                  />
                </div>

                <div className="text-[11px] leading-relaxed text-slate-300 bg-slate-900/50 p-2.5 rounded-lg font-sans border border-slate-800">
                  <span className="text-indigo-400 font-bold block mb-1 font-mono text-[10px]">TAILORING RECOMMENDATIONS:</span>
                  {tailorResult ? tailorResult.matchFeedback : application.matchFeedback}
                </div>
              </div>
            )}

            {/* Resume Input Area */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                Active Resume Draft Input
              </label>
              <textarea
                rows={5}
                placeholder="Paste or edit plain text resume blocks to analyze matches..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-slate-955/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />

              <button
                onClick={handleTailorResume}
                disabled={tailorLoading || !resumeText.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg"
              >
                {tailorLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Evaluator grading resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300/10" /> Tailor Resume with Gemini AI
                  </>
                )}
              </button>
            </div>

            {/* Keyword tags display */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Indexed Job Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {application.skills && application.skills.length > 0 ? (
                  application.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="bg-indigo-950/30 text-indigo-300 border border-indigo-900/40 font-mono text-[10px] px-2 py-0.5 rounded-md"
                    >
                      #{skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs font-mono">No parsed keywords. Click AI match to populate.</span>
                )}
              </div>
            </div>

            {/* Raw JD Section */}
            <div className="pt-2 border-t border-slate-800/60">
              <details className="group">
                <summary className="text-xs font-mono uppercase tracking-wider text-slate-400 cursor-pointer list-none flex justify-between items-center hover:text-slate-200">
                  <span>View Scraped Job Description Text</span>
                  <span className="text-[10px] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 text-[11px] leading-relaxed text-slate-400 bg-slate-950/20 p-3 rounded-xl border border-slate-850 font-sans max-h-40 overflow-y-auto whitespace-pre-line">
                  {application.jdText || "No job parameters saved."}
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Task Checklist Manager */}
        {activeTab === "tasks" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold mb-1">
              Checklist Milestones Planner
            </h3>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="bg-slate-950/30 p-3.5 border border-slate-800 rounded-xl space-y-2">
              <input
                type="text"
                placeholder="Interview step (e.g., Code rehearsal, design round...)"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-slate-955 border border-slate-805 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-550 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="date"
                    required
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-805 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-650 hover:bg-indigo-500 text-white font-semibold text-xs px-3 rounded-lg flex items-center gap-1 shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>
            </form>

            {/* Task list layout */}
            <div className="space-y-2">
              {application.tasks && application.tasks.length > 0 ? (
                application.tasks.map((task: Task) => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      task.done 
                        ? "bg-slate-950/10 border-slate-850 opacity-60" 
                        : "bg-slate-800/10 border-slate-750"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <button 
                        onClick={() => handleToggleTask(task)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {task.done ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      <div className="text-left">
                        <p className={`text-xs font-medium ${task.done ? "line-through text-slate-500" : "text-slate-200 font-sans"}`}>
                          {task.title}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          Due: {new Date(task.dueAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* ICS Export Calendar Download Link */}
                      <a
                        href={`/api/applications/ics-export/${application.id}/${task.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 border border-transparent hover:border-slate-700 transition-all"
                        title="Add deadline to Calendar (.ics)"
                      >
                        <Calendar className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-450 border border-transparent hover:border-slate-700 transition-all"
                        title="Delete task checklist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 font-mono text-xs">
                  No active application tracking deadlines recorded.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contacts Manager */}
        {activeTab === "contacts" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold mb-1">
              Interviewer & Referrer Directory
            </h3>

            {/* Add Contact Form */}
            <form onSubmit={handleAddContact} className="bg-slate-955/30 p-3.5 border border-slate-800 rounded-xl space-y-2">
              <input
                type="text"
                placeholder="Full Name (e.g. Rajesh Kumar)"
                required
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full bg-slate-955 border border-slate-805 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Title (e.g. Referrer, Manager)"
                  value={newContactTitle}
                  onChange={(e) => setNewContactTitle(e.target.value)}
                  className="bg-slate-955 border border-slate-805 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="bg-slate-955 border border-slate-805 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Notes or conversation detail"
                  value={newContactNotes}
                  onChange={(e) => setNewContactNotes(e.target.value)}
                  className="flex-1 bg-slate-955 border border-slate-805 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-505 text-white font-semibold text-xs px-3 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </form>

            {/* Contacts list */}
            <div className="space-y-2">
              {application.contacts && application.contacts.length > 0 ? (
                application.contacts.map((c: Contact) => (
                  <div key={c.id} className="p-3 bg-slate-950/20 border border-slate-800 rounded-xl text-left space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white font-sans">{c.name}</h4>
                        <p className="text-[10px] text-slate-400 font-sans">{c.title || "University Recruiter"}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">ID: recruiter</span>
                    </div>

                    <div className="text-[10px] text-slate-300 font-mono space-y-1.5 pt-1 border-t border-slate-850">
                      {c.email && (
                        <p className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-indigo-400" /> {c.email}
                        </p>
                      )}
                      {c.notes && (
                        <p className="text-[10px] leading-relaxed text-slate-400 bg-slate-900/60 p-1.5 rounded" style={{ fontStyle: "italic" }}>
                          Notes: {c.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 font-mono text-xs">
                  No active recruiter or helper contacts saved for this job.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prep Notes Section */}
        {activeTab === "notes" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold mb-1">
              Meeting Transcripts & Practice Drafts Notes
            </h3>

            {/* Add note textarea */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Type dynamic call questions, optimization notes, key interview questions discussed..."
                required
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full bg-slate-955 border border-slate-805 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Write Log Note
                </button>
              </div>
            </form>

            {/* Notes checklist display */}
            <div className="space-y-2">
              {application.notes && application.notes.length > 0 ? (
                application.notes.map((n: Note) => (
                  <div key={n.id} className="p-3 bg-slate-955 border border-slate-805 rounded-xl text-left space-y-1 font-mono">
                    <span className="text-[9px] text-slate-500 block">
                      Written: {new Date(n.createdAt).toLocaleString()}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-full">
                      {n.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 font-mono text-xs">
                  No preparatory logged notes saved yet. Add a code block or meeting timeline.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload documents attachments */}
        {activeTab === "docs" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold mb-1">
              Resume & Cover Letter Vault
            </h3>

            {/* Drag and drop sandbox zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                dragging
                  ? "border-emerald-505 bg-emerald-500/10 text-white"
                  : "border-slate-700 bg-slate-955/50 text-slate-400 hover:border-indigo-500"
              }`}
            >
              <UploadCloud className="w-10 h-10 mx-auto text-slate-405 mb-2 group-hover:text-white" />
              <p className="text-xs font-semibold text-slate-200">Drag & Drop Resume Attachment</p>
              <p className="text-[10px] text-slate-550 mt-1 font-mono uppercase">or click to choose files in storage</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleManualFile}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </div>

            {/* Attachment files list */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Active Attachment Files</h4>
              {application.docs && application.docs.length > 0 ? (
                application.docs.map((doc: Document) => (
                  <div key={doc.id} className="p-3 bg-slate-950/20 border border-slate-805 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-400" />
                      <div className="text-left font-sans">
                        <p className="text-xs font-bold text-slate-200 leading-tight">
                          {doc.filename}
                        </p>
                        <span className="text-[10px] text-slate-550 font-mono block mt-0.5 uppercase">
                          {doc.kind} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded">
                      {doc.contentSize || "118 KB"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-500 font-mono text-xs">
                  No customized documents uploaded to the sandbox vault.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Footer metadata details */}
      <div className="p-4 border-t border-slate-705 bg-slate-950/30 text-center font-mono text-[9px] text-slate-500 flex justify-between items-center">
        <span>Last action: {new Date(application.updatedAt).toLocaleDateString()}</span>
        <span className="text-indigo-400 select-all">{application.id}</span>
      </div>
      
    </div>
  );
}
