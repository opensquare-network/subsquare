export function SummaryColumnGap({ children }) {
  return <div className="flex flex-col gap-2.5">{children}</div>;
}

export function Item({ label = "", value }) {
  return (
    <div className="flex items-center gap-x-1 text12Medium text-textTertiary">
      <div>{label}</div>
      <div className="text-textPrimary">{value}</div>
    </div>
  );
}
