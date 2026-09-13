# Savvy Ledger

Build the FRONTEND ONLY for a cooperative savings ledger web app. Do not set up a database or backend — I will connect my own REST API separately. Use mock/placeholder data for now and structure API calls so I can swap in real endpoints later (e.g. a single api.js/api.ts file with functions like getMembers(), getTransactions(), addTransaction(), deleteTransaction(), login()).

AUTH (frontend only)

- Simple login page: username + password fields, submit button, forget password.

- No signup page,, no email verification.

- On submit, call a login(username, password) function that (for now) returns a mock success/fail — I will wire this to my real API later.

- Store returned auth token in memory/localStorage and redirect to Dashboard on success.

- Redirect to login if no token is present when visiting protected pages.

LAYOUT

- Sidebar (left) with nav items: Dashboard, Add Finance, Members, Transaction History, Logout.

- Top area shows the logged-in admin name and a logout button.

- Mobile-friendly: sidebar collapses to a hamburger menu on small screens.

DASHBOARD PAGE

- Three stat cards at the top:

  1. Total Balance (sum across all members)

  2. Today's Deposits (sum of today's "add money" transactions)

  3. Today's Withdrawals (sum of today's "take out money" transactions)

- Below the cards, a table of today's transactions: member name, type (deposit/withdraw), amount, notes, time.

- All numbers pulled from placeholder/mock data via functions like getDashboardStats() and getTodaysTransactions(), ready to be swapped for real API calls.

ADD FINANCE PAGE (core feature)

- Searchable dropdown to select an existing member (mock list for now), or a "+ New Member" inline option.

- Toggle or radio buttons: "Add Money" (deposit) vs "Take Out Money" (withdraw).

- Fields: amount (number), date (default today), voucher number (optional text), notes/thoughts (free text textarea).

- Submit button calls addTransaction(data) — show a success message and reset the form on success.

- Client-side validation: amount required and > 0, member required.

MEMBERS PAGE

- Table listing members: membership no., name, address, phone, current balance.

- "+ Add Member" button opens a form (membership no., name, address, phone) that calls addMember(data).

- Each row has an "Edit" and "Delete" action (Delete asks for confirmation before calling deleteMember(id)).

TRANSACTION HISTORY PAGE

- Table of all transactions: date, member name, type, amount, running balance, notes.

- Filters at the top: by member (dropdown) and by date range.

- Delete button per row (confirmation modal) calling deleteTransaction(id).

- Pagination or infinite scroll if the list is long.

DESIGN

- Clean, minimal, professional finance-app look.

- Currency displayed as "Rs." (NPR).

- Green for deposits/positive amounts, red for withdrawals, in tables and stat cards.

- Use [React / Next.js / Vue — pick one] with [Tailwind CSS] for styling.

API LAYER

- Put all data-fetching in one file (e.g. src/api.js) with clearly named functions and comments showing the expected request/response shape (see below), so I can connect it to my own MongoDB-backed API afterward.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f69aba79-d918-4f90-b5e1-4928fa766d23).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
