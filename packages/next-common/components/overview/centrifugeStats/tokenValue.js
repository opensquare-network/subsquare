import LoadableContent from "next-common/components/common/loadableContent";
import { useChainSettings } from "next-common/context/chain";

export default function TokenValue({ value, isLoading = false }) {
  const { symbol } = useChainSettings();
  return (
    <LoadableContent size={20} isLoading={isLoading}>
      <div className="flex gap-[4px]">
        <span className="text-textPrimary">{value}</span>
        <span className="text-textSecondary">{symbol}</span>
      </div>
    </LoadableContent>
  );
}
