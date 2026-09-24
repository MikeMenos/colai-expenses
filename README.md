# Κατάσταση Εξόδων (colai-expenses)

Web app for recording a seller’s daily travel expenses, modeled on the MAVROGENIS paper form (kilometers, parking, tolls, dining, and other costs).

## Stack

- **Next.js** (App Router)
- **React Query** + **Axios** for data fetching
- **shadcn/ui** + **Tailwind CSS**
- **Zod** + **react-hook-form** for validation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Dashboard** (`/`): pick a month, view summary cards and a daily ledger.
- **Add expense** (`/expenses/new`): date, license plate, route, and expense fields.
- **Calculations**:
  - Mileage reimbursement: total km × **0.13** €
  - Grand total: reimbursement + parking + tolls + dining + other

## Data storage

Entries are kept in an **in-memory store** on the server. Data is **lost when the dev server restarts**. This is intentional for the first version.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/expenses?month=YYYY-MM` | List entries for a month |
| `POST` | `/api/expenses` | Create entry (409 if date already exists) |
| `DELETE` | `/api/expenses/:id` | Delete an entry |
| `GET` | `/api/expenses/summary?month=YYYY-MM` | Month totals and grand total |

## Field glossary

| Greek (form) | Field |
|--------------|--------|
| ΗΜΕΡΟΜΗΝΙΑ | Date |
| ΔΙΑΔΡΟΜΗ | Route / description |
| ΧΙΛΙΟΜ. | Kilometers |
| ΚΑΥΣΙΜΑ | Fuel |
| PARKING | Parking |
| ΔΙΟΔΙΑ | Tolls |
| ΕΞΟΔΑ ΕΣΤΙΑΣΗΣ | Dining |
| ΑΛΛΟ | Other |
| ΑΡΙΘ. ΚΥΚΛ. | License plate |
