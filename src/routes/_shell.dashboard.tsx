import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  formatDate,
  formatRs,
  formatSigned,
  formatTime,
  getDashboardStats,
  getTodaysTransactions,
  todayISO,
} from "../api";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Passbook Ledger" },
      {
        name: "description",
        content: "Today's cooperative ledger overview: total balance, deposits, withdrawals and entries.",
      },
      { property: "og:title", content: "Dashboard — Passbook Ledger" },
      {
        property: "og:description",
        content: "Today's cooperative ledger overview: total balance, deposits, withdrawals and entries.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const stats = useQuery({ queryKey: ["dashboard-stats"], queryFn: getDashboardStats });
  const todays = useQuery({ queryKey: ["todays-transactions"], queryFn: getTodaysTransactions });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rise px-4 pt-5 pb-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass">Passbook · Today</p>
            <h1 className="font-display text-[26px] font-black leading-none tracking-tight text-ink">
              Ledger overview
            </h1>
          </div>
          <span className="font-mono text-[11px] text-muted-ink">{formatDate(todayISO())}</span>
        </div>

        <section className="mt-4 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
          <div className="px-3 py-4">
            <p className="label-ledger">Total balance</p>
            <p className="mt-2 font-mono text-[17px] font-medium leading-none tabular-nums text-ink sm:text-[20px]">
              {stats.data ? formatRs(stats.data.totalBalance) : "—"}
            </p>
            <p className="mt-1.5 font-mono text-[10px] text-muted-ink">
              {stats.data ? `${stats.data.memberCount} members` : ""}
            </p>
          </div>
          <div className="px-3 py-4">
            <p className="label-ledger">Deposits</p>
            <p className="mt-2 font-mono text-[17px] font-medium leading-none tabular-nums text-deposit sm:text-[20px]">
              {stats.data ? `+${formatRs(stats.data.todaysDeposits)}` : "—"}
            </p>
            <p className="mt-1.5 font-mono text-[10px] text-deposit">
              {stats.data ? `${stats.data.todaysDepositCount} entries` : ""}
            </p>
          </div>
          <div className="px-3 py-4">
            <p className="label-ledger">Withdrawals</p>
            <p className="mt-2 font-mono text-[17px] font-medium leading-none tabular-nums text-withdraw sm:text-[20px]">
              {stats.data ? `\u2212${formatRs(stats.data.todaysWithdrawals)}` : "—"}
            </p>
            <p className="mt-1.5 font-mono text-[10px] text-withdraw">
              {stats.data ? `${stats.data.todaysWithdrawalCount} entries` : ""}
            </p>
          </div>
        </section>
      </div>

      <section className="rise px-4 pb-8 [animation-delay:120ms]">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink">
            Today's transactions
          </h2>
          <Link to="/transactions" className="font-mono text-[11px] text-brass">
            All →
          </Link>
        </div>

        <div className="rounded-2xl bg-surface ring-1 ring-line">
          <div className="grid grid-cols-[1.6fr_1fr_.9fr] gap-3 border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-ink">
            <span>Member</span>
            <span className="text-right">Type</span>
            <span className="text-right">Amount</span>
          </div>

          <div className="divide-y divide-line text-[13px]">
            {todays.isLoading ? (
              <p className="px-4 py-6 text-center font-mono text-[11px] text-muted-ink">Loading…</p>
            ) : todays.data && todays.data.length > 0 ? (
              todays.data.map((t, i) => (
                <div
                  key={t.id}
                  className={`grid grid-cols-[1.6fr_1fr_.9fr] items-center gap-3 px-4 py-3 ${
                    i % 2 === 1 ? "bg-paper/50" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{t.memberName}</p>
                    <p className="truncate text-[11px] text-muted-ink">
                      {[t.notes, t.voucherNo ? `Voucher #${t.voucherNo}` : null, formatTime(t.createdAt)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span
                    className={`text-right font-mono text-[11px] uppercase tracking-wide ${
                      t.type === "deposit" ? "text-deposit" : "text-withdraw"
                    }`}
                  >
                    {t.type}
                  </span>
                  <span
                    className={`text-right font-mono font-medium tabular-nums ${
                      t.type === "deposit" ? "text-deposit" : "text-withdraw"
                    }`}
                  >
                    {formatSigned(t.type, t.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-4 py-6 text-center font-mono text-[11px] text-muted-ink">
                No entries recorded today.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
