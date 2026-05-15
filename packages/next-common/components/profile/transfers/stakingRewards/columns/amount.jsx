import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export function useStakingRewardsAmountColumn() {
  const { symbol, decimals } = useChainSettings();

  return {
    name: "Amount",
    style: { textAlign: "right", width: "160px", minWidth: "160px" },
    render: (item) => (
      <span key="amount" className="text14Medium text-textPrimary">
        <ValueDisplay
          value={toPrecision(item.amount, decimals)}
          symbol={symbol}
        />
      </span>
    ),
  };
}
