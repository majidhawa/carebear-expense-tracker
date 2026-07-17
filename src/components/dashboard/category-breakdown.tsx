type CategoryBreakdownProps = {
  totals: Record<string, number>;
};

const categoryStyles: Record<
  string,
  {
    bar: string;
    badge: string;
    icon: string;
  }
> = {
  Office: {
    bar: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700",
    icon: "O",
  },
  Travel: {
    bar: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700",
    icon: "T",
  },
  Meals: {
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
    icon: "M",
  },
  Utilities: {
    bar: "bg-cyan-500",
    badge: "bg-cyan-50 text-cyan-700",
    icon: "U",
  },
  Software: {
    bar: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-700",
    icon: "S",
  },
  Transport: {
    bar: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700",
    icon: "T",
  },
  Health: {
    bar: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700",
    icon: "H",
  },
  Other: {
    bar: "bg-slate-500",
    badge: "bg-slate-100 text-slate-700",
    icon: "O",
  },
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

  const totalSpend = categories.reduce(
    (sum, [, amount]) => sum + amount,
    0,
  );

  const topCategory = categories[0];

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/80 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
      <div className="border-b border-slate-200/80 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Category insight
            </span>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
              Spend by category
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              All values are converted into KES for consistent reporting.
            </p>
          </div>

          {topCategory ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                Highest category
              </p>

              <p className="mt-1 font-bold text-slate-950">
                {topCategory[0]}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-5">
          {categories.map(([category, amount], index) => {
            const share =
              totalSpend > 0
                ? (amount / totalSpend) * 100
                : 0;

            const styles =
              categoryStyles[category] ??
              categoryStyles.Other;

            return (
              <article
                key={category}
                className="group rounded-[22px] border border-transparent p-3 transition duration-300 hover:border-slate-200 hover:bg-slate-50/70"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold ${styles.badge}`}
                    >
                      {styles.icon}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        {category}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {share.toFixed(1)}% of total spend
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-950">
                      {formatKes(amount)}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      #{index + 1}
                    </p>
                  </div>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
                    style={{ width: `${share}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>

        <aside className="rounded-[24px] bg-slate-950 p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            Category total
          </p>

          <p className="mt-5 break-words text-2xl font-bold tracking-tight">
            {formatKes(totalSpend)}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Combined spend across all recorded categories.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Categories
              </span>

              <span className="font-semibold text-white">
                {categories.length}
              </span>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Largest share
              </span>

              <span className="font-semibold text-white">
                {totalSpend > 0
                  ? (
                      (categories[0][1] /
                        totalSpend) *
                      100
                    ).toFixed(1)
                  : "0.0"}
                %
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
