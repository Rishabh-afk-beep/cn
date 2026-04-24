import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "../lib/AuthContext";
import { completeProfile, updateMe } from "../lib/api";
import { Reveal } from "../components/ui/Reveal";

export function ProfilePage() {
  const { profile, firebaseUser, loading, logout, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [email, setEmail] = useState(profile?.email || firebaseUser?.email || "");
  const [saved, setSaved] = useState(false);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!profile?.name) {
        return completeProfile({ name, phone, email });
      }
      return updateMe({ name, phone, email });
    },
    onSuccess: async () => {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (!loading && !firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  const roleLabel = profile?.role === "owner" ? "Property Owner" : profile?.role === "admin" ? "Admin" : "Student";
  const roleIcon = profile?.role === "owner" ? "🏠" : profile?.role === "admin" ? "⚙️" : "🎓";

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      {/* Profile Header */}
      <Reveal>
        <section
          className="relative overflow-hidden rounded-3xl p-8"
          style={{ background: "var(--gradient-amber)" }}
        >
          {/* Decorative glow */}
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30"
            style={{ background: "var(--on-primary)", filter: "blur(40px)" }}
          />
          <div className="relative z-10 flex items-center gap-5">
            <div
              className="flex h-18 w-18 items-center justify-center rounded-2xl text-3xl font-black"
              style={{
                width: 72,
                height: 72,
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(12px)",
                color: "var(--on-primary)",
              }}
            >
              {(profile?.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: "var(--on-primary)" }}>
                {profile?.name || "Set up your profile"}
              </h1>
              <p className="mt-1 text-sm font-medium" style={{ color: "rgba(255,255,255,0.70)" }}>
                {roleIcon} {roleLabel} · {profile?.uid?.slice(0, 8)}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Personal Information */}
      <Reveal className="mt-6" delayMs={60}>
        <section className="glass-card-static p-7">
          <h2 className="text-lg font-black" style={{ color: "var(--on-surface)" }}>
            Personal Information
          </h2>

          {saved && (
            <div
              className="mt-4 animate-toast-in rounded-xl p-4 text-sm font-semibold"
              style={{
                background: "var(--success-container)",
                color: "#065f46",
              }}
            >
              ✓ Profile saved successfully
            </div>
          )}

          <div className="mt-5 space-y-5">
            <label className="block">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--outline)", letterSpacing: "0.05em" }}
              >
                Full Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field mt-2"
              />
            </label>
            <label className="block">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--outline)", letterSpacing: "0.05em" }}
              >
                Phone
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field mt-2"
              />
            </label>
            <label className="block">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--outline)", letterSpacing: "0.05em" }}
              >
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-2"
              />
            </label>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="btn-primary disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={logout}
              className="rounded-full px-6 py-3 text-sm font-bold transition-colors"
              style={{
                background: "rgba(186, 26, 26, 0.08)",
                color: "var(--error)",
              }}
            >
              Sign Out
            </button>
          </div>
        </section>
      </Reveal>

      {/* Account Details */}
      <Reveal className="mt-6" delayMs={110}>
        <section className="glass-card-static p-7">
          <h2 className="text-lg font-black" style={{ color: "var(--on-surface)" }}>
            Account Details
          </h2>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>Role</span>
              <span className="badge badge-amber">{profile?.role || "student"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>Status</span>
              <span className="badge badge-emerald">{profile?.status || "active"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>Verification</span>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--on-surface)" }}
              >
                {profile?.verification_state || "unverified"}
              </span>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
