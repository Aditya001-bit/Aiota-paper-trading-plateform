# Aiota

Aiota is a multi-user stock-trading simulator. It uses virtual INR cash only and does not submit orders to any broker or exchange.

## Run locally

1. Copy `backend/.env.example` to `backend/.env`, then provide an Atlas `MONGO_URL` and a long random `JWT_SECRET`.
2. MongoDB transactions require an Atlas cluster (or local replica set), not a standalone MongoDB server.
3. Install and run each project independently:

```sh
cd backend && npm install && npm run dev
cd dashboard && npm install && npm start
cd frontend && npm install && npm start
```

Set `REACT_APP_API_BASE_URL=http://localhost:3002/api/v1` for the dashboard when needed. The dashboard token deliberately lives only in browser memory, so a reload requires signing in again.

## V1 API

- Public: `GET /health`, `POST /api/v1/auth/signup`, `POST /api/v1/auth/login`
- Bearer-token protected: `/users/me`, `/instruments`, `/watchlist`, `/account`, `/holdings`, `/portfolio`, `/orders`, `/transactions`
- `POST /orders` accepts `{ "symbol": "INFY", "side": "BUY", "quantity": 1 }`; the server chooses the execution price and executes immediately.

## Design decisions

- Prices and cash are integer paise; JavaScript floating-point money is never used.
- New accounts receive ₹1,00,000 virtual cash.
- The backend updates a curated instrument catalog with deterministic demo price ticks.
- A MongoDB transaction updates cash, holdings, order, and immutable trade ledger record atomically.
- Holdings use weighted-average cost. Brokerage, taxes, limit orders, partial fills, withdrawals, real market data, and WebSockets are explicitly out of scope for V1.

## Verification

Run `npm test` in `backend` for the financial calculation unit tests. A GitHub Actions workflow builds the dashboard and runs backend tests. Before release, smoke-test signup, sign-in, adding/removing a watchlist item, buying, selling, insufficient cash/shares, holdings, and order history.
