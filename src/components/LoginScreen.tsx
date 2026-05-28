/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { User, LogIn, UserPlus, Flame, Briefcase, GraduationCap, ShieldCheck, ShieldAlert } from "lucide-react";

interface LoginProps {
  onSuccess: (user: { id: string; name: string; email: string; role?: "candidate" | "admin" }) => void;
}

export default function LoginScreen({ onSuccess }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"candidate" | "admin">("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent, roleOverride?: "candidate" | "admin") {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email || "karthikdurgam837@gmail.com", 
          password: password || "password123",
          role: roleOverride 
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login credentials rejected.");
      }

      onSuccess(data);
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    if (e) e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill out all registration fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to register user account.");
      }

      // Automatically log in
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const loginData = await loginRes.json();
      onSuccess(loginData);
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  }

  function handleDemoLogin(selectedRole: "candidate" | "admin") {
    setEmail("karthikdurgam837@gmail.com");
    setPassword("password123");
    handleLogin(null as any, selectedRole);
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-slate-800 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
        
        {/* Decorative ambient color accents */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4318FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#4318FF] rounded-2xl shadow-lg text-white mb-3">
            <span className="text-2xl font-black">J</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#111C43] sm:text-3xl font-sans mt-2">
            Jobie Tracker
          </h2>
          <p className="mt-1 text-sm text-slate-400 font-medium">
            {isRegister ? "Create your workspace account" : "An elegant gateway to manage your active pipeline"}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl text-xs flex items-start gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form className="mt-8 space-y-4 text-left" onSubmit={isRegister ? handleRegister : (e) => handleLogin(e)}>
          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Karthik Durgam"
                className="w-full bg-[#F4F7FE] font-sans border border-transparent rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4318FF] focus:bg-white transition-all shadow-inner"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
              Candidate Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="karthikdurgam837@gmail.com"
              className="w-full bg-[#F4F7FE] font-sans border border-transparent rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4318FF] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
              Account Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F4F7FE] font-sans border border-transparent rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4318FF] focus:bg-white transition-all shadow-inner"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
                Workspace Role
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={`py-3 px-4 text-xs font-bold rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
                    role === "candidate"
                      ? "bg-white border-[#4318FF] text-[#4318FF] shadow-md ring-2 ring-indigo-50/50"
                      : "bg-[#F4F7FE] border-transparent text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Candidate Account
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-3 px-4 text-xs font-bold rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
                    role === "admin"
                      ? "bg-white border-[#4318FF] text-[#4318FF] shadow-md ring-2 ring-indigo-50/50"
                      : "bg-[#F4F7FE] border-transparent text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Workspace Admin
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-normal pl-1">
                * Admins get full access to the interactive SQL database console to monitor physical schemas.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-[#4318FF] hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none transition-all shadow-lg shadow-indigo-500/15 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isRegister ? (
                <>
                  <UserPlus className="w-4.5 h-4.5" /> Initialize Account
                </>
              ) : (
                <>
                  <LogIn className="w-4.5 h-4.5" /> Enter Workspace
                </>
              )}
            </button>
          </div>
        </form>

        <div className="relative my-6 text-center text-[10px] tracking-wider font-bold">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 border-dashed"></div>
          </div>
          <span className="relative bg-white px-3 text-slate-400 font-mono uppercase">
            EVALUATION SANDBOX DEMO
          </span>
        </div>

        {/* Improved Interactive Demo Mode with Client vs Admin triggers */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin("candidate")}
              className="inline-flex flex-col justify-center items-center gap-1.5 py-3 px-3 border border-slate-200 text-xs font-bold rounded-2xl text-slate-700 hover:text-[#4318FF] bg-[#F4F7FE]/50 hover:bg-indigo-50/30 transition-all text-center"
            >
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span>Demo Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="inline-flex flex-col justify-center items-center gap-1.5 py-3 px-3 border border-indigo-100 text-xs font-bold rounded-2xl text-[#4318FF] hover:text-white bg-[#4318FF]/5 hover:bg-[#4318FF] transition-all text-center"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-650 hover:text-white" />
              <span>Demo Administrator</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-1 leading-normal px-1">
            Sign in instantly to test distinct access controls. 
            Admins get exclusive view authorization for databases.
          </p>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-xs font-semibold text-[#4318FF] hover:underline transition-all"
          >
            {isRegister
              ? "Already have an account? Sign In"
              : "Need a new tracker? Register Account"}
          </button>
        </div>

      </div>
    </div>
  );
}
