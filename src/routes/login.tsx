import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { requestPasswordReset } from "../api";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Passbook Ledger" },
      { name: "description", content: "Administrator sign-in for the cooperative savings ledger." },
      { property: "og:title", content: "Sign in — Passbook Ledger" },
      { property: "og:description", content: "Administrator sign-in for the cooperative savings ledger." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { ready, token, signIn } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && token) navigate({ to: "/dashboard", replace: true });
  }, [ready, token, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!username.trim()) return setError("Username is required.");
    if (!password) return setError("Password is required.");
    setBusy(true);
    try {
      await signIn(username.trim(), password);
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleForgot() {
    setError(null);
    if (!username.trim()) return setError("Enter your username first, then tap forgot password.");
    const res = await requestPasswordReset(username.trim());
    setNotice(res.message);
  }

  return (
    <main className="flex min-h-screen flex-col justify-center bg-paper px-4 py-10">
      <div className="mx-auto w-full max-w-sm rise">
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">Shree Janaki Co-op</p>
          <h1 className="mt-1 font-display text-[30px] font-black leading-none tracking-tight text-ink">
            Passbook
          </h1>
          <p className="mt-2 text-[13px] text-muted-ink">Administrator sign-in to the savings ledger.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-line">
          <div>
            <label htmlFor="username" className="label-ledger">
              Username
            </label>
            <input
              id="username"
              className="field mt-1.5"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div>
            <label htmlFor="password" className="label-ledger">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="field mt-1.5"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error ? <p className="text-[12px] font-medium text-withdraw">{error}</p> : null}
          {notice ? <p className="text-[12px] font-medium text-deposit">{notice}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="h-12 w-full rounded-xl bg-ink font-display text-[15px] font-semibold tracking-tight text-paper disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <button
            type="button"
            onClick={handleForgot}
            className="w-full font-mono text-[11px] uppercase tracking-wide text-brass"
          >
            Forgot password?
          </button>
        </form>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-ink">
          Demo: any username · password 4+ characters
        </p>
      </div>
    </main>
  );
}
