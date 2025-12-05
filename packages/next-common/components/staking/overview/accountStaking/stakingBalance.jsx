import { AccountBalanceItem } from "next-common/components/overview/accountInfo/components/accountBalances";
import CollapsePanel from "next-common/components/overview/accountInfo/components/collapsePanel";
import WindowSizeProvider from "next-common/context/windowSize";
import { useMyPoolInfo } from "next-common/hooks/staking/useMyPool";
import PoolWithdrawUnbondedButton from "./withdrawUnbondedButton";
import { useMyPoolRewardContext } from "next-common/context/staking/poolReward";
import ClaimPoolRewardButton from "./claimRewardButton";

export default function StakingBalance() {
  const { myPool, balances, loading } = useMyPoolInfo();
  const { claimable } = useMyPoolRewardContext();

  const inPoolBalance = (
    (balances?.active || 0n) +
    (balances?.unlocking || 0n) +
    (balances?.unlocked || 0n) +
    (claimable || 0n)
  )?.toString();

  return (
    <div className="flex flex-col gap-2">
      <WindowSizeProvider>
        <CollapsePanel
          className="w-[300px] [&>*:not(:last-child)]:mb-1"
          labelItem={
            <AccountBalanceItem
              title="In pool"
              value={inPoolBalance}
              isLoading={loading}
            />
          }
        >
          <AccountBalanceItem
            title="Active"
            value={(balances?.active || 0n)?.toString()}
            isLoading={loading}
          />
          <AccountBalanceItem
            title="Unbonding"
            value={(balances?.unlocking || 0n)?.toString()}
            isLoading={loading}
          />
          <div className="flex items-center gap-2 max-sm:items-end max-sm:gap-0 max-sm:flex-col">
            <AccountBalanceItem
              title="Unbonded"
              value={(balances?.unlocked || 0n)?.toString()}
              isLoading={loading}
            />
            {balances?.unlocked > 0n && (
              <PoolWithdrawUnbondedButton poolId={myPool?.poolId} />
            )}
          </div>
          <div className="flex items-center gap-2 max-sm:items-end max-sm:gap-0 max-sm:flex-col">
            <AccountBalanceItem
              title="Reward"
              value={claimable?.toString()}
              isLoading={loading}
            />
            {claimable > 0n && <ClaimPoolRewardButton />}
          </div>
        </CollapsePanel>
      </WindowSizeProvider>
    </div>
  );
}
