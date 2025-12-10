import { isNil } from "lodash-es";
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

function AccountStakingImpl() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return (
    <MyPoolRewardProvider>
      <WindowSizeProvider>
        <NeutralPanel className="p-6 space-y-4">
          <StakingHeader width={width} />
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
      </WindowSizeProvider>
    </MyPoolRewardProvider>
  );
}

function AccountStakingEmpty() {
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

export default function AccountStaking() {
  const { poolMember, loading } = useMyPool();

  if (loading) {
    return null;
  }

  if (isNil(poolMember)) {
    return <AccountStakingEmpty />;
  }

  return <AccountStakingImpl />;
}
