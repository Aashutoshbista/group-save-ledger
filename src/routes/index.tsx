import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Passbook — Cooperative Savings Ledger" },
      {
        name: "description",
        content: "Sign in to the cooperative savings ledger to record deposits, withdrawals and members.",
      },
      { property: "og:title", content: "Passbook — Cooperative Savings Ledger" },
      {
        property: "og:description",
        content: "Sign in to the cooperative savings ledger to record deposits, withdrawals and members.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { ready, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    navigate({ to: token ? "/dashboard" : "/login", replace: true });
  }, [ready, token, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-paper">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-ink">Opening passbook…</p>
    </div>
  );
}
