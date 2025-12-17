import { AccountBalanceItem } from "next-common/components/overview/accountInfo/components/accountBalances";
import CollapsePanel from "next-common/components/overview/accountInfo/components/collapsePanel";
import { useMyPoolInfo } from "next-common/hooks/staking/useMyPool";
import PoolWithdrawUnbondedButton from "./withdrawUnbondedButton";
import NumberWithComma from "next-common/components/numberWithComma";
import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import Divider from "next-common/components/styled/layout/divider";
import { useContextApi } from "next-common/context/api";
import { useGlobalRelayChainApi } from "next-common/hooks/useGlobalRelayChainApi";
import { useMemo } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import FieldLoading from "next-common/components/icons/fieldLoading";
import Duration from "next-common/components/duration";

function Era({ era }) {
  const api = useContextApi();
  const relayApi = useGlobalRelayChainApi();
  const { loading: isActiveEraLoading, result: optActiveEra } = useSubStorage(
    "staking",
    "activeEra",
    [],
  );

  const { endTimestamp, loading } = useMemo(() => {
    if (isActiveEraLoading || !optActiveEra || !api || !relayApi) {
      return { loading: true };
    }

    const activeEra = optActiveEra.toJSON();
    const expectedBlockTime = relayApi.consts.babe.expectedBlockTime.toNumber();
    const epochDuration = relayApi.consts.babe.epochDuration.toNumber();
    const sessionsPerEra = api.consts.staking.sessionsPerEra.toNumber();

    const start = activeEra.start; // start timestamp
    const adjustedEra = era - activeEra.index;
    const eraDurationBlocks = epochDuration * sessionsPerEra;
    const eraDuration = eraDurationBlocks * expectedBlockTime;
    const endTimestamp = start + adjustedEra * eraDuration;

    return {
      loading: false,
      endTimestamp,
    };
  }, [api, relayApi, era, optActiveEra, isActiveEraLoading]);

  if (loading) {
    return <FieldLoading size={12} />;
  }

  return (
    <span>
      Unlocks <Duration time={endTimestamp} slice={2} />
    </span>
  );
}

function UnbondingTooltip({ balances }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <div className="text-textPrimaryContrast text12Medium">
      <div className="flex gap-1">
        <div className="min-w-[128px]">Total</div>
        <NumberWithComma
          value={BigNumber(balances?.unlocking || 0n)
            .dividedBy(Math.pow(10, decimals))
            .toFixed()}
          symbol={symbol}
        />
      </div>
      <Divider className="my-1 !bg-textSecondaryContrast" />
      {(balances?.unlockingEntries || []).map((item) => (
        <div key={item.index} className="flex justify-between">
          <div className="min-w-[128px]">
            <Era era={item.era} />
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
          tooltipContent={<UnbondingTooltip balances={balances} />}
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
