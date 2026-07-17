type CategoryBreakdownProps = {
  totals: Record<string, number>;
};

function formatKes(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function CategoryBreakdown({
  totals,
}: CategoryBreakdownProps) {
  const categories = Object.entries(totals).sort(
    ([, firstAmount], [, secondAmount]) =>
      secondAmount - firstAmount,
  );

  if (categories.length === 0) {
    return null;
  }

  const largestAmount = categories[0]?.[1] ?? 1;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">
        Spend by category
      </h2>

      <p className="mt-1 text-sm text-slate-600">
        Converted into KES for consistent reporting.
      </p>

      <div className="mt-6 space-y-5">
        {categories.map(([category, amount]) => {
          const percentage = (amount / largestAmount) * 100;

          return (
            <div key={category}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-700">
                  {category}
                </p>

                <p className="text-sm font-semibold text-slate-950">
                  {formatKes(amount)}
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
