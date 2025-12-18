import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import StakingHeader from "./stakingHeader";
import StakingBalance from "./stakingBalance";
import Divider from "next-common/components/styled/layout/divider";
import { useMyPool } from "next-common/context/staking/myPool";
import Link from "next/link";
import { MyPoolRewardProvider } from "next-common/context/staking/poolReward";
import PoolReward from "./poolReward";
import WindowSizeProvider from "next-common/context/windowSize";
import { NominatorStatus } from "../accountNomination";
import { usePoolAccounts } from "next-common/hooks/staking/usePoolAccount";
import { useStakingLedgers } from "next-common/hooks/useStakingLedgers";
import { cn } from "next-common/utils";
import CheckNomineesButton from "../accountNomination/checkNomineesButton";

function PoolNominatorStatus({ stash }) {
  const { width } = useWindowSize();
  const { nominators } = useStakingLedgers(stash);

  return (
    <div
      className={cn(
        "flex justify-between items-start grow gap-4",
        width > 768 ? "flex-row" : "flex-col",
      )}
    >
      <NominatorStatus
        title="Pool Status"
        nominator={stash}
        nominees={nominators?.targets || []}
      />
      <div className="flex gap-[16px] items-center">
        <CheckNomineesButton nominator={stash} />
      </div>
    </div>
  );
}

export default function AccountStaking() {
  const { poolMember } = useMyPool();
  const { stash } = usePoolAccounts(poolMember?.poolId);

  if (!stash) {
    return null;
  }

  return (
    <WindowSizeProvider>
      <MyPoolRewardProvider>
        <NeutralPanel className="p-6 space-y-4">
          <StakingHeader />
          <Divider />
          <PoolNominatorStatus stash={stash} />
          <Divider />
          <div className="flex max-lg:flex-col w-full gap-2">
            <div className="flex-1 max-lg:flex-none min-w-0">
              <StakingBalance />
            </div>
            <div className="flex-1 max-lg:flex-none min-w-0">
              <PoolReward />
            </div>
          </div>
        </NeutralPanel>
      </MyPoolRewardProvider>
    </WindowSizeProvider>
  );
}

export function AccountStakingEmpty() {
  return (
    <NeutralPanel className="p-6">
      <div className="text-center text14Medium text-textTertiary">
        You are not participating in any nomination pool.{" "}
        <Link
          className="cursor-pointer text-theme500 hover:underline"
          href="/staking/pools"
        >
          Join a pool
        </Link>
      </div>
    </NeutralPanel>
  );
}
