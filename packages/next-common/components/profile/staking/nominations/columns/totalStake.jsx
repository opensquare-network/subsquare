import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export function useStakingNominationsTotalStakeColumn() {
  const { symbol, decimals } = useChainSettings();

  return {
    name: "Total Stake",
    style: { textAlign: "right", width: "200px", minWidth: "200px" },
    render: (item) => (
      <span key="totalStake" className="text14Medium text-textPrimary">
        <ValueDisplay
          value={toPrecision(item.total_stake, decimals)}
          symbol={symbol}
        />
      </span>
    ),
  };
}
