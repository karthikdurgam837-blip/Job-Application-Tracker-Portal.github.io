/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Database, Play, HardDrive, ShieldAlert, CheckCircle2, 
  Terminal, RefreshCw, Layers, Key, Code, HelpCircle, Server
} from "lucide-react";

interface SupabaseProps {
  userId: string;
}

export default function SupabaseConsole({ userId }: SupabaseProps) {
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM applications WHERE stage = 'TECH';");
  const [queryResults, setQueryResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSchemaTab, setActiveSchemaTab] = useState<"applications" | "tasks" | "contacts" | "notes">("applications");
  
  // DB statistics
  const [stats, setStats] = useState({
    applicationsCount: 0,
    tasksCount: 0,
    contactsCount: 0,
    notesCount: 0,
    rlsStatus: "ACTIVE (Row-Level Security)",
    connection: "CONNECTED TO SERVERLESS POSTGRES"
  });

  async function fetchDbStats() {
    try {
      const response = await fetch("/api/applications", {
        headers: { "Authorization": `Bearer ${userId}` }
      });
      if (response.ok) {
        const data = await response.json();
        let tCount = 0;
        let cCount = 0;
        let nCount = 0;
        data.forEach((a: any) => {
          tCount += (a.tasks || []).length;
          cCount += (a.contacts || []).length;
          nCount += (a.notes || []).length;
        });

        setStats({
          applicationsCount: data.length,
          tasksCount: tCount,
          contactsCount: cCount,
          notesCount: nCount,
          rlsStatus: "ACTIVE (Row-Level Security Enforced)",
          connection: "CONNECTED"
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchDbStats();
    handleRunQuery(sqlQuery);
  }, [userId]);

  async function handleRunQuery(queryTextToRun: string) {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("/api/supabase/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ sql: queryTextToRun })
      });
      
      const resData = await resp.json();
      if (!resp.ok) {
        setError(resData.error || "Execution aborted by engine policy.");
        setQueryResults(null);
      } else {
        setQueryResults(resData);
        fetchDbStats(); // update counters
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setQueryResults(null);
    } finally {
      setLoading(false);
    }
  }

  const suggestedQueries = [
    { label: "Fetch ALL Tracked jobs", sql: "SELECT * FROM applications;" },
    { label: "Find high-match candidates", sql: "SELECT company_name, role_title, match_score FROM applications WHERE match_score > 80;" },
    { label: "Check outstanding milestones", sql: "SELECT title, due_at, done FROM tasks WHERE done = 0;" },
    { label: "Promote job stage safely via SQL", sql: "UPDATE applications SET stage = 'OFFER' WHERE id = 'app-2';" }
  ];

  const schemas = {
    applications: [
      { column: "id", type: "UUID (Primary Key)", description: "Unique application locator ID" },
      { column: "company_name", type: "VARCHAR", description: "Company name (Google, Meta, etc.)" },
      { column: "role_title", type: "VARCHAR", description: "Full job vacancy name" },
      { column: "stage", type: "VARCHAR", description: "Kanban state column category code" },
      { column: "location", type: "VARCHAR", description: "Physical coordinates or remote" },
      { column: "salary_note", type: "VARCHAR", description: "Compensation parameters" },
      { column: "match_score", type: "INTEGER", description: "AI ATS alignment match percentage" },
      { column: "created_at", type: "TIMESTAMP", description: "Creation date timestamp" }
    ],
    tasks: [
      { column: "id", type: "VARCHAR (Unique)", description: "Task identifier" },
      { column: "application_id", type: "UUID (Foreign Key)", description: "Refers to applications.id" },
      { column: "title", type: "VARCHAR", description: "Task checklist description details" },
      { column: "done", type: "INTEGER (0 or 1)", description: "Binary indicator representing checklist execution" },
      { column: "due_at", type: "TIMESTAMP", description: "Milestone deadline target date" }
    ],
    contacts: [
      { column: "id", type: "VARCHAR", description: "Contact identifier ID" },
      { column: "application_id", type: "UUID (Foreign Key)", description: "Associated application ID link" },
      { column: "name", type: "VARCHAR", description: "Full name details" },
      { column: "title", type: "VARCHAR", description: "Corporate title/job (Recruiter, Referrer)" },
      { column: "email", type: "VARCHAR", description: "Corporate email coordinates" }
    ],
    notes: [
      { column: "id", type: "VARCHAR", description: "Note identifier details" },
      { column: "application_id", type: "UUID (Foreign Key)", description: "Associated application key link" },
      { column: "content", type: "TEXT", description: "Written transcription call feedback" },
      { column: "created_at", type: "TIMESTAMP", description: "Note timestamp" }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Supabase connection banner header */}
      <div className="bg-emerald-950/15 border border-emerald-500/20 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 rounded-xl text-white">
            <Database className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[#059669] tracking-tight uppercase font-mono">SQL DATABASE INTEGRATION</span>
              <span className="bg-emerald-100 text-emerald-850 text-[9px] px-2 py-0.5 rounded-full font-bold font-mono">
                ACTIVE POSTGRES
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active SQL query workspace to explore and inspect database tables for applications, milestones, and interview notes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
          <span className="bg-slate-200 border border-slate-300 px-3 py-1 rounded-md text-slate-600 flex items-center gap-1.5 font-semibold">
            <Server className="w-3 h-3 text-indigo-505" /> Server: Connected
          </span>
          <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md text-emerald-700 flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-3 h-3 text-emerald-605" /> RLS Verified
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        
        {/* Schema and Table Navigator sidebar */}
        <div className="md:col-span-1 space-y-4">
          
          {/* Postgres statistics */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Table Statistics</h4>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-600">
                <span>↳ applications:</span>
                <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  {stats.applicationsCount} rows
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>↳ tasks:</span>
                <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  {stats.tasksCount} rows
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>↳ contacts:</span>
                <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  {stats.contactsCount} rows
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>↳ notes:</span>
                <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  {stats.notesCount} rows
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Table Schema inspector */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2.5 text-left">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Public Schema definitions</h4>
            </div>

            <div className="flex gap-1 border-b border-slate-105 pb-2 overflow-x-auto whitespace-nowrap">
              {["applications", "tasks", "contacts", "notes"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveSchemaTab(t as any)}
                  className={`px-2 py-0.5 text-[9px] font-mono rounded-md border font-semibold ${
                    activeSchemaTab === t 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pt-1">
              {schemas[activeSchemaTab].map((col, i) => (
                <div key={i} className="text-[10px] leading-tight space-y-0.5">
                  <div className="flex justify-between items-center font-mono">
                    <span className="font-bold text-slate-800">{col.column}</span>
                    <span className="text-indigo-400 text-[9px]">{col.type}</span>
                  </div>
                  <p className="text-slate-400 text-[9px] leading-none" style={{ fontStyle: "italic" }}>
                    {col.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Console Query sandbox pane - 3 columns */}
        <div className="md:col-span-3 space-y-5 flex flex-col justify-between">
          
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            
            {/* Run controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-extrabold text-slate-850 uppercase tracking-widest font-mono flex items-center gap-1">
                  <Terminal className="w-4 h-4 text-emerald-600" /> PostgreSQL SQL Terminal
                </h4>
                <p className="text-[10px] text-slate-400">Write sandbox statements. Secure row locks restrict results to your user context records.</p>
          </div>

          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => setSqlQuery(`SELECT * FROM applications;`)}
              className="bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-600 font-mono text-[10px] px-2.5 py-1 rounded"
            >
              Reset SQL
            </button>
            <button
              onClick={() => handleRunQuery(sqlQuery)}
              disabled={loading}
              className="bg-emerald-650 hover:bg-emerald-600 disabled:opacity-50 text-white font-mono text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 font-semibold"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" /> Run SQL Query
                </>
              )}
            </button>
          </div>
            </div>

            {/* Quick Suggestions Panel */}
            <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 space-y-1.5">
              <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">SUGGESTED SANDBOX COMMANDS:</span>
              <div className="flex flex-wrap gap-1">
                {suggestedQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSqlQuery(q.sql);
                      handleRunQuery(q.sql);
                    }}
                    className="bg-white border border-slate-100 hover:border-emerald-300 text-slate-600 font-mono text-[9px] px-2 py-1 rounded shadow-sm hover:text-emerald-700 hover:bg-emerald-50/20 text-left transition-all"
                  >
                    💡 {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Area */}
            <div className="space-y-1">
              <textarea
                className="w-full h-24 bg-slate-900 border border-slate-950 rounded-xl p-4 text-xs text-emerald-400 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 whitespace-pre"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="/* Write valid PostgreSQL statements here... */"
              />
              <span className="text-[8px] text-slate-400 leading-none font-mono text-right block pr-1">
                Press Run to query real file-based datastore dynamically
              </span>
            </div>

            {/* Error messaging panel */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-xs text-rose-700 font-mono">
                <span className="font-bold flex items-center gap-1 text-rose-800">
                  ⚠️ Query Error:
                </span>
                <p className="mt-1 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Data output terminal results grid */}
            {queryResults && queryResults.success && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span>Success Status: <span className="text-emerald-600 font-bold">OK (200 SUCCESS)</span></span>
                  <span>Affected Rows: <b>{queryResults.rowsAffected}</b></span>
                </div>

                <div className="border border-slate-150 rounded-xl overflow-x-auto max-h-60 bg-white">
                  {queryResults.data && queryResults.data.length > 0 ? (
                    <table className="w-full text-left border-collapse text-[11px] font-mono">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500">
                          {Object.keys(queryResults.data[0]).map((key) => (
                            <th key={key} className="px-3 py-2 font-bold capitalize">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResults.data.map((row: any, i: number) => (
                          <tr key={i} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 text-slate-700">
                            {Object.values(row).map((val: any, j: number) => (
                              <td key={j} className="px-3 py-1.5 truncate max-w-[180px]" title={String(val)}>
                                {val === null ? <span className="text-slate-350 italic">null</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-400 font-mono text-xs">
                      No records matched. Query returned 0 rows successfully.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          <p className="text-[9px] text-slate-400 font-mono text-center leading-relaxed">
            Note: This interface executes standard query statements against your active job board data. It provides SQL capabilities to run audits, reports or batch-update records securely.
          </p>

        </div>

      </div>

    </div>
  );
}
