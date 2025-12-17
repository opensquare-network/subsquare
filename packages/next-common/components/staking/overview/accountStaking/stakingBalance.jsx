import { AccountBalanceItem } from "next-common/components/overview/accountInfo/components/accountBalances";
import CollapsePanel from "next-common/components/overview/accountInfo/components/collapsePanel";
import { useMyPoolInfo } from "next-common/hooks/staking/useMyPool";
import PoolWithdrawUnbondedButton from "./withdrawUnbondedButton";
import NumberWithComma from "next-common/components/numberWithComma";
import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import Divider from "next-common/components/styled/layout/divider";
import { UnlocksDuration } from "../unlocksDuration";

export function UnbondingTooltip({ unlocking, unlockingEntries }) {
  const { symbol, decimals } = useChainSettings();

  if (!unlocking || unlocking === 0n) {
    return <span>0 {symbol}</span>;
  }

  return (
    <div className="text-textPrimaryContrast text12Medium">
      <div className="flex gap-1">
        <div className="min-w-[128px]">Total</div>
        <NumberWithComma
          value={BigNumber(unlocking || 0n)
            .dividedBy(Math.pow(10, decimals))
            .toFixed()}
          symbol={symbol}
        />
      </div>
      <Divider className="my-1 !bg-textSecondaryContrast" />
      {(unlockingEntries || []).map((item) => (
        <div key={item.era} className="flex justify-between">
          <div className="min-w-[128px]">
            <UnlocksDuration era={item.era} />
          </div>
          <NumberWithComma
            value={BigNumber(item.value || 0n)
              .dividedBy(Math.pow(10, decimals))
              .toFixed()}
            symbol={symbol}
          />
        </div>
      ))}
    </div>
  );
}

export default function StakingBalance() {
  const { myPool, balances, loading } = useMyPoolInfo();

  const inPoolBalance = (
    (balances?.active || 0n) +
    (balances?.unlocking || 0n) +
    (balances?.unlocked || 0n)
  )?.toString();

  return (
    <div className="flex flex-col gap-2">
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
          tooltipContent={<UnbondingTooltip {...balances} />}
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
      </CollapsePanel>
    </div>
  );
}
