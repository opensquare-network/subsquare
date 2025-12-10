import { useNominatorUnClaimedRewardsContext } from "./context/nominatorUnClaimedRewardsContext";
import ClaimNominatorRewardButton from "./quickActions/claimButton";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";

export default function NominatorReward() {
  const isMobile = useIsMobile();
  const { result, loading } = useNominatorUnClaimedRewardsContext();
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
      <div className={cn("flex", isMobile && "w-full inline-flex flex-col")}>
        <LoadableItem
          value={totalRewards}
          title="Unclaimed Rewards"
          className={"inline-flex flex-row items-center justify-between"}
          titleClassName="mb-0 text14Medium text-textTertiary flex-1 min-w-[90px]"
          valueClassName="text14Medium min-w-[100px] ml-5 inline-flex justify-end"
        />
      </div>
      <div className="flex gap-4 max-sm:justify-end">
        <ClaimNominatorRewardButton />
      </div>
    </div>
  );
}
