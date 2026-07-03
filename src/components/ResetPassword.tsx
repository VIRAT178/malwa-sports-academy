import React, { useState } from "react";
import { Shield, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";
import { API_BASE } from "../config";

interface ResetPasswordProps {
  token: string;
  setView: (view: string) => void;
}

export default function ResetPassword({ token, setView }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please specify a security passcode.");
      return;
    }
    if (password.length < 6) {
      setError("Passcode must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Security passcodes do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Reset token has expired or is invalid.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-zinc-50 min-h-[70vh] py-16 px-4 flex items-center justify-center relative">
      <div className="absolute inset-0 sports-grid-pattern opacity-5 pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-xl relative z-10 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-red-200">
            MSA
          </div>
          <h3 className="font-title text-2xl font-black uppercase tracking-wider text-zinc-900">
            Reset Passcode
          </h3>
          <p className="text-zinc-500 text-xs uppercase font-black">
            Configure new security credentials for your academy portal
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto" />
            <h4 className="font-black text-zinc-900 uppercase text-sm">Passcode Updated</h4>
            <p className="text-zinc-600 text-xs font-semibold">Your portal credentials have been successfully updated. You may now authenticate using your new passcode.</p>
            
            <button
              onClick={() => {
                // Clear URL parameters and return home
                window.history.replaceState({}, document.title, window.location.pathname);
                setView("home");
              }}
              className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-black uppercase tracking-widest text-white transition cursor-pointer"
            >
              Return Home & Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                New Security Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:border-red-600 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Confirm New Passcode
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Retype your passcode"
                className="w-full rounded-xl bg-zinc-50 border border-zinc-250 px-4 py-3 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-3.5 text-xs font-black uppercase tracking-widest text-white transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>{isSubmitting ? "Updating Registries..." : "COMMIT NEW PASSWORD"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.history.replaceState({}, document.title, window.location.pathname);
                  setView("home");
                }}
                className="w-full rounded-xl border border-zinc-200 hover:bg-zinc-50 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-500 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Return Home
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
