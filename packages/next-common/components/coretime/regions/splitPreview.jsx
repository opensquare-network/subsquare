import BigNumber from "bignumber.js";

export default function RegionSplitPreview({ total, first, unit }) {
  if (first === null) {
    return null;
  }

  const regions = [
    { label: "First region", quantity: first },
    {
      label: "Second region",
      quantity: new BigNumber(total).minus(first),
    },
  ];

  return (
    <dl className="space-y-1 text12Normal text-textSecondary">
      {regions.map(({ label, quantity }) => {
        const quantityUnit = quantity.eq(1) ? unit : `${unit}s`;
        const displayValue = `${quantity
          .toNumber()
          .toLocaleString("en-US")} ${quantityUnit}`;

        return (
          <div
            key={label}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
          >
            <dt>{label}</dt>
            <dd className="tabular-nums">{displayValue}</dd>
          </div>
        );
      })}
    </dl>
  );
}
