import { useChainSettings } from "next-common/context/chain";

export default function TokenValue({ value }) {
  const { symbol } = useChainSettings();
  return (
    <div className="flex gap-[4px]">
      <span className="text-textPrimary">{value}</span>
      <span className="text-textSecondary">{symbol}</span>
    </div>
  );
}
