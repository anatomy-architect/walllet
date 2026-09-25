# 🌊 AquaVault — Hydro Turbine Investment Platform

A fully functional full-stack web application: invest in hydro turbine plans with simple
daily ROI, manual USDT (BEP20) deposits and withdrawals, and a 3-level referral program.

**Stack:** React 18 + Vite + Tailwind + Zustand (frontend) · Node.js + Express (backend) ·
PostgreSQL + Prisma (database) · Redis + BullMQ optional for the earnings queue.

## Project layout

```
aquavault/
├── backend/          # Express API, Prisma schema, earnings engine, seed script
│   ├── prisma/schema.prisma
│   ├── src/index.js  # server bootstrap, scheduler
│   ├── src/lib/      # config, money helpers, auth, ledger, notifications, audit
│   ├── src/routes/   # all REST endpoints (versioned /api/v1)
│   └── src/jobs/earnings.js
├── frontend/         # Vite + React + Tailwind app
│   └── src/pages     # landing, auth, dashboard, plans, deposit, withdraw,
│                     # team, history, notifications, profile + full admin console
├── docs/
│   ├── DEPLOYMENT.md
│   ├── SECURITY_CHECKLIST.md
│   └── GO_LIVE_WARNING.md   # ⚠️ read before launching
└── README.md
```

## Quick start (local)

```bash
# 1. PostgreSQL — create the database and point the backend at it.
#    Any PostgreSQL 14+ works. Example for a local instance on port 5433:
createdb -h localhost -p 5433 -U postgres aquavault
# 2. Backend
cd backend
cp .env.example .env
# edit .env: DATABASE_URL=postgresql://postgres:postgres@localhost:5433/aquavault
#            SESSION_SECRET=<random 32+ bytes>, BEP20_RECEIVING_ADDRESS=<vault address>
npm install
npx prisma migrate deploy   # applies all migrations incl. the TIMESTAMPTZ fix
npx prisma generate
npm run seed                # 5 turbine plans + superadmin (idempotent upserts)
npm run dev                 # → http://localhost:4000
# 3. Frontend (new terminal)
cd frontend && npm install && npm run dev   # → http://localhost:5173
```

> Tested setup: PostgreSQL 18 on `localhost:5433`, `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres`.
> The Prisma schema uses `TIMESTAMPTZ(3)` columns; migration `20260925090100_fix_timestamptz`
> converts legacy `timestamp without time zone` columns so date round-trips stay skew-free.

Admin login: email `admin@aquavault.local`, password `Admin@123` (**change immediately**).

### The 5 turbine plans (seeded)

| Plan | Min | Daily ROI | Duration | Cycle ROI | Withdrawal fee |
|------|-----|-----------|----------|-----------|----------------|
| Coral Stream | $20 | 0.85% | 27 days | 23.0% | 10% |
| Deep Current | $50 | 1.30% | 23 days | 29.9% | 6% |
| Ocean Pulse | $100 | 1.70% | 21 days | 35.7% | 4% |
| Abyss Flow | $300 | 2.30% | 35 days | 80.5% | 0% |
| Titan Current | $500 | 3.50% | **48 days** | 168.0% | 0% |

## How the money moves

1. **Deposit** — user sends USDT (BEP20) to the vault address, submits the TX hash.
   Admin verifies on BscScan and approves → turbine activates, starts earning.
2. **Daily earnings** — server-side job credits `amount × dailyRate / 100` to the user,
   plus L1 (3%/3d), L2 (2%/3d), L3 (0.8%/5d) commissions up the referral tree.
   Every credit is a ledger entry; idempotency keys make reruns safe.
3. **Withdrawal** — funds held instantly, fee applied from the user's most recent
   turbine (10% default), admin sends USDT manually within 12–18h and records the
   payout TX hash.

Full runbook, backup, and monitoring guidance: `docs/DEPLOYMENT.md`.
Security hardening checklist: `docs/SECURITY_CHECKLIST.md`.
