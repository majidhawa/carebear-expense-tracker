"use client";

import type { Expense } from "@/types/expense";

type ExportExpensesButtonProps = {
  expenses: Expense[];
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function exportCSV(expenses: Expense[]) {
  const headers = ["Title", "Amount", "Currency", "Category", "Date", "Taxable"];

  const rows = expenses.map((expense) => [
    `"${expense.title.replace(/"/g, '""')}"`,
    expense.amount,
    expense.currency,
    expense.category,
    expense.expense_date,
    expense.is_taxable ? "Yes" : "No",
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "carebearbooks-expenses.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function exportPDF(expenses: Expense[]) {
  const totalGross = expenses.reduce((sum, e) => sum + e.amount, 0);
  const exportDate = new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const rows = expenses
    .map(
      (expense) => `
        <tr>
          <td>${expense.title}</td>
          <td>${expense.category}</td>
          <td>${formatDate(expense.expense_date)}</td>
          <td>${expense.currency}</td>
          <td class="amount">${formatAmount(expense.amount, expense.currency)}</td>
          <td class="center">${expense.is_taxable ? "Yes" : "No"}</td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CareBearBooks — Expense Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #0f172a;
      background: #fff;
      padding: 48px;
      font-size: 13px;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 24px;
      border-bottom: 2px solid #0f172a;
      margin-bottom: 32px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo {
      width: 44px;
      height: 44px;
      background: #0f172a;
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .brand-name {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #059669;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }

    .meta {
      text-align: right;
      color: #64748b;
      font-size: 12px;
      line-height: 1.8;
    }

    .meta strong {
      color: #0f172a;
    }

    h1 {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 6px;
    }

    .subtitle {
      color: #64748b;
      margin-bottom: 28px;
      font-size: 13px;
    }

    .summary {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
    }

    .summary-card {
      flex: 1;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 18px;
    }

    .summary-card .label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .summary-card .value {
      font-size: 18px;
      font-weight: 800;
      margin-top: 4px;
      color: #0f172a;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead tr {
      background: #0f172a;
      color: #fff;
    }

    thead th {
      padding: 10px 14px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    tbody tr:nth-child(even) { background: #f8fafc; }
    tbody tr:nth-child(odd)  { background: #fff; }

    tbody td {
      padding: 10px 14px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 12.5px;
    }

    .amount { font-weight: 700; text-align: right; }
    .center { text-align: center; }

    footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      color: #94a3b8;
      font-size: 11px;
    }

    @media print {
      body { padding: 32px; }
      @page { margin: 0; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="logo">CB</div>
      <div>
        <div class="brand-name">CareBearBooks</div>
        <div class="brand-title">Expense Tracker</div>
      </div>
    </div>
    <div class="meta">
      <div><strong>Report generated</strong></div>
      <div>${exportDate}</div>
      <div>${expenses.length} transaction${expenses.length === 1 ? "" : "s"}</div>
    </div>
  </header>

  <h1>Expense Report</h1>
  <p class="subtitle">A summary of your recorded transactions.</p>

  <div class="summary">
    <div class="summary-card">
      <div class="label">Total transactions</div>
      <div class="value">${expenses.length}</div>
    </div>
    <div class="summary-card">
      <div class="label">Gross total (original currencies)</div>
      <div class="value">${expenses.length > 0 ? formatAmount(totalGross, expenses[0]!.currency) : "—"}</div>
    </div>
    <div class="summary-card">
      <div class="label">Taxable expenses</div>
      <div class="value">${expenses.filter((e) => e.is_taxable).length}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Category</th>
        <th>Date</th>
        <th>Currency</th>
        <th>Amount</th>
        <th>Taxable</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <footer>
    <span>CareBearBooks Expense Tracker</span>
    <span>Generated ${exportDate}</span>
  </footer>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");

  if (win) {
    win.onafterprint = () => URL.revokeObjectURL(url);
  }
}

export function ExportExpensesButton({
  expenses,
}: ExportExpensesButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => exportCSV(expenses)}
        disabled={expenses.length === 0}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
      >
        Export CSV
      </button>

      <button
        type="button"
        onClick={() => exportPDF(expenses)}
        disabled={expenses.length === 0}
        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
      >
        Export PDF
      </button>
    </div>
  );
}
