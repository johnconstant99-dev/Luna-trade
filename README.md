# Luna Trade - Full Production Investment Platform

A complete, secure, production-ready investment platform with:

- **Live Trading Terminal** powered by Alpaca (Paper + Live)
- **Plaid Bank Linking** + **Investments Move (ACATS)**
- **Real User Authentication** with Prisma + Database
- Secure backend API routes (keys never exposed to browser)
- Professional luxury dark/gold UI

## Quick Start

```bash
npm install

# 1. Setup environment
cp .env.example .env.local

# 2. Setup Prisma + Database
npx prisma generate
npx prisma db push

# 3. Add your Plaid and Alpaca keys in .env.local

npm run dev
```

Then open:
- http://localhost:3000 → Landing
- http://localhost:3000/signup → Create account
- http://localhost:3000/trading → Live trading view

**Demo flow**: Create an account → Login → Trade with live Alpaca data

## Database (Prisma)

- Currently using **SQLite** for easy local development
- To switch to **PostgreSQL** (recommended for production):
  1. Change `provider = "postgresql"` in `prisma/schema.prisma`
  2. Update `DATABASE_URL` in `.env.local` with your Postgres connection string
  3. Run `npx prisma db push`

## Production Checklist

See `LAUNCH_CHECKLIST.md`.

## Key Features

- Real-time positions from Alpaca (auto-refresh)
- Place Market and Limit orders
- Secure Plaid integration for funding
- Full Investments Move (ACATS) flow
- Real user accounts with hashed passwords
- Clean, professional trading interface

Ready for launch.
