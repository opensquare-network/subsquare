export default function BalanceDisplay({ balance }) {
  const [integerPart, fractionalPart] = balance.split(".");
  return (
    <span>
      <span className="text-textPrimary">{integerPart}</span>
      {fractionalPart && (
        <span className="text-textTertiary">.{fractionalPart}</span>
      )}
    </span>
  );
}
