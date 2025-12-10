import { useMyPoolRewardContext } from "next-common/context/staking/poolReward";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import ClaimPoolRewardButton from "./claimRewardButton";
import CompoundPoolRewardButton from "./compoundRewardButton";
import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";
import { cn } from "next-common/utils";

export default function PoolReward() {
  const { claimable, loading } = useMyPoolRewardContext();
  const isMobile = useIsMobile();

  if (loading && claimable === 0n) {
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
          value={(claimable || 0n)?.toString()}
          isLoading={loading}
          title="Unclaimed Rewards"
          className={"inline-flex flex-row items-center justify-between"}
          titleClassName={"mb-0 text14Medium text-textTertiary flex-1 w-[90px]"}
          valueClassName="text14Medium min-w-[100px] ml-5 inline-flex justify-end"
        />
      </div>
      <div className="flex gap-4 max-sm:justify-end">
        <ClaimPoolRewardButton />
        <CompoundPoolRewardButton />
      </div>
    </div>
  );
}
