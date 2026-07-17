# CareBearBooks Expense Tracker — Design Document

## 1. Overview

The CareBearBooks Expense Tracker is a full-stack web application for recording and analysing personal or business expenses.

Authenticated users can create, view, update, and delete their own expenses. The dashboard provides accounting-focused summaries including total spending, net spending, VAT, and spending by category. Expenses can be entered in different currencies and converted into KES for reporting.

## 2. Goals

- Provide secure email and password authentication.
- Restrict every user to their own expense records.
- Support complete expense CRUD functionality.
- Validate input at the client, server, and database levels.
- Calculate VAT and net expense values correctly.
- Convert expenses into a common reporting currency.
- Provide a responsive interface for mobile and desktop.
- Handle database and external API failures clearly.

## 3. Technology Stack

- Frontend: Next.js App Router, React, TypeScript
- Styling: Tailwind CSS
- Backend: Next.js Server Components, Server Actions, and Middleware
- Database: Supabase PostgreSQL
- Authentication: Supabase Auth
- Authorization: Supabase Row Level Security
- Validation: Zod
- Currency API: Frankfurter API
- Deployment: Vercel
- Version control: Git and GitHub

## 4. High-Level Architecture

```text
User browser
     |
     v
Next.js application
  - React user interface
  - Server Components
  - Server Actions
  - Route Handlers
     |
     +----------------------+
     |                      |
     v                      v
Supabase                 Exchange-rate API
  - Authentication         - Currency rates
  - PostgreSQL
  - Row Level Security