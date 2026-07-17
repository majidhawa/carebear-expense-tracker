type SummaryCardsProps = {
  gross: number;
  net: number;
  tax: number;
  count: number;
};

function formatKes(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function SummaryCards({
  gross,
  net,
  tax,
  count,
}: SummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article className="group relative overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-lg shadow-slate-950/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl xl:col-span-2">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-300">
              Total spend
            </p>

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg transition group-hover:rotate-12">
              ↗
            </span>
          </div>

          <p className="mt-8 break-words text-3xl font-bold tracking-tight sm:text-4xl">
            {formatKes(gross)}
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Gross expenses converted to KES
          </div>
        </div>
      </article>

      <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          N
        </div>

        <p className="mt-6 text-sm font-medium text-slate-500">
          Net spend
        </p>

        <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950">
          {formatKes(net)}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Total before VAT
        </p>
      </article>

      <article className="rounded-[28px] border border-slate-200/80 bg-[#ecfdf3] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
            %
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
            VAT
          </span>
        </div>

        <p className="mt-6 text-sm font-medium text-slate-600">
          VAT portion
        </p>

        <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950">
          {formatKes(tax)}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          From taxable expenses
        </p>
      </article>

      <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:col-span-2 xl:col-span-4">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Recorded transactions
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {count.toLocaleString("en-KE")}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((item) => (
              <span
                key={item}
                className="h-8 w-2 rounded-full bg-emerald-100 transition duration-300 hover:h-12 hover:bg-emerald-500"
              />
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
