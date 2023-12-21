import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import LoadableContent from "next-common/components/common/loadableContent";

export default function LoadableItem({ title, value, isLoading = false }) {
  const { symbol, decimals } = useChainSettings();

  return (
    <div className="flex flex-col grow">
      <span className="text-textTertiary text12Medium mb-1">{title}</span>
      <LoadableContent isLoading={isLoading}>
        <span className="text-textPrimary text16Bold">
          <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
        </span>
      </LoadableContent>
    </div>
  );
}
