import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", glyph: "▤" },
  { to: "/add-finance", label: "Add Finance", glyph: "＋" },
  { to: "/members", label: "Members", glyph: "◔" },
  { to: "/transactions", label: "Transaction History", glyph: "≡" },
] as const;

function ShellLayout() {
  const { ready, token, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (ready && !token) navigate({ to: "/login", replace: true });
  }, [ready, token, navigate]);

  async function handleLogout() {
    setMenuOpen(false);
    await signOut();
    navigate({ to: "/login", replace: true });
  }

  if (!ready || !token) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-ink">Loading ledger…</p>
      </div>
    );
  }

  const navList = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted-ink transition-colors hover:bg-rail"
          activeProps={{ className: "bg-rail text-ink" }}
        >
          <span className="w-4 text-center text-[14px]">{item.glyph}</span>
          {item.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-withdraw transition-colors hover:bg-rail"
      >
        <span className="w-4 text-center text-[14px]">⎋</span>
        Logout
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-paper">
      {/* desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface p-4 md:flex">
        <div className="mb-6 px-2 leading-tight">
          <p className="font-display text-[18px] font-black tracking-tight text-ink">Passbook</p>
          <p className="font-mono text-[10px] tracking-wide text-muted-ink">SHREE JANAKI CO-OP</p>
        </div>
        {navList}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-20 border-b border-line bg-surface">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="grid size-9 place-items-center rounded-lg text-ink ring-1 ring-line md:hidden"
              >
                <span className="flex flex-col gap-[5px]">
                  <span className="block h-[2px] w-4 bg-ink" />
                  <span className="block h-[2px] w-4 bg-ink" />
                  <span className="block h-[2px] w-4 bg-ink" />
                </span>
              </button>
              <div className="leading-tight md:hidden">
                <p className="font-display text-[17px] font-black tracking-tight text-ink">Passbook</p>
                <p className="font-mono text-[10px] tracking-wide text-muted-ink">SHREE JANAKI CO-OP</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-[13px] font-semibold text-ink">{user?.name ?? "Administrator"}</p>
                <p className="font-mono text-[10px] text-muted-ink">ADMIN</p>
              </div>
              <button
                onClick={handleLogout}
                className="h-9 rounded-lg px-3 text-[13px] font-medium text-muted-ink ring-1 ring-line"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-surface p-4">
            <div className="mb-6 flex items-start justify-between px-2">
              <div className="leading-tight">
                <p className="font-display text-[18px] font-black tracking-tight text-ink">Passbook</p>
                <p className="font-mono text-[10px] tracking-wide text-muted-ink">SHREE JANAKI CO-OP</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="font-mono text-[13px] text-muted-ink"
              >
                ✕
              </button>
            </div>
            {navList}
          </div>
        </div>
      ) : null}
    </div>
  );
}
