/**
 * ---------------------------------------------------------------------------
 * SINGLE API LAYER
 * ---------------------------------------------------------------------------
 * Every data call in the app goes through this file. Right now each function
 * returns mock data after a short delay. To connect your own REST API, replace
 * the body of each function with a `request(...)` call — the expected
 * request/response shapes are documented above each function.
 *
 * Example once your API is ready:
 *
 *   const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
 *
 *   async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
 *     const res = await fetch(`${API_BASE}${path}`, {
 *       ...init,
 *       headers: {
 *         "Content-Type": "application/json",
 *         ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
 *         ...init.headers,
 *       },
 *     });
 *     if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? res.statusText);
 *     return res.json() as Promise<T>;
 *   }
 */

/* ===========================================================================
 * TYPES
 * ========================================================================= */

export type TransactionType = "deposit" | "withdraw";

export interface Member {
  id: string;
  membershipNo: string;
  name: string;
  address: string;
  phone: string;
  /** Current savings balance in NPR. */
  balance: number;
}

export interface Transaction {
  id: string;
  memberId: string;
  /** Denormalized for table display. */
  memberName: string;
  type: TransactionType;
  amount: number;
  /** ISO date string: "2026-09-13" */
  date: string;
  /** ISO timestamp of when the entry was recorded. */
  createdAt: string;
  voucherNo?: string;
  notes?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface DashboardStats {
  totalBalance: number;
  memberCount: number;
  todaysDeposits: number;
  todaysDepositCount: number;
  todaysWithdrawals: number;
  todaysWithdrawalCount: number;
}

/* ===========================================================================
 * AUTH TOKEN STORAGE (localStorage + in-memory mirror)
 * ========================================================================= */

const TOKEN_KEY = "passbook.token";
const USER_KEY = "passbook.user";

let memoryToken: string | null = null;
let memoryUser: AuthUser | null = null;

export function getToken(): string | null {
  if (memoryToken) return memoryToken;
  if (typeof window === "undefined") return null;
  memoryToken = window.localStorage.getItem(TOKEN_KEY);
  return memoryToken;
}

export function getCurrentUser(): AuthUser | null {
  if (memoryUser) return memoryUser;
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  memoryUser = raw ? (JSON.parse(raw) as AuthUser) : null;
  return memoryUser;
}

function setSession(token: string, user: AuthUser) {
  memoryToken = token;
  memoryUser = user;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  memoryToken = null;
  memoryUser = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
}

/* ===========================================================================
 * MOCK DATA STORE (delete once the real API is wired up)
 * ========================================================================= */

const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

let members: Member[] = [
  { id: "m1", membershipNo: "MB-001", name: "Rita Adhikari", address: "Janakpur-04, Dhanusha", phone: "9812345601", balance: 128400 },
  { id: "m2", membershipNo: "MB-002", name: "Bikash Thapa", address: "Bharatpur-11, Chitwan", phone: "9812345602", balance: 74250 },
  { id: "m3", membershipNo: "MB-003", name: "Sunita Gurung", address: "Pokhara-08, Kaski", phone: "9812345603", balance: 96300 },
  { id: "m4", membershipNo: "MB-004", name: "Kiran Rai", address: "Dharan-16, Sunsari", phone: "9812345604", balance: 51980 },
  { id: "m5", membershipNo: "MB-005", name: "Dipa Prasad", address: "Lalitpur-03, Bagmati", phone: "9812345605", balance: 88500 },
  { id: "m6", membershipNo: "MB-006", name: "Ramesh Karki", address: "Butwal-07, Rupandehi", phone: "9812345606", balance: 43500 },
];

let transactions: Transaction[] = [
  { id: "t1", memberId: "m1", memberName: "Rita Adhikari", type: "deposit", amount: 3000, date: todayISO(), createdAt: `${todayISO()}T09:12:00`, voucherNo: "1042", notes: "Monthly savings" },
  { id: "t2", memberId: "m2", memberName: "Bikash Thapa", type: "withdraw", amount: 2500, date: todayISO(), createdAt: `${todayISO()}T10:05:00`, voucherNo: "1043", notes: "Loan repayment cash out" },
  { id: "t3", memberId: "m3", memberName: "Sunita Gurung", type: "deposit", amount: 1500, date: todayISO(), createdAt: `${todayISO()}T11:20:00`, voucherNo: "1044", notes: "Monthly share" },
  { id: "t4", memberId: "m4", memberName: "Kiran Rai", type: "withdraw", amount: 1800, date: todayISO(), createdAt: `${todayISO()}T13:48:00`, voucherNo: "1045", notes: "Emergency" },
  { id: "t5", memberId: "m5", memberName: "Dipa Prasad", type: "deposit", amount: 7950, date: todayISO(), createdAt: `${todayISO()}T14:31:00`, voucherNo: "1046", notes: "Group collection" },
  { id: "t6", memberId: "m1", memberName: "Rita Adhikari", type: "deposit", amount: 5000, date: daysAgoISO(1), createdAt: `${daysAgoISO(1)}T10:02:00`, voucherNo: "1039", notes: "Shop earnings" },
  { id: "t7", memberId: "m6", memberName: "Ramesh Karki", type: "withdraw", amount: 4000, date: daysAgoISO(1), createdAt: `${daysAgoISO(1)}T12:14:00`, voucherNo: "1040", notes: "School fees" },
  { id: "t8", memberId: "m3", memberName: "Sunita Gurung", type: "deposit", amount: 2600, date: daysAgoISO(2), createdAt: `${daysAgoISO(2)}T09:40:00`, voucherNo: "1035", notes: "Weekly top-up" },
  { id: "t9", memberId: "m2", memberName: "Bikash Thapa", type: "deposit", amount: 9000, date: daysAgoISO(3), createdAt: `${daysAgoISO(3)}T15:05:00`, voucherNo: "1030", notes: "Harvest income" },
  { id: "t10", memberId: "m4", memberName: "Kiran Rai", type: "withdraw", amount: 1200, date: daysAgoISO(4), createdAt: `${daysAgoISO(4)}T11:11:00`, voucherNo: "1028", notes: "Medical" },
  { id: "t11", memberId: "m5", memberName: "Dipa Prasad", type: "deposit", amount: 3400, date: daysAgoISO(5), createdAt: `${daysAgoISO(5)}T10:24:00`, voucherNo: "1024", notes: "Savings" },
  { id: "t12", memberId: "m6", memberName: "Ramesh Karki", type: "deposit", amount: 2200, date: daysAgoISO(6), createdAt: `${daysAgoISO(6)}T16:02:00`, voucherNo: "1019", notes: "Tailoring income" },
  { id: "t13", memberId: "m1", memberName: "Rita Adhikari", type: "withdraw", amount: 6500, date: daysAgoISO(7), createdAt: `${daysAgoISO(7)}T09:55:00`, voucherNo: "1015", notes: "Festival expenses" },
  { id: "t14", memberId: "m3", memberName: "Sunita Gurung", type: "deposit", amount: 4800, date: daysAgoISO(9), createdAt: `${daysAgoISO(9)}T14:45:00`, voucherNo: "1011", notes: "Livestock sale" },
  { id: "t15", memberId: "m2", memberName: "Bikash Thapa", type: "withdraw", amount: 3100, date: daysAgoISO(11), createdAt: `${daysAgoISO(11)}T11:30:00`, voucherNo: "1008", notes: "Seed purchase" },
];

/* ===========================================================================
 * AUTH
 * ========================================================================= */

/**
 * POST /auth/login
 * Request:  { username: string, password: string }
 * Response: { token: string, user: { id, username, name } }
 *
 * Mock: any username with password length >= 4 succeeds.
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  await delay();
  if (!username.trim() || password.length < 4) {
    throw new Error("Invalid username or password.");
  }
  const res: LoginResponse = {
    token: `mock-token-${uid()}`,
    user: { id: "u1", username, name: "D. Sharma" },
  };
  setSession(res.token, res.user);
  return res;
}

/**
 * POST /auth/logout  (optional server call)
 * Clears the locally stored token.
 */
export async function logout(): Promise<void> {
  clearSession();
}

/**
 * POST /auth/forgot-password
 * Request:  { username: string }
 * Response: { message: string }
 */
export async function requestPasswordReset(username: string): Promise<{ message: string }> {
  await delay();
  return { message: `Reset instructions were sent to the contact on file for "${username}".` };
}

/* ===========================================================================
 * MEMBERS
 * ========================================================================= */

/** GET /members -> Member[] */
export async function getMembers(): Promise<Member[]> {
  await delay();
  return [...members];
}

/**
 * POST /members
 * Request:  { membershipNo, name, address, phone }
 * Response: Member (with id and balance: 0)
 */
export async function addMember(data: Omit<Member, "id" | "balance">): Promise<Member> {
  await delay();
  const member: Member = { id: uid(), balance: 0, ...data };
  members = [...members, member];
  return member;
}

/**
 * PUT /members/:id
 * Request:  { membershipNo, name, address, phone }
 * Response: Member
 */
export async function updateMember(id: string, data: Omit<Member, "id" | "balance">): Promise<Member> {
  await delay();
  members = members.map((m) => (m.id === id ? { ...m, ...data } : m));
  transactions = transactions.map((t) => (t.memberId === id ? { ...t, memberName: data.name } : t));
  const updated = members.find((m) => m.id === id);
  if (!updated) throw new Error("Member not found.");
  return updated;
}

/** DELETE /members/:id -> { success: true } */
export async function deleteMember(id: string): Promise<{ success: true }> {
  await delay();
  members = members.filter((m) => m.id !== id);
  transactions = transactions.filter((t) => t.memberId !== id);
  return { success: true };
}

/* ===========================================================================
 * TRANSACTIONS
 * ========================================================================= */

/**
 * GET /dashboard/stats
 * Response: DashboardStats
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  const today = todayISO();
  const todays = transactions.filter((t) => t.date === today);
  const dep = todays.filter((t) => t.type === "deposit");
  const wit = todays.filter((t) => t.type === "withdraw");
  return {
    totalBalance: members.reduce((s, m) => s + m.balance, 0),
    memberCount: members.length,
    todaysDeposits: dep.reduce((s, t) => s + t.amount, 0),
    todaysDepositCount: dep.length,
    todaysWithdrawals: wit.reduce((s, t) => s + t.amount, 0),
    todaysWithdrawalCount: wit.length,
  };
}

/** GET /transactions?date=today -> Transaction[] */
export async function getTodaysTransactions(): Promise<Transaction[]> {
  await delay();
  const today = todayISO();
  return transactions
    .filter((t) => t.date === today)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface TransactionFilters {
  memberId?: string;
  /** ISO date "YYYY-MM-DD" */
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface TransactionPage {
  items: Array<Transaction & { runningBalance: number }>;
  total: number;
  page: number;
  pageSize: number;
}

/**
 * GET /transactions?memberId=&from=&to=&page=&pageSize=
 * Response: { items: Transaction[] (with runningBalance), total, page, pageSize }
 */
export async function getTransactions(filters: TransactionFilters = {}): Promise<TransactionPage> {
  await delay();
  const { memberId, from, to, page = 1, pageSize = 8 } = filters;

  const filtered = transactions.filter((t) => {
    if (memberId && t.memberId !== memberId) return false;
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    return true;
  });

  // oldest -> newest so the running balance accumulates correctly
  const chronological = [...filtered].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  let running = 0;
  const withRunning = chronological.map((t) => {
    running += t.type === "deposit" ? t.amount : -t.amount;
    return { ...t, runningBalance: running };
  });

  const newestFirst = withRunning.reverse();
  const start = (page - 1) * pageSize;
  return {
    items: newestFirst.slice(start, start + pageSize),
    total: newestFirst.length,
    page,
    pageSize,
  };
}

export interface NewTransaction {
  memberId: string;
  type: TransactionType;
  amount: number;
  /** ISO date "YYYY-MM-DD" */
  date: string;
  voucherNo?: string;
  notes?: string;
}

/**
 * POST /transactions
 * Request:  { memberId, type: "deposit" | "withdraw", amount, date, voucherNo?, notes? }
 * Response: Transaction
 */
export async function addTransaction(data: NewTransaction): Promise<Transaction> {
  await delay();
  const member = members.find((m) => m.id === data.memberId);
  if (!member) throw new Error("Member not found.");

  const tx: Transaction = {
    id: uid(),
    memberId: member.id,
    memberName: member.name,
    type: data.type,
    amount: data.amount,
    date: data.date,
    createdAt: new Date().toISOString().slice(0, 19),
    voucherNo: data.voucherNo,
    notes: data.notes,
  };
  transactions = [...transactions, tx];
  members = members.map((m) =>
    m.id === member.id
      ? { ...m, balance: m.balance + (data.type === "deposit" ? data.amount : -data.amount) }
      : m,
  );
  return tx;
}

/** DELETE /transactions/:id -> { success: true } */
export async function deleteTransaction(id: string): Promise<{ success: true }> {
  await delay();
  const tx = transactions.find((t) => t.id === id);
  if (tx) {
    members = members.map((m) =>
      m.id === tx.memberId
        ? { ...m, balance: m.balance - (tx.type === "deposit" ? tx.amount : -tx.amount) }
        : m,
    );
  }
  transactions = transactions.filter((t) => t.id !== id);
  return { success: true };
}

/* ===========================================================================
 * FORMATTING HELPERS
 * ========================================================================= */

export function formatRs(amount: number): string {
  return `Rs. ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.abs(amount))}`;
}

export function formatSigned(type: TransactionType, amount: number): string {
  return `${type === "deposit" ? "+" : "\u2212"}${formatRs(amount)}`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTime(isoTimestamp: string): string {
  const d = new Date(isoTimestamp);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
