import Loading from "next-common/components/loading";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecisionNumber } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

export default function TreasuryBalance({ symbol, isLoading, value }) {
  return (
    <div className="flex items-center gap-[8px] text12Bold text-textPrimary [&_.value-display-symbol]:text-textPrimary">
      <span className="text12Medium text-textTertiary">Treasury Balance</span>
      {isLoading ? (
        <Loading size={16} />
      ) : (
        <ValueDisplay
          value={toPrecisionNumber(
            value,
            SYMBOL_DECIMALS[symbol.toUpperCase()],
          )}
          symbol={symbol}
        />
      )}
    </div>
  );
}
