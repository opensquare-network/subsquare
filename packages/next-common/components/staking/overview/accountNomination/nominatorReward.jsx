import { useNominatorUnClaimedRewardsContext } from "./context/nominatorUnClaimedRewardsContext";
import ClaimNominatorRewardButton from "./quickActions/claimButton";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";

export default function NominatorReward() {
  const { decimals, symbol } = useChainSettings();
  const isMobile = useIsMobile();
  const { result, loading } = useNominatorUnClaimedRewardsContext() || {};
  const totalRewards = result?.totalRewards || "0";

  if (loading || totalRewards === "0") {
    return null;
  }

  return (
    <div
      className={cn(
        "flex",
        isMobile ? "flex-col" : "items-center justify-end gap-8",
      )}
    >
      <div
        className={cn(
          "flex items-center space-x-5",
          isMobile && "w-full inline-flex flex-col",
        )}
      >
        <span className="text-textTertiary text14Medium whitespace-nowrap">
          Unclaimed Rewards
        </span>
        <ValueDisplay
          key="value"
          value={toPrecision(123321312312312, decimals)}
          symbol={symbol}
          className="text14Medium"
        />
      </div>
      <div className="flex gap-4 max-sm:justify-end">
        <ClaimNominatorRewardButton />
      </div>
    </div>
  );
}
