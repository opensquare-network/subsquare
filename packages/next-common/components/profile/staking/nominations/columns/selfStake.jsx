import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export function useStakingNominationsSelfStakeColumn() {
  const { symbol, decimals } = useChainSettings();

  return {
    name: "Self Stake",
    style: { textAlign: "right", width: "200px", minWidth: "200px" },
    render: (item) => (
      <span key="selfStake" className="text14Medium text-textPrimary">
        <ValueDisplay
          value={toPrecision(item.self_stake, decimals)}
          symbol={symbol}
        />
      </span>
    ),
  };
}
