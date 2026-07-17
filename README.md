# CareBear Expense Tracker

A secure full-stack expense tracking application built as part of the CareBearBooks technical assessment.

The application allows authenticated users to record and manage expenses, track taxable transactions, calculate VAT, view spending summaries by category, and report expenses recorded in multiple currencies using a common KES base currency.

## Live Demo

**Deployed Application:** To be added after deployment

**GitHub Repository:** https://github.com/majidhawa/carebear-expense-tracker

---

## Features

### Authentication

- User registration with email and password
- Email verification through Supabase Auth
- Secure login and logout
- Persistent authentication sessions
- Protected dashboard routes
- Middleware-based session management

### Expense Management

Authenticated users can:

- Create expenses
- View their expenses
- Edit existing expenses
- Delete expenses
- Assign expense categories
- Record expenses in supported currencies
- Mark expenses as taxable or non-taxable
- Record the date of each expense

### Security

- Supabase Row Level Security (RLS)
- User-specific database access
- Database-level authorization policies
- Server-side authentication checks
- Server-side ownership checks for mutations
- Zod input validation
- Environment variables for configuration

Each expense belongs to an authenticated user through a `user_id`.

RLS policies ensure that users can only select, insert, update, and delete rows they are authorized to access.

### Dashboard Reporting

The dashboard provides:

- Total gross spending
- Net spending
- VAT portion
- Total expense count
- Spending breakdown by category
- Recent expense transactions

### VAT Calculations

The application treats taxable expense amounts as VAT-inclusive.

For a taxable expense:

```text
Net Amount = Gross Amount / (1 + VAT Rate)
VAT Amount = Gross Amount - Net Amount
```

For example, with a 16% VAT rate:

```text
Gross Amount: KES 116
Net Amount:   KES 100
VAT Amount:   KES 16
```

For non-taxable expenses:

```text
Net Amount = Gross Amount
VAT Amount = 0
```

The VAT rate is stored as a shared constant so that the business rule has a single source of truth.

### Multi-Currency Reporting

Expenses are stored in their original currencies.

For dashboard reporting, supported foreign currencies are converted into the application's base currency, KES.

The application:

- Preserves the original transaction currency and amount
- Fetches exchange rates on the server
- Converts expenses only for reporting purposes
- Caches successful exchange-rate requests
- Applies a request timeout
- Retries temporary failures once
- Validates returned exchange rates
- Gracefully handles external API failures

If currency conversion is unavailable, the original expense records remain accessible and safe. Only converted dashboard summaries become temporarily unavailable.

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js Server Components
- Next.js Server Actions
- Next.js Middleware

### Database and Authentication

- Supabase
- PostgreSQL
- Supabase Auth
- PostgreSQL Row Level Security

### Validation

- Zod

### External Services

- Frankfurter exchange-rate API

### Deployment

- Vercel

## Architecture

The application uses Next.js for both the frontend and server-side application logic.

```
Browser
   |
   v
Next.js Application
   |
   |-- Client Components
   |     Interactive forms and UI state
   |
   |-- Server Components
   |     Server-side data fetching
   |
   |-- Server Actions
   |     Create, update, and delete operations
   |
   |-- Middleware
   |     Authentication session handling
   |
   v
Supabase
   |
   |-- Authentication
   |
   |-- PostgreSQL Database
   |
   |-- Row Level Security
   |
   v
User-specific Expense Data


Dashboard Reporting
   |
   v
Exchange Rate Service
   |
   v
KES-normalized summaries
```

A more detailed architecture and database design can be found in DESIGN.md.

## Security Model

Security is enforced at multiple layers.

### Authentication

Supabase Auth manages user identity and sessions.

### Route Protection

Next.js middleware prevents unauthenticated users from accessing protected dashboard routes.

### Server-Side Verification

Server Actions retrieve the authenticated user directly from Supabase before performing protected operations.

The application does not trust a `user_id` supplied by the browser when creating an expense. Instead, ownership is assigned using the authenticated user's ID on the server.

### Row Level Security

PostgreSQL Row Level Security provides the final authorization layer.

Policies compare the authenticated Supabase user ID with the `user_id` stored on each expense.

This means that even if a user bypasses the application's frontend and sends custom API requests, the database still prevents unauthorized access to another user's expenses.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── actions.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── expenses/
│   │   └── actions.ts
│   ├── login/
│   ├── signup/
│   └── page.tsx
│
├── components/
│   ├── dashboard/
│   │   ├── category-breakdown.tsx
│   │   └── summary-cards.tsx
│   └── expenses/
│       ├── edit-expense-form.tsx
│       ├── expense-form.tsx
│       └── expense-list.tsx
│
├── lib/
│   ├── constants/
│   ├── services/
│   │   └── exchange-rates.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   ├── utils/
│   │   └── expense-calculations.ts
│   └── validations/
│
├── types/
│
└── middleware.ts
```

## Getting Started

### Prerequisites

Before running the application, ensure you have:

- Node.js installed
- npm installed
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/majidhawa/carebear-expense-tracker.git
cd carebear-expense-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Add your Supabase project credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

The actual `.env.local` file is excluded from version control.

### 4. Configure the database

Create the required expenses table and enable Row Level Security using the SQL schema and policies included with the project.

The database must include RLS policies that allow authenticated users to access only their own expense records.

### 5. Run the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

### 6. Create an account

Register through the signup page and confirm your email if email confirmation is enabled in your Supabase project.

You can then sign in and access the protected dashboard.

## Available Scripts

Run the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Validation and Error Handling

The application includes validation and failure handling across several layers.

### Form Validation

Zod validates expense and authentication input on the server.

### Database Validation

PostgreSQL constraints and RLS policies provide additional data integrity and authorization protection.

### Authentication Errors

Invalid credentials return user-friendly errors without exposing unnecessary authentication details.

### Database Errors

Detailed database errors are logged on the server while users receive safe, generic error messages.

### Exchange-Rate Failures

Currency conversion uses:

- Request timeouts
- Retry handling
- Response validation
- Server-side caching
- Graceful fallback UI

An exchange-rate failure does not prevent users from accessing or managing their original expense records.

## Testing

The application was manually tested for:

- User registration
- Email verification
- Login
- Invalid login credentials
- Logout
- Protected route redirects
- Session persistence
- Expense creation
- Expense retrieval
- Expense editing
- Expense deletion
- Input validation
- VAT calculations
- Taxable and non-taxable expenses
- Multi-currency expense reporting
- Exchange-rate API failure handling
- Responsive dashboard behavior

Before deployment, the following checks were run successfully:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Key Technical Decisions

### Why Supabase?

Supabase provides PostgreSQL, authentication, and Row Level Security in one platform while still allowing the application to use standard PostgreSQL concepts.

### Why Row Level Security?

RLS moves authorization enforcement into the database.

Frontend checks improve user experience but cannot be trusted as a security boundary because clients can manipulate requests.

### Why Server Actions?

Server Actions provide a direct server-side mutation layer for this application without requiring separate API route boilerplate.

They also allow authentication and validation to happen before database mutations.

### Why store expenses in their original currency?

The original amount and currency represent the source financial transaction and should remain unchanged.

Currency conversion is therefore performed only when generating normalized KES reporting totals.

### Why derive VAT instead of storing it?

VAT and net amounts can be deterministically calculated from the expense amount, taxable status, and VAT rate.

Keeping them derived avoids storing duplicate values that could become inconsistent.

## Documentation

Additional documentation is available in:

- `DESIGN.md` — architecture, database design, system design, and technical decisions
- `ANSWERS.md` — security reasoning, authentication flow, failure handling, AI usage, and code review answers

## Future Improvements

Given additional development time, possible improvements include:

- Automated unit and integration tests
- End-to-end testing
- Historical exchange-rate storage
- Offline fallback to the latest known exchange rate
- Date-range filtering
- Category filtering and search
- Pagination for large expense datasets
- Expense export to CSV or PDF
- Receipt uploads
- Additional dashboard visualizations
- Accessibility audits
- Observability and production error monitoring

## Author

Hawaah Majid

GitHub: [majidhawa](https://github.com/majidhawa)

## Assessment Notes

This project was developed as a technical assessment with a focus on:

- Code clarity
- Secure data access
- Correctness
- Maintainability
- Error handling
- Practical full-stack architecture

AI-assisted development tools were used during development for productivity, debugging, and code review. All generated suggestions were reviewed, tested, and adjusted where necessary. 
