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
  const cards = [
    {
      label: "Total spend",
      value: formatKes(gross),
      description: "Gross expenses in KES",
    },
    {
      label: "Net spend",
      value: formatKes(net),
      description: "Total before VAT",
    },
    {
      label: "VAT portion",
      value: formatKes(tax),
      description: "VAT from taxable expenses",
    },
    {
      label: "Expenses",
      value: count.toLocaleString("en-KE"),
      description: "Recorded transactions",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">
            {card.label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {card.value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {card.description}
          </p>
        </article>
      ))}
    </section>
  );
}
